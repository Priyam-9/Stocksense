import { useState } from "react"
import axios from "axios"

export default function ChatBar({ columns, onResult, loading, setLoading }) {
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
      const res = await axios.post("http://localhost:8001/query", {
        question: questionToAsk
      })
      onResult(res.data)
    } catch (err) {
      console.error(err)
      alert("Something went wrong! Check your backend terminal.")
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") ask()
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto 0" }}>

      {/* Input Row */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKey}
          placeholder='Ask anything e.g. "Show closing price over time"'
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#1e293b",
            color: "white",
            fontSize: "1rem",
            outline: "none"
          }}
        />
        <button
          onClick={() => ask()}
          disabled={loading}
          style={{
            background: loading ? "#334155" : "#10b981",
            color: loading ? "#94a3b8" : "black",
            border: "none",
            padding: "14px 24px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Thinking..." : "Ask AI ✨"}
        </button>
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            style={{
              background: "transparent",
              border: "1px solid #334155",
              color: "#94a3b8",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >
            {s}
          </button>
        ))}
      </div>

    </div>
  )
}