export default function Section({ label, children }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-black mb-2">
        {label}
      </p>
      <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4">
        {children}
      </div>
    </div>
  );
}
