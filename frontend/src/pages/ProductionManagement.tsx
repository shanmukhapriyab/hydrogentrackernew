import { useState } from 'react';
import { Plus, Search, Filter, RefreshCw, Settings, ChevronDown } from 'lucide-react';
import { StatCard, Badge, Card, ProgressBar, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { PLANTS } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HOURLY = [
  { h: '00:00', output: 88 }, { h: '02:00', output: 91 }, { h: '04:00', output: 87 },
  { h: '06:00', output: 94 }, { h: '08:00', output: 98 }, { h: '10:00', output: 102 },
  { h: '12:00', output: 105 }, { h: '14:00', output: 108 }, { h: '16:00', output: 104 },
  { h: '18:00', output: 99 }, { h: '20:00', output: 95 }, { h: '22:00', output: 90 },
];

const PLANT_DETAILS = {
  'PLT-001': {
    stacks: 24, temperature: 68, pressure: 30.4, powerConsumption: 4.8, waterConsumption: 9.2, certifications: ['ISO 9001', 'ISO 14001'],
    nextMaintenance: '2026-10-15', lastInspection: '2026-08-20',
  },
};

export default function ProductionManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState(PLANTS[0]);

  const filtered = PLANTS.filter(p =>
    (statusFilter === 'all' || p.status === statusFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Production Management"
        subtitle="Monitor and control hydrogen production facilities"
        actions={
          <>
            <Button variant="secondary" size="sm"><RefreshCw size={13} />Refresh</Button>
            <Button size="sm"><Plus size={13} />Add Plant</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Plants" value={PLANTS.length} icon={<Settings size={18} />} color="blue" />
        <StatCard label="Active" value={PLANTS.filter(p => p.status === 'active').length} icon={<Settings size={18} />} color="green" />
        <StatCard label="In Maintenance" value={PLANTS.filter(p => p.status === 'maintenance').length} icon={<Settings size={18} />} color="amber" />
        <StatCard label="Total Daily Output" value="606.5" unit="t/day" change={2.8} changeLabel="vs avg" icon={<Settings size={18} />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plant list */}
        <div className="lg:col-span-1">
          <Card title="Facilities" noPadding actions={
            <div className="flex gap-1.5">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 w-28"
                />
              </div>
            </div>
          }>
            <div className="divide-y divide-slate-50">
              {filtered.map(plant => (
                <button
                  key={plant.id}
                  onClick={() => setSelectedPlant(plant)}
                  className={`w-full text-left px-4 py-3.5 transition-colors ${selectedPlant.id === plant.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-tight truncate">{plant.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{plant.location}</p>
                    </div>
                    <Badge status={plant.status as any} />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div>
                      <p className="text-xs text-slate-400">Output</p>
                      <p className="text-sm font-bold text-slate-800">{plant.output} <span className="text-xs font-normal text-slate-400">t/d</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Efficiency</p>
                      <p className="text-sm font-bold text-slate-800">{plant.efficiency}%</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-1">Utilization</p>
                      <ProgressBar value={plant.output} max={plant.capacity} size="sm" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Plant detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title={selectedPlant.name}
            subtitle={`${selectedPlant.id} · ${selectedPlant.type} Electrolyzer · ${selectedPlant.location}`}
            actions={
              <>
                <Badge status={selectedPlant.status as any} />
                <Button variant="secondary" size="sm">Edit</Button>
              </>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Capacity', value: `${selectedPlant.capacity} t/day` },
                { label: 'Current Output', value: `${selectedPlant.output} t/day` },
                { label: 'Efficiency', value: `${selectedPlant.efficiency}%` },
                { label: 'Uptime (30d)', value: `${selectedPlant.uptime}%` },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">{m.label}</p>
                  <p className="text-base font-bold text-slate-900">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Capacity Utilization</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.round((selectedPlant.output / selectedPlant.capacity) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 w-10">
                  {Math.round((selectedPlant.output / selectedPlant.capacity) * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Electrolyzer Type', value: selectedPlant.type },
                { label: 'Location', value: selectedPlant.location },
                { label: 'Power Consumption', value: '4.8 kWh/Nm³' },
                { label: 'Water Consumption', value: '9.2 L/kg H₂' },
                { label: 'Next Maintenance', value: '2026-10-15' },
                { label: 'Last Inspection', value: '2026-08-20' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Hourly Output Today" subtitle="tonnes/day equivalent">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={HOURLY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="h" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 115]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="output" stroke="#2563eb" strokeWidth={2} dot={false} name="Output (t/d)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Temperature', value: '68°C', status: 'normal', max: 100, current: 68 },
              { label: 'Pressure', value: '30.4 bar', status: 'normal', max: 40, current: 30 },
              { label: 'H₂ Purity', value: '99.97%', status: 'normal', max: 100, current: 99.97 },
            ].map(m => (
              <div key={m.label} className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">{m.label}</p>
                <p className="text-xl font-bold text-slate-900">{m.value}</p>
                <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((m.current / m.max) * 100)}%` }} />
                </div>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Normal</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
