# Spatz-2 🚀

## Description

A complete, production-ready fullstack SvelteKit template with authentication, payments, AI features, and modern animations. Built as an evolution of the original [spatz](https://github.com/engageintellect/spatz) with enhanced performance and developer experience.

**[🌐 Live Demo](https://spatz2.engage-dev.com)** | **[📚 Documentation](./docs)**

## What's New in Spatz-2?

**Spatz v1**: Standard Svelte forms + DaisyUI  
**Spatz v2**: Svelte 5 + SuperForms + shadcn-svelte + Stripe + Magic-UI animations + Performance optimizations

## 🛠 Tech Stack

- **[SvelteKit](https://kit.svelte.dev/)**: Latest Svelte 5 with enhanced reactivity
- **[Pocketbase](https://pocketbase.io)**: Self-hosted backend with auth, database, and admin UI
- **[OpenAI](https://openai.com)** + **[Vercel AI SDK](https://vercel.com/ai)**: GPT-4 integration with streaming
- **[TailwindCSS](https://tailwindcss.com)** + **[shadcn-svelte](https://shadcn-svelte.com/)**: Modern component system
- **[Stripe](https://stripe.com)**: Complete payment and subscription handling
- **[Magic-UI](https://magicui.design/)**: Beautiful animated components
- **[Zod](https://zod.dev)** + **[SuperForms](https://superforms.rocks/)**: Type-safe form validation
- **[GSAP](https://greensock.com/)**: Professional-grade animations

## ✨ Features

### 🔐 **Authentication & User Management**
- Complete auth flow (login, register, password reset)
- User profiles with customizable settings
- Admin dashboard via Pocketbase
- Secure session management

### 💳 **Payments & Subscriptions**
- Stripe integration with webhook support
- Subscription management dashboard
- One-time payments and donations
- Customer portal integration

### 🤖 **AI Integration**
- OpenAI GPT-4 chatbot with streaming responses
- Custom AI agent workflows via n8n
- Image generation with DALL-E
- Context-aware conversations

### 🎨 **Modern UI/UX**
- Dark/light mode with system preference detection
- Responsive design with mobile-first approach
- Command palette (⌘+J) for power users
- Smooth animations and micro-interactions
- Loading states and error handling

### 📊 **Additional Features**
- Interactive guestbook with real-time updates
- Bitcoin price prediction dashboard
- Contact forms with validation
- Notification system
- SEO optimized
- Performance monitoring ready


![Image Description](/src/lib/assets/images/marketing/lighthouse.png)
![Image Description](/src/lib/assets/images/marketing/spatz2.png)

## Getting Started

### Pocketbase Setup

1. Create a directory for your Pocketbase instance and navigate to it.

```bash
mkdir pb-spatz-2
cd pb-spatz-2
```

2. Download the latest release of Pocketbase, unzip it, and start the server.

```bash
wget https://github.com/pocketbase/pocketbase/releases/download/v0.23.4/pocketbase_0.24.4_linux_amd64.zip
unzip pocketbase_0.24.3_linux_amd64.zip
./pocketbase serve --http="0.0.0.0:8090"
```

3. Log in to the Pocketbase admin console at `http://localhost:8090/_/` and create a new database.

4. Go to settings > Import collections, then paste in the contens of `./pocketbase/pb_schema.json` (from this repo) and click import.

### Client Setup

1. Clone the repo and navigate to the project directory.

```bash
git clone https://github.com/engageintellect/spatz-2
cd spatz-2
```

2. Copy .env.example and replace the values with your own.

```bash
cp .env.example .env.local (or .env)
```

3. Install the dependencies and start the development server.

```bash
pnpm i && pnpm run dev --host
```

4. Open your browser to `http://localhost:5173` to see the app.

## Development

### 📁 Project Structure

```
spatz-2/
├── 📁 src/
│   ├── 📁 lib/
│   │   ├── 📁 assets/images/          # Static images and media
│   │   ├── 📁 components/
│   │   │   ├── 📁 landing-page/       # Hero, About, Skills components
│   │   │   ├── 📁 magic-ui/           # Animated components (Globe, Particles, etc.)
│   │   │   ├── 📁 marketing/          # Marketing page components
│   │   │   └── 📁 ui/                 # Reusable UI components (shadcn-svelte)
│   │   ├── 📁 hooks/                  # Custom Svelte hooks
│   │   ├── 📁 stores/                 # Global state management
│   │   ├── 📁 utils/                  # Utility functions
│   │   ├── animations.ts              # GSAP animation helpers
│   │   └── schema.ts                  # Zod validation schemas
│   │
│   ├── 📁 routes/
│   │   ├── 📄 +layout.svelte          # Root layout with nav/footer
│   │   ├── 📄 +page.svelte            # Landing page
│   │   │
│   │   ├── 📁 ai/                     # AI-powered features
│   │   │   ├── 📄 +page.svelte        # AI dashboard
│   │   │   ├── 📁 agent/              # n8n workflow integration
│   │   │   ├── 📁 chat/               # OpenAI chatbot
│   │   │   └── 📁 context/            # Context management
│   │   │
│   │   ├── 📁 api/                    # Server-side API routes
│   │   │   ├── 📄 +server.ts          # Main API endpoint
│   │   │   ├── 📁 agent/              # n8n workflow API
│   │   │   ├── 📁 chat/               # OpenAI streaming API
│   │   │   ├── 📁 donate/             # Stripe donation handling
│   │   │   ├── 📁 fortune/            # Random quotes API
│   │   │   ├── 📁 image-gen/          # DALL-E image generation
│   │   │   └── 📁 repo-data/          # GitHub repository data
│   │   │
│   │   ├── 📁 auth/                   # Authentication flows
│   │   │   ├── 📁 login/              # User login
│   │   │   ├── 📁 register/           # User registration
│   │   │   ├── 📁 logout/             # Session termination
│   │   │   └── 📁 reset-password/     # Password recovery
│   │   │
│   │   ├── 📁 my/                     # User dashboard
│   │   │   └── 📁 settings/
│   │   │       ├── 📁 account/        # Account management
│   │   │       ├── 📁 profile/        # Profile customization
│   │   │       ├── 📁 security/       # Password & security
│   │   │       └── 📁 subscription/   # Stripe subscriptions
│   │   │
│   │   ├── 📁 guestbook/              # Interactive guestbook
│   │   │   └── 📁 post/[id]/          # Individual post pages
│   │   │
│   │   ├── 📁 users/[id]/             # User profile pages
│   │   ├── 📁 notifications/[id]/     # Notification system
│   │   ├── 📁 bitcoin-prediction/     # Crypto price predictions
│   │   ├── 📁 checkout/               # Stripe checkout flow
│   │   ├── 📁 subscriptions/          # Subscription management
│   │   ├── 📁 technologies/           # Tech stack showcase
│   │   ├── 📁 contact/                # Contact form
│   │   ├── 📁 donate/                 # Donation page
│   │   ├── 📁 privacy/                # Privacy policy
│   │   └── 📁 terms/                  # Terms of service
│   │
│   ├── 📄 app.css                     # Global styles & CSS variables
│   ├── 📄 app.d.ts                    # TypeScript declarations
│   ├── 📄 app.html                    # HTML template
│   └── 📄 hooks.server.ts             # Server-side hooks
│
├── 📁 pocketbase/
│   └── 📄 pb_schema.json              # Database schema
│
├── 📁 static/                         # Static assets
│   └── 📄 favicon.png
│
├── 📄 package.json                    # Dependencies & scripts
├── 📄 tailwind.config.ts              # Tailwind configuration
├── 📄 vite.config.ts                  # Vite build configuration
└── 📄 README.md                       # This file
```

### Icons

Icons are provided by [iconify/svelte](https://www.npmjs.com/package/@iconify/svelte).
You can search for icons on [Icones](https://icones.js.org/collection/all).

### Animations

Animations are provided by GSAP and are easy to implement. You can find the documentation [here](https://greensock.com/docs/v3/GSAP).

### Tips

If the payments don't work, check if there is a csp part in your svelte.config.js. You have to comment it out completely for Stripe to work.

## Contributing to spatz

Contributions are welcomed, and appreciated. If you have a feature request, please add it as an issue or make a pull request.
