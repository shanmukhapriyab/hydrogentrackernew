import { useState } from 'react';
import { Plus, Filter, Calendar, Truck, Clock } from 'lucide-react';
import { Badge, Card, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { DELIVERY_SCHEDULE, SHIPMENTS } from '../data/mockData';

export default function DeliveryManagement() {
  const [view, setView] = useState<'schedule' | 'map'>('schedule');
  const [dateFilter, setDateFilter] = useState('today');

  const drivers = [
    { name: 'Marcus Johnson', truck: 'TRK-224', status: 'active', deliveries: 1, location: 'I-35 N near Round Rock' },
    { name: 'Elena Rodriguez', truck: 'TRK-118', status: 'available', deliveries: 1, location: 'San Diego, CA' },
    { name: 'David Kim', truck: 'TRK-307', status: 'active', deliveries: 1, location: 'I-95 N near Providence' },
    { name: 'Sarah Chen', truck: 'TRK-415', status: 'delayed', deliveries: 1, location: 'I-35 S near Kyle, TX' },
    { name: 'Andre Dupont', truck: 'TRK-729', status: 'active', deliveries: 1, location: 'I-10 E near Lafayette' },
    { name: 'Maria Santos', truck: 'TRK-834', status: 'available', deliveries: 1, location: 'Las Vegas, NV' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Delivery Management"
        subtitle="Schedule and track all deliveries and drivers"
        actions={
          <>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden text-xs">
              {['today', 'week', 'month'].map(d => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={`px-3 py-1.5 font-medium capitalize transition-colors ${dateFilter === d ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <Button size="sm"><Plus size={13} />New Delivery</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-2">
          <Card title="Delivery Schedule — September 23, 2026" noPadding
            actions={
              <div className="flex gap-1.5">
                <button
                  onClick={() => setView('schedule')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${view === 'schedule' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >List</button>
                <button
                  onClick={() => setView('map')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${view === 'map' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >Timeline</button>
              </div>
            }
          >
            {view === 'schedule' ? (
              <Table headers={['Time', 'Shipment', 'Driver', 'Destination', 'Quantity', 'Status']}>
                {DELIVERY_SCHEDULE.map((row, i) => (
                  <Tr key={i}>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="font-mono text-xs font-semibold text-slate-700">{row.time}</span>
                      </div>
                    </Td>
                    <Td>
                      <span className="font-mono text-xs text-blue-600 font-semibold">{row.shipment.slice(-4)}</span>
                    </Td>
                    <Td className="text-xs">{row.driver}</Td>
                    <Td className="text-xs font-medium text-slate-700">{row.destination}</Td>
                    <Td className="text-xs">{row.qty}</Td>
                    <Td><Badge status={row.status as any} /></Td>
                  </Tr>
                ))}
              </Table>
            ) : (
              <div className="p-5">
                {/* Timeline view */}
                <div className="relative">
                  <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-slate-100" />
                  <div className="space-y-1">
                    {DELIVERY_SCHEDULE.map((row, i) => (
                      <div key={i} className="flex items-start gap-4 py-2">
                        <span className="text-xs font-mono font-bold text-slate-500 w-12 text-right flex-shrink-0 pt-0.5">{row.time}</span>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 z-10 border-2 border-white ${
                          row.status === 'delivered' ? 'bg-emerald-500' :
                          row.status === 'transit' ? 'bg-blue-500' :
                          row.status === 'delayed' ? 'bg-red-500' : 'bg-amber-400'
                        }`} />
                        <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-slate-700">{row.destination}</span>
                              <span className="text-xs text-slate-400 ml-2">· {row.driver}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">{row.qty}</span>
                              <Badge status={row.status as any} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Driver panel */}
        <div>
          <Card title="Driver Status" subtitle="6 drivers assigned today" noPadding>
            <div className="divide-y divide-slate-50">
              {drivers.map(driver => (
                <div key={driver.name} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                      driver.status === 'active' ? 'bg-emerald-500' :
                      driver.status === 'delayed' ? 'bg-red-500' : 'bg-slate-300'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-700 truncate">{driver.name}</p>
                        <span className="text-xs text-slate-400 flex-shrink-0">{driver.truck}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{driver.location}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs font-medium ${
                          driver.status === 'active' ? 'text-emerald-600' :
                          driver.status === 'delayed' ? 'text-red-600' : 'text-slate-500'
                        }`}>
                          {driver.status === 'active' ? 'En route' : driver.status === 'delayed' ? 'Delayed' : 'Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Button variant="secondary" size="sm" className="w-full justify-center">Assign Driver</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'On-Time Rate', value: '78.6%', sub: '11 of 14 deliveries', ok: true },
          { label: 'Avg Delivery Time', value: '6.4 hrs', sub: '-0.3 hrs vs last week', ok: true },
          { label: 'Fuel Efficiency', value: '5.2 km/L', sub: 'Fleet average', ok: false },
          { label: 'Deliveries Today', value: '7', sub: '2 delivered, 3 in transit', ok: true },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-400 mt-1">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
