import { useState } from "react"
import UploadZone from "./components/UploadZone"

export default function App() {
  const [uploadData, setUploadData] = useState(null)

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: "40px" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#10b981" }}>📈 StockSense AI</h1>
        <p style={{ color: "#94a3b8" }}>Upload your stock data and ask questions in plain English</p>
      </div>

      {/* Upload Section */}
      <UploadZone onUpload={setUploadData} />

      {/* Preview Section — shows after upload */}
      {uploadData && (
        <div style={{ marginTop: "40px", background: "#1e293b", borderRadius: "12px", padding: "24px" }}>
          
          <h2 style={{ color: "#10b981", marginBottom: "16px" }}>✅ File Loaded Successfully!</h2>
          
          <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
            <div style={{ background: "#0f172a", padding: "16px", borderRadius: "8px", flex: 1 }}>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>TOTAL ROWS</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>{uploadData.total_rows}</p>
            </div>
            <div style={{ background: "#0f172a", padding: "16px", borderRadius: "8px", flex: 1 }}>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>COLUMNS FOUND</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>{uploadData.columns.length}</p>
            </div>
          </div>

          {/* Column Tags */}
          <p style={{ color: "#94a3b8", marginBottom: "8px" }}>Columns detected:</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
            {uploadData.columns.map(col => (
              <span key={col} style={{
                background: "#10b981", color: "black",
                padding: "4px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "bold"
              }}>
                {col}
              </span>
            ))}
          </div>

          {/* Data Preview Table */}
          <p style={{ color: "#94a3b8", marginBottom: "8px" }}>First 5 rows:</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  {uploadData.columns.map(col => (
                    <th key={col} style={{
                      padding: "8px 12px", background: "#0f172a",
                      color: "#10b981", textAlign: "left", border: "1px solid #334155"
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uploadData.preview.map((row, i) => (
                  <tr key={i}>
                    {uploadData.columns.map(col => (
                      <td key={col} style={{
                        padding: "8px 12px", border: "1px solid #334155", color: "#cbd5e1"
                      }}>
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  )
}