/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Maximize, Minimize } from "lucide-react";

/**
 * EXACT DATA from Alphabet Workers Union (AWU-CWA) Job Security Asks
 */
const STANDARDS = [
  {
    id: 1,
    title: "Severance as leave",
    status: "NEW AS OF 9/9/2025",
    workersSay: "When workers on visas are hit by surprise layoffs, they often have only a few months to find a new job.",
    fightFor: "Allow workers to take severance as an extension of paid garden leave instead of a lump-sum.",
  },
  {
    id: 2,
    title: "Voluntary layoffs",
    status: "VEPs offered to over 70,000 Googlers",
    workersSay: "When layoffs are necessary, Googlers that are ready to make a career change or retire can volunteer to be laid off.",
    fightFor: "Voluntary layoffs must be offered before performing involuntary layoffs. Buyouts must offer at least the guaranteed severance package.",
  },
  {
    id: 3,
    title: "Guaranteed severance",
    status: null,
    workersSay: "Since the layoff of 20,000 Googlers in 2023, severance packages have been slowly shrinking.",
    fightFor: "Every laid off worker must receive a guaranteed minimum severance package equal to the packages offered in January 2023.",
  },
  {
    id: 4,
    title: "No GRAD quotas",
    status: null,
    workersSay: "Each GRAD rating can only be given out to a set percentage of workers, a practice that is illegal in other countries Google operates in.",
    fightFor: "Ratings must be given based on performance and cannot be given or changed to achieve a forced distribution.",
  }
];

function SignatureCounter({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-center md:items-end">
      <div className="text-[clamp(4rem,14vh,9rem)] font-display font-black text-awu-red tracking-tighter tabular-nums leading-[0.9]">
        {value.toLocaleString()}
      </div>
      <div className="text-[clamp(1.1rem,3.5vh,2rem)] font-display font-black uppercase tracking-tight text-gray-900 mt-1">
        Googlers Have Signed
      </div>
    </div>
  );
}

export default function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleInactivity = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    // Initial timeout
    timeout = setTimeout(() => setShowControls(false), 3000);

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((name) => document.addEventListener(name, handleInactivity));

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      handleInactivity(); // Show controls on change
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      events.forEach((name) => document.removeEventListener(name, handleInactivity));
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      clearTimeout(timeout);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="h-screen bg-gray-50 font-sans text-[#222] flex flex-col antialiased overflow-hidden relative">
      {/* Fullscreen Toggle Button */}
      <motion.button
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 p-2 bg-white border-2 border-gray-200 rounded-full shadow-lg hover:border-awu-red hover:text-awu-red transition-all cursor-pointer"
        style={{ pointerEvents: showControls ? "auto" : "none" }}
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </motion.button>

      <main className="flex-grow max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col justify-center">
        {/* Enhanced Counter Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center md:items-end border-b border-gray-200 pb-6">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="font-display font-black italic text-gray-900 uppercase tracking-normal text-[clamp(2.1rem,6.8vh,4.8rem)] leading-[1.1]">
              Googlers For <br />
              Job Security
            </h1>
          </div>
          <SignatureCounter value={4065} />
        </div>

        {/* The Asks Section - Compact 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STANDARDS.map((std) => (
            <div 
              key={std.id}
              className="bg-white border-2 border-gray-200 p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="mb-6">
                <h3 className="font-display font-black text-2xl text-gray-900 mb-1 uppercase tracking-normal">
                  {std.title}
                </h3>
                {std.status && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-awu-red">
                    {std.status}
                  </span>
                )}
              </div>

              <div className="space-y-6">
                <div className="pl-6 border-l-2 border-gray-200">
                  <p className="text-gray-600 text-base leading-relaxed">
                    "{std.workersSay}"
                  </p>
                </div>

                <div className="pl-6 border-l-4 border-awu-red bg-red-50/20 py-4 pr-6">
                  <p className="text-gray-900 font-bold text-lg leading-tight">
                    {std.fightFor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}




