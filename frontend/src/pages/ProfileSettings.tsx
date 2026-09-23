import { useState } from 'react';
import { User, Shield, Bell, Monitor, Key, LogOut, Save, Camera } from 'lucide-react';
import { Card, PageHeader, Button, Input, Select } from '../components/ui';

const TABS = ['Profile', 'Security', 'Notifications', 'Appearance'];

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl fade-in">
      <PageHeader
        title="Profile & Settings"
        subtitle="Manage your account information and preferences"
        actions={
          <Button size="sm" onClick={handleSave}>
            {saved ? '✓ Saved' : <><Save size={13} />Save Changes</>}
          </Button>
        }
      />

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Profile' && (
        <div className="space-y-4">
          <Card title="Personal Information">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  AM
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50">
                  <Camera size={11} />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Alexandra Mitchell</h3>
                <p className="text-sm text-slate-500">a.mitchell@h2track.com</p>
                <p className="text-xs text-slate-400 mt-0.5">Administrator · HydrogenTrack</p>
              </div>
              <button className="ml-auto text-sm text-blue-600 hover:underline">Change photo</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" defaultValue="Alexandra" />
              <Input label="Last Name" defaultValue="Mitchell" />
              <Input label="Email Address" type="email" defaultValue="a.mitchell@h2track.com" />
              <Input label="Phone Number" defaultValue="+1 713-555-0100" />
              <Input label="Job Title" defaultValue="Platform Administrator" />
              <Select label="Department" options={[
                { value: 'ops', label: 'Operations' },
                { value: 'prod', label: 'Production' },
                { value: 'sc', label: 'Supply Chain' },
              ]} />
              <div className="col-span-2">
                <Select label="Timezone" options={[
                  { value: 'ct', label: 'Central Time (CT) — UTC-6' },
                  { value: 'et', label: 'Eastern Time (ET) — UTC-5' },
                  { value: 'pt', label: 'Pacific Time (PT) — UTC-8' },
                ]} />
              </div>
              <div className="col-span-2">
                <Select label="Language" options={[
                  { value: 'en', label: 'English (US)' },
                  { value: 'es', label: 'Spanish (ES)' },
                  { value: 'de', label: 'German (DE)' },
                ]} />
              </div>
            </div>
          </Card>

          <Card title="Company Information">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Organization" defaultValue="HydrogenTrack, Inc." />
              <Input label="Account ID" defaultValue="ACC-2024-001" />
              <div className="col-span-2">
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500">
                  Member since March 2024 · Platinum Enterprise · Account Manager: Jessica Park
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="space-y-4">
          <Card title="Password">
            <div className="space-y-4 max-w-sm">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" helpText="Min 12 characters, include uppercase, number, and symbol" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              <Button>Update Password</Button>
            </div>
          </Card>

          <Card title="Two-Factor Authentication">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-800">Authenticator App</p>
                <p className="text-xs text-slate-500 mt-0.5">Use an authenticator app to generate one-time codes</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs font-medium text-emerald-600">Enabled</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="secondary" size="sm"><Key size={13} />View Backup Codes</Button>
              <p className="text-xs text-slate-400">Last used: September 23, 2026 at 09:14 AM</p>
            </div>
          </Card>

          <Card title="Active Sessions">
            <div className="space-y-3">
              {[
                { device: 'MacBook Pro 16"', location: 'Houston, TX · Chrome 128', time: 'Current session', current: true },
                { device: 'iPhone 16 Pro', location: 'Houston, TX · Safari', time: '2 hours ago', current: false },
                { device: 'iPad Air', location: 'Austin, TX · Safari', time: 'Yesterday', current: false },
              ].map(session => (
                <div key={session.device} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                    <Monitor size={14} className="text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700">{session.device}</p>
                    <p className="text-xs text-slate-400">{session.location} · {session.time}</p>
                  </div>
                  {session.current ? (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Current</span>
                  ) : (
                    <button className="text-xs text-red-500 hover:underline font-medium">Revoke</button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="danger" size="sm"><LogOut size={13} />Sign Out All Other Sessions</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'Notifications' && (
        <Card title="Notification Preferences">
          <div className="space-y-5">
            {[
              { section: 'Production Alerts', items: [
                { label: 'Plant status changes', email: true, push: true, sms: false },
                { label: 'Efficiency alerts', email: true, push: true, sms: false },
                { label: 'Maintenance reminders', email: true, push: false, sms: false },
              ]},
              { section: 'Shipment & Delivery', items: [
                { label: 'Shipment dispatched', email: true, push: true, sms: true },
                { label: 'Delivery delays', email: true, push: true, sms: true },
                { label: 'Delivery completed', email: true, push: false, sms: false },
              ]},
              { section: 'System', items: [
                { label: 'Security alerts', email: true, push: true, sms: true },
                { label: 'System maintenance', email: true, push: false, sms: false },
                { label: 'New user registrations', email: false, push: false, sms: false },
              ]},
            ].map(group => (
              <div key={group.section}>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{group.section}</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-xs text-slate-400 mb-1 px-1">
                    <span className="col-span-1" />
                    {['Email', 'Push', 'SMS'].map(ch => <span key={ch} className="text-center">{ch}</span>)}
                  </div>
                  {group.items.map(item => (
                    <div key={item.label} className="grid grid-cols-4 items-center gap-2 px-1">
                      <span className="text-sm text-slate-700 col-span-1">{item.label}</span>
                      {[item.email, item.push, item.sms].map((val, i) => (
                        <div key={i} className="flex justify-center">
                          <input type="checkbox" defaultChecked={val} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'Appearance' && (
        <Card title="Display Preferences">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-3">Theme</label>
              <div className="flex gap-3">
                {['Light', 'Dark', 'System'].map(t => (
                  <button key={t} className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${t === 'Light' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Date Format</label>
              <Select options={[
                { value: 'mdy', label: 'MM/DD/YYYY (US)' },
                { value: 'dmy', label: 'DD/MM/YYYY (EU)' },
                { value: 'ymd', label: 'YYYY-MM-DD (ISO)' },
              ]} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Default Units</label>
              <Select options={[
                { value: 'kg', label: 'Kilograms (kg)' },
                { value: 'lb', label: 'Pounds (lb)' },
                { value: 'nm3', label: 'Normal cubic metres (Nm³)' },
              ]} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
