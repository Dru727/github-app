'use client';

import { useEffect, useState } from 'react';
import type { DeploymentCheck } from '@/lib/agents';

export default function HomePage() {
  const [status, setStatus] = useState<DeploymentCheck | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error('Status fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = async () => {
    setDeploying(true);
    setResult(null);

    try {
      const res = await fetch('/api/deploy', { method: 'POST' });
      const data = await res.json();
      setResult(data.message);

      // Refetch status
      const statusRes = await fetch('/api/status');
      const statusData = await statusRes.json();
      setStatus(statusData);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'unknown error'}`);
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return (
      <main className="page-shell">
        <div className="panel" style={{ textAlign: 'center', padding: '48px' }}>
          <p>Loading agent status...</p>
        </div>
      </main>
    );
  }

  const mode = status?.mode ?? 'demo';
  const canDeploy = status?.canDeploy ?? false;
  const reports = status?.reports ?? [];

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="panel">
          <span className="kicker">GitHub App Ops — Lightweight</span>
          <h1>Three agents. One job. Safe deploys.</h1>
          <p className="lead">
            Repo Guardian checks your code. Bug Sweeper runs tests. Credit Manager protects your budget.
            Together they decide if it's safe to deploy to Vercel.
          </p>

          <div className="cta-row">
            <button
              className="primary-btn"
              onClick={handleDeploy}
              disabled={deploying || !canDeploy}
              title={canDeploy ? 'Run the deploy check' : 'Not ready to deploy in ' + mode + ' mode'}
            >
              {deploying ? 'Checking...' : 'Run deploy check'}
            </button>
            <span
              className="pill"
              style={{
                background: mode === 'live' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(251, 191, 36, 0.11)',
                color: mode === 'live' ? '#7af3b5' : '#f8d77a',
              }}
            >
              {mode === 'live' ? '🔴 live' : '🟡 demo'}
            </span>
          </div>

          {result && (
            <div className="panel" style={{ marginTop: '20px', background: 'rgba(15, 23, 42, 0.8)' }}>
              <p style={{ margin: 0 }}>{result}</p>
            </div>
          )}
        </div>

        <div className="panel">
          <p className="card-title">Agent status</p>
          <ul className="agent-list">
            {reports.map((report) => (
              <li key={report.agent}>
                <div>
                  <div className="agent-name">
                    <span className={`status-dot ${getStatusColor(report.status)}`} />
                    {report.agent}
                  </div>
                  <small>{report.message}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="summary-grid">
        <div className="panel">
          <p className="card-title">Mode</p>
          <div className="check-row">
            <span>Current mode</span>
            <span className="pill" style={getModePillStyle(mode)}>
              {mode}
            </span>
          </div>
          <div className="check-row">
            <span>Can deploy</span>
            <span className={`pill ${canDeploy ? 'good' : 'warn'}`}>
              {canDeploy ? 'ready' : 'blocked'}
            </span>
          </div>
        </div>

        <div className="panel">
          <p className="card-title">Checks</p>
          <div className="check-row">
            <span>Repo Guardian</span>
            <span className={`pill ${reports[0]?.status === 'good' ? 'good' : 'warn'}`}>
              {reports[0]?.status ?? 'pending'}
            </span>
          </div>
          <div className="check-row">
            <span>Bug Sweeper</span>
            <span className={`pill ${reports[1]?.status === 'good' ? 'good' : 'warn'}`}>
              {reports[1]?.status ?? 'pending'}
            </span>
          </div>
          <div className="check-row">
            <span>Credit Manager</span>
            <span className={`pill ${reports[2]?.status === 'good' ? 'good' : 'warn'}`}>
              {reports[2]?.status ?? 'pending'}
            </span>
          </div>
        </div>

        <div className="panel">
          <p className="card-title">Info</p>
          <p style={{ fontSize: '0.9rem', margin: '0 0 12px' }}>
            {mode === 'demo'
              ? 'Running in demo mode. Checks are simulated. No cloud credits are used.'
              : 'Running in live mode. Checks are real. Deploys to Vercel when all green.'}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#8aa5d1', margin: 0 }}>
            Powered by Repo Guardian, Bug Sweeper, and Credit Manager.
          </p>
        </div>
      </section>
    </main>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'good':
    case 'ready':
      return 'good';
    case 'warn':
      return 'warn';
    case 'blocked':
      return 'bad';
    default:
      return 'warn';
  }
}

function getModePillStyle(mode: string) {
  return mode === 'live'
    ? { background: 'rgba(34, 197, 94, 0.12)', color: '#7af3b5' }
    : { background: 'rgba(251, 191, 36, 0.11)', color: '#f8d77a' };
}
