import { useState } from "react"
import UploadZone from "./components/UploadZone"
import ChatBar from "./components/ChatBar"
import StockChart from "./components/StockChart"
import DashboardGrid from "./components/DashboardGrid"

export default function App() {
  const [uploadData, setUploadData] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [widgets, setWidgets] = useState([])
  const [activeTab, setActiveTab] = useState("query")

  const pinToDashboard = () => {
    if (!result) return
    setWidgets(prev => [...prev, result])
    setActiveTab("dashboard")
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>

      {/* Top Nav */}
      <nav style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-light)",
        padding: "0 40px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.1rem" }}>📈</span>
          <span style={{ fontWeight: "600", fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            StockSense
          </span>
          <span style={{
            background: "var(--accent-soft)", color: "var(--accent)",
            fontSize: "0.7rem", fontWeight: "600", padding: "2px 8px",
            borderRadius: "var(--radius-pill)", marginLeft: "4px"
          }}>
            AI
          </span>
        </div>
        {uploadData && (
          <button className="btn-ghost" onClick={() => { setUploadData(null); setResult(null); setWidgets([]) }}>
            Upload new file
          </button>
        )}
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>

        {!uploadData ? (

          /* Hero + Upload */
          <div style={{ textAlign: "center" }}>
            <div className="fade-up">
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: "700",
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1.1,
                marginBottom: "16px"
              }}>
                Understand your stocks<br />
                <span style={{ color: "var(--accent)" }}>in plain English</span>
              </h1>
              <p style={{
                color: "var(--text-secondary)",
                fontSize: "1.1rem",
                maxWidth: "480px",
                margin: "0 auto 40px",
                lineHeight: 1.6
              }}>
                Upload any NSE, BSE or Yahoo Finance CSV. Ask questions. Get instant charts — no Excel, no code.
              </p>
            </div>
            <UploadZone onUpload={setUploadData} />

            {/* Student badges */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "32px", flexWrap: "wrap" }}>
              {["Perfect for BBA/MBA assignments", "Works with NSE & BSE data", "No coding needed", "100% free"].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>

        ) : (

          <div className="fade-up">

            {/* File loaded bar */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "28px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="tag-success">✓ File loaded</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  {uploadData.total_rows.toLocaleString()} rows · {uploadData.columns.length} columns
                </span>
              </div>
              <div className="tab-bar">
                <button className={`tab ${activeTab === "query" ? "active" : ""}`} onClick={() => setActiveTab("query")}>
                  Ask AI
                </button>
                <button className={`tab ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
                  Dashboard {widgets.length > 0 && `(${widgets.length})`}
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
              <div className="stat-card">
                <div className="stat-label">Total Rows</div>
                <div className="stat-value">{uploadData.total_rows.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Columns</div>
                <div className="stat-value">{uploadData.columns.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">AI Status</div>
                <div className="stat-value" style={{ fontSize: "1rem", marginTop: "4px" }}>
                  <span className="tag-success">Ready</span>
                </div>
              </div>
            </div>

            {/* Query Tab */}
            {activeTab === "query" && (
              <div>
                <ChatBar
                  columns={uploadData.columns}
                  onResult={setResult}
                  loading={loading}
                  setLoading={setLoading}
                />

                {loading && (
                  <div className="card fade-up" style={{ textAlign: "center", padding: "48px" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🤖</div>
                    <p style={{ color: "var(--text-secondary)", fontWeight: "500" }}>
                      Generating your chart...
                    </p>
                  </div>
                )}

                {result && !loading && (
                  <div className="fade-up">
                    <StockChart result={result} />
                    <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
                      <button className="btn-primary" onClick={pinToDashboard}>
                        Pin to Dashboard
                      </button>
                      <button className="btn-secondary" onClick={() => setResult(null)}>
                        Ask another
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "600", letterSpacing: "-0.02em" }}>My Dashboard</h2>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "0.8rem", marginTop: "2px" }}>
                      Drag to rearrange · Resize from corners
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-secondary" onClick={() => setActiveTab("query")}>
                      + Add chart
                    </button>
                    {widgets.length > 0 && (
                      <button className="btn-ghost" onClick={() => setWidgets([])} style={{ color: "var(--danger)" }}>
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                <DashboardGrid widgets={widgets} onRemove={(i) => setWidgets(p => p.filter((_, idx) => idx !== i))} />
              </div>
            )}

          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center", padding: "32px",
        color: "var(--text-tertiary)", fontSize: "0.8rem",
        borderTop: "1px solid var(--border-light)"
      }}>
        StockSense AI — Built for students & finance freshers 🎓
      </footer>

    </div>
  )
}