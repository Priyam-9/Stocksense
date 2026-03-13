import { useState, useRef } from "react"
import axios from "axios"

export default function UploadZone({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a .csv file only")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post("http://localhost:8001/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      onUpload(res.data)
    } catch (err) {
      console.error(err)
      setError("Upload failed. Is your backend running on port 8001?")
    } finally {
      setLoading(false)
    }
  }

  // Drag events
  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }


  const onInputChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
      style={{
        border: `2px dashed ${isDragging ? "#10b981" : "#334155"}`,
        borderRadius: "16px",
        padding: "60px 40px",
        textAlign: "center",
        background: isDragging ? "#0d2d22" : "#1e293b",
        transition: "all 0.2s ease",
        cursor: "pointer",
        maxWidth: "600px",
        margin: "0 auto",
        userSelect: "none"
      }}
    >
      {/* Hidden real file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={onInputChange}
        style={{ display: "none" }}
      />

      {loading ? (
        <div>
          <p style={{ fontSize: "2rem" }}>⏳</p>
          <p style={{ color: "#10b981" }}>Uploading & analyzing your data...</p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: "3rem", marginBottom: "12px" }}>📂</p>
          <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "8px", color: "white" }}>
            Drag & drop your stock CSV here
          </p>
          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            or click anywhere here to browse
          </p>
          <span style={{
            background: "#10b981",
            color: "black",
            padding: "10px 24px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}>
            Browse File
          </span>

          {error && (
            <p style={{ color: "#f87171", marginTop: "16px" }}>{error}</p>
          )}
        </div>
      )}
    </div>
  )
}