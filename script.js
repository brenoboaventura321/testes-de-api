// ─────────────────────────────────────────────
//  NexaPlay — script.js  (controle total do frontend)
// ─────────────────────────────────────────────

// Detecta automaticamente se está no PC (localhost) ou na Vercel
const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
  ? "http://localhost:3001" 
  : "";
// ── Catálogo ──────────────────────────────────
const CATALOG = [
  // G1: Destaques (Ofertas e Grandes Títulos)
  { name: "Elden Ring", category: "RPG", price: "R$ 149,90", old: "R$ 229,90", badge: "sale", pct: "-35%", e: "💍", t: "t1", g: "g1" },
  { name: "Cyberpunk 2077", category: "Ação/RPG", price: "R$ 99,90", old: "R$ 199,90", badge: "sale", pct: "-50%", e: "🦾", t: "t2", g: "g1" },
  { name: "Red Dead Redemption 2", category: "Aventura", price: "R$ 98,96", old: "R$ 299,90", badge: "sale", pct: "-67%", e: "🤠", t: "t6", g: "g1" },
  { name: "The Witcher 3: Wild Hunt", category: "RPG", price: "R$ 39,99", old: "R$ 159,99", badge: "sale", pct: "-75%", e: "🐺", t: "t4", g: "g1" },
  { name: "Baldur's Gate 3", category: "RPG", price: "R$ 199,99", e: "🎲", t: "t1", g: "g1" },
  { name: "Sekiro: Shadows Die Twice", category: "Ação", price: "R$ 99,50", old: "R$ 199,00", badge: "sale", pct: "-50%", e: "🥷", t: "t3", g: "g1" },
  { name: "Hogwarts Legacy", category: "Aventura", price: "R$ 124,99", old: "R$ 249,99", badge: "sale", pct: "-50%", e: "🪄", t: "t5", g: "g1" },
  { name: "Resident Evil 4 Remake", category: "Horror", price: "R$ 169,00", e: "🧟", t: "t6", g: "g1" },
  { name: "God of War", category: "Ação", price: "R$ 99,95", old: "R$ 199,90", badge: "sale", pct: "-50%", e: "🪓", t: "t2", g: "g1" },
  { name: "Marvel's Spider-Man", category: "Ação", price: "R$ 149,50", e: "🕷️", t: "t6", g: "g1" },
  { name: "Horizon Zero Dawn", category: "Aventura", price: "R$ 49,90", old: "R$ 199,90", badge: "sale", pct: "-75%", e: "🏹", t: "t4", g: "g1" },
  { name: "Hades", category: "Roguelike", price: "R$ 46,99", e: "🔥", t: "t6", g: "g1" },
  { name: "Stardew Valley", category: "Simulação", price: "R$ 24,99", e: "🚜", t: "t2", g: "g1" },
  { name: "Hollow Knight", category: "Metroidvania", price: "R$ 46,99", e: "🪲", t: "t1", g: "g1" },
  { name: "Terraria", category: "Sandbox", price: "R$ 16,49", old: "R$ 32,99", badge: "sale", pct: "-50%", e: "⛏️", t: "t4", g: "g1" },
  { name: "Dead Cells", category: "Roguelike", price: "R$ 47,49", e: "🗡️", t: "t5", g: "g1" },

  // G2: Lançamentos
  { name: "Dragon's Dogma 2", category: "RPG", price: "R$ 299,00", badge: "new", e: "🐉", t: "t1", g: "g2" },
  { name: "Helldivers 2", category: "Shooter", price: "R$ 199,50", badge: "new", e: "🚀", t: "t2", g: "g2" },
  { name: "Tekken 8", category: "Luta", price: "R$ 269,90", badge: "new", e: "🥊", t: "t6", g: "g2" },
  { name: "Palworld", category: "Sobrevivência", price: "R$ 88,99", badge: "new", e: "🐑", t: "t4", g: "g2" },
  { name: "Enshrouded", category: "Sobrevivência", price: "R$ 89,99", badge: "new", e: "🌫️", t: "t3", g: "g2" },
  { name: "Persona 3 Reload", category: "RPG", price: "R$ 349,90", badge: "new", e: "🏫", t: "t5", g: "g2" },
  { name: "Pacific Drive", category: "Sobrevivência", price: "R$ 88,90", badge: "new", e: "🚘", t: "t2", g: "g2" },
  { name: "Banishers: Ghosts of New Eden", category: "Ação/RPG", price: "R$ 179,90", badge: "new", e: "👻", t: "t1", g: "g2" },
  { name: "Nightingale", category: "Sobrevivência", price: "R$ 88,99", badge: "new", e: "🎩", t: "t4", g: "g2" },
  { name: "Last Epoch", category: "ARPG", price: "R$ 104,90", badge: "new", e: "⏳", t: "t6", g: "g2" },
  { name: "Manor Lords", category: "Estratégia", price: "R$ 99,90", badge: "new", e: "🏰", t: "t3", g: "g2" },
  { name: "Homeworld 3", category: "Estratégia", price: "R$ 299,00", badge: "new", e: "🌌", t: "t2", g: "g2" },
  { name: "S.T.A.L.K.E.R. 2", category: "Shooter", price: "R$ 239,00", badge: "new", e: "☢️", t: "t5", g: "g2" },
  { name: "Frostpunk 2", category: "Estratégia", price: "R$ 139,90", badge: "new", e: "❄️", t: "t1", g: "g2" },
  { name: "Hades II", category: "Roguelike", price: "R$ 88,99", badge: "new", e: "🌙", t: "t4", g: "g2" },
  { name: "Black Myth: Wukong", category: "Ação/RPG", price: "R$ 229,99", badge: "new", e: "🐒", t: "t6", g: "g2" },

  // G3: Mais Vendidos
  { name: "Grand Theft Auto V", category: "Ação", price: "R$ 82,41", e: "🚗", t: "t3", g: "g3" },
  { name: "Counter-Strike 2", category: "FPS", price: "Gratuito", e: "🔫", t: "t2", g: "g3" },
  { name: "Dota 2", category: "MOBA", price: "Gratuito", e: "🛡️", t: "t1", g: "g3" },
  { name: "Apex Legends", category: "Battle Royale", price: "Gratuito", e: "🏆", t: "t4", g: "g3" },
  { name: "EA SPORTS FC 24", category: "Esportes", price: "R$ 359,00", e: "⚽", t: "t5", g: "g3" },
  { name: "Rust", category: "Sobrevivência", price: "R$ 103,49", e: "🏕️", t: "t6", g: "g3" },
  { name: "Dead by Daylight", category: "Multiplayer", price: "R$ 49,99", e: "🪝", t: "t1", g: "g3" },
  { name: "Rainbow Six Siege", category: "FPS", price: "R$ 59,99", e: "🧨", t: "t2", g: "g3" },
  { name: "Left 4 Dead 2", category: "Horror", price: "R$ 32,99", e: "🧟‍♂️", t: "t3", g: "g3" },
  { name: "Garry's Mod", category: "Sandbox", price: "R$ 32,99", e: "🔧", t: "t4", g: "g3" },
  { name: "Phasmophobia", category: "Horror", price: "R$ 27,89", e: "🔦", t: "t5", g: "g3" },
  { name: "Lethal Company", category: "Co-op", price: "R$ 32,99", e: "🧑‍🚀", t: "t6", g: "g3" },
  { name: "Sea of Thieves", category: "Aventura", price: "R$ 89,99", e: "🏴‍☠️", t: "t2", g: "g3" },
  { name: "DayZ", category: "Sobrevivência", price: "R$ 119,99", e: "🥫", t: "t1", g: "g3" },
  { name: "Geometry Dash", category: "Ritmo", price: "R$ 10,49", e: "⏹️", t: "t4", g: "g3" },
  { name: "Forza Horizon 5", category: "Corrida", price: "R$ 249,00", e: "🏎️", t: "t3", g: "g3" },
  { name: "The Elder Scrolls V: Skyrim", category: "RPG", price: "R$ 149,00", e: "🗡️", t: "t5", g: "g3" },
  { name: "Fallout 4", category: "RPG", price: "R$ 59,99", e: "☢️", t: "t6", g: "g3" }
];
window.openChat = function(gameName) {
  panel.classList.add("open");
  main.classList.add('main-open');
  document.querySelector('.catalog').classList.add("chat-open"); // Reduz a largura para 50%
  ensureLoginForm();
  
  // Se veio de um jogo específico, apenas preenche o input sem enviar
  if (gameName) {
    const inputEl = document.getElementById("ci");
    inputEl.value = `Me fale sobre ${gameName}`;
    inputEl.focus();
  }
};

window.closeChat = function() {
  panel.classList.remove("open");
  document.querySelector('.catalog').classList.remove("chat-open"); // Restaura a largura
};

// ── Estado ────────────────────────────────────
const state = { steamid: null, library: [], history: [] };

// ── Refs DOM ──────────────────────────────────
const panel  = document.getElementById("chatPanel");
const msgsEl = document.getElementById("msgs");
const inputEl = document.getElementById("ci");
const main=document.querySelector('.main');

// ══════════════════════════════════════════════
//  CARDS — renderiza as 3 grids
// ══════════════════════════════════════════════
CATALOG.forEach(p => {
  const grid = document.getElementById(p.g);
  if (!grid) return;
  const badgeHtml = p.badge
    ? `<span class="badge ${p.badge}">${p.badge === "new" ? "Novo" : p.pct}</span>`
    : "";
  const oldHtml = p.old ? `<div class="old">${p.old}</div>` : "";
  grid.innerHTML += `
    <div class="card">
      <div class="thumb ${p.t}">${p.e}${badgeHtml}</div>
      <div class="card-b">
        <div class="cat">${p.category}</div>
        <div class="name">${p.name}</div>
        <div class="foot">
          <div>${oldHtml}<div class="price">${p.price}</div></div>
          <button class="cbtn" onclick="openChat('${p.name}')">Chat</button>
        </div>
      </div>
    </div>`;
});

// ══════════════════════════════════════════════
//  SLIDER do banner
// ══════════════════════════════════════════════
let cur = 0;
const slides = document.querySelectorAll(".slide");
const dots   = document.querySelectorAll(".dot");

function goTo(n) {
  slides[cur].classList.remove("on");
  dots[cur].classList.remove("on");
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add("on");
  dots[cur].classList.add("on");
}

// expõe para os botões inline do HTML
window.slide = d => goTo(cur + d);
dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));
setInterval(() => goTo(cur + 1), 5000);

// ══════════════════════════════════════════════
//  TEMA
// ══════════════════════════════════════════════
document.getElementById("themeBtn").addEventListener("click", () => {
  const html = document.documentElement;
  const dark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", dark ? "light" : "dark");
  document.getElementById("themeBtn").textContent = dark ? "☀️" : "🌙";
});

// ══════════════════════════════════════════════
//  FORMULÁRIO DE LOGIN STEAM
//  Injeta campo de nickname no topo do chat
// ══════════════════════════════════════════════
function ensureLoginForm() {
  if (document.getElementById("steamLoginForm") || state.steamid) return;

  const form = document.createElement("div");
  form.id = "steamLoginForm";
  form.style.cssText =
    "padding:10px 14px;border-bottom:1px solid var(--bdr);background:var(--sur);display:flex;flex-direction:column;gap:8px;flex-shrink:0";

  form.innerHTML = `
    <div style="display:flex;gap:8px">
      <input id="steamNickInput" type="text"
        placeholder="Link do perfil, vanityURL ou SteamID64…"
        style="flex:1;background:var(--bg);border:1px solid var(--bdr);border-radius:20px;
               padding:7px 13px;color:var(--txt);font-size:12px;font-family:inherit;outline:none"/>
      <button id="steamHelpBtn" title="Como encontrar meu perfil?"
        style="background:none;border:1px solid var(--bdr);border-radius:50%;width:30px;height:30px;
               color:var(--muted);font-size:13px;cursor:pointer;flex-shrink:0">?</button>
      <button id="steamLoginBtn"
        style="background:linear-gradient(135deg,#7B61FF,#00FFFF);border:none;border-radius:20px;
               padding:7px 13px;color:#fff;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap">
        🎮 Entrar
      </button>
    </div>
    <div id="steamHelpBox" style="display:none;background:var(--bg);border:1px solid var(--bdr);
      border-radius:10px;padding:10px 12px;font-size:11px;color:var(--muted);line-height:1.6">
      <strong style="color:var(--txt)">Como conectar sua conta Steam:</strong><br>
      <b>Opção 1 — Link do perfil</b> (mais fácil)<br>
      Cole o link completo: <code style="color:var(--c)">steamcommunity.com/id/seu_nome</code><br>
      ou <code style="color:var(--c)">steamcommunity.com/profiles/76561198…</code><br><br>
      <b>Opção 2 — SteamID64</b><br>
      É um número de 17 dígitos. Encontre em <a href="https://steamid.io" target="_blank"
        style="color:var(--p)">steamid.io</a> — cole seu link lá e copie o SteamID64.<br><br>
      <b>⚠️ Por que "nick" não funciona?</b><br>
      O nome de exibição (que você vê no jogo) não é usado pela API da Steam. Somente o
      link do perfil ou o ID numérico funcionam.
    </div>`;

  document.querySelector(".chat-head").insertAdjacentElement("afterend", form);

  document.getElementById("steamLoginBtn").addEventListener("click", steamLogin);
  document.getElementById("steamNickInput").addEventListener("keydown", e => {
    if (e.key === "Enter") steamLogin();
  });
  document.getElementById("steamHelpBtn").addEventListener("click", () => {
    const box = document.getElementById("steamHelpBox");
    box.style.display = box.style.display === "none" ? "block" : "none";
  });
}

async function steamLogin() {
  const nick = document.getElementById("steamNickInput")?.value?.trim();
  if (!nick) return;

  const btn = document.getElementById("steamLoginBtn");
  if (btn) { btn.disabled = true; btn.textContent = "…"; }

  addMsg("🎮 Identificando sua conta Steam...", "bot");

  try {
    // Passo 1 — nickname → steamid
    const r1 = await fetch(`${API}/api/steam/identify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vanityurl: nick }),
    });
    const d1 = await r1.json();
    if (!r1.ok) throw new Error(d1.error);
    state.steamid = d1.steamid;

    // Passo 2 — steamid → biblioteca
    const r2 = await fetch(`${API}/api/steam/library`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steamid: state.steamid }),
    });
    const d2 = await r2.json();
    if (!r2.ok) throw new Error(d2.error);
    state.library = d2.games;

    document.getElementById("steamLoginForm")?.remove();
    addMsg(
      `✅ Biblioteca carregada! **${d2.game_count} jogos** encontrados.\n` +
      `Agora posso recomendar títulos do catálogo NexaPlay com base no que você já joga!`,
      "bot"
    );
  } catch (err) {
    addMsg("❌ Conta não encontrada. Verifique o nickname e tente novamente.", "bot");
    if (btn) { btn.disabled = false; btn.textContent = "🎮 Entrar"; }
  }
}

// ══════════════════════════════════════════════
//  CHAT — envia mensagem ao servidor
// ══════════════════════════════════════════════
async function sendMessage(text) {
  text = text?.trim();
  if (!text) return;

  addMsg(text, "usr");
  inputEl.value = "";

  const tid = showThink();

  try {
    const r = await fetch(`${API}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: state.history,
        library: state.library,
        catalog: CATALOG.map(({ name, category, price }) => ({ name, category, price })),
      }),
    });

    const data = await r.json();
    removeThink(tid);
    if (!r.ok) throw new Error(data.error);

    state.history.push({ role: "user",  text });
    state.history.push({ role: "model", text: data.reply });
    if (state.history.length > 40) state.history = state.history.slice(-40);

    addMsg(data.reply, "bot");
  } catch (err) {
    removeThink(tid);
    addMsg("⚠️ Servidor offline. Verifique se o server.js está rodando na porta 3001.", "bot");
    console.error("[chat]", err);
  }
}

// ── Helpers DOM ───────────────────────────────
function now() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function addMsg(text, role) {
  const d = document.createElement("div");
  d.className = `msg ${role}`;
  
  let cardsHtml = "";
  
  // Se a mensagem for do bot, procuramos as tags [CARD: Jogo]
  if (role === "bot") {
    const regex = /\[CARD:\s*(.+?)\]/gi;
    let match;
    const recommended = [];
    
    // Captura todos os jogos recomendados pela IA
    while ((match = regex.exec(text)) !== null) {
      recommended.push(match[1].trim().toLowerCase());
    }
    
    // Remove as tags do texto original para não aparecerem na mensagem
    text = text.replace(regex, "").trim();
    
    // Se a IA recomendou algo, montamos a grade de cards
    if (recommended.length > 0) {
      cardsHtml += `<div style="display:flex; gap:10px; margin-top:12px; overflow-x:auto; padding:4px; max-width:100%; scrollbar-width:none;">`;
      
      recommended.forEach(gameName => {
        // Procura o jogo no catálogo usando o nome
        const p = CATALOG.find(g => g.name.toLowerCase() === gameName);
        if (p) {
          const badgeHtml = p.badge ? `<span class="badge ${p.badge}">${p.badge === "new" ? "Novo" : p.pct}</span>` : "";
          const oldHtml = p.old ? `<div class="old">${p.old}</div>` : "";
          
          cardsHtml += `
            <div class="card" style="width:140px; flex-shrink:0;">
              <div class="thumb ${p.t}">${p.e}${badgeHtml}</div>
              <div class="card-b">
                <div class="cat">${p.category}</div>
                <div class="name">${p.name}</div>
                <div class="foot">
                  <div>${oldHtml}<div class="price">${p.price}</div></div>
                  <button class="cbtn" style="background:#10B981; color:#fff;" onclick="alert('Adicionado ao carrinho: ${p.name}')">🛒</button>
                </div>
              </div>
            </div>`;
        }
      });
      cardsHtml += `</div>`;
    }
  }

  // Formata negrito e quebras de linha no texto
  const html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
    
  d.innerHTML = `<div class="bubble">${html}${cardsHtml}</div><span class="ts">${now()}</span>`;
  msgsEl.appendChild(d);
  msgsEl.scrollTop = msgsEl.scrollHeight;
}
let _tc = 0;
function showThink() {
  const id = `think-${_tc++}`;
  const d = document.createElement("div");
  d.id = id; d.className = "msg bot";
  d.innerHTML = `<div class="think"><span></span><span></span><span></span></div>`;
  msgsEl.appendChild(d);
  msgsEl.scrollTop = msgsEl.scrollHeight;
  return id;
}
function removeThink(id) { document.getElementById(id)?.remove(); }

// ══════════════════════════════════════════════
//  FUNÇÕES GLOBAIS (chamadas pelo HTML inline)
// ══════════════════════════════════════════════
window.openChat = function(gameName) {
  panel.classList.add("open");
  main.classList.add('main-open');
  ensureLoginForm();
  if (gameName) setTimeout(() => sendMessage(`Me fale sobre ${gameName}`), 200);
};

window.closeChat = function() {
  panel.classList.remove("open");
};

window.ask = function(text) {
  panel.classList.add("open");
  ensureLoginForm();
  setTimeout(() => sendMessage(text), 150);
};

// Botão enviar (id="sendBtn") e Enter
window.send = () => sendMessage(inputEl.value);
document.getElementById("sendBtn")?.addEventListener("click", () => sendMessage(inputEl.value));
inputEl?.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(inputEl.value); });
