"use client";

export default function ManifestoWindow({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#FFF8EE] border-4 border-black shadow-hard-lg rounded-[2px] pointer-events-auto overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF6A00]" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
            </div>
            <span className="font-black text-[calc((12/12)*var(--base-font-size))] uppercase tracking-widest">
              why_is_it_called_this.txt
            </span>
          </div>
          <button onClick={onClose} className="hover:text-[#FF6A00] transition-colors font-black text-xl leading-none">×</button>
        </div>

        <div className="p-8 sm:p-12 max-h-[80vh] overflow-y-auto">
          <h2 className="text-[calc((48/12)*var(--base-font-size))] font-black leading-[0.85] tracking-tighter uppercase mb-12">
            Relax. It&apos;s a note, <br />
            <span className="text-[#FF6A00]">not a tax form.</span>
          </h2>

          <div className="space-y-12">
            <div className="grid sm:grid-cols-[100px_1fr] gap-4">
              <span className="text-[calc((14/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase">The Vibe</span>
              <div>
                <h3 className="text-[calc((20/12)*var(--base-font-size))] font-black uppercase mb-3">A bucket for unfinished things.</h3>
                <p className="text-[calc((15/12)*var(--base-font-size))] font-bold leading-relaxed text-black/70">
                  That thing you remembered in the shower. That startup you&apos;ll definitely build someday. 
                  That tab you&apos;ve kept open for three months. If it doesn&apos;t have a home yet, 
                  <span className="text-black"> throw it in the bucket.</span>
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-[100px_1fr] gap-4">
              <span className="text-[calc((14/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase">The Pain</span>
              <div>
                <h3 className="text-[calc((20/12)*var(--base-font-size))] font-black uppercase mb-3">No more questions.</h3>
                <p className="text-[calc((15/12)*var(--base-font-size))] font-bold leading-relaxed text-black/70">
                  Most apps start asking questions immediately. What project? What category? 
                  What priority? <span className="text-black">ShitBucket doesn&apos;t care.</span> 
                  Write it down before it disappears. We&apos;ll deal with the "what" later.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-[100px_1fr] gap-4">
              <span className="text-[calc((14/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase">The Name</span>
              <div>
                <h3 className="text-[calc((20/12)*var(--base-font-size))] font-black uppercase mb-3">Why the name?</h3>
                <p className="text-[calc((15/12)*var(--base-font-size))] font-bold leading-relaxed text-black/70">
                  Because that&apos;s exactly what it is. A bucket. For your stuff. 
                  Important stuff. Stupid stuff. Brilliant stuff. Everything goes into the same bucket. 
                  <span className="text-black"> No judgement.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t-2 border-black/10">
            <button 
              onClick={onClose}
              className="w-full bg-black text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] shadow-hard hover:bg-[#FF6A00] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              Start Dumping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
