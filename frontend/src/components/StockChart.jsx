import {
  LineChart, BarChart, AreaChart,
  Line, Bar, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

export default function StockChart({ result }) {
  const { data, chart_type, x_axis, y_axis, title, sql } = result

  if (!data || data.length === 0) {
    return <p style={{ color: "#94a3b8" }}>No data returned.</p>
  }

  const commonProps = {
    data,
    margin: { top: 10, right: 20, bottom: 40, left: 20 }
  }

  const xAxis = <XAxis
    dataKey={x_axis}
    tick={{ fill: "#94a3b8", fontSize: 11 }}
    angle={-30}
    textAnchor="end"
  />
  const yAxis = <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
  const grid = <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
  const tooltip = <Tooltip
    contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
    labelStyle={{ color: "#10b981" }}
  />

  const renderChart = () => {
    if (chart_type === "bar") {
      return (
        <BarChart {...commonProps}>
          {grid}{xAxis}{yAxis}{tooltip}
          <Bar dataKey={y_axis} fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      )
    }
    if (chart_type === "area") {
      return (
        <AreaChart {...commonProps}>
          {grid}{xAxis}{yAxis}{tooltip}
          <Area type="monotone" dataKey={y_axis} stroke="#10b981" fill="#0d2d22" />
        </AreaChart>
      )
    }
    // Default: line
    return (
      <LineChart {...commonProps}>
        {grid}{xAxis}{yAxis}{tooltip}
        <Line type="monotone" dataKey={y_axis} stroke="#10b981" dot={false} strokeWidth={2} />
      </LineChart>
    )
  }

  return (
    <div style={{ background: "#1e293b", borderRadius: "12px", padding: "24px", marginTop: "24px" }}>

      {/* Chart Title */}
      <h3 style={{ color: "white", marginBottom: "4px" }}>{title}</h3>
      <p style={{ color: "#64748b", fontSize: "0.8rem", marginBottom: "20px" }}>
        {data.length} data points
      </p>

      {/* The Chart */}
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>

      {/* SQL Badge */}
      <details style={{ marginTop: "16px" }}>
        <summary style={{ color: "#64748b", fontSize: "0.8rem", cursor: "pointer" }}>
          🔍 View generated SQL
        </summary>
        <pre style={{
          background: "#0f172a", color: "#10b981",
          padding: "12px", borderRadius: "8px",
          fontSize: "0.8rem", marginTop: "8px",
          overflowX: "auto"
        }}>
          {sql}
        </pre>
      </details>

    </div>
  )
}