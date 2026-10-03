import { useEffect, useState } from 'react';

const agentSeed = [
  { name: 'Repo Guardian', role: 'Health checks', status: 'ready' },
  { name: 'Bug Sweeper', role: 'Scan before ship', status: 'good' },
  { name: 'Credit Manager', role: 'Budget protection', status: 'ready' },
  { name: 'Deploy Ops', role: 'Pipeline orchestration', status: 'warn' },
  { name: 'Self Upgrader', role: 'Patch and improve', status: 'good' },
];

export default function HomePage() {
  const [status, setStatus] = useState<any>(null);
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setStatus({ mode: 'demo', ok: true, checks: [] }));
  }, []);

  const triggerDeploy = async () => {
    setDeploying(true);
    setResult(null);

    try {
      const response = await fetch('/api/deploy', { method: 'POST' });
      const data = await response.json();
      setResult(data.message || 'Deployment action complete');
      const refreshed = await fetch('/api/status');
      setStatus(await refreshed.json());
    } catch (error) {
      setResult('Deployment action failed in the local demo environment.');
    } finally {
      setDeploying(false);
    }
  };

  const summary = status?.summary ?? {
    mode: 'demo',
    credits: 82,
    repoSpace: 74,
    deploys: 2,
    healthy: true,
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="panel">
          <span className="kicker">GitHub App Ops</span>
          <h1>Mini AI agents that keep deploys clean, safe, and efficient.</h1>
          <p className="lead">
            This repository contains a deployment orchestrator that watches GitHub health,
            checks Vercel and Netlify readiness, protects free room, and only ships when
            credits and repository capacity are still healthy.
          </p>

          <div className="cta-row">
            <button className="primary-btn" onClick={triggerDeploy} disabled={deploying}>
              {deploying ? 'Launching...' : 'Run deploy check'}
            </button>
            <button className="secondary-btn" type="button">Switch to live mode</button>
          </div>

          <div className="metrics">
            <div className="metric">
              <div className="metric-value">{summary.credits ?? 82}%</div>
              <div className="metric-label">Credit buffer</div>
            </div>
            <div className="metric">
              <div className="metric-value">{summary.repoSpace ?? 74}%</div>
              <div className="metric-label">Repo free room</div>
            </div>
            <div className="metric">
              <div className="metric-value">{summary.deploys ?? 2}</div>
              <div className="metric-label">Queued deploys</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <p className="card-title">Mission control</p>
          <ul className="agent-list">
            {agentSeed.map((agent) => (
              <li key={agent.name}>
                <div>
                  <div className="agent-name">
                    <span className={`status-dot ${agent.status}`} />
                    {agent.name}
                  </div>
                  <small>{agent.role}</small>
                </div>
                <span className={`pill ${agent.status === 'ready' ? 'good' : agent.status === 'warn' ? 'warn' : 'good'}`}>
                  {agent.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="summary-grid">
        <div className="panel">
          <p className="card-title">Repository checks</p>
          <div className="check-row">
            <span>Repo health</span>
            <span className="pill good">healthy</span>
          </div>
          <div className="check-row">
            <span>Branch hygiene</span>
            <span className="pill good">clean</span>
          </div>
          <div className="check-row">
            <span>Artifact cleanup</span>
            <span className="pill warn">review</span>
          </div>
        </div>

        <div className="panel">
          <p className="card-title">Deployment targets</p>
          <div className="check-row">
            <span>Vercel</span>
            <span className="pill good">ready</span>
          </div>
          <div className="check-row">
            <span>Netlify</span>
            <span className="pill warn">fallback</span>
          </div>
          <div className="check-row">
            <span>GitHub sync</span>
            <span className="pill good">linked</span>
          </div>
        </div>

        <div className="panel">
          <p className="card-title">System message</p>
          {result ? (
            <p>{result}</p>
          ) : (
            <p>
              No deploy action has been triggered. The agent team is optimizing spend and
              routing deployments to the cheapest healthy environment.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
