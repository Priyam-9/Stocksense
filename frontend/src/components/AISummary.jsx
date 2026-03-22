import { useState, useEffect } from "react"

export default function AISummary({ summary }) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  // Typewriter effect — makes it feel like AI is thinking
  useEffect(() => {
    if (!summary) return
    setDisplayed("")
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < summary.length) {
        setDisplayed(summary.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, 12) // speed of typing in ms
    return () => clearInterval(interval)
  }, [summary])

  if (!summary) return null

  return (
    <div
      className="fade-up"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        marginTop: "16px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Blue left accent bar */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: "4px",
        background: "var(--accent)",
        borderRadius: "4px 0 0 4px"
      }} />

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
        paddingLeft: "4px"
      }}>
        <div style={{
          width: "24px", height: "24px",
          background: "var(--accent-soft)",
          borderRadius: "6px",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem"
        }}>
          🤖
        </div>
        <span style={{
          fontSize: "0.78rem",
          fontWeight: "600",
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: "0.06em"
        }}>
          AI Insight
        </span>
        {!done && (
          <span style={{
            width: "6px", height: "6px",
            background: "var(--accent)",
            borderRadius: "50%",
            display: "inline-block",
            animation: "pulse 1s infinite"
          }} />
        )}
      </div>

      {/* Summary text */}
      <p style={{
        fontSize: "0.925rem",
        lineHeight: 1.7,
        color: "var(--text-primary)",
        paddingLeft: "4px",
        margin: 0
      }}>
        {displayed}
        {!done && (
          <span style={{
            display: "inline-block",
            width: "2px", height: "16px",
            background: "var(--accent)",
            marginLeft: "2px",
            verticalAlign: "middle",
            animation: "blink 0.7s infinite"
          }} />
        )}
      </p>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}