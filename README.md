#FocusMe
<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-6366f1?style=for-the-badge" />
<img src="https://img.shields.io/badge/expo-SDK%2056-000020?style=for-the-badge&logo=expo" />
<img src="https://img.shields.io/badge/react%20native-0.85.3-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/typescript-6.0.3-3178C6?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/plataformas-iOS%20%7C%20Android%20%7C%20Web-success?style=for-the-badge" />

<br/>
<br/>

# 🧠 FocusMe

**Aplicativo mobile multiplataforma para pessoas com TDAH**

Organize compromissos, crie lembretes, anote ideias, faça listas de mercado, rastreie hábitos e mantenha o foco — tudo em um único lugar, com uma interface pensada para mentes TDAH.

[▶ Demo](#) · [📦 Download](#publicação-nas-lojas) · [🐛 Reportar Bug](../../issues) · [✨ Sugerir Feature](../../issues)

</div>

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tech Stack](#-tech-stack)
- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Banco de Dados](#-banco-de-dados)
- [Gerenciamento de Estado](#-gerenciamento-de-estado)
- [Notificações Push](#-notificações-push)
- [Temas Claro e Escuro](#-temas-claro-e-escuro)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Extensões VS Code](#-extensões-vs-code)
- [Comandos](#-comandos)
- [Publicação nas Lojas](#-publicação-nas-lojas)
- [Decisões Técnicas](#-decisões-técnicas)

---

## 💡 Sobre o Projeto

O **FocusMe** nasceu da necessidade de uma ferramenta de organização pensada especificamente para pessoas com TDAH. Em vez de usar 5 apps diferentes para agenda, notas, lista de mercado, hábitos e timer, o FocusMe centraliza tudo com uma interface simples, direta e sem distrações.

### Por que o FocusMe é diferente?

| Problema comum no TDAH | Solução no FocusMe |
|---|---|
| Esquecer compromissos | Lembretes push configuráveis por evento |
| Perder ideias rapidamente | Notas rápidas com um toque na Home |
| Ir ao mercado sem lista | Lista de mercado com categorias e progresso |
| Dificuldade de manter foco | Timer Pomodoro com ciclos e vibração |
| Quebrar rotinas | Rastreador de hábitos com streak diário |
| Não saber onde o tempo foi | Estatísticas semanais e mensais |

---

## ✨ Funcionalidades

<details>
<summary><b>🏠 Home (Tela Principal)</b></summary>

- Saudação personalizada com nome do usuário
- Seletor de dias com scroll horizontal (14 dias)
- Lista de compromissos do dia com cards coloridos
- Atalhos rápidos para todas as funcionalidades
- Seção de notas recentes (últimas 3)
- Pull-to-refresh para recarregar dados

</details>

<details>
<summary><b>📅 Compromissos e Agenda</b></summary>

- Criação com título, descrição, data, hora início/fim
- Suporte a eventos de dia inteiro
- Seletor de 6 cores para categorização visual
- Lembrete configurável (5min, 15min, 30min, 1h, 1 dia)
- Calendário mensal com pontinhos coloridos nos dias com eventos
- Edição e exclusão com confirmação
- Soft delete (dados preservados)

</details>

<details>
<summary><b>📝 Notas Rápidas</b></summary>

- Criação com título e conteúdo livre
- 6 cores de fundo disponíveis
- Grade de cards com prévia do conteúdo
- Busca em tempo real por título e conteúdo
- Exibe data de criação e última edição

</details>

<details>
<summary><b>🛒 Lista de Mercado</b></summary>

- Múltiplas listas simultâneas
- Categorias: Hortifruti, Laticínios, Carnes, Padaria, Limpeza, Mercearia, Congelados, Outros
- Quantidades predefinidas + campo customizado
- Marcar/desmarcar itens com toque
- Barra de progresso visual (% concluída)
- Limpar todos os marcados de uma vez

</details>

<details>
<summary><b>🍅 Modo Foco — Pomodoro</b></summary>

- Timer circular animado
- 3 modos: Foco (25min), Pausa Curta (5min), Pausa Longa (15min)
- Controles: Play/Pause, Skip, Reset timer, Reset ciclo completo
- Vibração ao término de cada sessão
- Indicador visual de ciclos (pontos)
- Dicas de uso para TDAH

</details>

<details>
<summary><b>🌱 Hábitos Diários</b></summary>

- Criação com nome, ícone (20 opções) e cor (8 opções)
- Marcar hábito do dia com um toque
- Streak (🔥) de dias consecutivos
- Visualização dos últimos 7 dias com bolinhas coloridas
- Barra de progresso diária
- Celebração ao completar todos os hábitos

</details>

<details>
<summary><b>📊 Estatísticas</b></summary>

- Resumo por: Semana, Mês, Todo período
- Comparação com período anterior (↑ ↓ =)
- Gráfico de barras por dia da semana
- Dia mais produtivo em destaque
- Lista dos próximos compromissos
- Mensagem motivacional personalizada

</details>

<details>
<summary><b>⚙️ Configurações</b></summary>

- Edição de nome e data de nascimento
- Tema claro / escuro
- Cor de destaque do app (8 opções)
- Toggle e tempo padrão de notificações
- Exportar dados (em breve)
- Apagar todos os dados

</details>

---

## 🛠 Tech Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| **TypeScript** | 6.0.3 | Linguagem principal |
| **React Native** | 0.85.3 | Framework UI multiplataforma |
| **Expo SDK** | 56 | Plataforma de desenvolvimento |
| **Expo Router** | 56.2.9 | Navegação file-based |
| **Zustand** | 5.0.14 | Gerenciamento de estado global |
| **Expo SQLite** | 56.0.4 | Banco de dados local para eventos |
| **AsyncStorage** | latest | Persistência para notas, hábitos e listas |
| **date-fns** | 4.4.0 | Manipulação de datas em pt-BR |
| **Expo Notifications** | 56.0.16 | Notificações push locais |
| **NativeWind** | 4.2.5 | Tailwind CSS para React Native |
| **UUID** | 14.0.0 | Geração de IDs únicos |

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                     Telas (app/)                    │
│              Expo Router — file-based               │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Componentes (src/components/)           │
│         UI reutilizável com suporte a temas         │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│               Stores (src/store/)                   │
│        Zustand — estado global por domínio          │
└──────┬─────────────────────────────────┬────────────┘
       │                                 │
┌──────▼──────┐                 ┌────────▼───────┐
│  Expo SQLite │                 │  AsyncStorage  │
│  (Eventos)   │                 │  (Notas, etc.) │
└─────────────┘                 └────────────────┘
```

**Fluxo de dados:**
```
Ação do usuário → Store (Zustand) → DB/AsyncStorage → Store atualiza → UI re-renderiza
```

**Persistência por módulo:**

| Módulo | Tecnologia | Motivo |
|---|---|---|
| Eventos | Expo SQLite | Queries por intervalo de datas com índices |
| Notas | AsyncStorage | Dados simples, sem necessidade de SQL |
| Listas | AsyncStorage | Dados aninhados, filtrados em memória |
| Hábitos | AsyncStorage | Arrays de datas, lógica simples |
| Configurações | AsyncStorage | Chave-valor simples |

---

## 📁 Estrutura de Pastas

```
focusme/
│
├── app/                          # Telas — Expo Router (file-based routing)
│   ├── _layout.tsx               # Layout raiz: DB init, notificações, onboarding redirect
│   ├── onboarding.tsx            # Boas-vindas (4 slides animados)
│   ├── new-event.tsx             # Formulário de novo compromisso
│   ├── notifications-debug.tsx   # Tela de debug de notificações
│   │
│   ├── (tabs)/                   # Abas da navegação principal
│   │   ├── _layout.tsx           # Configuração das 3 tabs
│   │   ├── index.tsx             # Home
│   │   ├── agenda.tsx            # Calendário mensal
│   │   └── settings.tsx          # Configurações
│   │
│   ├── event/[id].tsx            # Detalhe e edição de compromisso
│   ├── grocery/
│   │   ├── index.tsx             # Lista de listas de mercado
│   │   └── [id].tsx              # Itens de uma lista
│   ├── notes/
│   │   ├── index.tsx             # Grade de notas + busca
│   │   ├── new.tsx               # Criar nota
│   │   └── [id].tsx              # Ver/editar nota
│   ├── focus/index.tsx           # Timer Pomodoro
│   ├── habits/index.tsx          # Hábitos diários
│   └── stats/index.tsx           # Estatísticas
│
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── CalendarGrid.tsx      # Grade do calendário com pontinhos
│   │   ├── ColorAccentPicker.tsx # Seletor de cor do app
│   │   ├── ColorPicker.tsx       # Seletor de cor de eventos
│   │   ├── DaySelector.tsx       # Scroll horizontal de dias
│   │   ├── EventCard.tsx         # Card de compromisso
│   │   ├── FormField.tsx         # Campo de formulário com label
│   │   ├── QuickActions.tsx      # Atalhos rápidos (scroll horizontal)
│   │   ├── RecentNotes.tsx       # Notas recentes na Home
│   │   ├── ReminderPicker.tsx    # Seletor de tempo de lembrete
│   │   ├── SettingRow.tsx        # Linha de configuração
│   │   └── TimePicker.tsx        # Picker customizado de data/hora
│   │
│   ├── db/
│   │   ├── database.ts           # Init e schema SQLite
│   │   └── events.ts             # CRUD eventos (com fallback web)
│   │
│   ├── store/
│   │   ├── useEventStore.ts      # Estado de compromissos
│   │   ├── useGroceryStore.ts    # Estado de listas de mercado
│   │   ├── useHabitsStore.ts     # Estado de hábitos
│   │   ├── useNotesStore.ts      # Estado de notas
│   │   ├── useSettingsStore.ts   # Estado de configurações
│   │   └── useThemeStore.ts      # Estado do tema
│   │
│   ├── types/
│   │   ├── index.ts              # Event, Reminder, EventColor
│   │   ├── grocery.ts            # GroceryItem, GroceryList, CATEGORIES
│   │   ├── habits.ts             # Habit, HABIT_ICONS, HABIT_COLORS
│   │   └── notes.ts              # Note, NoteColor, NOTE_COLORS
│   │
│   ├── utils/
│   │   ├── dateHelpers.ts        # getDayBounds, formatTime, formatDate
│   │   ├── duration.ts           # formatDuration, reminderLabel
│   │   └── notifications.ts      # requestPermissions, schedule, cancel
│   │
│   └── global.css                # CSS base NativeWind
│
├── assets/images/
│   ├── icon.png                  # Ícone 1024×1024
│   ├── adaptive-icon.png         # Ícone Android 1024×1024
│   └── splash-icon.png           # Splash screen
│
├── app.json                      # Configuração Expo
├── eas.json                      # Configuração EAS Build/Submit
├── babel.config.js               # Babel com preset Expo + NativeWind
├── tailwind.config.js            # Tailwind com preset NativeWind
├── metro.config.js               # Metro bundler com NativeWind
├── tsconfig.json                 # TypeScript strict mode
├── nativewind-env.d.ts           # Tipos globais NativeWind
└── .npmrc                        # legacy-peer-deps=true
```

---

## 🗃 Banco de Dados

O banco SQLite é usado para **eventos/compromissos** por exigir queries com filtros por intervalo de datas.

### Schema

```sql
-- Tabela principal de eventos
CREATE TABLE IF NOT EXISTS events (
  id            TEXT PRIMARY KEY NOT NULL,  -- UUID v4
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT "",
  start_at      INTEGER NOT NULL,           -- Unix timestamp em ms
  end_at        INTEGER NOT NULL,
  all_day       INTEGER NOT NULL DEFAULT 0, -- 0=com horário, 1=dia inteiro
  color         TEXT NOT NULL DEFAULT "#6366f1",
  notify_before INTEGER NOT NULL DEFAULT 15, -- minutos antes
  recurrence    TEXT,                        -- JSON (reservado)
  synced_at     INTEGER,
  deleted_at    INTEGER                      -- soft delete
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_events_start_at   ON events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at);
```

> **Compatibilidade Web:** O módulo `src/db/events.ts` detecta `Platform.OS === "web"` e usa AsyncStorage como fallback automático.

---

## 🗃 Gerenciamento de Estado

Cada domínio tem sua própria store Zustand independente:

```typescript
// Exemplo: useEventStore
const { events, loading, loadByDay, addEvent, editEvent, removeEvent } = useEventStore();

// Exemplo: useThemeStore
const { theme, dark, setDark } = useThemeStore();

// Exemplo: useSettingsStore
const { name, accentColor, update } = useSettingsStore();
```

| Store | Dados gerenciados | Persistência |
|---|---|---|
| `useEventStore` | Compromissos do dia/período | SQLite |
| `useNotesStore` | Todas as notas | AsyncStorage |
| `useGroceryStore` | Listas e itens de mercado | AsyncStorage |
| `useHabitsStore` | Hábitos e completions | AsyncStorage |
| `useSettingsStore` | Configurações do usuário | AsyncStorage |
| `useThemeStore` | Tema ativo e cores | Memória (sincronizado com Settings) |

---

## 🔔 Notificações Push

```
Criar evento com notify_before > 0
         ↓
scheduleEventNotification(event)
         ↓
Verifica: dispositivo físico + triggerMs > Date.now()
         ↓
Expo Notifications.scheduleNotificationAsync()
         ↓
Notificação agendada para: start_at - notify_before * 60000

Editar ou excluir evento
         ↓
rescheduleAllEvents(allEvents)
         ↓
cancelAllNotifications() → reagenda todos os eventos futuros
```

**Ao tocar na notificação:** o listener em `_layout.tsx` captura o `eventId` nos dados e redireciona automaticamente para `/event/${eventId}`.

> ⚠️ Notificações funcionam em **dispositivos físicos**. No emulador/simulador é necessária configuração adicional.

---

## 🎨 Temas Claro e Escuro

```typescript
// Tema Claro
{
  background:    "#f3f4f6",
  card:          "#ffffff",
  border:        "#e5e7eb",
  text:          "#111827",
  textSecondary: "#6b7280",
  textMuted:     "#9ca3af",
  inputBg:       "#f3f4f6",
}

// Tema Escuro
{
  background:    "#0f172a",
  card:          "#1e293b",
  border:        "#334155",
  text:          "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted:     "#64748b",
  inputBg:       "#1e293b",
}
```

Todos os componentes consomem `useThemeStore()` e aplicam cores dinamicamente. O tema é sincronizado com `darkMode` do `useSettingsStore` na inicialização do app.

---

## ✅ Pré-requisitos

| Ferramenta | Versão mínima | Link |
|---|---|---|
| **Node.js** | 18.x LTS | [nodejs.org](https://nodejs.org) |
| **npm** | 9.x | Incluso com Node.js |
| **Git** | 2.x | [git-scm.com](https://git-scm.com) |
| **VS Code** | 1.80+ | [code.visualstudio.com](https://code.visualstudio.com) |
| **Expo Go** (celular) | Última versão | App Store / Play Store |

---

## 🚀 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/focusme.git
cd focusme

# 2. Crie o .npmrc (evita conflitos de peer deps)
echo "legacy-peer-deps=true" > .npmrc

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npx expo start
```

### Rodando em cada plataforma

```bash
# Navegador (mais rápido para desenvolvimento)
npx expo start    # depois pressione W

# Celular Android ou iOS
npx expo start    # escaneie o QR code com o Expo Go

# Emulador Android
npx expo start --android

# Simulador iOS (apenas macOS)
npx expo start --ios

# Limpar cache (quando algo der errado)
npx expo start --clear
```

---

## 🧩 Extensões VS Code

### Obrigatórias

| Extensão | ID |
|---|---|
| ESLint | `dbaeumer.vscode-eslint` |
| Prettier | `esbenp.prettier-vscode` |
| TypeScript Importer | `pmneo.tsimporter` |
| ES7+ React Snippets | `dsznajder.es7-react-js-snippets` |
| Expo Tools | `expo.vscode-expo-tools` |

### Recomendadas

| Extensão | ID |
|---|---|
| React Native Tools | `msjsdiag.vscode-react-native` |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` |
| GitLens | `eamodio.gitlens` |
| Error Lens | `usernamehw.errorlens` |
| Path IntelliSense | `christian-kohler.path-intellisense` |

### Instalar todas de uma vez

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension pmneo.tsimporter
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension expo.vscode-expo-tools
code --install-extension msjsdiag.vscode-react-native
code --install-extension bradlc.vscode-tailwindcss
code --install-extension eamodio.gitlens
code --install-extension usernamehw.errorlens
code --install-extension christian-kohler.path-intellisense
```

---

## ⚡ Comandos

### Desenvolvimento

```bash
npx expo start              # Iniciar servidor
npx expo start --clear      # Iniciar limpando cache
npx expo install --check    # Verificar compatibilidade de pacotes
npx expo doctor             # Diagnosticar problemas no projeto
npx expo config             # Ver configuração atual
```

### Build e Publicação (EAS)

```bash
# Login
eas login
eas init                    # Inicializar projeto EAS (gera projectId)

# Builds de teste
eas build --platform android --profile preview   # APK para instalar direto
eas build --platform ios --profile development   # Simulador iOS

# Builds de produção
eas build --platform android --profile production  # .aab para Play Store
eas build --platform ios --profile production      # .ipa para App Store
eas build --platform all --profile production      # Ambas de uma vez

# Publicar nas lojas
eas submit --platform android
eas submit --platform ios

# Ver status
eas build:list
```

---

## 📦 Publicação nas Lojas

### 🤖 Google Play Store

**Requisitos:**
- Conta no [Google Play Console](https://play.google.com/console) — taxa única de **U$ 25**
- Ícone `512×512px` PNG
- Banner `1024×500px`
- Screenshots `1080×1920px` (mínimo 2)
- Política de privacidade (URL obrigatória)

```bash
eas build --platform android --profile production
# → Upload do .aab gerado no Google Play Console
```

### 🍎 App Store (iOS)

**Requisitos:**
- Conta no [Apple Developer](https://developer.apple.com) — **U$ 99/ano**
- Ícone `1024×1024px` PNG (sem transparência)
- Screenshots `1290×2796px` iPhone 6.7" (mínimo 3)
- Política de privacidade (URL obrigatória)

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### Ferramentas úteis

| Ferramenta | URL | Para quê |
|---|---|---|
| App Icon Generator | [appicon.co](https://appicon.co) | Gerar ícones em todos os tamanhos |
| Screenshot Maker | [hotpot.ai](https://hotpot.ai/app-screenshot) | Screenshots bonitas para as lojas |
| Privacy Policy Gen | [privacypolicygenerator.info](https://privacypolicygenerator.info) | Política de privacidade gratuita |
| GitHub Pages | [pages.github.com](https://pages.github.com) | Hospedar política de privacidade |

---

## 🧠 Decisões Técnicas

<details>
<summary><b>Por que Expo em vez de React Native puro?</b></summary>

Expo elimina toda a configuração nativa (Gradle, Xcode, CocoaPods), permite gerar builds iOS **sem Mac físico** via EAS Build, e oferece módulos prontos para SQLite, notificações, câmera e device. Para um app com foco em entrega rápida de funcionalidades, Expo é a escolha natural.

</details>

<details>
<summary><b>Por que Expo Router em vez de React Navigation?</b></summary>

Expo Router usa file-based routing (como Next.js): cada arquivo em `app/` é automaticamente uma rota. A estrutura do projeto fica autoexplicativa, sem necessidade de registrar rotas manualmente. Facilita manutenção e onboarding de novos desenvolvedores.

</details>

<details>
<summary><b>Por que Zustand em vez de Redux?</b></summary>

Zustand tem **zero boilerplate**, pesa ~1KB e não exige Provider wrappers. Para um app mobile com estado relativamente simples, Redux seria excessivo. O Context API re-renderiza toda a árvore de componentes, causando problemas de performance em listas longas.

</details>

<details>
<summary><b>Por que SQLite para eventos e AsyncStorage para o resto?</b></summary>

Eventos exigem queries com filtros por intervalo de datas (`WHERE start_at >= ? AND start_at < ?`) e índices para performance. SQLite é a tecnologia correta. Notas, hábitos e listas são dados simples que podem ser lidos inteiros e filtrados em memória — AsyncStorage é suficiente e mais simples.

</details>

<details>
<summary><b>Por que o TimePicker é customizado?</b></summary>

O `@react-native-community/datetimepicker` tem comportamento inconsistente entre plataformas no Expo Go: no iOS precisa de modal, no Android fecha automaticamente, e na web não funciona. O TimePicker customizado com `ScrollView` funciona **identicamente em todas as plataformas**.

</details>

<details>
<summary><b>Por que <code>legacy-peer-deps=true</code>?</b></summary>

O Expo SDK 56 usa React 19.2.3, mas alguns pacotes internos do `expo-router` referenciam `react-dom@19.2.7` que exige `react@^19.2.7`. É um conflito de versão patch sem impacto real, resolvido com `legacy-peer-deps` que instrui o npm a ignorar conflitos de peer dependencies não críticos.

</details>

---

## 📊 Informações do Projeto

| Campo | Valor |
|---|---|
| **Nome** | FocusMe |
| **Versão** | 1.0.0 |
| **Bundle ID (iOS)** | com.focusme.app |
| **Package (Android)** | com.focusme.app |
| **Plataformas** | iOS · Android · Web |
| **SDK Expo** | 56 |
| **React Native** | 0.85.3 |
| **TypeScript** | 6.0.3 |
| **Mínimo iOS** | 15.0 |
| **Mínimo Android** | API 24 (Android 7.0) |

---

<div align="center">

Feito com 💜 para mentes TDAH

**FocusMe** · v1.0.0 · Junho 2025

</div>
