import { useEffect, useState } from 'react';
import { Download, Filter, TrendingUp, BarChart3, FileText } from 'lucide-react';
import { Card, PageHeader, Button } from '../components/ui';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { api } from '../lib/api';
import { subscribeToResource } from '../lib/realtime';

const REPORTS = [
  { name: 'Monthly Operations Report — Aug 2026', type: 'PDF', size: '2.4 MB', date: '2026-09-01', status: 'ready' },
  { name: 'Sustainability & Green H₂ Report Q2 2026', type: 'PDF', size: '4.1 MB', date: '2026-07-15', status: 'ready' },
  { name: 'Supply Chain Performance — H1 2026', type: 'Excel', size: '1.8 MB', date: '2026-07-01', status: 'ready' },
  { name: 'Customer Analytics — Sep 2026 (Live)', type: 'PDF', size: 'Generating', date: '2026-09-23', status: 'generating' },
  { name: 'Fleet Efficiency Report — Sep 2026', type: 'PDF', size: '1.2 MB', date: '2026-09-20', status: 'ready' },
];

export default function ReportsAnalytics() {
  const [period, setPeriod] = useState('ytd');
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>({ productionTrend: [], revenueTrend: [], efficiency: [], regionData: [] });

  useEffect(() => {
    const load = () => api<any>('/analytics/summary').then(setAnalytics).catch(console.error);
    load();
    return subscribeToResource('production', load);
  }, []);

  const monthly = analytics.productionTrend.map((item: any, index: number) => ({
    ...item,
    deliveries: analytics.consumption?.[index]?.delivered || 0,
    revenue: analytics.revenueTrend?.[index]?.revenue || 0,
  }));
  const efficiencyData = analytics.efficiency || [];
  const regionData = analytics.regionData || [];

  const tabs = ['overview', 'production', 'logistics', 'financial', 'reports'];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Platform performance metrics and downloadable reports"
        actions={
          <>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden text-xs">
              {['mtd', 'qtd', 'ytd'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 font-medium uppercase transition-colors ${period === p ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                  {p}
                </button>
              ))}
            </div>
            <Button size="sm"><Download size={13} />Export All</Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* KPI metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Production (YTD)', value: '3,220', unit: 't', change: '+8.4%' },
          { label: 'Total Revenue (YTD)', value: '$28.2M', unit: '', change: '+11.2%' },
          { label: 'Deliveries Completed', value: '2,366', unit: '', change: '+7.9%' },
          { label: 'On-Time Delivery Rate', value: '91.4', unit: '%', change: '+1.2pp' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-400 mb-1.5 uppercase tracking-wide">{m.label}</p>
            <p className="text-2xl font-bold text-slate-900">{m.value}<span className="text-base text-slate-400 ml-1">{m.unit}</span></p>
            <p className="text-xs text-emerald-600 font-medium mt-1">{m.change} vs last year</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Production & Deliveries" subtitle="Monthly volumes — tonnes">
          <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="production" stroke="#2563eb" strokeWidth={2} fill="url(#gP)" name="Production (t)" />
              <Area type="monotone" dataKey="deliveries" stroke="#10b981" strokeWidth={2} fill="url(#gD)" name="Deliveries (t)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue Trend" subtitle="Monthly revenue in USD">
          <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} margin={{ top: 4, right: 4, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`$${(v/1e6).toFixed(2)}M`]} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4,4,0,0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Electrolyzer Efficiency by Technology" subtitle="Weekly average (%)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={efficiencyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[78, 86]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="pem" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="PEM (%)" />
              <Line type="monotone" dataKey="alkaline" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Alkaline (%)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Volume by Region" subtitle="Share of total deliveries (%)">
          <div className="flex items-center gap-6">
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={regionData} cx="50%" cy="50%" outerRadius={70} dataKey="volume" paddingAngle={2}>
                    {regionData.map((_: any, i: number) => (
                      <Cell key={i} fill={['#2563eb','#3b82f6','#93c5fd','#dbeafe','#eff6ff'][i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {regionData.map((d: any, i: number) => (
                <div key={d.region} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: ['#2563eb','#3b82f6','#93c5fd','#dbeafe','#eff6ff'][i] }} />
                  <span className="text-slate-600 flex-1">{d.region}</span>
                  <span className="font-bold text-slate-800">{d.volume}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Downloadable reports */}
      <Card title="Available Reports" noPadding>
        <div className="divide-y divide-slate-50">
          {REPORTS.map(report => (
            <div key={report.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                report.type === 'PDF' ? 'bg-red-100' : 'bg-emerald-100'
              }`}>
                <FileText size={14} className={report.type === 'PDF' ? 'text-red-600' : 'text-emerald-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{report.name}</p>
                <p className="text-xs text-slate-400">{report.type} · {report.size} · {report.date}</p>
              </div>
              {report.status === 'generating' ? (
                <div className="flex items-center gap-1.5 text-xs text-amber-600">
                  <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <Button variant="secondary" size="sm"><Download size={12} />Download</Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
