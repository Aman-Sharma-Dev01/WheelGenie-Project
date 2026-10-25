import { Bell } from 'lucide-react';

export default function CarAlertBanner({ onOpenAlertModal }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 shadow-2xs">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-[#155DFC] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Bell size={18} />
        </div>

        <div>
          <strong className="block text-sm font-bold text-slate-900 leading-tight">
            Can't find what you're looking for?
          </strong>
          <span className="block text-xs text-slate-500 leading-tight mt-1">
            Set an alert and we'll notify you when a matching car is listed.
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenAlertModal}
        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs rounded-lg shadow-2xs hover:bg-slate-50 transition cursor-pointer shrink-0"
        aria-label="Set car listing alert"
      >
        <Bell size={13} className="text-[#155DFC]" />
        <span>Set Alert</span>
      </button>
    </div>
  );
}
