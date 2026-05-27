export default function Section({ label, children }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] text-bucket-accent uppercase tracking-[2px] font-semibold mb-3">
        {label}
      </div>
      {children}
    </div>
  );
}
