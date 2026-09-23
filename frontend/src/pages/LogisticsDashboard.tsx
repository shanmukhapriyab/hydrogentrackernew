import { Truck, Package, Clock, AlertTriangle, MapPin, Navigation } from 'lucide-react';
import { StatCard, Badge, Card, ProgressBar, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { SHIPMENTS } from '../data/mockData';

// Simple SVG map of USA with shipment dots
function LogisticsMap({ onShipmentClick }: { onShipmentClick: (id: string) => void }) {
  // US map approximate paths for major states
  const shipmentPoints = [
    { id: 'SHP-2026-0841', cx: 220, cy: 300, status: 'transit', label: 'Austin TX' },
    { id: 'SHP-2026-0842', cx: 55, cy: 290, status: 'delivered', label: 'San Diego CA' },
    { id: 'SHP-2026-0843', cx: 600, cy: 130, status: 'transit', label: 'Boston MA' },
    { id: 'SHP-2026-0844', cx: 215, cy: 310, status: 'delayed', label: 'San Antonio TX' },
    { id: 'SHP-2026-0845', cx: 90, cy: 270, status: 'pending', label: 'Phoenix AZ' },
    { id: 'SHP-2026-0846', cx: 440, cy: 155, status: 'pending', label: 'Chicago IL' },
    { id: 'SHP-2026-0847', cx: 310, cy: 318, status: 'transit', label: 'New Orleans LA' },
    { id: 'SHP-2026-0848', cx: 110, cy: 250, status: 'delivered', label: 'Las Vegas NV' },
  ];

  const COLOR = {
    transit: '#2563eb',
    delivered: '#16a34a',
    delayed: '#dc2626',
    pending: '#d97706',
  };

  return (
    <div className="relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200" style={{ height: 380 }}>
      <svg viewBox="0 0 700 420" className="w-full h-full" style={{ background: 'linear-gradient(to bottom, #f0f9ff, #f8fafc)' }}>
        {/* Simple USA outline approximation */}
        <path
          d="M 80 100 L 580 100 L 620 130 L 640 180 L 610 230 L 620 280 L 580 330 L 500 350 L 420 360 L 350 370 L 260 365 L 180 355 L 120 340 L 80 300 L 60 240 L 70 170 Z"
          fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" fillOpacity="0.6"
        />
        {/* Gulf coast indentation */}
        <path d="M 260 365 L 290 380 L 320 375 L 350 370" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* Routes */}
        {shipmentPoints.filter(s => s.status === 'transit' || s.status === 'delayed').map(s => (
          <line key={s.id + '-route'}
            x1={s.cx} y1={s.cy}
            x2={s.status === 'transit' ? s.cx - 30 : s.cx + 20} y2={s.status === 'transit' ? s.cy - 40 : s.cy - 50}
            stroke={COLOR[s.status as keyof typeof COLOR]}
            strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"
          />
        ))}

        {/* Shipment dots */}
        {shipmentPoints.map(s => (
          <g key={s.id} onClick={() => onShipmentClick(s.id)} className="cursor-pointer">
            <circle cx={s.cx} cy={s.cy} r={14} fill={COLOR[s.status as keyof typeof COLOR]} fillOpacity={0.12} />
            <circle cx={s.cx} cy={s.cy} r={7} fill={COLOR[s.status as keyof typeof COLOR]} />
            <circle cx={s.cx} cy={s.cy} r={4} fill="white" />
            <text x={s.cx} y={s.cy + 22} textAnchor="middle" fontSize="9" fill="#475569" fontFamily="Inter,sans-serif" fontWeight="500">
              {s.label}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(520, 20)">
          {[
            { color: '#2563eb', label: 'In Transit' },
            { color: '#16a34a', label: 'Delivered' },
            { color: '#dc2626', label: 'Delayed' },
            { color: '#d97706', label: 'Pending' },
          ].map((item, i) => (
            <g key={item.label} transform={`translate(0, ${i * 20})`}>
              <circle cx={6} cy={6} r={5} fill={item.color} />
              <text x={16} y={10} fontSize="10" fill="#64748b" fontFamily="Inter,sans-serif">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>

      {/* Overlay badge */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2">
        <p className="text-xs font-semibold text-slate-700">Live Shipment Map</p>
        <p className="text-xs text-slate-400">{SHIPMENTS.filter(s => s.status === 'transit').length} vehicles in transit</p>
      </div>
    </div>
  );
}

export default function LogisticsDashboard({ onNavigate }: { onNavigate: (p: any) => void }) {
  const inTransit = SHIPMENTS.filter(s => s.status === 'transit').length;
  const delayed = SHIPMENTS.filter(s => s.status === 'delayed').length;
  const delivered = SHIPMENTS.filter(s => s.status === 'delivered').length;
  const pending = SHIPMENTS.filter(s => s.status === 'pending').length;
  const totalKg = SHIPMENTS.reduce((s, sh) => s + sh.quantity, 0);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Logistics Dashboard"
        subtitle="Real-time shipment tracking and fleet management"
        actions={
          <>
            <Button variant="secondary" size="sm">Filter</Button>
            <Button size="sm" onClick={() => onNavigate('delivery')}><Package size={13} />Schedule Delivery</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="In Transit" value={inTransit} icon={<Truck size={18} />} color="blue" />
        <StatCard label="Delayed" value={delayed} icon={<AlertTriangle size={18} />} color="red" />
        <StatCard label="Delivered Today" value={delivered} icon={<Package size={18} />} color="green" />
        <StatCard label="Pending" value={pending} icon={<Clock size={18} />} color="amber" />
        <StatCard label="Total Volume" value={(totalKg / 1000).toFixed(1)} unit="t" icon={<MapPin size={18} />} color="purple" />
      </div>

      {/* Map */}
      <LogisticsMap onShipmentClick={() => onNavigate('shipment-details')} />

      {/* Shipments table */}
      <Card title="Active Shipments" noPadding actions={
        <Button size="sm" onClick={() => onNavigate('shipment-details')}>View All</Button>
      }>
        <Table headers={['Shipment ID', 'Route', 'Customer', 'Driver', 'Quantity', 'Progress', 'ETA', 'Status', '']}>
          {SHIPMENTS.map(s => (
            <Tr key={s.id} onClick={() => onNavigate('shipment-details')}>
              <Td>
                <span className="font-mono text-xs font-semibold text-blue-600">{s.id}</span>
              </Td>
              <Td>
                <div className="text-xs">
                  <p className="font-medium text-slate-700">{s.origin}</p>
                  <p className="text-slate-400 flex items-center gap-1"><Navigation size={9} className="rotate-45" />{s.destination}</p>
                </div>
              </Td>
              <Td className="text-xs text-slate-600">{s.customer}</Td>
              <Td className="text-xs text-slate-600">{s.driver === 'Pending' ? <span className="text-amber-500">Unassigned</span> : s.driver}</Td>
              <Td>
                <span className="font-medium text-slate-800">{s.quantity.toLocaleString()}</span>
                <span className="text-slate-400 text-xs ml-1">kg</span>
              </Td>
              <Td className="min-w-28">
                {s.progress > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.status === 'delayed' ? 'bg-red-400' : 'bg-blue-500'}`} style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-7">{s.progress}%</span>
                  </div>
                ) : <span className="text-xs text-slate-400">—</span>}
              </Td>
              <Td className="text-xs text-slate-500 whitespace-nowrap">{s.eta || '—'}</Td>
              <Td><Badge status={s.status as any} /></Td>
              <Td>
                <button className="text-xs text-blue-600 font-medium hover:underline whitespace-nowrap" onClick={() => onNavigate('shipment-details')}>
                  View →
                </button>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
