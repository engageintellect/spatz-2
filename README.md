# spatz-2

## Description

A complete, fullstack template for Svelte, based on the original [spatz](https://github.com/engageintellect).

[Live Demo App](https://spatz2.engage-dev.com)

## What's the difference between spatz and spatz-2?

spatz uses standard forms in svelte and daisyUI.
spatz-2 uses svelte-superforms, shadcn-svelte, and svelte-animations.

## Tech Stack

- [Sveltekit](https://kit.svelte.dev/): Futuristic web framework for building blazing fast web apps.
- [Pocketbase](https://pocketbase.io): Self-contained User Auth, Database, Admin UI, and API documentation.
- [OpenAI](https://openai.com): chatGPT 3.5-turbo & 4.0-turbo for contextually aware chatbots.
- [Vercel AI SDK](https://vercel.com/ai): AI/ML models for image, text, and audio processing.
- [TailwindCSS](https://tailwindcss.com): A utility-first CSS framework for rapid UI development.
- [svelte-animations](https://animation-svelte.vercel.app/): A svelte port of Magic-UI.
- [Zod](https://zod.dev): TypeScript-first schema declaration and validation.

## Features
- User Authentication.
- User Profile and Settings on client.
- Admin Dashboard in Pocketbase.
- Stripe Payments.
- Dark/Light Mode Themes.
- Iconifty Icons.
- GSAP Animations.
- Command Pallette (CMD+j).
- AI Chatbot with OpenAI.
- Guestbook with Pocketbase.
- Forms by svelte-superforms, with client/server validation via Zod.


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
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.9/pocketbase_0.22.9_linux_amd64.zip
unzip pocketbase_0.22.9_linux_amd64.zip
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

### Project Structure

```
/src
├── /lib
│   ├── /schema.ts (Zod schema)
│   └── app.d.ts (global types)
├── /assets
│   └── /images
├── /components
│   ├── /magic-ui (svelte-animations)
│   └── /ui (shared components)
├── /stores (global state)
├── /routes
│   ├── /guestbook
│   ├── /technologies
│   ├── /ai
│   │   ├── /chat
│   │   ├── /context
│   │   ├── /a
│   │   ├── /b
│   │   └── /c
│   ├── /api
│   │   ├── /repo-data (fetch github repository stars)
│   │   ├── /fortune (fetch random tech founder quote)
│   │   ├── /chat (OpenAI streaming API)
│   │__ /auth (Pocketbase auth)
│   │   ├── /login
│   │   ├── /register
│   │   ├── /logout
│   │   └── /reset-password
│   └── /my (user-specific routes)
│       ├── /profile
│       ├── /account
│       └── /settings
/pocketbase
├── pb_schema.json
/static
└── /docs (general documentation)

```

### Icons

Icons are provided by [iconify/svelte](https://www.npmjs.com/package/@iconify/svelte).
You can search for icons on [Icones](https://icones.js.org/collection/all).

### Animations

Animations are provided by GSAP and are easy to implement. You can find the documentation [here](https://greensock.com/docs/v3/GSAP).

## Contributing to spatz

Contributions are welcomed, and appreciated. If you have a feature request, please add it as an issue or make a pull request.
