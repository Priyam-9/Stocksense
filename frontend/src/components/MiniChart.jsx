import {
  LineChart, BarChart, AreaChart,
  Line, Bar, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

export default function MiniChart({ result }) {
  const { data, chart_type, x_axis, y_axis } = result

  if (!data || data.length === 0) {
    return <p style={{ color: "#94a3b8", padding: "12px" }}>No data</p>
  }

  const commonProps = {
    data,
    margin: { top: 5, right: 10, bottom: 20, left: 0 }
  }

  const xAxis = (
    <XAxis
      dataKey={x_axis}
      tick={{ fill: "#64748b", fontSize: 9 }}
      angle={-30}
      textAnchor="end"
    />
  )
  const yAxis = <YAxis tick={{ fill: "#64748b", fontSize: 9 }} width={40} />
  const grid = <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
  const tooltip = (
    <Tooltip
      contentStyle={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "8px",
        fontSize: "0.75rem"
      }}
    />
  )

  const renderChart = () => {
    if (chart_type === "bar") {
      return (
        <BarChart {...commonProps}>
          {grid}{xAxis}{yAxis}{tooltip}
          <Bar dataKey={y_axis} fill="#10b981" radius={[3, 3, 0, 0]} />
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
    return (
      <LineChart {...commonProps}>
        {grid}{xAxis}{yAxis}{tooltip}
        <Line
          type="monotone"
          dataKey={y_axis}
          stroke="#10b981"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  )
}