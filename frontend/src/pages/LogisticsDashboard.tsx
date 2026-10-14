import { useEffect, useMemo, useState } from 'react';
import {
  CircleAlert,
  Factory,
  LocateFixed,
  MapPin,
  Navigation,
  Package,
  Route,
  Truck,
  Warehouse,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StatCard, Badge, Card, ProgressBar, PageHeader, Button, Table, Tr, Td } from '../components/ui';
import { api } from '../lib/api';
import { subscribeToResource } from '../lib/realtime';
import { useGeolocation } from '../hooks/useGeolocation';

type Shipment = {
  _id: string;
  shipmentId?: string;
  id?: string;
  origin: string;
  destination: string;
  customer: string;
  driver: string;
  quantity: number;
  status: string;
  eta?: string;
  progress: number;
  lat: number;
  lng?: number;
  lon?: number;
  speed?: number;
  distanceRemaining?: number;
  deliveryStatus?: string;
};

type Facility = { _id: string; plantId?: string; plantName?: string; location?: string; locationCoords?: { lat: number; lng: number }; };
type Storage = { _id: string; facilityName: string; tankId: string; location: { lat: number; lng: number }; status: string; fillPercent?: number; };
type Point = [number, number];

const CITY_COORDINATES: Record<string, Point> = {
  'Hyderabad Hub': [17.385, 78.4867], 'Hyderabad, Telangana': [17.385, 78.4867],
  'Pune Electrolyzer': [18.5204, 73.8567], 'Pune, Maharashtra': [18.5204, 73.8567],
  'Mumbai Port Facility': [19.076, 72.8777], 'Mumbai, Maharashtra': [19.076, 72.8777],
  'Bengaluru Mobility Depot': [12.9716, 77.5946], 'Bengaluru, Karnataka': [12.9716, 77.5946],
  'Delhi H2 Hub': [28.6139, 77.209], 'New Delhi, Delhi': [28.6139, 77.209],
  'Chennai Station': [13.0827, 80.2707], 'Chennai, Tamil Nadu': [13.0827, 80.2707],
  'Ahmedabad Terminal': [23.0225, 72.5714], 'Ahmedabad, Gujarat': [23.0225, 72.5714],
  'Jaipur Facility': [26.9124, 75.7873], 'Jaipur, Rajasthan': [26.9124, 75.7873],
  'Kolkata Depot': [22.5726, 88.3639], 'Kolkata, West Bengal': [22.5726, 88.3639],
};

const STATUS_COLORS: Record<string, string> = {
  transit: '#16a34a', delivered: '#2563eb', delayed: '#f59e0b', pending: '#64748b', critical: '#dc2626',
};

export function LogisticsMap({ shipments, facilities, storages, onShipmentClick }: { shipments: Shipment[]; facilities: Facility[]; storages: Storage[]; onShipmentClick: (id: string) => void }) {
  const [layers, setLayers] = useState({ plants: true, storage: true, customers: true, routes: true });
  const [routeLines, setRouteLines] = useState<Record<string, Point[]>>({});
  const [routeError, setRouteError] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [toast, setToast] = useState('');
  const { coordinates, error: locationError, loading: locationLoading, requestLocation } = useGeolocation();
  const activeShipments = useMemo(() => shipments.filter(s => s.status === 'transit' || s.status === 'delayed'), [shipments]);
  const visibleShipments = useMemo(() => activeOnly ? activeShipments : shipments, [activeOnly, activeShipments, shipments]);

  const pointFor = (name: string) => CITY_COORDINATES[name] ?? null;
  const routeEndpoints = useMemo(() => visibleShipments.map(s => {
    const current: Point | null = Number.isFinite(s.lat) && Number.isFinite(s.lng ?? s.lon)
      ? [s.lat, s.lng ?? s.lon!]
      : null;
    return { id: s._id, current, origin: pointFor(s.origin), destination: pointFor(s.destination) };
  }), [visibleShipments]);

  useEffect(() => {
    let cancelled = false;
    const loadRoutes = async () => {
      const missing = routeEndpoints.filter(r => r.current && r.origin && r.destination && !routeLines[r.id]);
      if (!missing.length) return;
      setLoadingRoutes(true);
      const resolved: Record<string, Point[]> = {};
      await Promise.all(missing.map(async route => {
        try {
          const start = `${route.origin![1]},${route.origin![0]}`;
          const current = `${route.current![1]},${route.current![0]}`;
          const end = `${route.destination![1]},${route.destination![0]}`;
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start};${current};${end}?overview=full&geometries=geojson`);
          if (!response.ok) throw new Error('Route service unavailable');
          const data = await response.json();
          const coordinates = data.routes?.[0]?.geometry?.coordinates;
          if (coordinates?.length) resolved[route.id] = coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
        } catch {
          setRouteError('Some routes are shown as direct connections because road routing is unavailable.');
        }
      }));
      if (!cancelled) setRouteLines(current => ({ ...current, ...resolved }));
      if (!cancelled) setLoadingRoutes(false);
    };
    loadRoutes();
    return () => { cancelled = true; };
  }, [routeEndpoints, routeLines]);

  const allPoints = useMemo(() => activeShipments.flatMap(s => {
    const destination = pointFor(s.destination);
    const current = Number.isFinite(s.lat) && Number.isFinite(s.lng ?? s.lon)
      ? [[s.lat, s.lng ?? s.lon!] as Point]
      : [];
    return [...current, ...(destination ? [destination] : [])];
  }).concat(
    facilities.flatMap(facility => {
      const position = facility.locationCoords ?? pointFor(facility.location || '');
      return       position ? [[position.lat, position.lng] as Point] : [];
    }),
    storages.map(storage => [storage.location.lat, storage.location.lng] as Point),
  ), [activeShipments, facilities, storages]);
  const routeColor = (status: string) => STATUS_COLORS[status] || STATUS_COLORS.pending;
  const toggle = (key: keyof typeof layers) => setLayers(current => ({ ...current, [key]: !current[key] }));
  useEffect(() => {
    if (locationError) setToast(locationError);
  }, [locationError]);

  const locateUser = () => {
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setToast('Location access requires HTTPS or localhost, plus browser permission.');
      return;
    }
    requestLocation();
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <MapContainer center={[22.5, 79]} zoom={5} className="logistics-map" scrollWheelZoom>
        <MapViewport userLocation={coordinates ? [coordinates.latitude, coordinates.longitude] : null} onMap={setMap} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates && (
          <Marker position={[coordinates.latitude, coordinates.longitude]} icon={mapIcon('●', '#2563eb')}>
            <Popup><strong>Your current location</strong><div>Accuracy: within {Math.round(coordinates.accuracy)} m</div></Popup>
          </Marker>
        )}
        {layers.routes && routeEndpoints.map(route => {
          const line = routeLines[route.id] ?? [route.origin, route.current, route.destination].filter(Boolean) as Point[];
          return line.length > 1 ? <Polyline key={`route-${route.id}`} positions={line} pathOptions={{ color: routeColor(shipments.find(s => s._id === route.id)?.status || 'pending'), weight: 4, opacity: 0.72 }} /> : null;
        })}
        {layers.plants && facilities.map(facility => {
          const position = facility.locationCoords ?? pointFor(facility.location || '');
          return position ? <Marker key={facility._id} position={position} icon={mapIcon('⚡', '#16a34a')}><Popup><strong>{facility.plantName || facility.plantId || 'Production plant'}</strong><div>Production facility · {facility.location || ''}</div></Popup></Marker> : null;
        })}
        {layers.storage && storages.map(storage => <Marker key={storage._id} position={[storage.location.lat, storage.location.lng]} icon={mapIcon('▣', '#7c3aed')}><Popup><strong>{storage.facilityName}</strong><div>Tank {storage.tankId} · Status: {storage.status} · Fill: {storage.fillPercent ?? '—'}%</div></Popup></Marker>)}
        {layers.customers && visibleShipments.map(shipment => {
          const position = pointFor(shipment.destination);
          return position ? <Marker key={`customer-${shipment._id}`} position={position} icon={mapIcon('◆', '#dc2626')}><Popup><strong>{shipment.customer}</strong><div>Customer destination · {shipment.destination}</div></Popup></Marker> : null;
        })}
        {visibleShipments.map(shipment => {
          const position: Point | null = Number.isFinite(shipment.lat) && Number.isFinite(shipment.lng ?? shipment.lon)
            ? [shipment.lat, shipment.lng ?? shipment.lon!]
            : null;
          const id = shipment.shipmentId || shipment.id || shipment._id;
          return position ? <Marker key={shipment._id} position={position} icon={mapIcon('▲', routeColor(shipment.status))} eventHandlers={{ click: () => onShipmentClick(id) }}><Popup><strong>{shipment.truck || 'Vehicle'} · {id}</strong><div>{shipment.origin} → {shipment.destination}</div></Popup></Marker> : null;
        })}
      </MapContainer>
      <div className="pointer-events-none absolute inset-x-3 top-3 z-[1000] flex flex-wrap items-start justify-between gap-2">
        <div className="pointer-events-auto rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-800"><Route size={14} className="text-blue-600" /> Live logistics network</p>
          <p className="mt-0.5 text-[11px] text-slate-500">{activeShipments.length} active vehicles · OpenStreetMap roads</p>
        </div>
        <div className="pointer-events-auto flex max-w-full flex-wrap gap-1 rounded-lg border border-slate-200 bg-white/95 p-1 shadow-sm">
          {[['plants', 'Plants', Factory], ['storage', 'Storage', Warehouse], ['customers', 'Customers', MapPin], ['routes', 'Routes', Route]].map(([key, label, Icon]) => <button key={key as string} onClick={() => toggle(key as keyof typeof layers)} className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${layers[key as keyof typeof layers] ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Icon size={12} />{label}</button>)}
        </div>
      </div>
      <div className="absolute bottom-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        <div className="rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-sm"><div className="flex flex-wrap gap-x-3 gap-y-1"><span><i className="legend-dot bg-green-600" />Active</span><span><i className="legend-dot bg-blue-600" />Completed</span><span><i className="legend-dot bg-amber-400" />Delayed</span><span><i className="legend-dot bg-red-600" />Critical</span></div></div>
        <button className="map-action" onClick={() => allPoints.length && map?.fitBounds(L.latLngBounds(allPoints), { padding: [30, 30] })}><LocateFixed size={13} /> Fit all</button>
        <button className="map-action" onClick={locateUser} disabled={locationLoading}><LocateFixed size={13} /> {locationLoading ? 'Locating…' : 'Use my location'}</button>
        <button className={`map-action ${activeOnly ? 'bg-blue-50 text-blue-700' : ''}`} onClick={() => setActiveOnly(current => !current)}><Truck size={13} /> Active only</button>
      </div>
      {loadingRoutes && <div className="absolute right-3 bottom-3 z-[1000] rounded-md bg-white/95 px-2 py-1 text-[11px] text-slate-500 shadow">Loading road routes…</div>}
      {routeError && <div className="absolute right-3 top-16 z-[1000] max-w-xs rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-800"><CircleAlert size={12} className="mr-1 inline" />{routeError}</div>}
      {toast && <div className="absolute right-3 top-16 z-[1000] max-w-xs rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-800"><CircleAlert size={12} className="mr-1 inline" />{toast}<button className="ml-2 font-bold" onClick={() => setToast('')}>×</button></div>}
      {locationError && <div className="absolute right-3 top-28 z-[1000] max-w-xs rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-800"><CircleAlert size={12} className="mr-1 inline" />{locationError}</div>}
    </div>
  );
}

const mapIcon = (label: string, color: string) => L.divIcon({
  className: 'map-marker',
  html: `<span style="background:${color}">${label}</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

function MapViewport({ userLocation, onMap }: { userLocation: Point | null; onMap: (map: L.Map | null) => void }) {
  const map = useMap();
  useEffect(() => {
    onMap(map);
    return () => onMap(null);
  }, [map, onMap]);
  useEffect(() => {
    if (userLocation) map.setView(userLocation, 14);
  }, [map, userLocation]);
  return null;
}

export default function LogisticsDashboard({ onNavigate }: { onNavigate: (p: any) => void }) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [storages, setStorages] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadAll = () => {
      setLoadError('');
      return Promise.all([
        api<Shipment[]>('/shipments'),
        api<Facility[]>('/production'),
        api<Storage[]>('/storage'),
      ]).then(([shipmentData, productionData, storageData]) => {
        if (!mounted) return;
        setShipments(shipmentData);
        setFacilities(productionData);
        setStorages(storageData);
      }).catch(error => {
        if (mounted) setLoadError(error instanceof Error ? error.message : 'Unable to load logistics data');
      }).finally(() => { if (mounted) setLoading(false); });
    };
    const loadShipments = () => api<Shipment[]>('/shipments').then(data => { if (mounted) setShipments(data); }).catch(error => { if (mounted) setLoadError(error instanceof Error ? error.message : 'Unable to load shipments'); });
    const loadProduction = () => api<Facility[]>('/production').then(data => { if (mounted) setFacilities(data); }).catch(error => { if (mounted) setLoadError(error instanceof Error ? error.message : 'Unable to load production facilities'); });
    const loadStorage = () => api<Storage[]>('/storage').then(data => { if (mounted) setStorages(data); }).catch(error => { if (mounted) setLoadError(error instanceof Error ? error.message : 'Unable to load storage facilities'); });
    loadAll();
    const stopShipments = subscribeToResource('shipments', loadShipments);
    const stopProduction = subscribeToResource('production', loadProduction);
    const stopStorage = subscribeToResource('storage', loadStorage);
    return () => { mounted = false; stopShipments(); stopProduction(); stopStorage(); };
  }, []);

  const inTransit = shipments.filter(s => s.status === 'transit').length;
  const delayed = shipments.filter(s => s.status === 'delayed').length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const pending = shipments.filter(s => s.status === 'pending').length;
  const totalKg = shipments.reduce((sum, shipment) => sum + shipment.quantity, 0);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Logistics Dashboard"
        subtitle="Real-time shipment tracking and fleet management"
        actions={
          <Button size="sm" onClick={() => onNavigate('delivery')}><Package size={13} />Schedule Delivery</Button>
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
      {loading ? (
        <div className="flex h-[520px] items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500">Loading live logistics network…</div>
      ) : loadError ? (
        <div className="flex h-[520px] items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-center text-sm text-red-700">Unable to load map data: {loadError}</div>
      ) : (
        <LogisticsMap shipments={shipments} facilities={facilities} storages={storages} onShipmentClick={() => onNavigate('shipment-details')} />
      )}

      {/* Shipments table */}
      <Card title="Active Shipments" noPadding actions={
        <Button size="sm" onClick={() => onNavigate('shipment-details')}>View All</Button>
      }>
        <Table headers={['Shipment ID', 'Route', 'Customer', 'Driver', 'Quantity', 'Progress', 'ETA', 'Status', '']}>
          {shipments.map(s => (
            <Tr key={s._id} onClick={() => onNavigate('shipment-details')}>
              <Td>
                <span className="font-mono text-xs font-semibold text-blue-600">{s.shipmentId || s.id || s._id}</span>
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
