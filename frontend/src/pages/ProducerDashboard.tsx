import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Factory, Database, Truck, Zap, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { StatCard, Badge, Card, ProgressBar, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { PLANTS, PRODUCTION_CHART, REVENUE_CHART, ALERTS, STORAGE_TANKS } from '../data/mockData';

export default function ProducerDashboard({ onNavigate }: { onNavigate: (p: any) => void }) {
  const totalCapacity = PLANTS.reduce((s, p) => s + p.capacity, 0);
  const totalOutput = PLANTS.reduce((s, p) => s + p.output, 0);
  const activePlants = PLANTS.filter(p => p.status === 'active').length;

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Producer Dashboard"
        subtitle="September 23, 2026 — Real-time production overview"
        actions={
          <>
            <Button variant="secondary" size="sm">Export Report</Button>
            <Button size="sm"><Zap size={13} />Live Mode</Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Output"
          value={totalOutput.toFixed(1)}
          unit="t/day"
          change={2.8}
          changeLabel="vs last week"
          icon={<Zap size={18} />}
          color="blue"
        />
        <StatCard
          label="Active Plants"
          value={activePlants}
          unit={`/ ${PLANTS.length}`}
          change={0}
          changeLabel="steady"
          icon={<Factory size={18} />}
          color="green"
        />
        <StatCard
          label="Avg Efficiency"
          value="82.6"
          unit="%"
          change={-1.2}
          changeLabel="vs target"
          icon={<TrendingUp size={18} />}
          color="amber"
        />
        <StatCard
          label="Storage Utilization"
          value="67.4"
          unit="%"
          change={3.1}
          changeLabel="vs yesterday"
          icon={<Database size={18} />}
          color="purple"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Production Output (tonnes/day)"
          subtitle="Last 6 months — target vs actual"
          actions={<Button variant="ghost" size="sm">View All</Button>}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={PRODUCTION_CHART} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Target" />
              <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} fill="url(#grad1)" name="Actual" />
              <Area type="monotone" dataKey="renewable" stroke="#10b981" strokeWidth={2} fill="url(#grad2)" name="Renewable" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card
          title="Revenue & Cost"
          subtitle="Last 6 months"
          actions={<Button variant="ghost" size="sm">Details</Button>}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_CHART} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`$${(v/1e6).toFixed(2)}M`]} />
              <Bar dataKey="revenue" fill="#dbeafe" radius={[4,4,0,0]} name="Revenue" />
              <Bar dataKey="cost" fill="#2563eb" radius={[4,4,0,0]} name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Plants table + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Production Plants" noPadding actions={
            <Button size="sm" onClick={() => onNavigate('production')}>Manage Plants</Button>
          }>
            <Table headers={['Plant', 'Location', 'Output', 'Capacity', 'Efficiency', 'Status']}>
              {PLANTS.map(plant => (
                <Tr key={plant.id} onClick={() => onNavigate('production')}>
                  <Td>
                    <div className="font-medium text-slate-800 text-xs">{plant.name}</div>
                    <div className="text-xs text-slate-400">{plant.id} · {plant.type}</div>
                  </Td>
                  <Td className="text-xs text-slate-500">{plant.location}</Td>
                  <Td>
                    <span className="font-semibold text-slate-800">{plant.output}</span>
                    <span className="text-slate-400 text-xs ml-1">t/d</span>
                  </Td>
                  <Td className="w-28">
                    <ProgressBar value={plant.output} max={plant.capacity} size="sm" showLabel />
                  </Td>
                  <Td className="text-xs">{plant.efficiency}%</Td>
                  <Td><Badge status={plant.status as any} /></Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>

        <div>
          <Card title="Recent Alerts" subtitle="Last 8 hours" noPadding>
            <div className="divide-y divide-slate-50">
              {ALERTS.slice(0, 5).map(alert => (
                <div key={alert.id} className={`flex gap-3 px-4 py-3 ${alert.read ? 'opacity-60' : ''}`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                    alert.type === 'critical' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-amber-400' :
                    alert.type === 'success' ? 'bg-emerald-500' : 'bg-blue-400'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 leading-snug">{alert.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{alert.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3">
                <button onClick={() => onNavigate('notifications')} className="text-xs text-blue-600 font-medium hover:underline">
                  View all notifications →
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Storage overview */}
      <Card title="Storage Overview" subtitle="Current tank levels" noPadding>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-0 divide-x divide-y divide-slate-100">
          {STORAGE_TANKS.map(tank => {
            const pct = Math.round((tank.current / tank.capacity) * 100);
            return (
              <div key={tank.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onNavigate('storage')}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium text-slate-700 leading-tight">{tank.location}</p>
                    <p className="text-xs text-slate-400">{tank.id}</p>
                  </div>
                  <Badge status={tank.status as any} />
                </div>
                <p className="text-xl font-bold text-slate-900">{pct}%</p>
                <ProgressBar value={tank.current} max={tank.capacity} size="sm" />
                <p className="text-xs text-slate-400 mt-1">{tank.current.toLocaleString()} / {tank.capacity.toLocaleString()} kg</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
