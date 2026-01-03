
import React, { useState, useRef, useEffect } from 'react';

interface PitchViewProps {
  onPitchSelect: (x: number, y: number) => void;
  selectedPitch: { x: number, y: number } | null;
  isDelivering: boolean;
  deliveryResult: any;
}

const PitchView: React.FC<PitchViewProps> = ({ onPitchSelect, selectedPitch, isDelivering, deliveryResult }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ballPos, setBallPos] = useState({ x: 50, y: 100 }); // Start at bowler end

  useEffect(() => {
    if (isDelivering && selectedPitch) {
      // Animate ball from bowler end to pitch location, then to batsman
      setBallPos({ x: 50, y: 100 });
      const timer = setTimeout(() => {
        setBallPos({ x: selectedPitch.x, y: selectedPitch.y });
        const timer2 = setTimeout(() => {
          // Move towards the "camera" (batsman end)
          setBallPos(prev => ({ ...prev, y: -20 }));
        }, 500);
        return () => clearTimeout(timer2);
      }, 50);
      return () => clearTimeout(timer);
    } else {
        setBallPos({ x: 50, y: 100 });
    }
  }, [isDelivering, selectedPitch]);

  const handleClick = (e: React.MouseEvent) => {
    if (isDelivering) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onPitchSelect(x, y);
  };

  return (
    <div className="relative w-full max-w-2xl aspect-[1/2] bg-slate-900/50 rounded-xl overflow-hidden border border-cyan-500/30 shadow-2xl pitch-perspective">
      {/* Pitch Surface */}
      <div 
        ref={containerRef}
        onClick={handleClick}
        className="absolute inset-x-10 inset-y-4 bg-[#b4916c] shadow-inner cursor-crosshair group"
        style={{
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
        }}
      >
        {/* Pitch markings */}
        <div className="absolute top-[10%] w-full h-1 bg-white/40"></div>
        <div className="absolute bottom-[10%] w-full h-1 bg-white/40"></div>
        
        {/* Stumps Visualization */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-1 items-end">
            <div className="w-1 h-8 bg-orange-400"></div>
            <div className="w-1 h-8 bg-orange-400"></div>
            <div className="w-1 h-8 bg-orange-400"></div>
        </div>

        {/* Selected Pitch Target */}
        {selectedPitch && (
          <div 
            className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-cyan-400 animate-pulse bg-cyan-400/20"
            style={{ left: `${selectedPitch.x}%`, top: `${selectedPitch.y}%` }}
          />
        )}

        {/* The Ball */}
        <div 
          className={`absolute w-4 h-4 rounded-full bg-red-600 shadow-lg border border-red-400 transition-all duration-500 ease-out ${isDelivering ? 'opacity-100 scale-125' : 'opacity-0 scale-50'}`}
          style={{ 
            left: `${ballPos.x}%`, 
            top: `${ballPos.y}%`,
            boxShadow: '0 0 15px rgba(255,0,0,0.5)'
          }}
        />

        {/* Pitch helper lines */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white"></div>
        </div>
      </div>

      {/* Info Overlays */}
      <div className="absolute top-4 left-4 text-xs text-cyan-400 font-orbitron bg-black/50 p-2 rounded">
        PITCH SELECTOR: CLICK TO TARGET
      </div>
      
      {deliveryResult && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-cyan-500 text-black px-8 py-4 rounded-lg font-orbitron text-4xl transform scale-150 animate-bounce shadow-[0_0_30px_#06b6d4]">
                {deliveryResult.wicket ? 'WICKET!' : deliveryResult.runs === 0 ? 'DOT BALL' : `${deliveryResult.runs} RUNS`}
            </div>
        </div>
      )}
    </div>
  );
};

export default PitchView;
