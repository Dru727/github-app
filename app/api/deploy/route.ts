import { NextResponse } from 'next/server';
import { orchestrateDeployment } from '@/lib/agents';
import { vercelDeploy } from '@/lib/vercel-client';

export async function POST() {
  try {
    const check = await orchestrateDeployment();

    if (!check.canDeploy) {
      return NextResponse.json(
        {
          ok: false,
          message: check.reason,
          reports: check.reports,
        },
        { status: 400 }
      );
    }

    // All checks passed and we're in live mode
    const projectId = process.env.VERCEL_PROJECT_ID;
    if (!projectId) {
      return NextResponse.json(
        {
          ok: false,
          message: 'VERCEL_PROJECT_ID not configured',
          reports: check.reports,
        },
        { status: 500 }
      );
    }

    // Trigger the actual deploy
    const deployment = await vercelDeploy(projectId);

    return NextResponse.json({
      ok: true,
      message: `Deploy initiated on Vercel. Deployment ID: ${deployment.id}`,
      deployment,
      reports: check.reports,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: `Deploy failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      },
      { status: 500 }
    );
  }
}
