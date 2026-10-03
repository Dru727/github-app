import { NextResponse } from 'next/server';
import { orchestrateDeployment } from '@/lib/agents';

export async function GET() {
  const mode = process.env.APP_MODE ?? 'demo';
  const result = await orchestrateDeployment();

  return NextResponse.json({
    mode,
    ...result,
  });
}
