import { Loader2, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-80 gap-4 p-8">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
        <Loader2 size={28} className="text-blue-500 animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700">Loading data...</p>
        <p className="text-xs text-slate-400 mt-1">Fetching latest hydrogen supply chain information</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action, onAction }: {
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-80 gap-4 p-8">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
        <Package size={30} className="text-slate-300" />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
      {action && onAction && (
        <Button size="sm" onClick={onAction}>{action}</Button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-80 gap-4 p-8">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-sm font-semibold text-slate-700">Something went wrong</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          {message ?? 'Unable to load data. Please check your connection and try again.'}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw size={13} />Try Again
        </Button>
      )}
    </div>
  );
}

export default function StatesDemo() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl fade-in">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">UI State Components</h1>
        <p className="text-sm text-slate-500 mt-0.5">Loading, empty, and error state patterns</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Loading State</h3>
          </div>
          <LoadingState />
        </div>
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Empty State</h3>
          </div>
          <EmptyState
            title="No shipments found"
            description="No shipments match your current filters. Try adjusting your search criteria or create a new shipment."
            action="Create Shipment"
            onAction={() => {}}
          />
        </div>
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Error State</h3>
          </div>
          <ErrorState
            message="Failed to connect to the H₂ monitoring service. The service may be temporarily unavailable."
            onRetry={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
