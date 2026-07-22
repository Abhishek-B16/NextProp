import React, { useState, useEffect } from 'react';
import { Building2, Server, Database, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    connected: false,
    message: '',
    dbStatus: 'Unknown',
    timestamp: ''
  });

  const checkBackend = async () => {
    setBackendStatus(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        setBackendStatus({
          loading: false,
          connected: true,
          message: data.message,
          dbStatus: data.database,
          timestamp: data.timestamp
        });
      } else {
        throw new Error('Server returned non-ok status');
      }
    } catch (err) {
      setBackendStatus({
        loading: false,
        connected: false,
        message: 'Could not connect to Express Backend API server (http://localhost:5000)',
        dbStatus: 'Disconnected',
        timestamp: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <a href="#" className="logo">
          <Building2 size={28} color="#60a5fa" />
          <span>NextProperty</span>
        </a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Architecture</a>
          <a href="#status" className="nav-link">System Status</a>
          <button className="btn-primary" onClick={checkBackend}>
            <RefreshCw size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Ping API
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-layout">
        <section className="hero-section">
          <div className="glass-pill" style={{ display: 'inline-flex', padding: '0.4rem 1.2rem', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Sparkles size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>MERN Stack Architecture Initialized</span>
          </div>

          <h1 className="hero-title">
            Build the Future of <br />
            <span className="gradient-text">Real Estate Applications</span>
          </h1>

          <p className="hero-subtitle">
            NextProperty backend and React frontend are connected and ready. Plug in your MongoDB connection string to unlock full database capabilities.
          </p>
        </section>

        {/* System Health Dashboard */}
        <section id="status">
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={22} color="#818cf8" />
            Live Stack Connection Monitor
          </h2>

          <div className="status-grid">
            {/* Express Backend Card */}
            <div className="glass-panel status-card">
              <div className="card-header">
                <div className="card-title">
                  <Server size={20} color="#3b82f6" />
                  Express Backend
                </div>
                {backendStatus.loading ? (
                  <span className="badge badge-warning">Checking...</span>
                ) : backendStatus.connected ? (
                  <span className="badge badge-success">
                    <span className="pulse-dot"></span> Online (Port 5000)
                  </span>
                ) : (
                  <span className="badge badge-danger">Offline</span>
                )}
              </div>
              <div className="card-body">
                <p>{backendStatus.message}</p>
                <div className="code-snippet">GET /api/health</div>
              </div>
            </div>

            {/* React Frontend Card */}
            <div className="glass-panel status-card">
              <div className="card-header">
                <div className="card-title">
                  <Building2 size={20} color="#06b6d4" />
                  React Frontend
                </div>
                <span className="badge badge-success">
                  <span className="pulse-dot"></span> Running (Vite + JSX)
                </span>
              </div>
              <div className="card-body">
                <p>Modern React 18 single page web application initialized with Vite dev server and proxy support.</p>
                <div className="code-snippet">src/App.jsx</div>
              </div>
            </div>

            {/* MongoDB Card */}
            <div className="glass-panel status-card">
              <div className="card-header">
                <div className="card-title">
                  <Database size={20} color="#8b5cf6" />
                  MongoDB (Mongoose)
                </div>
                {backendStatus.dbStatus === 'Connected' ? (
                  <span className="badge badge-success">
                    <span className="pulse-dot"></span> Connected
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    Awaiting Cluster URI
                  </span>
                )}
              </div>
              <div className="card-body">
                <p>Mongoose database connector initialized. When ready, paste your MongoDB URI into <code>backend/.env</code>.</p>
                <div className="code-snippet">MONGO_URI in backend/.env</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        NextProperty MERN Boilerplate &bull; Powered by Express, React, and MongoDB
      </footer>
    </div>
  );
}
