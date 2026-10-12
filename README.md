# KAVRO — AI Business Workspace

> **Work smarter. Operate better. Grow faster.**

KAVRO is a production-oriented AI SaaS platform designed for founders, consultants, management executives, and modern operators. It unifies AI assistance, document generation, deterministic data intelligence, and workflow automation into an executive canvas with sovereign data privacy.

---

## 1. System Architecture

- **Frontend Framework**: Next.js 15+ (App Router), React 19, TypeScript (Strict).
- **Styling & Design System**: Tailwind CSS, custom design tokens, dark theme by default, accessible responsive layouts inspired by Linear, Stripe, and Notion.
- **Components & UI**: Lucide React icons, Framer Motion animations, accessible modal dialogs, and toast notifications.
- **Forms & Validation**: `react-hook-form` + `@hookform/resolvers` + `zod`.
- **Database & Auth**: Supabase PostgreSQL with `@supabase/ssr` & `@supabase/supabase-js`, protected by Row Level Security (RLS) on every table.
- **AI Service Layer**: Modular provider architecture supporting OpenAI, Anthropic Claude, Google Gemini, and a robust simulated fallback (`MockAIProvider`) for development without API keys.
- **Data Intelligence Engine**: Deterministic spreadsheet parsing (`PapaParse`) with statistical inference (means, distributions, null counts) before AI reasoning to eliminate hallucinations.
- **Audit & Token Quotas**: Audit logging table (`usage_events`) and quota gates by subscription tier (`free`, `pro`, `business`).

---

## 2. Directory Structure

```
KAVRO/
├── .env.example                          # Environment variable templates
├── .env.local                            # Local development configuration
├── package.json                          # Dependencies & build scripts
├── tsconfig.json                         # Strict TypeScript configuration
├── tailwind.config.ts                    # Semantic design tokens & color palette
├── supabase/
│   ├── migrations/
│   │   ├── 20261012000001_initial_schema.sql  # Tables, indexes, triggers
│   │   └── 20261012000002_rls_policies.sql    # Row-Level Security policies
│   └── seed.sql                          # Development seeds
├── src/
│   ├── app/
│   │   ├── (marketing)/                  # Public pages (/, /pricing, /about, /contact, /privacy, /terms)
│   │   ├── (auth)/                       # Auth flows (/login, /signup, /forgot-password, /auth/callback)
│   │   ├── (workspace)/                  # Authenticated workspace shell
│   │   │   ├── dashboard/page.tsx        # Overview, metrics, and quick actions
│   │   │   ├── assistant/                # AI Chat & persistent multi-conversation threads
│   │   │   ├── documents/                # Document Studio (Templates & Markdown editor)
│   │   │   ├── data-analysis/page.tsx    # CSV spreadsheet intelligence
│   │   │   ├── workflows/page.tsx        # Repeatable operational workflows
│   │   │   ├── history/page.tsx          # Audit trail of workspace activity
│   │   │   └── settings/                 # Profile, Preferences, Usage, Billing
│   │   └── api/                          # Server Route Handlers
│   │       ├── ai/chat/                  # Chat completion with quota checks
│   │       ├── ai/generate-document/     # AI Document generation
│   │       ├── conversations/            # Conversation CRUD
│   │       ├── documents/                # Document CRUD
│   │       ├── usage/                    # Token telemetry & quota status
│   │       └── billing/subscription/     # Tier subscriptions & pricing
│   ├── components/
│   │   ├── ui/                           # Reusable UI primitives (Button, Input, Card, Modal, Badge)
│   │   ├── marketing/                    # Marketing Navbar & Footer
│   │   ├── workspace/                    # Workspace Sidebar, Header, Usage Bar
│   │   ├── assistant/                    # ChatMessage, ChatInput, ConversationSidebar
│   │   └── documents/                    # TemplateGeneratorModal
│   ├── lib/
│   │   ├── ai/                           # Modular provider adapters (OpenAI, Gemini, Anthropic, Mock)
│   │   ├── supabase/                     # Client, Server, and Admin Supabase instances
│   │   ├── validations/                  # Zod schemas for forms and API payloads
│   │   └── utils.ts                      # Helpers for styling, tokens, and dates
│   ├── services/                         # Business logic & database service layer
│   └── types/                            # Strict TypeScript models
└── tests/                                # Automated node unit tests
```

---

## 3. Database Schema & Row Level Security

The application uses **Supabase PostgreSQL** as its primary source of truth:

| Table | Purpose | RLS Policy Summary |
| :--- | :--- | :--- |
| `profiles` | User profile data, display name, avatar | Isolated to `auth.uid() = id` |
| `workspaces` | Multi-tenant workspace entities | Accessible only by workspace owner or confirmed members |
| `workspace_members` | Role memberships (`owner`, `admin`, `member`) | Isolated by workspace membership function |
| `conversations` | AI chat session headers & titles | Strictly scoped to owning member and workspace |
| `messages` | Chat turns, input/output token counts | Scoped to owning conversation |
| `documents` | Generated & custom business documents | Scoped to owning member and workspace |
| `usage_events` | Immutable audit log of AI token consumption | Scoped to tenant; service role writes |
| `subscriptions` | Active plans, tier quotas, and billing status | Scoped to workspace members |

Migrations are located in `supabase/migrations/`.

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 18.x or later (Node.js 20+ recommended)
- npm or pnpm

### Installation

1. Clone or navigate to the repository directory:
   ```bash
   cd KAVRO
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   A ready-to-run `.env.local` is already provided. To connect to your Supabase project and AI provider, update the variables:
   ```env
   # Supabase Credentials
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # AI Provider Configuration (openai | anthropic | gemini | mock)
   AI_PROVIDER=mock
   AI_PROVIDER_API_KEY=your-api-key-here
   AI_MODEL=gpt-4o-mini
   ```

4. Apply Database Migrations (in Supabase SQL Editor):
   - Run `supabase/migrations/20261012000001_initial_schema.sql`
   - Run `supabase/migrations/20261012000002_rls_policies.sql`

5. Start the Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Automated Tests

Run the test suite:
```bash
npm test
```
Tests validate:
- Authentication & signup input validation
- AI request payload constraints and message schemas
- Document creation schemas
- Token estimator algorithms and financial cost calculators
- Monthly quota thresholds and access rejection rules

---

## 6. Implemented Features & Modules

- [x] **Public Marketing Suite**: High-converting Home (`/`), Pricing (`/pricing`), About (`/about`), Contact (`/contact`), Privacy (`/privacy`), and Terms (`/terms`).
- [x] **Authentication**: Login, Signup with onboarding profile trigger, Password Recovery, and Auth Callback session handling.
- [x] **Workspace Shell**: Responsive collapsible sidebar, top navigation, mobile overlay drawer, active workspace indicator, live token quota bar.
- [x] **Dashboard (`/dashboard`)**: Time-of-day greeting, remaining quota display, quick launchpads, recent conversation threads, recent documents.
- [x] **AI Assistant (`/assistant` & `/assistant/[id]`)**: Multi-conversation persistent chat, safe Markdown rendering with tables and code blocks, copy-to-clipboard, thread rename and deletion, suggested prompt launchpad.
- [x] **Document Studio (`/documents` & `/documents/[id]`)**: 5 business templates (Proposals, Reports, Emails, Meetings, Plans), AI generation modal, live split-view Markdown editor, autosave indicator, copy, and Markdown download export.
- [x] **Data Intelligence (`/data-analysis`)**: Deterministic CSV parser, statistical metrics computation (means, min, max, missing values), data table preview, fact-grounded AI insights.
- [x] **Workflows (`/workflows`)**: Operational blueprints with confirmation authorization gates and execution logs.
- [x] **History (`/history`)**: Chronological audit trail across conversations and documents.
- [x] **User Settings**: Profile credentials, theme/tone preferences, live usage & quota meters, subscription tiers.

---

## 7. Security Highlights

1. **Zero Secret Exposure**: Privileged keys (`SUPABASE_SERVICE_ROLE_KEY`, `AI_PROVIDER_API_KEY`) are exclusively referenced in server Route Handlers and never bundle into client JavaScript.
2. **Security Headers**: `next.config.ts` enforces `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
3. **Deterministic Math Guard**: Generative AI models are prevented from fabricating arithmetic figures in spreadsheet analysis.
4. **Input Defense**: Every API endpoint rejects unvalidated payloads with Zod.
