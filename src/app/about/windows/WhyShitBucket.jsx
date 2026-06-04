export default function WhyShitBucket() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8EE] p-4 sm:p-8">
      <h2 className="text-[calc((42/12)*var(--base-font-size))] font-black leading-[0.85] tracking-tighter uppercase mb-10 text-black">
        A bucket for <br />
        <span className="text-[#FF6A00]">unfinished things.</span>
      </h2>

      <div className="space-y-10">
        <div className="grid sm:grid-cols-[80px_1fr] gap-4">
          <span className="text-[calc((12/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase pt-1">01 / Ideas</span>
          <div>
            <h3 className="text-[calc((18/12)*var(--base-font-size))] font-black uppercase mb-2 text-black">Shower thoughts.</h3>
            <p className="text-[calc((13/12)*var(--base-font-size))] font-bold leading-relaxed text-black/60">
              That startup you&apos;ll build "someday." That grocery list you keep losing. 
              The stuff that doesn&apos;t have a home yet.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-[80px_1fr] gap-4">
          <span className="text-[calc((12/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase pt-1">02 / Tabs</span>
          <div>
            <h3 className="text-[calc((18/12)*var(--base-font-size))] font-black uppercase mb-2 text-black">Close the browser.</h3>
            <p className="text-[calc((13/12)*var(--base-font-size))] font-bold leading-relaxed text-black/60">
              For that tab you&apos;ve kept open for three months because you might need it. 
              Dump the link and breathe.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-[80px_1fr] gap-4">
          <span className="text-[calc((12/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase pt-1">03 / Peace</span>
          <div>
            <h3 className="text-[calc((18/12)*var(--base-font-size))] font-black uppercase mb-2 text-black">Offload your brain.</h3>
            <p className="text-[calc((13/12)*var(--base-font-size))] font-bold leading-relaxed text-black/60">
              Because your brain has better things to do than remember everything. 
              Commit to the mess. Offload to the bucket.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t-2 border-black/10 text-center">
        <div className="inline-block bg-[#FF6A00] text-white font-black px-6 py-3 rounded-xl border-2 border-black shadow-hard-sm uppercase tracking-widest text-[calc((11/12)*var(--base-font-size))]">
          Note, not a tax form.
        </div>
      </div>
    </div>
  );
}
