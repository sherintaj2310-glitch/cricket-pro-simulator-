
import React from 'react';
import { BallType, BowlingDelivery } from '../types';
import { BALL_VARIATIONS } from '../constants';

interface BowlingControlsProps {
  delivery: BowlingDelivery;
  onChange: (updates: Partial<BowlingDelivery>) => void;
  onDeliver: () => void;
  disabled: boolean;
}

const BowlingControls: React.FC<BowlingControlsProps> = ({ delivery, onChange, onDeliver, disabled }) => {
  return (
    <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-md space-y-6">
      <h3 className="text-xl font-orbitron text-cyan-400 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
        BOWLING ENGINE
      </h3>

      {/* Ball Variations */}
      <div>
        <label className="block text-xs uppercase text-slate-400 mb-2 tracking-widest">Variation</label>
        <div className="grid grid-cols-3 gap-2">
          {BALL_VARIATIONS.map((type) => (
            <button
              key={type}
              onClick={() => onChange({ type })}
              disabled={disabled}
              className={`py-2 text-[10px] rounded border transition-all ${
                delivery.type === type 
                ? 'bg-cyan-500 border-cyan-500 text-black font-bold' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-500/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Speed Slider */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase tracking-widest">
          <span>Speed</span>
          <span className="text-cyan-400 font-orbitron">{delivery.speed} km/h</span>
        </div>
        <input 
          type="range" min="110" max="160" 
          value={delivery.speed}
          onChange={(e) => onChange({ speed: parseInt(e.target.value) })}
          disabled={disabled}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Swing Slider */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase tracking-widest">
          <span>Swing / Spin</span>
          <span className="text-cyan-400 font-orbitron">{delivery.swing > 0 ? `+${delivery.swing}` : delivery.swing}</span>
        </div>
        <input 
          type="range" min="-10" max="10" 
          value={delivery.swing}
          onChange={(e) => onChange({ swing: parseInt(e.target.value) })}
          disabled={disabled}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Deliver Button */}
      <button
        onClick={onDeliver}
        disabled={disabled}
        className={`w-full py-4 rounded-xl font-orbitron text-xl tracking-widest transition-all ${
          disabled 
          ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
          : 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
        }`}
      >
        {disabled ? 'DELIVERING...' : 'DELIVER BALL'}
      </button>
    </div>
  );
};

export default BowlingControls;
