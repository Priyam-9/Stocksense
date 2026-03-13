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
  const [activeTab, setActiveTab] = useState("query") // "query" or "dashboard"

  // Pin current chart to dashboard
  const pinToDashboard = () => {
    if (!result) return
    setWidgets(prev => [...prev, result])
    setActiveTab("dashboard")
  }

  // Remove a widget
  const removeWidget = (index) => {
    setWidgets(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "40px"
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#10b981" }}>📈 StockSense AI</h1>
        <p style={{ color: "#94a3b8" }}>
          Upload stock data · Ask in plain English · Build your dashboard
        </p>
      </div>

      {/* BEFORE UPLOAD */}
      {!uploadData ? (
        <UploadZone onUpload={setUploadData} />
      ) : (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Success Bar */}
          <div style={{
            background: "#0d2d22",
            border: "1px solid #10b981",
            borderRadius: "10px",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <span style={{ color: "#10b981" }}>
              ✅ <strong>{uploadData.total_rows} rows</strong> loaded ·
              Columns: {uploadData.columns.join(", ")}
            </span>
            <button
              onClick={() => {
                setUploadData(null)
                setResult(null)
                setWidgets([])
              }}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "none",
                cursor: "pointer"
              }}
            >
              Upload new file
            </button>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            borderBottom: "1px solid #334155",
            paddingBottom: "12px"
          }}>
            {["query", "dashboard"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  background: activeTab === tab ? "#10b981" : "#1e293b",
                  color: activeTab === tab ? "black" : "#94a3b8"
                }}
              >
                {tab === "query" ? "🤖 Ask AI" : `📊 Dashboard (${widgets.length})`}
              </button>
            ))}
          </div>

          {/* QUERY TAB */}
          {activeTab === "query" && (
            <div>
              <ChatBar
                columns={uploadData.columns}
                onResult={setResult}
                loading={loading}
                setLoading={setLoading}
              />

              {/* Loading State */}
              {loading && (
                <div style={{ textAlign: "center", padding: "40px", color: "#10b981" }}>
                  <p style={{ fontSize: "2rem" }}>🤖</p>
                  <p>AI is generating your chart...</p>
                </div>
              )}

              {/* Chart Result + Pin Button */}
              {result && !loading && (
                <div>
                  <StockChart result={result} />

                  {/* Pin to Dashboard Button */}
                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <button
                      onClick={pinToDashboard}
                      style={{
                        background: "#10b981",
                        color: "black",
                        border: "none",
                        padding: "12px 32px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: "pointer"
                      }}
                    >
                      📌 Pin to Dashboard
                    </button>
                    <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "8px" }}>
                      Ask more questions and pin multiple charts to build your dashboard
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <h2 style={{ color: "white" }}>
                  📊 My Dashboard
                  <span style={{ color: "#64748b", fontSize: "0.9rem", marginLeft: "8px" }}>
                    drag to move · resize from corners
                  </span>
                </h2>
                {widgets.length > 0 && (
                  <button
                    onClick={() => setWidgets([])}
                    style={{
                      background: "transparent",
                      color: "#f87171",
                      border: "1px solid #f87171",
                      padding: "6px 16px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <DashboardGrid widgets={widgets} onRemove={removeWidget} />

              {/* Go back to ask more */}
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <button
                  onClick={() => setActiveTab("query")}
                  style={{
                    background: "#1e293b",
                    color: "#10b981",
                    border: "1px solid #10b981",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  + Ask another question
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}