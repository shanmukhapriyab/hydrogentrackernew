import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import {
  Factory,
  Database,
  Zap,
  TrendingUp
} from 'lucide-react';

import {
  StatCard,
  Badge,
  Card,
  ProgressBar,
  PageHeader,
  Button,
  Table,
  Tr,
  Td
} from '../components/ui';

import {
  PRODUCTION_CHART,
  REVENUE_CHART,
  ALERTS,
  STORAGE_TANKS
} from '../data/mockData';
import { api } from '../lib/api';
import { subscribeToResource } from '../lib/realtime';

type Production = {
  _id: string;
  plantId: string;
  batchId: string;
  quantityKg: number;
  purity: number;
  energySource: string;
  costPerKg: number;
  status: 'active' | 'completed' | 'pending';
};

export default function ProducerDashboard({
  onNavigate
}: {
  onNavigate: (p: any) => void;
}) {
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const data = await api<Production[]>('/production');
        setProductions(data);
      } catch (error) {
        console.error('Production fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductions();
    return subscribeToResource('production', fetchProductions);
  }, []);

  const totalOutputKg = productions.reduce(
    (sum, production) => sum + production.quantityKg,
    0
  );

  const totalOutput = totalOutputKg / 1000;

  const activePlants = productions.filter(
    production => production.status === 'active'
  ).length;

  const averagePurity =
    productions.length > 0
      ? productions.reduce(
          (sum, production) => sum + production.purity,
          0
        ) / productions.length
      : 0;

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Producer Dashboard"
        subtitle="September 23, 2026 — Real-time production overview"
        actions={
          <>
            <Button variant="secondary" size="sm">
              Export Report
            </Button>

            <Button size="sm">
              <Zap size={13} />
              Live Mode
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Production"
          value={totalOutput.toFixed(2)}
          unit="t"
          change={0}
          changeLabel="from database"
          icon={<Zap size={18} />}
          color="blue"
        />

        <StatCard
          label="Active Batches"
          value={activePlants}
          unit={`/ ${productions.length}`}
          change={0}
          changeLabel="current"
          icon={<Factory size={18} />}
          color="green"
        />

        <StatCard
          label="Avg Purity"
          value={averagePurity.toFixed(2)}
          unit="%"
          change={0}
          changeLabel="from database"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Production Output (tonnes/day)"
          subtitle="Production trend"
          actions={
            <Button variant="ghost" size="sm">
              View All
            </Button>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={PRODUCTION_CHART}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <defs>
                <linearGradient
                  id="grad1"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563eb"
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor="#2563eb"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 12
                }}
              />

              <Area
                type="monotone"
                dataKey="actual"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#grad1)"
                name="Actual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card
          title="Revenue & Cost"
          subtitle="Last 6 months"
          actions={
            <Button variant="ghost" size="sm">
              Details
            </Button>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={REVENUE_CHART}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="revenue"
                fill="#dbeafe"
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />

              <Bar
                dataKey="cost"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                name="Cost"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Production Batches"
            noPadding
            actions={
              <Button
                size="sm"
                onClick={() => onNavigate('production')}
              >
                Manage Production
              </Button>
            }
          >
            {loading ? (
              <div className="p-6 text-sm text-slate-500">
                Loading production data...
              </div>
            ) : productions.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">
                No production records found.
              </div>
            ) : (
              <Table
                headers={[
                  'Plant',
                  'Batch',
                  'Quantity',
                  'Purity',
                  'Energy Source',
                  'Status'
                ]}
              >
                {productions.map(production => (
                  <Tr
                    key={production._id}
                    onClick={() => onNavigate('production')}
                  >
                    <Td>
                      <div className="font-medium text-slate-800 text-xs">
                        {production.plantId}
                      </div>

                      <div className="text-xs text-slate-400">
                        {production._id}
                      </div>
                    </Td>

                    <Td className="text-xs text-slate-500">
                      {production.batchId}
                    </Td>

                    <Td>
                      <span className="font-semibold text-slate-800">
                        {production.quantityKg.toLocaleString()}
                      </span>

                      <span className="text-slate-400 text-xs ml-1">
                        kg
                      </span>
                    </Td>

                    <Td className="text-xs">
                      {production.purity}%
                    </Td>

                    <Td className="text-xs capitalize">
                      {production.energySource}
                    </Td>

                    <Td>
                      <Badge status={production.status as any} />
                    </Td>
                  </Tr>
                ))}
              </Table>
            )}
          </Card>
        </div>

        <div>
          <Card
            title="Recent Alerts"
            subtitle="Last 8 hours"
            noPadding
          >
            <div className="divide-y divide-slate-50">
              {ALERTS.slice(0, 5).map(alert => (
                <div
                  key={alert.id}
                  className={`flex gap-3 px-4 py-3 ${
                    alert.read ? 'opacity-60' : ''
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                      alert.type === 'critical'
                        ? 'bg-red-500'
                        : alert.type === 'warning'
                        ? 'bg-amber-400'
                        : alert.type === 'success'
                        ? 'bg-emerald-500'
                        : 'bg-blue-400'
                    }`}
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 leading-snug">
                      {alert.title}
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}

              <div className="px-4 py-3">
                <button
                  onClick={() => onNavigate('notifications')}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card
        title="Storage Overview"
        subtitle="Current tank levels"
        noPadding
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-0 divide-x divide-y divide-slate-100">
          {STORAGE_TANKS.map(tank => {
            const pct = Math.round(
              (tank.current / tank.capacity) * 100
            );

            return (
              <div
                key={tank.id}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onNavigate('storage')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium text-slate-700 leading-tight">
                      {tank.location}
                    </p>

                    <p className="text-xs text-slate-400">
                      {tank.id}
                    </p>
                  </div>

                  <Badge status={tank.status as any} />
                </div>

                <p className="text-xl font-bold text-slate-900">
                  {pct}%
                </p>

                <ProgressBar
                  value={tank.current}
                  max={tank.capacity}
                  size="sm"
                />

                <p className="text-xs text-slate-400 mt-1">
                  {tank.current.toLocaleString()} /{' '}
                  {tank.capacity.toLocaleString()} kg
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}