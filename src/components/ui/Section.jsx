export default function Section({ label, children }) {
  return (
    <div className="mb-5">
      <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.15em] text-black mb-2">
        {label}
      </p>
      <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4">
        {children}
      </div>
    </div>
  );
}
