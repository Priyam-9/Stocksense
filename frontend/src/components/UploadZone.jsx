import { useState, useRef } from "react"
import axios from "axios"

export default function UploadZone({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.name.endsWith(".csv")) { setError("Please upload a .csv file only"); return }
    setLoading(true); setError(null)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload-csv`, formData)
      onUpload(res.data)
    } catch {
      setError("Upload failed. Is your backend running?")
    } finally { setLoading(false) }
  }

  return (
    <div
      onClick={() => !loading && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
      style={{
        background: isDragging ? "var(--accent-soft)" : "var(--bg-card)",
        border: `2px dashed ${isDragging ? "var(--accent)" : "var(--border-light)"}`,
        borderRadius: "var(--radius-xl)",
        padding: "56px 40px",
        textAlign: "center",
        cursor: "pointer",
        maxWidth: "560px",
        margin: "0 auto",
        transition: "all 0.2s ease"
      }}
    >
      <input ref={inputRef} type="file" accept=".csv" onChange={(e) => handleFile(e.target.files[0])} style={{ display: "none" }} />

      {loading ? (
        <>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
          <p style={{ fontWeight: "500", color: "var(--text-primary)" }}>Analyzing your data...</p>
          <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginTop: "4px" }}>This takes just a second</p>
        </>
      ) : (
        <>
          <div style={{
            width: "52px", height: "52px", background: "var(--accent-soft)",
            borderRadius: "14px", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 16px", fontSize: "1.5rem"
          }}>
            📂
          </div>
          <p style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
            Drop your stock CSV here
          </p>
          <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", marginBottom: "20px" }}>
            NSE · BSE · Yahoo Finance · Any stock CSV
          </p>
          <button className="btn-primary" onClick={(e) => { e.stopPropagation(); inputRef.current.click() }}>
            Choose file
          </button>
          {error && (
            <p style={{ color: "var(--danger)", marginTop: "16px", fontSize: "0.875rem" }}>{error}</p>
          )}
        </>
      )}
    </div>
  )
}