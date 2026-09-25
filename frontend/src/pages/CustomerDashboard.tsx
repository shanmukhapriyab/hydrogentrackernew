import { useEffect, useState } from 'react';
import { ShoppingCart, Package, Truck, Clock, TrendingUp, Star } from 'lucide-react';
import { StatCard, Badge, Card, ProgressBar, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { REVENUE_CHART } from '../data/mockData';
import { api } from '../lib/api';
import { subscribeToResource } from '../lib/realtime';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CONSUMPTION = [
  { month: 'Apr', ordered: 12400, delivered: 12100 },
  { month: 'May', ordered: 13800, delivered: 13500 },
  { month: 'Jun', ordered: 15200, delivered: 14900 },
  { month: 'Jul', ordered: 14600, delivered: 14300 },
  { month: 'Aug', ordered: 16200, delivered: 15800 },
  { month: 'Sep', ordered: 17500, delivered: 11200 },
];

export default function CustomerDashboard({ onNavigate }: { onNavigate: (p: any) => void }) {
  const [myShipments, setMyShipments] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = () => Promise.all([
      api<any[]>('/orders'),
      api<any[]>('/shipments'),
    ]).then(([orders, shipments]) => {
      setMyOrders(orders);
      setMyShipments(shipments.filter(item => item.customer === 'NorthEast Power' || item.status === 'transit').slice(0, 3));
    }).catch(console.error);
    load();
    const stopOrders = subscribeToResource('orders', load);
    const stopShipments = subscribeToResource('shipments', load);
    return () => { stopOrders(); stopShipments(); };
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Customer Dashboard"
        subtitle="NorthEast Power — Account Overview"
        actions={
          <>
            <Button variant="secondary" size="sm">Download Invoice</Button>
            <Button size="sm" onClick={() => onNavigate('place-order')}><ShoppingCart size={13} />Place Order</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Orders" value={myOrders.filter(order => !['delivered', 'cancelled'].includes(order.status)).length} icon={<ShoppingCart size={18} />} color="blue" />
        <StatCard label="In Transit" value={myShipments.filter(shipment => shipment.status === 'transit').length} icon={<Truck size={18} />} color="purple" />
        <StatCard label="Delivered (Sep)" value={8} icon={<Package size={18} />} color="green" />
        <StatCard label="Total Volume (YTD)" value="278.1" unit="t" change={12.4} changeLabel="vs 2025" icon={<TrendingUp size={18} />} color="amber" />
      </div>

      {/* Account summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Consumption Trend" subtitle="Monthly hydrogen volume (kg)">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={CONSUMPTION} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="gradC1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}t`} />
                <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="ordered" stroke="#cbd5e1" strokeWidth={1.5} fill="none" name="Ordered (kg)" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="delivered" stroke="#2563eb" strokeWidth={2} fill="url(#gradC1)" name="Delivered (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Recent Orders" noPadding actions={
            <Button size="sm" onClick={() => onNavigate('place-order')}>New Order</Button>
          }>
            <Table headers={['Order ID', 'Quantity', 'Delivery Date', 'Origin', 'Total', 'Status']}>
              {myOrders.map(order => (
                <Tr key={order.id}>
                  <Td><span className="font-mono text-xs font-semibold text-blue-600">{order.orderId || order.id}</span></Td>
                  <Td><span className="font-medium">{order.quantity.toLocaleString()}</span><span className="text-slate-400 text-xs ml-1">kg</span></Td>
                  <Td className="text-xs text-slate-600">{order.deliveryDate}</Td>
                  <Td className="text-xs text-slate-500">{order.origin}</Td>
                  <Td className="font-semibold text-slate-800">${order.total.toLocaleString()}</Td>
                  <Td><Badge status={order.status as any} /></Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Account info */}
          <Card title="Account Details">
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">NP</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">NorthEast Power</p>
                  <p className="text-xs text-slate-400">Utilities · Silver Tier</p>
                </div>
                <div className="ml-auto">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />)}
                  </div>
                </div>
              </div>
              {[
                { label: 'Account Manager', value: 'Jessica Park' },
                { label: 'Contract Type', value: 'Annual Fixed' },
                { label: 'Credit Limit', value: '$750,000' },
                { label: 'Current Balance', value: '$284,320' },
                { label: 'Payment Terms', value: 'Net 30' },
                { label: 'Member Since', value: 'March 2025' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Active shipments */}
          <Card title="Active Shipments" noPadding>
            <div className="divide-y divide-slate-50">
              {myShipments.map(s => (
                <div key={s.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-blue-600">{s.id.slice(-4)}</span>
                    <Badge status={s.status as any} />
                  </div>
                  <p className="text-xs text-slate-600 mb-1">{s.destination}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{s.progress}%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">ETA: {s.eta || 'TBD'}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
