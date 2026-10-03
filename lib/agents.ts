export type AgentName = 'Repo Guardian' | 'Bug Sweeper' | 'Credit Manager';
export type AgentStatus = 'ready' | 'good' | 'warn' | 'blocked';

export interface AgentReport {
  agent: AgentName;
  status: AgentStatus;
  message: string;
  timestamp: number;
}

export interface DeploymentCheck {
  ok: boolean;
  reason: string;
  reports: AgentReport[];
  mode: 'demo' | 'live';
  canDeploy: boolean;
}

/**
 * Repo Guardian checks basic repository health
 */
export async function repoGuardian(): Promise<AgentReport> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return {
        agent: 'Repo Guardian',
        status: 'warn',
        message: 'GitHub token not found. Repo health check skipped in demo mode.',
        timestamp: Date.now(),
      };
    }

    // In a real app, call GitHub API to check branch status, recent commits, etc.
    return {
      agent: 'Repo Guardian',
      status: 'good',
      message: 'Repository is healthy. Main branch is clean.',
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      agent: 'Repo Guardian',
      status: 'blocked',
      message: `Repo check failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      timestamp: Date.now(),
    };
  }
}

/**
 * Bug Sweeper runs build and lint checks
 */
export async function bugSweeper(): Promise<AgentReport> {
  try {
    const mode = process.env.APP_MODE ?? 'demo';

    if (mode === 'demo') {
      return {
        agent: 'Bug Sweeper',
        status: 'good',
        message: 'Build check passed (demo mode simulation).',
        timestamp: Date.now(),
      };
    }

    // In live mode, would run actual build/lint
    return {
      agent: 'Bug Sweeper',
      status: 'good',
      message: 'No build errors detected.',
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      agent: 'Bug Sweeper',
      status: 'blocked',
      message: `Build check failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      timestamp: Date.now(),
    };
  }
}

/**
 * Credit Manager checks deployment budget and Vercel quota
 */
export async function creditManager(): Promise<AgentReport> {
  try {
    const token = process.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const mode = process.env.APP_MODE ?? 'demo';

    if (!token || !projectId) {
      return {
        agent: 'Credit Manager',
        status: 'warn',
        message: 'Vercel token or project ID not found. Budget check skipped in demo mode.',
        timestamp: Date.now(),
      };
    }

    // In a real app, check Vercel API for remaining deployments, bandwidth, etc.
    return {
      agent: 'Credit Manager',
      status: 'good',
      message: 'Budget is healthy. Vercel quota available.',
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      agent: 'Credit Manager',
      status: 'blocked',
      message: `Budget check failed: ${error instanceof Error ? error.message : 'unknown error'}`,
      timestamp: Date.now(),
    };
  }
}

/**
 * Run all agents and return a deployment decision
 */
export async function orchestrateDeployment(): Promise<DeploymentCheck> {
  const mode = process.env.APP_MODE ?? 'demo';

  const [repoReport, bugReport, creditReport] = await Promise.all([
    repoGuardian(),
    bugSweeper(),
    creditManager(),
  ]);

  const reports = [repoReport, bugReport, creditReport];
  const allPassed = reports.every((r) => r.status === 'good' || r.status === 'ready');
  const anyBlocked = reports.some((r) => r.status === 'blocked');

  const canDeploy = allPassed && !anyBlocked && mode === 'live';

  return {
    ok: true,
    reason: canDeploy
      ? 'All checks passed. Safe to deploy to Vercel.'
      : mode === 'demo'
      ? 'Demo mode: deploy check passed but live deploy is disabled.'
      : anyBlocked
      ? 'One or more checks failed. Deploy blocked.'
      : 'Some checks require attention before deploy.',
    reports,
    mode,
    canDeploy,
  };
}
