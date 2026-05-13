import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getDashboard } from '../api/dashboardService'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
  STATUS_LABELS, PRIORITY_LABELS,
  STATUS_COLORS, PRIORITY_COLORS, CHART_PALETTE,
} from '../constants/task'

function StatCard({ title, value, color = 'primary', icon }) {
  return (
    <div className="col-6 col-md-3">
      <div className="card h-100 border-0 shadow-sm" style={{ borderLeft: `4px solid var(--bs-${color})` }}>
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <div className="text-muted small mb-1">{title}</div>
              <div className={`fw-bold text-${color}`} style={{ fontSize: '2rem', lineHeight: 1 }}>{value}</div>
            </div>
            <div className={`text-${color} opacity-50`} style={{ fontSize: '2rem' }}>
              <i className={`bi ${icon}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompletionRate({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const color = pct >= 75 ? 'success' : pct >= 40 ? 'warning' : 'danger'

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold text-muted small text-uppercase">Tasa de completado</span>
          <span className={`fw-bold text-${color}`} style={{ fontSize: '1.1rem' }}>{pct}%</span>
        </div>
        <div className="progress" style={{ height: '10px', borderRadius: '999px' }}>
          <div
            className={`progress-bar bg-${color}`}
            style={{ width: `${pct}%`, borderRadius: '999px', transition: 'width 0.6s ease' }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="d-flex justify-content-between mt-1">
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{completed} completadas</span>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{total} totales</span>
        </div>
      </div>
    </div>
  )
}

function DonutChart({ title, data, labelMap, colorMap }) {
  const entries = Object.entries(data)
  if (entries.length === 0) return null

  const chartData = entries.map(([key, value]) => ({
    name: labelMap?.[key] ?? key,
    value,
    color: colorMap?.[key] ?? CHART_PALETTE[0],
  }))

  return (
    <div className="col-md-6">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-bottom fw-semibold text-muted small text-uppercase">
          {title}
        </div>
        <div className="card-body d-flex align-items-center justify-content-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}


function HorizontalBarChartCard({ title, data, labelMap, colorMap }) {
  const entries = Object.entries(data)
  if (entries.length === 0) return null

  const chartData = entries.map(([key, value], i) => ({
    name: labelMap?.[key] ?? key,
    value,
    fill: colorMap?.[key] ?? CHART_PALETTE[i % CHART_PALETTE.length],
  }))

  return (
    <div className="col-md-6">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-bottom fw-semibold text-muted small text-uppercase">
          {title}
        </div>
        <div className="card-body d-flex align-items-center">
          <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 56)}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="value" name="Tareas" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { getAuthHeader } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDashboard(getAuthHeader())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  )

  if (error) return <div className="alert alert-danger">{error}</div>

  const completed = data.byStatus?.COMPLETED ?? 0

  return (
    <div>
      <h2 className="fs-4 mb-4">Dashboard</h2>

      <div className="row g-3 mb-4">
        <StatCard title="Total de tareas" value={data.totalTasks} color="primary" icon="bi-list-task" />
        <StatCard title="Vencidas" value={data.overdue} color="danger" icon="bi-exclamation-circle" />
        <StatCard title="Creadas hoy" value={data.createdToday} color="secondary" icon="bi-calendar-plus" />
        <StatCard title="Completadas" value={completed} color="success" icon="bi-check-circle" />
      </div>

      <CompletionRate completed={completed} total={data.totalTasks} />

      <div className="row g-3 mb-3">
        <DonutChart
          title="Por estado"
          data={data.byStatus ?? {}}
          labelMap={STATUS_LABELS}
          colorMap={STATUS_COLORS}
        />
        <HorizontalBarChartCard
          title="Por prioridad"
          data={data.byPriority ?? {}}
          labelMap={PRIORITY_LABELS}
          colorMap={PRIORITY_COLORS}
        />
      </div>

    </div>
  )
}
