import GridLayout from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import MiniChart from "./MiniChart"

export default function DashboardGrid({ widgets, onRemove }) {
  if (widgets.length === 0) return (
    <div style={{
      textAlign: "center", padding: "60px",
      border: "2px dashed var(--border-light)",
      borderRadius: "var(--radius-xl)",
      color: "var(--text-tertiary)"
    }}>
      <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>PIN</p>
      <p style={{ fontWeight: "500" }}>Your dashboard is empty</p>
      <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>Ask a question and click "Pin to Dashboard"</p>
    </div>
  )

  const layout = widgets.map((_, i) => ({ i: String(i), x: (i % 2) * 6, y: Math.floor(i / 2) * 5, w: 6, h: 5, minW: 3, minH: 3 }))

  return (
    <GridLayout layout={layout} cols={12} rowHeight={60} width={900} draggableHandle=".drag-handle" isResizable isDraggable>
      {widgets.map((widget, i) => (
        <div key={String(i)} style={{ background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div className="drag-handle" style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-light)", cursor: "grab", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)" }}>
              {widget.title}
            </span>
            <button onClick={() => onRemove(i)} style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}>✕</button>
          </div>
          <div style={{ flex: 1, padding: "8px" }}>
            <MiniChart result={widget} />
          </div>
        </div>
      ))}
    </GridLayout>
  )
}