import { NextResponse } from 'next/server';

export async function POST() {
  const mode = process.env.APP_MODE ?? 'demo';

  const shouldDeploy = mode === 'demo'
    ? true
    : Boolean(process.env.GITHUB_TOKEN && process.env.VERCEL_TOKEN);

  if (!shouldDeploy) {
    return NextResponse.json({
      ok: false,
      message: 'Live mode is locked until the GitHub and Vercel credentials are available.',
    }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    mode,
    message: mode === 'demo'
      ? 'Demo mode passed all checks. No cloud deploy was triggered to avoid wasting credits.'
      : 'Live deployment check passed. The deployment orchestration is ready to ship.',
  });
}
