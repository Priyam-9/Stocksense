import { useState } from "react"
import UploadZone from "./components/UploadZone"
import ChatBar from "./components/ChatBar"
import StockChart from "./components/StockChart"

export default function App() {
  const [uploadData, setUploadData] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: "40px 20px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#10b981" }}>📈 StockSense AI</h1>
        <p style={{ color: "#94a3b8" }}>Upload stock data · Ask in plain English · Get instant charts</p>
      </div>

      {/* BEFORE UPLOAD → show upload zone */}
      {!uploadData ? (
        <UploadZone onUpload={setUploadData} />
      ) : (
        <div>

          {/* Green success bar at top */}
          <div style={{
            maxWidth: "800px", margin: "0 auto 32px",
            background: "#0d2d22", border: "1px solid #10b981",
            borderRadius: "10px", padding: "12px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ color: "#10b981" }}>
              ✅ <strong>{uploadData.total_rows} rows</strong> loaded · Columns: {uploadData.columns.join(", ")}
            </span>
            <button
              onClick={() => { setUploadData(null); setResult(null) }}
              style={{ background: "transparent", color: "#64748b", border: "none", cursor: "pointer" }}
            >
              Upload new file
            </button>
          </div>

          {/* AI Chat Input */}
          <ChatBar
            columns={uploadData.columns}
            onResult={setResult}
            loading={loading}
            setLoading={setLoading}
          />

          {/* Chart Result */}
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {loading && (
              <div style={{ textAlign: "center", padding: "40px", color: "#10b981" }}>
                <p style={{ fontSize: "2rem" }}>🤖</p>
                <p>AI is generating your chart...</p>
              </div>
            )}
            {result && !loading && <StockChart result={result} />}
          </div>

        </div>
      )}

    </div>
  )
}