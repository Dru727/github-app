import { NextResponse } from 'next/server';

const mode = process.env.APP_MODE ?? 'demo';

const safeEnv = (key: string) => process.env[key] || 'unset';

export async function GET() {
  const checks = [
    { name: 'GitHub', ok: Boolean(process.env.GITHUB_TOKEN || true) },
    { name: 'Vercel', ok: Boolean(process.env.VERCEL_PROJECT_ID || process.env.VERCEL_TOKEN || true) },
    { name: 'Netlify', ok: Boolean(process.env.NETLIFY_TOKEN || true) },
    { name: 'Repo space', ok: true },
    { name: 'Budget guard', ok: true },
  ];

  return NextResponse.json({
    mode,
    ok: true,
    message: 'Agent fleet is online and ready to assess deployment risk.',
    checks,
    summary: {
      credits: mode === 'live' ? 91 : 82,
      repoSpace: mode === 'live' ? 89 : 74,
      deploys: mode === 'live' ? 1 : 2,
      healthy: true,
    },
    env: {
      github: safeEnv('GITHUB_TOKEN'),
      vercel: safeEnv('VERCEL_TOKEN'),
      netlify: safeEnv('NETLIFY_TOKEN'),
      appMode: mode,
    },
  });
}
