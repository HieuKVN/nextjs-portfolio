"use client";

import { useState } from "react";

export default function WOL() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/wol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("WOL request failed:", error);
      setMessage("❌ Connection error! Check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
                marginBottom: "15px",
                fontSize: "16px",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid var(--glass-border)",
                background: "var(--glass-bg)",
                color: "var(--text-primary)",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--accent-primary)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--glass-border)")
              }
            />
            <center>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  background: loading
                    ? "var(--glass-border)"
                    : "var(--accent-primary)",
                  color: "white",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "140px",
                }}
              >
                {loading ? "Waking up..." : "Wake Computer"}
              </button>
            </center>
          </form>
          {message && (
            <div
              className="content-card"
              style={{
                marginTop: "30px",
                padding: "20px",
                textAlign: "center",
                borderRadius: "16px",
                background: message.includes("✅")
                  ? "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))"
                  : "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))",
                border: `2px solid ${
                  message.includes("✅") ? "#22c55e" : "#ef4444"
                }`,
                color: message.includes("✅") ? "#15803d" : "#dc2626",
                boxShadow: message.includes("✅")
                  ? "0 8px 25px rgba(34, 197, 94, 0.15)"
                  : "0 8px 25px rgba(239, 68, 68, 0.15)",
                animation: "fadeInUp 0.5s ease-out",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: message.includes("✅")
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : "linear-gradient(90deg, #ef4444, #dc2626)",
                }}
              />

              {/* Icon */}
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>
                {message.includes("✅") ? "🎉" : "⚠️"}
              </div>

              {/* Message */}
              <div style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                lineHeight: "1.5",
                marginTop: "8px"
              }}>
                {message}
              </div>

              {/* Subtle glow effect */}
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background: message.includes("✅")
                    ? "radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)",
                  animation: "pulse 2s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
