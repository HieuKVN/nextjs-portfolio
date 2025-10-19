'use client';

import Head from 'next/head';
import { useState } from 'react';

export default function WOL() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/wol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('❌ Connection error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Wake-on-LAN</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container">
        <header className="profile">
          <h1>Wake-on-LAN</h1>
          <p className="subtitle">Remotely wake up your computer</p>
        </header>

        <main className="section">
          <div className="content-card">
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                name="password"
                placeholder="Enter wake-up password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
                style={{
                  marginBottom: '15px',
                  fontSize: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
              />
              <center>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    background: loading ? 'var(--glass-border)' : 'var(--accent-primary)',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '140px'
                  }}
                >
                  {loading ? 'Waking up...' : 'Wake Computer'}
                </button>
              </center>
            </form>
            {message && (
              <div
                className="message"
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: '500',
                  background: message.includes('✅') ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
                  border: `1px solid ${message.includes('✅') ? '#48bb78' : '#f56565'}`,
                  color: message.includes('✅') ? '#22543d' : '#742a2a'
                }}
              >
                {message}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
