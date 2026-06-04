export default function WhyShitBucket() {
  return (
    <div className="flex flex-col h-full bg-[#FFF8EE] p-4 sm:p-8">
      <h2 className="text-[calc((42/12)*var(--base-font-size))] font-black leading-[0.85] tracking-tighter uppercase mb-10 text-black">
        Why <br />
        <span className="text-[#FF6A00]">Shitbucket?</span>
      </h2>

      <div className="space-y-10">
        {/* Point 1 */}
        <div className="grid sm:grid-cols-[80px_1fr] gap-4">
          <span className="text-[calc((12/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase pt-1">01 / Speed</span>
          <div>
            <h3 className="text-[calc((18/12)*var(--base-font-size))] font-black uppercase mb-2 text-black">Capture is Priority.</h3>
            <p className="text-[calc((13/12)*var(--base-font-size))] font-bold leading-relaxed text-black/60">
              Most ideas die because the friction of recording them is too high. 
              Shitbucket is built to capture raw thoughts in <span className="text-black font-black">under 5 seconds</span>. 
              Don't organize. Just dump.
            </p>
          </div>
        </div>

        {/* Point 2 */}
        <div className="grid sm:grid-cols-[80px_1fr] gap-4">
          <span className="text-[calc((12/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase pt-1">02 / Brew</span>
          <div>
            <h3 className="text-[calc((18/12)*var(--base-font-size))] font-black uppercase mb-2 text-black">Let it Sit.</h3>
            <p className="text-[calc((13/12)*var(--base-font-size))] font-bold leading-relaxed text-black/60">
              A good idea needs time to sit. Our <span className="text-black font-black">Brew Progress</span> system 
              rewards you for returning to your thoughts, adding context, and letting them mature 
              from "Raw" to "Gold."
            </p>
          </div>
        </div>

        {/* Point 3 */}
        <div className="grid sm:grid-cols-[80px_1fr] gap-4">
          <span className="text-[calc((12/12)*var(--base-font-size))] font-black text-[#FF6A00] uppercase pt-1">03 / Filter</span>
          <div>
            <h3 className="text-[calc((18/12)*var(--base-font-size))] font-black uppercase mb-2 text-black">Manual Selection.</h3>
            <p className="text-[calc((13/12)*var(--base-font-size))] font-bold leading-relaxed text-black/60">
              Folders are where ideas go to be forgotten. Shitbucket is a single, 
              unfiltered "Pile." If it's important, you'll find it. If it's shit, let it expire.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t-2 border-black/10 text-center">
        <div className="inline-block bg-[#FF6A00] text-white font-black px-6 py-3 rounded-xl border-2 border-black shadow-hard-sm uppercase tracking-widest text-[calc((11/12)*var(--base-font-size))]">
          Ideas first. Organization later.
        </div>
      </div>
    </div>
  );
}
