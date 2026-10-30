import { Bell } from 'lucide-react';

export default function CarAlertBanner({ onOpenAlertModal }) {
  return (
    <div className="rounded-xl border border-white/80 bg-white/95 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#092340] to-[#2F80ED] flex items-center justify-center text-white shrink-0 shadow-md">
          <Bell size={18} />
        </div>

        <div>
          <strong className="block text-sm font-bold text-[#092340] leading-tight">
            Can't find what you're looking for?
          </strong>
          <span className="block text-xs text-slate-600 leading-tight mt-1">
            Set an alert and we'll notify you when a matching car is listed.
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenAlertModal}
        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#092340] via-[#103E70] to-[#2F80ED] hover:from-[#0B2E54] hover:to-[#256DD6] text-white font-bold text-xs rounded-lg shadow-md cursor-pointer transition hover:-translate-y-0.5 shrink-0"
        aria-label="Set car listing alert"
      >
        <Bell size={13} className="text-white" />
        <span>Set Alert</span>
      </button>
    </div>
  );
}
