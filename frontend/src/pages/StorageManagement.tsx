import { useEffect, useState } from 'react';

import { Database, Plus, AlertTriangle, Gauge } from 'lucide-react';

import {
  StatCard,
  Badge,
  Card,
  ProgressBar,
  PageHeader,
  Button,
} from '../components/ui';

type Storage = {
  _id: string;
  facilityName: string;
  tankId: string;
  capacityKg: number;
  currentLevelKg: number;
  pressureBar: number;
  temperatureC: number;
  safetyThresholdPct: number;
  status: 'normal' | 'warning' | 'critical';
  fillPercent: number;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
};

export default function StorageManagement() {
  const [storages, setStorages] = useState<Storage[]>([]);
  const [selected, setSelected] = useState<Storage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/storage')
      .then(response => response.json())
      .then(data => {
        setStorages(data);

        if (data.length > 0) {
          setSelected(data[0]);
        }
      })
      .catch(error => {
        console.error('Failed to fetch storage data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalCap = storages.reduce(
    (sum, tank) => sum + tank.capacityKg,
    0
  );

  const totalCur = storages.reduce(
    (sum, tank) => sum + tank.currentLevelKg,
    0
  );

  const criticalTanks = storages.filter(
    tank => tank.status === 'critical'
  ).length;

  const avgFill =
    totalCap > 0
      ? Math.round((totalCur / totalCap) * 100)
      : 0;

  if (loading) {
    return (
      <div className="p-6 max-w-screen-xl fade-in">
        <PageHeader
          title="Storage Management"
          subtitle="Monitor and manage hydrogen storage facilities"
        />

        <div className="flex items-center justify-center py-20 text-sm text-slate-500">
          Loading storage data...
        </div>
      </div>
    );
  }

  if (storages.length === 0) {
    return (
      <div className="p-6 max-w-screen-xl fade-in">
        <PageHeader
          title="Storage Management"
          subtitle="Monitor and manage hydrogen storage facilities"
          actions={
            <Button size="sm">
              <Plus size={13} />
              Add Tank
            </Button>
          }
        />

        <Card title="No Storage Tanks">
          <div className="py-10 text-center text-sm text-slate-500">
            No storage data is available in the database.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">

      <PageHeader
        title="Storage Management"
        subtitle="Monitor and manage hydrogen storage facilities"
        actions={
          <>
            <Button variant="secondary" size="sm">
              Export
            </Button>

            <Button size="sm">
              <Plus size={13} />
              Add Tank
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          label="Total Capacity"
          value={(totalCap / 1000).toFixed(1)}
          unit="t"
          icon={<Database size={18} />}
          color="blue"
        />

        <StatCard
          label="Current Inventory"
          value={(totalCur / 1000).toFixed(1)}
          unit="t"
          icon={<Database size={18} />}
          color="green"
        />

        <StatCard
          label="Avg Fill Level"
          value={avgFill}
          unit="%"
          icon={<Gauge size={18} />}
          color="purple"
        />

        <StatCard
          label="Critical Tanks"
          value={criticalTanks}
          icon={<AlertTriangle size={18} />}
          color="red"
        />

      </div>

      {/* Tank grid */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {storages.map(tank => {

          const pct = tank.fillPercent;

          const isSelected =
            selected?._id === tank._id;

          const barColor =
            pct < 20
              ? 'bg-red-500'
              : pct < 50
              ? 'bg-amber-400'
              : 'bg-emerald-500';

          return (
            <button
              key={tank._id}
              onClick={() => setSelected(tank)}
              className={`text-left bg-white rounded-xl border p-5 transition-all hover:shadow-sm ${
                isSelected
                  ? 'border-blue-400 shadow-sm ring-1 ring-blue-200'
                  : 'border-slate-200'
              }`}
            >

              <div className="flex items-start justify-between mb-4">

                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {tank.facilityName}
                  </p>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {tank.tankId}
                  </p>
                </div>

                <Badge status={tank.status as any} />

              </div>

              {/* Gauge */}

              <div className="relative mb-4">

                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>0%</span>

                  <span className="font-bold text-lg text-slate-900">
                    {pct}%
                  </span>

                  <span>100%</span>
                </div>

                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className={`h-full ${barColor} rounded-full transition-all`}
                    style={{
                      width: `${pct}%`
                    }}
                  />

                </div>

              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Current
                  </span>

                  <span className="font-medium text-slate-700">
                    {tank.currentLevelKg.toLocaleString()} kg
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Capacity
                  </span>

                  <span className="font-medium text-slate-700">
                    {tank.capacityKg.toLocaleString()} kg
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Pressure
                  </span>

                  <span className="font-medium text-slate-700">
                    {tank.pressureBar} bar
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Temperature
                  </span>

                  <span className="font-medium text-slate-700">
                    {tank.temperatureC}°C
                  </span>
                </div>

              </div>

              {tank.status === 'critical' && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <AlertTriangle size={12} />
                  Low level — immediate refill required
                </div>
              )}

              {tank.status === 'warning' && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  <AlertTriangle size={12} />
                  Storage level requires attention
                </div>
              )}

            </button>
          );
        })}

      </div>

      {/* Selected tank detail */}

      {selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">

            <Card
              title={`Tank Details — ${selected.facilityName}`}
              subtitle={selected.tankId}
            >

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">

                {[
                  {
                    label: 'Facility',
                    value: selected.facilityName
                  },
                  {
                    label: 'Tank ID',
                    value: selected.tankId
                  },
                  {
                    label: 'Total Capacity',
                    value: `${selected.capacityKg.toLocaleString()} kg`
                  },
                  {
                    label: 'Current Level',
                    value: `${selected.currentLevelKg.toLocaleString()} kg`
                  },
                  {
                    label: 'Fill %',
                    value: `${selected.fillPercent}%`
                  },
                  {
                    label: 'Operating Pressure',
                    value: `${selected.pressureBar} bar`
                  },
                  {
                    label: 'Temperature',
                    value: `${selected.temperatureC}°C`
                  },
                  {
                    label: 'Safety Threshold',
                    value: `${selected.safetyThresholdPct}%`
                  },
                  {
                    label: 'Status',
                    value: (
                      <Badge
                        status={selected.status as any}
                      />
                    )
                  }
                ].map(item => (

                  <div
                    key={item.label}
                    className="bg-slate-50 rounded-lg p-3"
                  >
                    <p className="text-xs text-slate-400 mb-1">
                      {item.label}
                    </p>

                    <div className="text-sm font-semibold text-slate-800">
                      {item.value}
                    </div>
                  </div>

                ))}

              </div>

              <div className="flex gap-3">

                <Button size="sm">
                  Schedule Refill
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                >
                  View History
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                >
                  Download Report
                </Button>

                {selected.status === 'critical' && (
                  <Button
                    variant="danger"
                    size="sm"
                  >
                    <AlertTriangle size={13} />
                    Emergency Alert
                  </Button>
                )}

              </div>

            </Card>

          </div>

          <div>

            <Card
              title="Storage Summary"
              subtitle="All locations"
            >

              <div className="space-y-3">

                {storages.map(tank => {

                  const pct = tank.fillPercent;

                  return (
                    <button
                      key={tank._id}
                      onClick={() => setSelected(tank)}
                      className="w-full text-left"
                    >

                      <div className="flex items-center justify-between mb-1">

                        <span className="text-xs font-medium text-slate-600 truncate">
                          {tank.facilityName}
                        </span>

                        <span className="text-xs font-bold text-slate-800 ml-2">
                          {pct}%
                        </span>

                      </div>

                      <ProgressBar
                        value={tank.currentLevelKg}
                        max={tank.capacityKg}
                        size="sm"
                      />

                    </button>
                  );
                })}

              </div>

            </Card>

          </div>

        </div>
      )}

    </div>
  );
}