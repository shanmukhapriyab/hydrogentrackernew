import { Users, Factory, Truck, DollarSign, AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';
import { StatCard, Badge, Card, ProgressBar, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { PLANTS, SHIPMENTS, USERS, ALERTS, PRODUCTION_CHART, REVENUE_CHART } from '../data/mockData';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const SYSTEM_METRICS = [
  { label: 'API Uptime', value: '99.97%', ok: true },
  { label: 'Avg Response', value: '142ms', ok: true },
  { label: 'Active Sessions', value: '38', ok: true },
  { label: 'Error Rate', value: '0.04%', ok: true },
  { label: 'Storage Used', value: '68.2%', ok: true },
  { label: 'DB Connections', value: '124/500', ok: true },
];

const PIE_DATA = [
  { name: 'Green H₂', value: 68.4 },
  { name: 'Blue H₂', value: 21.2 },
  { name: 'Gray H₂', value: 10.4 },
];
const PIE_COLORS = ['#2563eb', '#10b981', '#94a3b8'];

export default function AdminDashboard({ onNavigate }: { onNavigate: (p: any) => void }) {
  const activeUsers = USERS.filter(u => u.status === 'active').length;
  const criticalAlerts = ALERTS.filter(a => a.type === 'critical' && !a.read).length;

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform-wide operations and system health overview"
        actions={
          <>
            <Button variant="secondary" size="sm"><Shield size={13} />Security Report</Button>
            <Button size="sm"><Activity size={13} />System Status</Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue (Sep)" value="$3.74M" change={4.6} changeLabel="vs Aug" icon={<DollarSign size={18} />} color="green" />
        <StatCard label="Active Users" value={activeUsers} unit={`/${USERS.length}`} icon={<Users size={18} />} color="blue" />
        <StatCard label="Plants Online" value={5} unit="/6" icon={<Factory size={18} />} color="amber" />
        <StatCard label="Critical Alerts" value={criticalAlerts} icon={<AlertTriangle size={18} />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2">
          <Card title="Revenue vs Cost" subtitle="Monthly comparison — last 6 months">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={REVENUE_CHART} margin={{ top: 4, right: 4, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} />
                <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`$${(v/1e6).toFixed(2)}M`]} />
                <Bar dataKey="cost" fill="#dbeafe" radius={[4,4,0,0]} name="Cost" />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4,4,0,0]} name="Revenue" />
                <Line type="monotone" dataKey="revenue" stroke="#1d4ed8" strokeWidth={0} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Product mix */}
        <div>
          <Card title="H₂ Product Mix" subtitle="By volume — current month">
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {PIE_DATA.map((entry, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {PIE_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-slate-600 flex-1">{d.name}</span>
                  <span className="font-semibold text-slate-800">{d.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent users */}
        <div className="lg:col-span-2">
          <Card title="User Activity" noPadding actions={
            <Button size="sm" onClick={() => onNavigate('user-management')}>Manage Users</Button>
          }>
            <Table headers={['User', 'Role', 'Last Active', 'Status', '']}>
              {USERS.map(user => (
                <Tr key={user.id}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{user.role}</span>
                  </Td>
                  <Td className="text-xs text-slate-500">{user.lastLogin}</Td>
                  <Td><Badge status={user.status as any} /></Td>
                  <Td>
                    <button className="text-xs text-blue-600 hover:underline">Edit</button>
                  </Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>

        <div className="space-y-4">
          {/* System health */}
          <Card title="System Health" subtitle="Live metrics">
            <div className="space-y-3">
              {SYSTEM_METRICS.map(m => (
                <div key={m.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{m.value}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${m.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card title="Active Alerts" noPadding>
            <div className="divide-y divide-slate-50">
              {ALERTS.filter(a => !a.read).map(alert => (
                <div key={alert.id} className="flex gap-3 px-4 py-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                    alert.type === 'critical' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <p className="text-xs font-medium text-slate-700">{alert.title}</p>
                    <p className="text-xs text-slate-400">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Platform stats footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Total Plants', value: '6' },
          { label: 'Storage Tanks', value: '6' },
          { label: 'Active Customers', value: '47' },
          { label: 'Drivers', value: '24' },
          { label: 'Vehicles', value: '18' },
          { label: 'Shipments (Sep)', value: '284' },
          { label: 'Orders (Sep)', value: '312' },
          { label: 'Avg Price/kg', value: '$8.42' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-lg font-bold text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
