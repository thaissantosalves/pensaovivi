export function AdminField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--text)] mb-0.5">
        {label}
      </label>
      {hint && (
        <p className="text-[11px] text-[var(--text-muted)] mb-1.5">{hint}</p>
      )}
      {children}
    </div>
  );
}
