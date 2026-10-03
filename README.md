# github-app

Lightweight AI agent system for safe GitHub and Vercel deployments.

## What it does

Three simple agents that keep your deployments safe and efficient:

1. **Repo Guardian** — checks repository health before any deploy
2. **Bug Sweeper** — runs lint and build checks, blocks broken code
3. **Credit Manager** — avoids unnecessary deploys, protects your budget

Then a simple orchestrator that ties them together: demo mode or live mode.

## Demo mode (default)

Safe simulation. No cloud credits spent.

```bash
npm install
npm run dev
```

Open http://localhost:3000 to see the dashboard.

## Live mode

Requires GitHub and Vercel tokens. Set these env vars:

```bash
GITHUB_TOKEN=your-github-token
VERCEL_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-project-id
APP_MODE=live
```

Then:

```bash
npm run build
npm run start
```

## How the agents work

- **Repo Guardian** checks branch status, commit history, and file changes
- **Bug Sweeper** runs build checks (no actual compilation unless live mode)
- **Credit Manager** verifies Vercel quota and avoids risky deploys
- **Orchestrator** decides: skip, check, or deploy based on all signals

All decisions are logged. Nothing ships without a green light.

## Deploy flow

1. User clicks "Run deploy check"
2. Repo Guardian scans the repo
3. Bug Sweeper runs syntax/build checks
4. Credit Manager verifies budget
5. Orchestrator decides: safe to deploy or hold
6. If live mode + all green → queue Vercel deploy
7. If demo mode or any check fails → show reason and stop

## Files

- `app/page.tsx` — main dashboard UI
- `app/api/status/route.ts` — agent fleet status endpoint
- `app/api/deploy/route.ts` — deploy check endpoint
- `lib/agents.ts` — core agent logic
- `lib/vercel-client.ts` — Vercel API integration

## Credits and safety

- Demo mode never touches the cloud
- Live mode requires valid tokens and green checks
- All deploys are logged with a reason
- Credit/space checks run before every ship
