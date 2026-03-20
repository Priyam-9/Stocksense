import { LineChart, BarChart, AreaChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function StockChart({ result }) {
  const { data, chart_type, x_axis, y_axis, title, sql } = result
  if (!data || data.length === 0) return <p style={{ color: "var(--text-tertiary)" }}>No data returned.</p>

  const props = { data, margin: { top: 5, right: 16, bottom: 40, left: 0 } }

  const xAxis = <XAxis dataKey={x_axis} tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} angle={-30} textAnchor="end" />
  const yAxis = <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} width={55} />
  const grid  = <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
  const tip   = <Tooltip contentStyle={{ background: "white", border: "1px solid var(--border-light)", borderRadius: "10px", boxShadow: "var(--shadow-md)", fontSize: "0.85rem" }} />

  const chart = () => {
    if (chart_type === "bar")  return <BarChart  {...props}>{grid}{xAxis}{yAxis}{tip}<Bar  dataKey={y_axis} fill="var(--accent)" radius={[6,6,0,0]} /></BarChart>
    if (chart_type === "area") return <AreaChart {...props}>{grid}{xAxis}{yAxis}{tip}<Area type="monotone" dataKey={y_axis} stroke="var(--accent)" fill="var(--accent-soft)" strokeWidth={2} /></AreaChart>
    return <LineChart {...props}>{grid}{xAxis}{yAxis}{tip}<Line type="monotone" dataKey={y_axis} stroke="var(--accent)" dot={false} strokeWidth={2.5} /></LineChart>
  }

  return (
    <div className="card fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "600", letterSpacing: "-0.01em", marginBottom: "2px" }}>{title}</h3>
          <p style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>{data.length} data points</p>
        </div>
        <span style={{
          background: "var(--accent-soft)", color: "var(--accent)",
          fontSize: "0.75rem", fontWeight: "600", padding: "4px 10px",
          borderRadius: "var(--radius-pill)"
        }}>
          {chart_type?.toUpperCase()}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>{chart()}</ResponsiveContainer>

      <hr className="divider" />

      <details>
        <summary style={{ color: "var(--text-tertiary)", fontSize: "0.8rem", cursor: "pointer", userSelect: "none" }}>
          View generated SQL
        </summary>
        <pre style={{
          background: "var(--bg-page)", color: "var(--text-secondary)",
          padding: "12px 16px", borderRadius: "var(--radius-md)",
          fontSize: "0.8rem", marginTop: "10px", overflowX: "auto",
          border: "1px solid var(--border-light)"
        }}>{sql}</pre>
      </details>
    </div>
  )
}