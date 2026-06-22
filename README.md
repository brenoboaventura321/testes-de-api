"""# NexaPlay & NexaChat 🎮🤖

NexaPlay é uma plataforma web inovadora de catálogo de videojogos digitais integrada com um assistente virtual inteligente, o **NexaChat**. O ecossistema combina o poder do modelo de linguagem **Google Gemini** com a **API da Steam** para oferecer recomendações personalizadas e contextualizadas com base no histórico real de jogo do utilizador, filtrando automaticamente títulos já adquiridos e exibindo cartões interativos diretamente na interface de conversação.

---

## 🚀 Principais Funcionalidades

### 💻 Interface de Utilizador (Frontend)
- **Catálogo Dinâmico:** Dividido em três secções principais (Destaques, Lançamentos e Mais Vendidos), apresentando um alinhamento inicial com mais de 50 jogos reais da indústria.
- **Modo Escuro e Claro:** Suporte nativo para alternância de temas (`dark`/`light`) com transições visuais suaves.
- **Layout Responsivo Inteligente:** Ao abrir o painel de conversação, a zona do catálogo principal (`.catalog`) encolhe automaticamente para `50%` da largura do ecrã de forma fluida, otimizando o espaço de navegação.
- **Cartões Interativos no Chat:** Quando o assistente sugere um jogo, a interface intercetará a resposta e injetará um cartão estilizado com imagem (emoji), categoria, preço, etiquetas de desconto e um botão funcional de **Adicionar ao Carrinho (🛒)**.

### 🧠 Inteligência e Integração (Backend)
- **Conexão com a Steam:** Identificação simplificada através de links de perfil, Vanity URLs personalizados ou SteamID64 numérico de 17 dígitos.
- **Análise Não Invasiva de Perfil:** O assistente utiliza o histórico para entender preferências (ritmo, géneros, se prefere jogos multijogador, offline, cooperativos ou competitivos) de forma subtil, sem expor dados brutos de forma robótica ou assustadora.
- **Otimização Extrema de Tokens (RAG Otimizado):**
  - **Filtro de Ruído:** Ordena a biblioteca por tempo de jogo e seleciona apenas os 20 títulos mais jogados com mais de 2 horas acumuladas, minimizando drasticamente o consumo de tokens na API do Gemini.
  - **Prevenção de Duplicados:** O servidor cruza a biblioteca completa do utilizador com o catálogo da loja *antes* de enviar os dados para a IA, impossibilitando que o assistente sugira um jogo que o utilizador já possua.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (Variáveis nativas e transições CSS), JavaScript Vanilla (ES6+).
- **Backend:** Node.js, Express.js.
- **Dependências do Servidor:** `cors`, `dotenv`, `node-fetch`.
- **APIs Externas:**
  - [Steam Web API](https://steamcommunity.com/dev) (Serviços `ISteamUser` e `IPlayerService`).
  - [Google Gemini API](https://ai.google.dev/) (Modelo de processamento de linguagem natural ultra-rápido `gemini-2.5-flash-lite`).

---

## 📁 Estrutura do Projeto

Saída de código
README.md criado com sucesso.

```bash
├── nexaplay.html   # Estrutura visual da aplicação, estilos CSS e painel do chat
├── script.js       # Comportamento do frontend, slider de banners, catálogo e renderização de cartões
├── server.js       # Servidor Express, integração com APIs da Steam e Gemini e lógica RAG
└── .env            # Arquivo de configuração local para chaves de API (não incluído no repositório)
🔧 Configuração e Instalação
Prerrequisitos
Certifique-se de que tem o Node.js instalado na sua máquina.

1. Obter as Chaves de API necessárias
Steam API Key: Aceda a Steam Community Dev e crie uma chave de acesso.

Gemini API Key: Aceda ao Google AI Studio e gere uma chave de API para o seu projeto.

2. Configurar as Variáveis de Ambiente
Crie um ficheiro chamado .env na raiz do seu projeto e preencha-o com as suas credenciais:

Snippet de código
PORT=3001
STEAM_API_KEY=SUA_CHAVE_API_STEAM_AQUI
GEMINI_API_KEY=SUA_CHAVE_API_GEMINI_AQUI
3. Instalar as Dependências do Servidor
Abra o seu terminal na pasta do projeto e execute o seguinte comando para instalar os pacotes necessários:

Bash
npm install express cors node-fetch dotenv
4. Iniciar o Servidor Backend
Execute o servidor Node.js com o comando:

Bash
node server.js
Deverá ver a mensagem de validação no terminal:

✅ NexaPlay server → http://localhost:3001

5. Executar o Frontend
Basta abrir o ficheiro nexaplay.html diretamente em qualquer navegador moderno ou utilizar uma extensão de servidor local (como Live Server no VS Code).

🔄 Fluxo de Funcionamento do NexaChat
Ligação: O utilizador insere o seu identificador da Steam e clica em 🎮 Entrar.

Processamento Inicial: O backend consulta a Steam, localiza o perfil, descarrega a biblioteca completa e armazena os dados.

Interação: O utilizador abre o chat geral ou clica no botão "Chat" de um jogo específico.

Construção do Contexto RAG Inteligente:

O servidor gera uma lista com o Top 20 jogos mais jogados do utilizador para servir de bússola de gostos.

O servidor filtra o catálogo completo da NexaPlay, removendo permanentemente qualquer jogo que o utilizador já tenha na Steam.

Prompting: O prompt do sistema instrui o Gemini a analisar subtilmente o perfil e a sugerir apenas os jogos disponíveis do catálogo filtrado, anexando a tag especial [CARD: Nome do Jogo].

Renderização Mágica: O frontend interceta o texto da IA, remove a tag de texto cru e monta dinamicamente o cartão visual com o botão de carrinho verde integrado.

🛡️ Licença
Este projeto foi desenvolvido para fins demonstrativos e educacionais por NEXUS Development & AI Solutions. Sinta-se à vontade para expandir, modificar e integrar novos módulos.
"""

with open("README.md", "w", encoding="utf-8") as f:
f.write(readme_content)

print("README.md criado com sucesso.")

O seu ficheiro Markdown está pronto:
[file-tag: code-generated-file-0-1782107199209741443]

O README do projeto **NexaPlay** foi gerado com sucesso. Ele contém todos os detalhes nec
