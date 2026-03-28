export default function Campo({ label, value, mono = false }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className={mono ? "break-all font-mono text-sm" : "text-sm"}>
        {value}
      </div>
    </div>
  );
}