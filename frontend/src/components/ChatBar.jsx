import { useState } from "react"
import axios from "axios"

export default function ChatBar({ onResult, loading, setLoading }) {
  const [question, setQuestion] = useState("")

  const suggestions = [
    "Show closing price over time",
    "What is the highest volume day?",
    "Show monthly average closing price",
    "Compare open and close prices",
  ]

  const ask = async (q) => {
    const questionToAsk = q || question
    if (!questionToAsk.trim()) return
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/query`, { question: questionToAsk })
      onResult(res.data)
    } catch {
      alert("Something went wrong! Check your backend.")
    } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
        Ask a question
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
        <input
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder='e.g. "Show closing price over time"'
        />
        <button className="btn-primary" onClick={() => ask()} disabled={loading} style={{ whiteSpace: "nowrap", borderRadius: "var(--radius-md)" }}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {suggestions.map(s => (
          <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>
        ))}
      </div>
    </div>
  )
}