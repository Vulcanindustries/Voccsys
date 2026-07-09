import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-testid="site-footer" className="dark-block border-t border-[#40453F] bg-[#2D3130] text-[#F2F1ED]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-6 bg-[#C85A17]" />
              <span className="font-display font-black tracking-[-0.04em] text-2xl text-white">
                VOCCSYS
              </span>
            </div>
            <p className="mt-4 text-sm text-[#B8B9B4] max-w-md leading-relaxed">
              Vulcan Online Condenser Cleaning System. Engineered &amp; manufactured by Vulcan
              Industries India — advancing continuous condenser performance since decades.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="overline mb-4">Explore</div>
            <ul className="space-y-2 text-sm text-[#F2F1ED]">
              <li><a href="#overview" className="hover:text-[#C85A17] transition-colors">The system</a></li>
              <li><a href="#process" className="hover:text-[#C85A17] transition-colors">How it works</a></li>
              <li><a href="#benefits" className="hover:text-[#C85A17] transition-colors">ROI &amp; Benefits</a></li>
              <li><a href="#specs" className="hover:text-[#C85A17] transition-colors">Technical specs</a></li>
              <li><a href="#industries" className="hover:text-[#C85A17] transition-colors">Industries served</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="overline mb-4">Contact</div>
            <ul className="space-y-2 text-sm text-[#F2F1ED]">
              <li>
                <a
                  href="mailto:contactus@vulcanindustriesindia.com"
                  className="hover:text-[#C85A17] transition-colors break-all"
                >
                  contactus@vulcanindustriesindia.com
                </a>
              </li>
              <li>Vulcan Industries India</li>
            </ul>
          </div>
        </div>

        <div className="dashed-divider my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-[#8A8E8C]">
          <div className="font-mono">© {year} Vulcan Industries India · All rights reserved.</div>
          <div className="flex items-center gap-6 font-mono">
            <span>VOCCSYS™</span>
            <span>Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
