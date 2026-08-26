/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Maximize, Minimize, MonitorPlay, ArrowUp } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAfxhqyWxWI20dyK0JwrTTNml2Ir1btmpk",
  authDomain: "g4js-signer-count.firebaseapp.com",
  databaseURL: "https://g4js-signer-count-default-rtdb.firebaseio.com",
  projectId: "g4js-signer-count",
  storageBucket: "g4js-signer-count.firebasestorage.app",
  messagingSenderId: "1003923953911",
  appId: "1:1003923953911:web:97c7001a7c6c9d11c45bf2",
  measurementId: "G-MWYJ0LRJVK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
      <div className="font-display font-black text-awu-red tracking-tighter tabular-nums leading-[0.9]" style={{ fontSize: 'clamp(3rem, 12dvh, 9rem)' }}>
        {value.toLocaleString()}
      </div>
      <div className="font-display font-black uppercase tracking-tight text-gray-900 mt-1" style={{ fontSize: 'clamp(0.9rem, 3dvh, 2rem)' }}>
        Googlers Have Signed
      </div>
    </div>
  );
}

export default function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [mode, setMode] = useState<'info' | 'cta'>('info');
  const HARDCODED_COUNT = 4431;
  const [firebaseCount, setFirebaseCount] = useState(0);

  const signatureCount = Math.max(HARDCODED_COUNT, firebaseCount);

  // Firebase Realtime Database Listener for total signatures
  useEffect(() => {
    const countRef = ref(db, 'manualCount');
    const unsubscribe = onValue(countRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Firebase data received:", typeof data, data);
      
      if (data !== null) {
        // Handle both numbers and string numbers ("150")
        const parsed = typeof data === 'number' ? data : parseInt(data, 10);
        if (!isNaN(parsed)) {
          setFirebaseCount(parsed);
        }
      }
    }, (error) => {
      console.error("Firebase permission/read error:", error);
    });
    return () => unsubscribe();
  }, []);

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') {
        setMode(prev => prev === 'info' ? 'cta' : 'info');
        handleInactivity();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      events.forEach((name) => document.removeEventListener(name, handleInactivity));
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
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
    <div className="bg-gray-50 font-sans text-[#222] flex flex-col antialiased overflow-hidden relative" style={{ height: '100dvh' }}>
      {/* Mode Toggle Button */}
      <motion.button
        initial={{ opacity: 1 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => setMode(prev => prev === 'info' ? 'cta' : 'info')}
        className="fixed top-4 right-20 z-50 p-2 bg-white border-2 border-gray-200 rounded-full shadow-lg hover:border-awu-red hover:text-awu-red transition-all cursor-pointer"
        style={{ pointerEvents: showControls ? "auto" : "none" }}
        title="Toggle CTA Mode (Press M)"
      >
        <MonitorPlay className="w-5 h-5" />
      </motion.button>

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

      <main className="flex-grow max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center" style={{ paddingTop: '2dvh', paddingBottom: '2dvh', width: '100%' }}>
        {mode === 'info' ? (
          <>
            {/* Enhanced Counter Section */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-gray-200" style={{ marginBottom: '2dvh', paddingBottom: '1.5dvh' }}>
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <h1 className="font-anton font-black italic text-gray-900 uppercase tracking-normal leading-[1.1] inline-block scale-x-[1.22] origin-left" style={{ fontSize: 'clamp(2rem, 7dvh, 5.5rem)' }}>
                  Googlers For <br />
                  Job Security
                </h1>
              </div>
              <SignatureCounter value={signatureCount} />
            </div>

            {/* The Asks Section - Compact 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5dvh' }}>
              {STANDARDS.map((std) => (
                <div 
                  key={std.id}
                  className="bg-white border-2 border-gray-200 shadow-sm flex flex-col justify-between"
                  style={{ padding: 'clamp(0.75rem, 2dvh, 1.5rem)' }}
                >
                  <div style={{ marginBottom: 'clamp(0.5rem, 1.5dvh, 1.5rem)' }}>
                    <h3 className="font-display font-black text-gray-900 uppercase tracking-normal" style={{ fontSize: 'clamp(1.5rem, 4dvh, 2.5rem)', marginBottom: '0.25rem' }}>
                      {std.title}
                    </h3>
                    {std.status && (
                      <span className="text-[12px] md:text-sm font-bold uppercase tracking-widest text-awu-red">
                        {std.status}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col" style={{ gap: 'clamp(0.5rem, 1.5dvh, 1.5rem)' }}>
                    <div className="flex-1 flex flex-col justify-center pl-6 border-l-4 border-awu-red bg-red-50/20 pr-6" style={{ paddingTop: 'clamp(0.75rem, 1.5dvh, 1.5rem)', paddingBottom: 'clamp(0.75rem, 1.5dvh, 1.5rem)' }}>
                      <p className="text-gray-900 leading-tight" style={{ fontSize: 'clamp(1rem, 2.5dvh, 1.5rem)' }}>
                        {std.fightFor}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
            <div className="mb-12">
              <div className="font-display font-black text-awu-red tracking-tighter tabular-nums leading-[0.9]" style={{ fontSize: 'clamp(6rem, 25dvh, 20rem)' }}>
                {signatureCount.toLocaleString()}
              </div>
              <div className="font-display font-black uppercase tracking-tight text-gray-900 mt-2" style={{ fontSize: 'clamp(2rem, 6dvh, 4rem)' }}>
                Googlers Have Signed
              </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <h2 className="font-anton font-black text-gray-900 uppercase tracking-normal leading-[1.1] inline-block scale-x-[1.22]" style={{ fontSize: 'clamp(3.5rem, 12dvh, 8rem)' }}>
                SIGN THE PETITION
              </h2>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
