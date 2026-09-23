export const PLANTS = [
  { id: 'PLT-001', name: 'Green Valley Electrolyzer', location: 'Houston, TX', capacity: 120, output: 98.4, efficiency: 82, status: 'active', type: 'PEM', uptime: 99.1 },
  { id: 'PLT-002', name: 'Sunrise H2 Facility', location: 'Phoenix, AZ', capacity: 85, output: 71.2, efficiency: 83.8, status: 'active', type: 'Alkaline', uptime: 97.6 },
  { id: 'PLT-003', name: 'Pacific Hydrogen Works', location: 'Los Angeles, CA', capacity: 200, output: 168.5, efficiency: 84.3, status: 'active', type: 'PEM', uptime: 98.2 },
  { id: 'PLT-004', name: 'Midwest Green Energy', location: 'Chicago, IL', capacity: 95, output: 0, efficiency: 0, status: 'maintenance', type: 'SOEC', uptime: 0 },
  { id: 'PLT-005', name: 'Atlantic H2 Solutions', location: 'Newark, NJ', capacity: 150, output: 122.8, efficiency: 81.9, status: 'active', type: 'Alkaline', uptime: 96.4 },
  { id: 'PLT-006', name: 'Lone Star Hydrogen', location: 'Dallas, TX', capacity: 180, output: 145.6, efficiency: 80.9, status: 'active', type: 'PEM', uptime: 98.8 },
];

export const STORAGE_TANKS = [
  { id: 'TNK-001', location: 'Houston Hub', capacity: 500, current: 387, pressure: 350, temp: -253, type: 'Cryogenic', status: 'active', lastFilled: '2026-09-22' },
  { id: 'TNK-002', location: 'Phoenix Terminal', capacity: 250, current: 198, pressure: 700, temp: 25, type: 'Compressed Gas', status: 'active', lastFilled: '2026-09-21' },
  { id: 'TNK-003', location: 'LA Port Facility', capacity: 800, current: 624, pressure: 350, temp: -253, type: 'Cryogenic', status: 'active', lastFilled: '2026-09-23' },
  { id: 'TNK-004', location: 'Chicago Depot', capacity: 300, current: 12, pressure: 0, temp: 20, type: 'Cryogenic', status: 'offline', lastFilled: '2026-09-15' },
  { id: 'TNK-005', location: 'Newark Terminal', capacity: 400, current: 302, pressure: 700, temp: 25, type: 'Compressed Gas', status: 'active', lastFilled: '2026-09-22' },
  { id: 'TNK-006', location: 'Dallas Hub', capacity: 600, current: 89, pressure: 350, temp: -253, type: 'Cryogenic', status: 'critical', lastFilled: '2026-09-20' },
];

export const SHIPMENTS = [
  { id: 'SHP-2026-0841', origin: 'Houston Hub', destination: 'Austin Fuel Depot', customer: 'Apex Energy Corp', driver: 'Marcus Johnson', truck: 'TRK-224', quantity: 4200, unit: 'kg', status: 'transit', eta: '2026-09-23 16:30', departed: '2026-09-23 08:15', progress: 68, lat: 29.8, lon: -96.1, priority: 'high' },
  { id: 'SHP-2026-0842', origin: 'LA Port Facility', destination: 'San Diego FC Station', customer: 'CleanFleet Solutions', driver: 'Elena Rodriguez', truck: 'TRK-118', quantity: 3100, unit: 'kg', status: 'delivered', eta: '2026-09-23 11:00', departed: '2026-09-23 06:00', progress: 100, lat: 32.7, lon: -117.1, priority: 'normal' },
  { id: 'SHP-2026-0843', origin: 'Newark Terminal', destination: 'Boston H2 Hub', customer: 'NorthEast Power', driver: 'David Kim', truck: 'TRK-307', quantity: 5800, unit: 'kg', status: 'transit', eta: '2026-09-23 20:00', departed: '2026-09-23 12:00', progress: 32, lat: 41.2, lon: -73.8, priority: 'normal' },
  { id: 'SHP-2026-0844', origin: 'Dallas Hub', destination: 'San Antonio Plant', customer: 'TXH2 Industries', driver: 'Sarah Chen', truck: 'TRK-415', quantity: 2900, unit: 'kg', status: 'delayed', eta: '2026-09-23 15:00', departed: '2026-09-23 09:30', progress: 45, lat: 29.4, lon: -98.0, priority: 'high' },
  { id: 'SHP-2026-0845', origin: 'Phoenix Terminal', destination: 'Tucson Facility', customer: 'Desert H2 LLC', driver: 'James Wilson', truck: 'TRK-521', quantity: 1800, unit: 'kg', status: 'pending', eta: '2026-09-24 09:00', departed: '', progress: 0, lat: 33.4, lon: -112.0, priority: 'low' },
  { id: 'SHP-2026-0846', origin: 'Chicago Depot', destination: 'Detroit Hub', customer: 'Great Lakes Energy', driver: 'Pending', truck: 'TRK-632', quantity: 4500, unit: 'kg', status: 'pending', eta: '2026-09-24 14:00', departed: '', progress: 0, lat: 41.8, lon: -87.6, priority: 'normal' },
  { id: 'SHP-2026-0847', origin: 'Houston Hub', destination: 'New Orleans Port', customer: 'Gulf Coast H2', driver: 'Andre Dupont', truck: 'TRK-729', quantity: 6200, unit: 'kg', status: 'transit', eta: '2026-09-23 19:45', departed: '2026-09-23 11:00', progress: 55, lat: 29.6, lon: -92.8, priority: 'high' },
  { id: 'SHP-2026-0848', origin: 'LA Port Facility', destination: 'Las Vegas Station', customer: 'NV Clean Energy', driver: 'Maria Santos', truck: 'TRK-834', quantity: 2400, unit: 'kg', status: 'delivered', eta: '2026-09-23 13:00', departed: '2026-09-23 07:00', progress: 100, lat: 36.1, lon: -115.2, priority: 'normal' },
];

export const CUSTOMERS = [
  { id: 'CST-001', name: 'Apex Energy Corp', industry: 'Transportation', contact: 'Robert Hayes', email: 'r.hayes@apexenergy.com', phone: '+1 713-555-0182', totalOrders: 148, totalVolume: 624500, status: 'active', tier: 'platinum', creditLimit: 2000000 },
  { id: 'CST-002', name: 'CleanFleet Solutions', industry: 'Fleet Management', contact: 'Jennifer Wu', email: 'j.wu@cleanfleet.io', phone: '+1 310-555-0291', totalOrders: 92, totalVolume: 389200, status: 'active', tier: 'gold', creditLimit: 1000000 },
  { id: 'CST-003', name: 'NorthEast Power', industry: 'Utilities', contact: 'Brian Callahan', email: 'b.callahan@neptower.com', phone: '+1 617-555-0374', totalOrders: 64, totalVolume: 278100, status: 'active', tier: 'silver', creditLimit: 750000 },
  { id: 'CST-004', name: 'TXH2 Industries', industry: 'Industrial', contact: 'Carmen Torres', email: 'c.torres@txh2.com', phone: '+1 214-555-0483', totalOrders: 201, totalVolume: 985400, status: 'active', tier: 'platinum', creditLimit: 3000000 },
  { id: 'CST-005', name: 'Desert H2 LLC', industry: 'Refining', contact: 'Mohammed Al-Rashid', email: 'm.alrashid@deserth2.com', phone: '+1 602-555-0562', totalOrders: 37, totalVolume: 148700, status: 'active', tier: 'bronze', creditLimit: 500000 },
  { id: 'CST-006', name: 'Great Lakes Energy', industry: 'Power Generation', contact: 'Lisa Kowalski', email: 'l.kowalski@glakes.energy', phone: '+1 312-555-0617', totalOrders: 118, totalVolume: 512300, status: 'suspended', tier: 'gold', creditLimit: 1500000 },
];

export const ORDERS = [
  { id: 'ORD-2026-1204', customer: 'Apex Energy Corp', quantity: 4200, unit: 'kg', deliveryDate: '2026-09-25', origin: 'Houston Hub', status: 'confirmed', priority: 'high', created: '2026-09-22', price: 8.40, total: 35280 },
  { id: 'ORD-2026-1205', customer: 'CleanFleet Solutions', quantity: 3100, unit: 'kg', deliveryDate: '2026-09-26', origin: 'LA Port Facility', status: 'processing', priority: 'normal', created: '2026-09-22', price: 8.65, total: 26815 },
  { id: 'ORD-2026-1206', customer: 'NorthEast Power', quantity: 5800, unit: 'kg', deliveryDate: '2026-09-27', origin: 'Newark Terminal', status: 'pending', priority: 'normal', created: '2026-09-23', price: 8.20, total: 47560 },
  { id: 'ORD-2026-1207', customer: 'TXH2 Industries', quantity: 8500, unit: 'kg', deliveryDate: '2026-09-24', origin: 'Dallas Hub', status: 'confirmed', priority: 'high', created: '2026-09-21', price: 8.10, total: 68850 },
  { id: 'ORD-2026-1208', customer: 'Desert H2 LLC', quantity: 1800, unit: 'kg', deliveryDate: '2026-09-28', origin: 'Phoenix Terminal', status: 'pending', priority: 'low', created: '2026-09-23', price: 8.75, total: 15750 },
];

export const USERS = [
  { id: 'USR-001', name: 'Alexandra Mitchell', email: 'a.mitchell@h2track.com', role: 'Admin', department: 'Operations', status: 'active', lastLogin: '2026-09-23 09:14', joined: '2024-03-01', mfa: true },
  { id: 'USR-002', name: 'Carlos Reyes', email: 'c.reyes@h2track.com', role: 'Producer', department: 'Production', status: 'active', lastLogin: '2026-09-23 08:52', joined: '2024-06-15', mfa: true },
  { id: 'USR-003', name: 'Priya Sharma', email: 'p.sharma@h2track.com', role: 'Logistics', department: 'Supply Chain', status: 'active', lastLogin: '2026-09-23 10:01', joined: '2025-01-10', mfa: false },
  { id: 'USR-004', name: 'Thomas Berg', email: 't.berg@h2track.com', role: 'Customer', department: 'External', status: 'active', lastLogin: '2026-09-22 16:30', joined: '2025-04-20', mfa: true },
  { id: 'USR-005', name: 'Rachel Kim', email: 'r.kim@h2track.com', role: 'Analyst', department: 'Analytics', status: 'active', lastLogin: '2026-09-23 07:45', joined: '2024-11-08', mfa: true },
  { id: 'USR-006', name: 'Daniel Okonkwo', email: 'd.okonkwo@h2track.com', role: 'Logistics', department: 'Supply Chain', status: 'inactive', lastLogin: '2026-09-18 14:22', joined: '2024-08-01', mfa: false },
  { id: 'USR-007', name: 'Sophie Laurent', email: 's.laurent@h2track.com', role: 'Producer', department: 'Production', status: 'active', lastLogin: '2026-09-23 09:33', joined: '2025-02-14', mfa: true },
];

export const PRODUCTION_CHART = [
  { month: 'Apr', target: 380, actual: 362, renewable: 298 },
  { month: 'May', target: 390, actual: 381, renewable: 314 },
  { month: 'Jun', target: 400, actual: 395, renewable: 328 },
  { month: 'Jul', target: 410, actual: 388, renewable: 319 },
  { month: 'Aug', target: 420, actual: 412, renewable: 344 },
  { month: 'Sep', target: 430, actual: 420, renewable: 358 },
];

export const REVENUE_CHART = [
  { month: 'Apr', revenue: 2840000, cost: 1820000 },
  { month: 'May', revenue: 3120000, cost: 1940000 },
  { month: 'Jun', revenue: 3380000, cost: 2080000 },
  { month: 'Jul', revenue: 3240000, cost: 1980000 },
  { month: 'Aug', revenue: 3580000, cost: 2120000 },
  { month: 'Sep', revenue: 3740000, cost: 2180000 },
];

export const ALERTS = [
  { id: 'ALT-001', type: 'critical', title: 'Tank TNK-006 Low Level', message: 'Dallas Hub tank at 14.8% capacity. Immediate refill required.', time: '10 min ago', read: false },
  { id: 'ALT-002', type: 'warning', title: 'Shipment SHP-2026-0844 Delayed', message: 'Driver reporting traffic incident on I-35. ETA pushed 2 hours.', time: '28 min ago', read: false },
  { id: 'ALT-003', type: 'info', title: 'PLT-004 Maintenance Complete', message: 'Midwest Green Energy facility maintenance scheduled for completion by 18:00.', time: '1 hr ago', read: false },
  { id: 'ALT-004', type: 'success', title: 'Order ORD-2026-1207 Confirmed', message: 'TXH2 Industries order for 8,500 kg confirmed and scheduled for 09/24.', time: '2 hrs ago', read: true },
  { id: 'ALT-005', type: 'warning', title: 'PEM Electrolyzer Efficiency Drop', message: 'PLT-001 efficiency dropped from 84.1% to 82.0%. Inspection recommended.', time: '3 hrs ago', read: true },
  { id: 'ALT-006', type: 'info', title: 'New Customer Registration', message: 'Gulf Hydrogen Partners has completed onboarding and is awaiting approval.', time: '4 hrs ago', read: true },
  { id: 'ALT-007', type: 'success', title: 'Delivery SHP-2026-0842 Completed', message: 'CleanFleet Solutions delivery of 3,100 kg completed successfully.', time: '5 hrs ago', read: true },
  { id: 'ALT-008', type: 'critical', title: 'Pressure Anomaly Detected', message: 'TNK-002 Phoenix Terminal showing 4.2% above normal operating pressure.', time: '6 hrs ago', read: true },
];

export const DELIVERY_SCHEDULE = [
  { time: '08:15', shipment: 'SHP-2026-0841', driver: 'Marcus Johnson', destination: 'Austin Fuel Depot', qty: '4,200 kg', status: 'transit' },
  { time: '09:30', shipment: 'SHP-2026-0844', driver: 'Sarah Chen', destination: 'San Antonio Plant', qty: '2,900 kg', status: 'delayed' },
  { time: '11:00', shipment: 'SHP-2026-0842', driver: 'Elena Rodriguez', destination: 'San Diego FC Station', qty: '3,100 kg', status: 'delivered' },
  { time: '11:00', shipment: 'SHP-2026-0847', driver: 'Andre Dupont', destination: 'New Orleans Port', qty: '6,200 kg', status: 'transit' },
  { time: '12:00', shipment: 'SHP-2026-0843', driver: 'David Kim', destination: 'Boston H2 Hub', qty: '5,800 kg', status: 'transit' },
  { time: '14:00', shipment: 'SHP-2026-0846', driver: 'Pending Assignment', destination: 'Detroit Hub', qty: '4,500 kg', status: 'pending' },
  { time: '15:30', shipment: 'SHP-2026-0848', driver: 'Maria Santos', destination: 'Las Vegas Station', qty: '2,400 kg', status: 'delivered' },
];
