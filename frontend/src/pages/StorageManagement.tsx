import { useState } from 'react';
import { Database, Plus, AlertTriangle, Thermometer, Gauge } from 'lucide-react';
import { StatCard, Badge, Card, ProgressBar, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { STORAGE_TANKS } from '../data/mockData';

export default function StorageManagement() {
  const [selected, setSelected] = useState(STORAGE_TANKS[0]);
  const totalCap = STORAGE_TANKS.reduce((s, t) => s + t.capacity, 0);
  const totalCur = STORAGE_TANKS.reduce((s, t) => s + t.current, 0);
  const criticalTanks = STORAGE_TANKS.filter(t => t.status === 'critical').length;

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Storage Management"
        subtitle="Monitor and manage hydrogen storage facilities"
        actions={
          <>
            <Button variant="secondary" size="sm">Export</Button>
            <Button size="sm"><Plus size={13} />Add Tank</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Capacity" value={(totalCap / 1000).toFixed(1)} unit="t" icon={<Database size={18} />} color="blue" />
        <StatCard label="Current Inventory" value={(totalCur / 1000).toFixed(1)} unit="t" change={3.1} changeLabel="vs yesterday" icon={<Database size={18} />} color="green" />
        <StatCard label="Avg Fill Level" value={Math.round((totalCur / totalCap) * 100)} unit="%" icon={<Gauge size={18} />} color="purple" />
        <StatCard label="Critical Tanks" value={criticalTanks} icon={<AlertTriangle size={18} />} color="red" />
      </div>

      {/* Tank grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STORAGE_TANKS.map(tank => {
          const pct = Math.round((tank.current / tank.capacity) * 100);
          const isSelected = selected.id === tank.id;
          const barColor = pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-amber-400' : 'bg-emerald-500';

          return (
            <button
              key={tank.id}
              onClick={() => setSelected(tank)}
              className={`text-left bg-white rounded-xl border p-5 transition-all hover:shadow-sm ${isSelected ? 'border-blue-400 shadow-sm ring-1 ring-blue-200' : 'border-slate-200'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{tank.location}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{tank.id} · {tank.type}</p>
                </div>
                <Badge status={tank.status as any} />
              </div>

              {/* Gauge visualization */}
              <div className="relative mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>0%</span>
                  <span className="font-bold text-lg text-slate-900">{pct}%</span>
                  <span>100%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current</span>
                  <span className="font-medium text-slate-700">{tank.current.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity</span>
                  <span className="font-medium text-slate-700">{tank.capacity.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pressure</span>
                  <span className="font-medium text-slate-700">{tank.pressure} bar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Temperature</span>
                  <span className="font-medium text-slate-700">{tank.temp}°C</span>
                </div>
              </div>

              {tank.status === 'critical' && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <AlertTriangle size={12} />
                  Low level — immediate refill required
                </div>
              )}
              {tank.status === 'offline' && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                  Tank offline — maintenance mode
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected tank detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title={`Tank Details — ${selected.location}`} subtitle={selected.id}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Tank Type', value: selected.type },
                { label: 'Total Capacity', value: `${selected.capacity.toLocaleString()} kg` },
                { label: 'Current Level', value: `${selected.current.toLocaleString()} kg` },
                { label: 'Fill %', value: `${Math.round((selected.current / selected.capacity) * 100)}%` },
                { label: 'Operating Pressure', value: `${selected.pressure} bar` },
                { label: 'Temperature', value: `${selected.temp}°C` },
                { label: 'Last Filled', value: selected.lastFilled },
                { label: 'Status', value: <Badge status={selected.status as any} /> },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <div className="text-sm font-semibold text-slate-800">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button size="sm">Schedule Refill</Button>
              <Button variant="secondary" size="sm">View History</Button>
              <Button variant="secondary" size="sm">Download Report</Button>
              {selected.status === 'critical' && (
                <Button variant="danger" size="sm"><AlertTriangle size={13} />Emergency Alert</Button>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Storage Summary" subtitle="All locations">
            <div className="space-y-3">
              {STORAGE_TANKS.map(tank => {
                const pct = Math.round((tank.current / tank.capacity) * 100);
                return (
                  <button
                    key={tank.id}
                    onClick={() => setSelected(tank)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600 truncate">{tank.location}</span>
                      <span className="text-xs font-bold text-slate-800 ml-2">{pct}%</span>
                    </div>
                    <ProgressBar value={tank.current} max={tank.capacity} size="sm" />
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
