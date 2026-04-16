import { RefreshCw } from "lucide-react";

interface TableSkeletonProps {
  columns: Array<{ width: string }>;
  rows?: number;
  showHeader?: boolean;
}

export function TableSkeleton({ columns, rows = 5, showHeader = true }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto" role="status" aria-label="Loading">
      <table className="w-full text-sm">
        {showHeader && (
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <div className={`animate-pulse h-3 bg-gray-200 rounded ${col.width}`} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-4 py-3">
                  <div
                    className={`animate-pulse h-4 bg-gray-200 rounded ${col.width}`}
                    style={{ animationDelay: `${rowIdx * 75}ms` }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface StatCardSkeletonProps {
  count?: number;
}

export function StatCardSkeleton({ count = 4 }: StatCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
          <div className="animate-pulse space-y-3" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-200 rounded-lg" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        </div>
      ))}
    </>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading">
      <div className="animate-pulse h-4 bg-gray-200 rounded w-28" />
      <div className="flex items-center gap-3">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48" />
        <div className="animate-pulse h-6 bg-gray-200 rounded-full w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="animate-pulse h-5 bg-gray-200 rounded w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex justify-between" style={{ animationDelay: `${i * 75}ms` }}>
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="animate-pulse h-5 bg-gray-200 rounded w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex justify-between" style={{ animationDelay: `${i * 75}ms` }}>
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="animate-pulse h-5 bg-gray-200 rounded w-28" />
        <div className="animate-pulse h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorBanner({ message, onRetry, className = "" }: ErrorBannerProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between gap-4 ${className}`}>
      <span className="text-red-700 text-sm">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}

