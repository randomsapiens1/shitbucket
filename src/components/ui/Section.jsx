export default function Section({ label, children, onCopy, isCopied }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[calc((10/12)*var(--base-font-size))] font-extrabold uppercase tracking-[0.15em] text-black">
          {label}
        </p>
        {onCopy && (
          <button
            onClick={onCopy}
            title={`Copy ${label} for AI`}
            className={`flex items-center justify-center w-8 h-8 transition-all active:scale-90 ${
              isCopied ? "text-[#CAFF00]" : "text-[#FF6A00] opacity-50 hover:opacity-100"
            }`}
          >
            {isCopied ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="bg-white border-2 border-black rounded-2xl shadow-hard p-4">
        {children}
      </div>
    </div>
  );
}
