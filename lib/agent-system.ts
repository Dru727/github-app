export type AgentStatus = 'ready' | 'good' | 'warn';

export interface Agent {
  name: string;
  role: string;
  status: AgentStatus;
}

export function createAgentTeam(): Agent[] {
  return [
    { name: 'Repo Guardian', role: 'Checks repo health and branch hygiene', status: 'ready' },
    { name: 'Bug Sweeper', role: 'Catches runtime and syntax issues before ship', status: 'good' },
    { name: 'Credit Manager', role: 'Protects budget and avoids waste', status: 'ready' },
    { name: 'Deploy Ops', role: 'Chooses Vercel or Netlify automatically', status: 'warn' },
    { name: 'Self Upgrader', role: 'Applies safe improvements and patches', status: 'good' },
  ];
}

export function getDeploymentSnapshot() {
  const mode = process.env.APP_MODE ?? 'demo';

  return {
    mode,
    repoSpace: mode === 'live' ? 91 : 74,
    credits: mode === 'live' ? 88 : 82,
    deploysQueued: mode === 'live' ? 1 : 2,
    shouldShip: mode === 'demo' ? false : Boolean(process.env.GITHUB_TOKEN && process.env.VERCEL_TOKEN),
  };
}
