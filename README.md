# HUD-RPG 2.0

Uma aplicação React/TypeScript mobile-first em que o jogador acessa o Sistema
vinculado ao seu personagem. Firebase Authentication (Email/Password) e Cloud
Firestore são as únicas tecnologias Firebase de persistência.

## Estado implementado

- ritual Link Start curto, pulável e compatível com reduced motion;
- acesso e cadastro por **Player ID + Access Key**, sem revelar o e-mail técnico;
- recuperação automática de `players/{uid}` quando Auth existe sem perfil;
- criação de personagem com nome, raça, classe, cálculo puro de stats/HP/MP;
- World View, Status e launcher responsivo do System Shell;
- estados derivados NORMAL, COMBAT, CRITICAL, EVENT e SYSTEM;
- empty states reais para módulos ainda sem dados, sem mocks em produção;
- repositories para player, admin, inventário e solicitação de item;
- regras e testes de regras para autorização crítica.

## Desenvolvimento

```bash
npm install
cp .env.example .env
npm run dev
npm run typecheck
npm run lint
npm test
```

O build de produção é `npm run build` e gera `dist/`. O fallback SPA para
Cloudflare Pages está em `public/_redirects`.

## Arquitetura

```text
src/app                 composition, providers e Error Boundary
src/features            fluxos por capacidade do jogo
src/game                catálogo estático e matemática pura
src/services/firebase   SDK modular e repositories Firestore
src/system              shell, navegação, áudio e estado reativo
src/styles              tokens, global e motion
src/types               contratos e runtime guards
```

Componentes não acessam Firestore diretamente. Leituras são limitadas e
disparadas quando o módulo correspondente é usado; não há polling nem listener
global de coleções. A sessão é responsabilidade do Firebase Auth.

## Modelo Firestore

- `players/{uid}` — identidade e estado resumido do personagem;
- `players/{uid}/inventory/{ownedItemId}`;
- `players/{uid}/skills/{skillId}`;
- `players/{uid}/titles/{titleId}`;
- `players/{uid}/quests/{questId}`;
- `players/{uid}/notifications/{notificationId}`;
- `admins/{uid}` — autorização administrativa, fora do player;
- `items/{itemId}` — catálogo canônico;
- `itemRequests/{requestId}`;
- `guilds/{guildId}/members/{uid}` e `joinRequests/{uid}`;
- `parties/{partyId}/members/{uid}`;
- `systemAnnouncements/{announcementId}`.

Os índices compostos versionados estão em `firestore.indexes.json`. Inventário
permanece como subcoleção para impedir o crescimento ilimitado do player.

## Segurança e bootstrap manual

As rules **não são publicadas pelo build e não foram publicadas neste trabalho**.
Antes do primeiro deploy:

1. habilite somente Email/Password em Firebase Authentication;
2. crie Cloud Firestore no projeto `grpg-335ce`;
3. obtenha o UID do primeiro administrador e crie manualmente
   `admins/{uid}` no Firebase Console (o cliente não possui permissão de escrita);
4. revise e publique `firestore.rules` e `firestore.indexes.json` explicitamente;
5. adicione os domínios Cloudflare em Authentication > Authorized domains.

As rules usam a existência de `admins/{request.auth.uid}`. `isAdmin` não existe
no player. Jogadores não podem elevar level, conceder inventário, revisar o
próprio pedido ou alterar conteúdo de notificações.

Para executar os testes de rules, instale Java/Firebase CLI e rode
`npm run test:rules`. Eles usam apenas o Emulator e nunca produção.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Configure em **Preview e Production**:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

Essas variáveis são configuração pública do app web, não credenciais Admin.
Nunca adicione service account ao frontend ou repositório.

## Auditoria da referência

O produto preserva os conceitos solicitados da referência — Link Start, Player
ID, Access Key, criação, raças/classes, stats, mundo, módulos, guilda, party e
admin — mas não reutiliza sua arquitetura nem persistência. O acesso remoto ao
repositório de referência foi bloqueado pelo proxy deste ambiente; portanto,
listas adicionais não verificáveis não foram inventadas. As opções explicitadas
na especificação estão versionadas até uma auditoria comparativa posterior.

## Custos e próximos módulos

O player normal nunca consulta todos os players. Inventário usa `limit(40)` e os
módulos fechados não carregam dados. Realtime deve ser reservado ao player atual,
notificações relevantes e contexto ativo, sempre com unsubscribe. Admin deverá
usar cursores, filtros e paginação. Implementações ainda pendentes devem seguir
os contracts já definidos para Equipment, Items, Quests, Skills, Titles, Guild,
Party e Admin, sem usar dados fictícios como fallback.
