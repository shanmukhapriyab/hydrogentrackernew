import { useState } from 'react';

import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';

type UserRole = 'admin' | 'producer' | 'logistics' | 'customer';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const DEMO_ACCOUNTS: {
  role: UserRole;
  label: string;
  email: string;
  description: string;
}[] = [
  {
    role: 'admin',
    label: 'Administrator',
    email: 'admin@hydrogen.com',
    description: 'Full platform access'
  },
  {
    role: 'producer',
    label: 'Producer',
    email: 'producer@hydrogen.com',
    description: 'Production & storage management'
  },
  {
    role: 'logistics',
    label: 'Logistics',
    email: 'logistics@hydrogen.com',
    description: 'Shipment & delivery management'
  },
  {
    role: 'customer',
    label: 'Customer',
    email: 'customer@hydrogen.com',
    description: 'Order & delivery tracking'
  }
];

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@hydrogen.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<UserRole>('admin');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.user.role);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the server'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex">
      <div className="hidden lg:flex flex-col w-[480px] bg-blue-700 text-white p-12 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/40"
              style={{
                width: `${200 + i * 120}px`,
                height: `${200 + i * 120}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>

            <div>
              <div className="font-bold text-lg">
                HydrogenTrack
              </div>

              <div className="text-blue-200 text-xs">
                Supply Chain Platform
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Hydrogen Supply Chain,
              <br />
              Fully Visible.
            </h2>

            <p className="text-blue-200 text-sm leading-relaxed mb-10">
              Real-time production monitoring, intelligent logistics routing, and end-to-end traceability for green hydrogen operations.
            </p>

            <div className="space-y-4">
              {[
                {
                  label: 'Production Monitoring',
                  value: '6 active plants'
                },
                {
                  label: 'Active Shipments',
                  value: '3 in transit today'
                },
                {
                  label: 'Platform Uptime',
                  value: '99.97% SLA'
                }
              ].map(item => (
                <div
                  key={item.label}
                  className="flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />

                  <span className="text-blue-100 text-sm">
                    {item.label}
                  </span>

                  <span className="ml-auto text-white font-medium text-sm">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-blue-600">
            <p className="text-blue-300 text-xs">
              ISO 27001 Certified · SOC 2 Type II · GDPR Compliant
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>

              <span className="font-bold text-slate-900">
                HydrogenTrack
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Welcome back
            </h1>

            <p className="text-sm text-slate-500">
              Sign in to your account to continue
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <button className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-900"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-slate-300 text-blue-600"
                defaultChecked
              />

              <label
                htmlFor="remember"
                className="text-sm text-slate-600"
              >
                Remember me for 30 days
              </label>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-slate-500 mb-3 text-center">
              Quick demo access
            </p>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  onClick={() => {
                    setSelectedDemo(acc.role);
                    setEmail(acc.email);
                    setPassword('admin123');
                    setError('');
                  }}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    selectedDemo === acc.role
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium">
                    {acc.label}
                  </div>

                  <div className="text-slate-400 mt-0.5 text-[10px]">
                    {acc.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}