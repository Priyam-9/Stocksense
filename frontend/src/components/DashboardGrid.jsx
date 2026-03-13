import GridLayout from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import MiniChart from "./MiniChart"

export default function DashboardGrid({ widgets, onRemove }) {
  if (widgets.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "60px",
        border: "2px dashed #334155", borderRadius: "16px",
        color: "#475569", marginTop: "24px"
      }}>
        <p style={{ fontSize: "2rem" }}>📌</p>
        <p style={{ fontSize: "1.1rem" }}>Your dashboard is empty</p>
        <p style={{ fontSize: "0.85rem" }}>Ask a question above and click "Pin to Dashboard"</p>
      </div>
    )
  }

  // Build layout — 2 charts per row, each 6 cols wide, 4 rows tall
  const layout = widgets.map((w, i) => ({
    i: String(i),
    x: (i % 2) * 6,
    y: Math.floor(i / 2) * 5,
    w: 6,
    h: 5,
    minW: 3,
    minH: 3
  }))

  return (
    <div style={{ marginTop: "24px" }}>
      <GridLayout
        layout={layout}
        cols={12}
        rowHeight={60}
        width={1100}
        draggableHandle=".drag-handle"
        isResizable={true}
        isDraggable={true}
      >
        {widgets.map((widget, i) => (
          <div
            key={String(i)}
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              border: "1px solid #334155",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* Drag Handle Bar */}
            <div
              className="drag-handle"
              style={{
                padding: "8px 12px",
                background: "#0f172a",
                cursor: "grab",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #334155"
              }}
            >
              <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: "bold" }}>
                ⠿ {widget.title}
              </span>
              <button
                onClick={() => onRemove(i)}
                style={{
                  background: "transparent", border: "none",
                  color: "#64748b", cursor: "pointer", fontSize: "1rem"
                }}
              >
                ✕
              </button>
            </div>

            {/* Chart inside */}
            <div style={{ flex: 1, padding: "8px" }}>
              <MiniChart result={widget} />
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  )
}