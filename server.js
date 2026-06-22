// ─────────────────────────────────────────────
//  NexaPlay — server.js
//  Node.js + Express + dotenv
//  Requer: npm install express cors node-fetch dotenv
// ─────────────────────────────────────────────
import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const STEAM_KEY  = process.env.STEAM_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const PORT       = process.env.PORT || 3001;

// Valida chaves na inicialização
if (!STEAM_KEY || !GEMINI_KEY) {
  console.error("❌ Defina STEAM_API_KEY e GEMINI_API_KEY no arquivo .env");
  process.exit(1);
}

// ── Persona da NexaChat ───────────────────────
const PERSONA = `
Você é NexaChat, o assistente virtual da loja de jogos NexaPlay.
Tom: Amigável, sutil, empático e especialista em videogames.

Diretrizes principais:
1. ANÁLISE SUTIL DE PERFIL: Use a lista de jogos mais jogados apenas para entender o estilo do usuário (gêneros, modos, ritmo). 
ATENÇÃO: NUNCA cite a quantidade de horas exatas que a pessoa jogou, nem liste a biblioteca de forma robótica para não parecer invasivo/assustador. Em vez de "Vi que você tem 500h em Rust", seja natural: "Percebi que você é um grande fã de jogos de sobrevivência..." ou "Pelo seu histórico, dá pra ver que você curte RPGs de mundo aberto...".
2. RECOMENDAÇÃO: Sugira jogos EXCLUSIVAMENTE do "Catálogo NexaPlay" (Disponíveis para compra) que combinem com esse perfil.
3. FORMATO VISUAL (OBRIGATÓRIO): Para CADA jogo que você recomendar, você DEVE adicionar no final da sua mensagem a tag exata: [CARD: Nome do Jogo]. 

Exemplo de resposta ideal:
"Notei que você adora explorar mundos abertos e desafiadores! Temos algumas opções incríveis por aqui que combinam perfeitamente com esse estilo. O Elden Ring está com um ótimo desconto e o Hogwarts Legacy é uma aventura fantástica."

[CARD: Elden Ring]
[CARD: Hogwarts Legacy]

Regras:
- Responda de forma concisa em português brasileiro.
- NUNCA invente jogos, preços ou promoções. Apenas recomende o que está no catálogo fornecido.
`.trim();

// ── Rota de saúde (evita "Cannot GET /") ─────
app.get("/api/status", (_, res) => res.json({ status: "NexaPlay server online ✅" }));

// ═══════════════════════════════════════════════
//  POST /api/steam/identify
//  Aceita: link completo, SteamID64 (17 dígitos) ou vanityurl
// ═══════════════════════════════════════════════
app.post("/api/steam/identify", async (req, res) => {
  let { vanityurl } = req.body;
  if (!vanityurl) return res.status(400).json({ error: "Campo obrigatório." });

  vanityurl = vanityurl.trim();

  // 1) Tenta interpretar como URL completa
  try {
    const u = new URL(vanityurl.startsWith("http") ? vanityurl : `https://${vanityurl}`);
    if (u.hostname.includes("steamcommunity.com")) {
      const parts = u.pathname.split("/").filter(Boolean);
      // steamcommunity.com/profiles/76561198012345678
      if (parts[0] === "profiles" && /^\d{17}$/.test(parts[1]))
        return res.json({ steamid: parts[1] });
      // steamcommunity.com/id/vanityname
      if (parts[0] === "id" && parts[1])
        vanityurl = parts[1]; // extrai só o nome e continua para o passo 3
    }
  } catch (_) { /* não era URL, segue */ }

  // 2) SteamID64 puro (17 dígitos)
  if (/^\d{17}$/.test(vanityurl))
    return res.json({ steamid: vanityurl });

  // 3) Vanity URL — chama ResolveVanityURL
  try {
    const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/`
      + `?key=${STEAM_KEY}&vanityurl=${encodeURIComponent(vanityurl)}`;
    const r    = await fetch(url);
    const data = await r.json();

    if (data.response?.success !== 1)
      return res.status(404).json({
        error: "Perfil não encontrado. Cole o link completo do perfil ou o SteamID64.",
      });

    res.json({ steamid: data.response.steamid });
  } catch (err) {
    console.error("[identify]", err.message);
    res.status(500).json({ error: "Erro ao consultar API Steam." });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/steam/library
//  body: { steamid: string }
//  Retorna biblioteca de jogos do usuário
// ═══════════════════════════════════════════════
app.post("/api/steam/library", async (req, res) => {
  const { steamid } = req.body;
  if (!steamid) return res.status(400).json({ error: "steamid obrigatório." });

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`
      + `?key=${STEAM_KEY}`
      + `&steamid=${steamid}`
      + `&include_appinfo=true`
      + `&include_played_free_games=true`
      + `&format=json`;

    const r    = await fetch(url);
    const data = await r.json();
    const raw  = data.response?.games ?? [];

    const games = raw.map(g => ({
      appid:            g.appid,
      name:             g.name,
      playtime_minutes: g.playtime_forever,
      icon_url: g.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
        : null,
    }));

    res.json({ game_count: games.length, games });
  } catch (err) {
    console.error("[library]", err.message);
    res.status(500).json({ error: "Erro ao buscar biblioteca Steam." });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/chat
//  body: { message, history, library, catalog }
//  Envia ao Gemini com contexto RAG
// ═══════════════════════════════════════════════
app.post("/api/chat", async (req, res) => {
  const { message, history = [], library = [], catalog = [] } = req.body;
  if (!message) return res.status(400).json({ error: "message obrigatório." });

  // Contexto RAG montado no servidor
// 1. Perfil do Usuário (Top 20 para economizar tokens e definir gostos)
  const TOP_GAMES_LIMIT = 20;
  const MIN_HOURS = 2;

  const topGames = library
    .filter(g => (g.playtime_minutes / 60) >= MIN_HOURS)
    .sort((a, b) => b.playtime_minutes - a.playtime_minutes)
    .slice(0, TOP_GAMES_LIMIT);

  const libraryCtx = topGames.length
    ? `Top ${topGames.length} jogos mais jogados do usuário:\n`
      + topGames.map(g => `- ${g.name} (${Math.round(g.playtime_minutes / 60)}h)`).join("\n")
    : (library.length > 0 
        ? "Usuário possui jogos, mas nenhum com tempo significativo." 
        : "Conta Steam não conectada.");

  // 2. Prevenção de Duplicidade: Filtra o catálogo usando a biblioteca COMPLETA
  // Cria um "Set" com os nomes dos jogos em minúsculo para facilitar a comparação
  const ownedGameNames = new Set(library.map(g => g.name.toLowerCase().trim()));

  // Remove do catálogo os jogos que o usuário já tem na Steam
  const availableCatalog = catalog.filter(
    g => !ownedGameNames.has(g.name.toLowerCase().trim())
  );

  // 3. Catálogo RAG limpo (só o que ele pode comprar)
  const catalogCtx = availableCatalog.length
    ? `Catálogo NexaPlay (Disponíveis para compra):\n`
      + availableCatalog.map(g => `- ${g.name} | ${g.category} | ${g.price}`).join("\n")
    : "Catálogo não disponível ou o usuário já possui todos os nossos jogos.";

  // const catalogCtx = catalog.length
  //   ? `Catálogo NexaPlay:\n`
  //     + catalog.map(g => `- ${g.name} | ${g.category} | ${g.price}`).join("\n")
  //   : "Catálogo não disponível.";

  const systemPrompt = `${PERSONA}\n\n${libraryCtx}\n\n${catalogCtx}`;

  // Histórico no formato Gemini
  const geminiHistory = history.map(h => ({
    role:  h.role === "user" ? "user" : "model",
    parts: [{ text: h.text }],
  }));

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      ...geminiHistory,
      { role: "user", parts: [{ text: message }] },
    ],
    generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`
      + `?key=${GEMINI_KEY}`;

    const r    = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    const data = await r.json();

    if (!r.ok) {
      console.error("[chat] Gemini:", data.error?.message);
      return res.status(r.status).json({ error: data.error?.message ?? "Erro no Gemini." });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "(sem resposta)";
    res.json({ reply });
  } catch (err) {
    console.error("[chat]", err.message);
    res.status(500).json({ error: "Erro ao se comunicar com o Gemini." });
  }
});

// Só roda o .listen() se estiver no seu PC local
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`✅ NexaPlay server → http://localhost:${PORT}`)
  );
}

// Exporta para a Vercel transformar em Serverless
export default app;
