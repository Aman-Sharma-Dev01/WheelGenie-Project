export default function LoadingSpinner({ size = 'default', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    default: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.default} border-slate-200 border-t-wg-blue rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <span className="text-xs font-medium text-slate-500">{text}</span>}
    </div>
  );
}
