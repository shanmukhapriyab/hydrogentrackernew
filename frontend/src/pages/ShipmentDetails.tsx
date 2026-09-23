import { useState } from 'react';
import { MapPin, Truck, Clock, User, Package, Navigation, Phone, CheckCircle, Circle } from 'lucide-react';
import { Badge, Card, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { SHIPMENTS } from '../data/mockData';

const TIMELINE = [
  { label: 'Order Confirmed', time: '09/23 07:30', done: true },
  { label: 'Dispatch Authorized', time: '09/23 07:58', done: true },
  { label: 'Vehicle Loaded', time: '09/23 08:10', done: true },
  { label: 'Departed Origin', time: '09/23 08:15', done: true },
  { label: 'In Transit (68%)', time: 'In progress', done: false, active: true },
  { label: 'Arrived Destination', time: 'ETA 16:30', done: false },
  { label: 'Delivery Confirmed', time: 'Pending', done: false },
];

export default function ShipmentDetails() {
  const [selectedId, setSelectedId] = useState('SHP-2026-0841');
  const shipment = SHIPMENTS.find(s => s.id === selectedId) ?? SHIPMENTS[0];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Shipment Tracking"
        subtitle="Real-time shipment status and route information"
        actions={
          <>
            <Button variant="secondary" size="sm">Download POD</Button>
            <Button size="sm">Contact Driver</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Shipment list */}
        <div className="lg:col-span-1">
          <Card title="Shipments" noPadding>
            <div className="divide-y divide-slate-50">
              {SHIPMENTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full text-left px-4 py-3 transition-colors ${selectedId === s.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-blue-600">{s.id.slice(-4)}</span>
                    <Badge status={s.status as any} />
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate">{s.destination}</p>
                  <p className="text-xs text-slate-400">{s.quantity.toLocaleString()} kg · {s.eta || 'Pending'}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header card */}
          <Card>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-slate-900">{shipment.id}</span>
                  <Badge status={shipment.status as any} />
                  {shipment.priority === 'high' && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">High Priority</span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{shipment.customer}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Edit</Button>
                <Button variant="secondary" size="sm">Flag Issue</Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Origin', value: shipment.origin, icon: <MapPin size={13} className="text-slate-400" /> },
                { label: 'Destination', value: shipment.destination, icon: <Navigation size={13} className="text-blue-400" /> },
                { label: 'Quantity', value: `${shipment.quantity.toLocaleString()} kg`, icon: <Package size={13} className="text-slate-400" /> },
                { label: 'ETA', value: shipment.eta || 'TBD', icon: <Clock size={13} className="text-slate-400" /> },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.icon}
                    <span className="text-xs text-slate-400">{item.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Route map */}
            <Card title="Route Overview" noPadding>
              <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl overflow-hidden" style={{ height: 220 }}>
                <svg viewBox="0 0 400 220" className="w-full h-full">
                  {/* Road */}
                  <path d="M 60 160 Q 180 80 340 60" stroke="#cbd5e1" strokeWidth="3" fill="none" strokeDasharray="6 3" />
                  <path d="M 60 160 Q 180 80 340 60" stroke="#2563eb" strokeWidth="2" fill="none" strokeDasharray="6 3" opacity="0.5" />

                  {/* Origin */}
                  <circle cx={60} cy={160} r={10} fill="#16a34a" />
                  <circle cx={60} cy={160} r={5} fill="white" />
                  <text x={60} y={180} textAnchor="middle" fontSize="9" fill="#374151" fontFamily="Inter" fontWeight="600">Origin</text>
                  <text x={60} y={192} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="Inter">{shipment.origin.split(',')[0]}</text>

                  {/* Destination */}
                  <circle cx={340} cy={60} r={10} fill="#2563eb" />
                  <circle cx={340} cy={60} r={5} fill="white" />
                  <text x={340} y={80} textAnchor="middle" fontSize="9" fill="#374151" fontFamily="Inter" fontWeight="600">Destination</text>
                  <text x={340} y={92} textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="Inter">{shipment.destination.split(' ').slice(0,2).join(' ')}</text>

                  {/* Truck position */}
                  {shipment.progress > 0 && shipment.progress < 100 && (
                    <g>
                      <circle cx={180} cy={105} r={14} fill="#2563eb" fillOpacity="0.1" />
                      <circle cx={180} cy={105} r={8} fill="#2563eb" />
                      <text x={180} y={109} textAnchor="middle" fontSize="9" fill="white" fontFamily="Inter" fontWeight="bold">🚛</text>
                    </g>
                  )}

                  {/* Progress label */}
                  <text x={200} y={30} textAnchor="middle" fontSize="11" fill="#2563eb" fontFamily="Inter" fontWeight="700">{shipment.progress}% Complete</text>
                </svg>
              </div>
            </Card>

            {/* Timeline */}
            <Card title="Delivery Timeline">
              <div className="space-y-3">
                {TIMELINE.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {step.done ? (
                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                      ) : step.active ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-100 flex-shrink-0 animate-pulse" />
                      ) : (
                        <Circle size={16} className="text-slate-300 flex-shrink-0" />
                      )}
                      {i < TIMELINE.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-1 ${step.done ? 'bg-emerald-200' : 'bg-slate-100'}`} />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className={`text-xs font-medium ${step.done ? 'text-slate-700' : step.active ? 'text-blue-600' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Driver & vehicle info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card title="Driver Information">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-semibold text-sm">
                  {shipment.driver !== 'Pending' ? shipment.driver.split(' ').map(n => n[0]).join('') : '?'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{shipment.driver === 'Pending' ? 'Unassigned' : shipment.driver}</p>
                  <p className="text-xs text-slate-400">CDL Class A · Cryogenic Certified</p>
                </div>
                {shipment.driver !== 'Pending' && (
                  <button className="ml-auto w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100">
                    <Phone size={14} />
                  </button>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Vehicle</span><span className="font-medium text-slate-700">{shipment.truck}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">License</span><span className="font-medium text-slate-700">TX-482-9173</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Last GPS Update</span><span className="font-medium text-slate-700">2 min ago</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Speed</span><span className="font-medium text-slate-700">68 mph</span></div>
              </div>
            </Card>

            <Card title="Cargo Details">
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Product', value: 'Green Hydrogen (GH₂)' },
                  { label: 'Quantity', value: `${shipment.quantity.toLocaleString()} kg` },
                  { label: 'Purity Grade', value: '99.97% (Grade 4.0)' },
                  { label: 'Container Type', value: 'Cryogenic Tanker' },
                  { label: 'UN Number', value: 'UN 1966' },
                  { label: 'Hazmat Class', value: '2.1 (Flammable Gas)' },
                  { label: 'Temperature', value: '-253°C (LH₂)' },
                  { label: 'Pressure', value: '350 bar' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-medium text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
