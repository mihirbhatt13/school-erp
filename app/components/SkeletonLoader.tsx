"use client";

export function TableSkeletonRows({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="p-4">
              <div className="h-4 bg-slate-200 rounded-md w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardSkeletonGrid({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: cards }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="w-12 h-3 bg-slate-200 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded-md w-1/2" />
            <div className="h-7 bg-slate-200 rounded-md w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
