# github-app

Mini AI agents system with GitHub/Vercel/Netlify deployment tunnel and intelligent credit management.

## What this app does

- monitors repository and deployment health
- maintains a small set of autonomous agents for cleanup, bug scanning, upgrades, and deploy pricing checks
- lets the app run in demo mode or live mode
- avoids waste by delaying deploys unless the environment is safe
- provides a ready-to-deploy Next.js dashboard for Vercel and Netlify

## Demo mode

The dashboard runs without cloud credentials and behaves safely by simulating checks:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Live mode

Set the following environment variables if you want the app to attempt real integration checks:

```bash
GITHUB_TOKEN=your-token
VERCEL_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-project-id
NETLIFY_TOKEN=your-netlify-token
APP_MODE=live
```

Then start the app:

```bash
npm run build
npm run start
```

## Built-in agent flow

- Repo Guardian: validates repository health
- Bug Sweeper: scans for broken code before release
- Credit Manager: keeps spend under control
- Deploy Ops: chooses the healthiest target
- Self Upgrader: applies safe upgrades when the system is stable

## Notes

This repo is intentionally designed to preserve credits by default. Demo mode never triggers a cloud deployment unless the user explicitly switches to live mode with valid credentials and a safe environment.
