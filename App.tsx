
import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Team, BallType, BowlingDelivery, MatchState, BallResult } from './types';
import { TEAMS, STADIUMS } from './constants';
import { getBatsmanReaction, getMatchStrategy } from './services/geminiService';
import PitchView from './components/PitchView';
import BowlingControls from './components/BowlingControls';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'home' | 'modes' | 'setup' | 'gameplay'>('home');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [matchTeams, setMatchTeams] = useState<{ user: Team; ai: Team }>({ user: TEAMS[0], ai: TEAMS[1] });
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [currentDelivery, setCurrentDelivery] = useState<BowlingDelivery>({
    type: BallType.OUTSWING,
    speed: 140,
    pitchX: 50,
    pitchY: 85,
    swing: 0
  });
  const [isDelivering, setIsDelivering] = useState(false);
  const [lastResult, setLastResult] = useState<BallResult | null>(null);
  const [strategy, setStrategy] = useState<string | null>(null);

  const startMatch = () => {
    setMatchState({
      overs: 5, // Default for demo
      target: 85,
      currentScore: 0,
      wickets: 0,
      currentOver: 0,
      ballsInOver: 0,
      battingTeam: matchTeams.ai,
      bowlingTeam: matchTeams.user,
      history: []
    });
    setScreen('gameplay');
    
    // Get AI strategy from Gemini
    getMatchStrategy(matchTeams.user, matchTeams.ai, 'T20').then(setStrategy);
  };

  const handleDeliver = async () => {
    if (!matchState) return;
    setIsDelivering(true);
    setLastResult(null);

    // AI Batsman decides reaction via Gemini
    const result = await getBatsmanReaction(
      currentDelivery,
      matchTeams.ai.players[0], // Simplified: always first player
      matchTeams.user.players[2], // Simplified: always 3rd player (bowler)
      { 
        score: matchState.currentScore, 
        wickets: matchState.wickets, 
        overs: `${matchState.currentOver}.${matchState.ballsInOver}`,
        target: matchState.target 
      }
    );

    // Wait for animation
    setTimeout(() => {
      setLastResult(result);
      setIsDelivering(false);

      setMatchState(prev => {
        if (!prev) return null;
        let newScore = prev.currentScore + result.runs;
        let newWickets = prev.wickets + (result.wicket ? 1 : 0);
        let newBalls = prev.ballsInOver + 1;
        let newOvers = prev.currentOver;

        if (newBalls === 6) {
          newBalls = 0;
          newOvers += 1;
        }

        return {
          ...prev,
          currentScore: newScore,
          wickets: newWickets,
          currentOver: newOvers,
          ballsInOver: newBalls,
          history: [...prev.history, result]
        };
      });
    }, 1500);
  };

  const renderHome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('https://picsum.photos/id/122/1600/900')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      <div className="relative z-10 text-center space-y-8 max-w-4xl">
        <h1 className="text-7xl md:text-9xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
          PRO CRICKET
          <span className="block text-3xl md:text-5xl tracking-[1rem] md:tracking-[2rem] mt-2 text-white/80">SIMULATOR 2026</span>
        </h1>
        <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto italic">
          Experience the next generation of cricket simulation powered by advanced AI and physics.
        </p>
        <button 
          onClick={() => setScreen('modes')}
          className="group relative inline-flex items-center justify-center px-12 py-5 font-orbitron font-bold text-white transition-all bg-cyan-600 rounded-full hover:bg-cyan-500 active:scale-95 shadow-[0_0_40px_rgba(6,182,212,0.3)]"
        >
          <span className="relative">ENTER STADIUM</span>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-pulse-neon -m-1"></div>
        </button>
      </div>
    </div>
  );

  const renderModes = () => (
    <div className="min-h-screen bg-slate-950 p-8 pt-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-orbitron text-cyan-400 mb-12 border-l-4 border-cyan-500 pl-4">SELECT GAME MODE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(GameMode).map((mode) => (
            <div 
              key={mode}
              onClick={() => { setSelectedMode(mode); setScreen('setup'); }}
              className="group relative h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              <img src={`https://picsum.photos/seed/${mode}/600/400`} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" alt={mode} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-3xl font-orbitron text-white group-hover:text-cyan-400 transition-colors">{mode}</h3>
                <p className="text-slate-400 text-sm mt-1">Professional competitive match experience</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="min-h-screen bg-slate-950 p-8 pt-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex justify-between items-center">
            <h2 className="text-4xl font-orbitron text-cyan-400">MATCH SETUP</h2>
            <div className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded border border-cyan-500/20 font-orbitron">{selectedMode}</div>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Team Selection */}
          <div className="space-y-6">
            <h3 className="text-xl text-slate-400 uppercase tracking-widest font-orbitron">Choose Your Team</h3>
            <div className="space-y-4">
              {TEAMS.slice(0, 4).map(team => (
                <button 
                  key={team.id}
                  onClick={() => setMatchTeams(prev => ({ ...prev, user: team }))}
                  className={`w-full flex items-center p-4 rounded-xl border transition-all ${matchTeams.user.id === team.id ? 'bg-cyan-600 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-3xl mr-4">{team.logo}</span>
                  <div className="text-left">
                    <div className="font-bold text-white">{team.name}</div>
                    <div className="text-xs text-slate-400">{team.shortName} • Elite Rank</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Opponent Selection */}
          <div className="space-y-6 opacity-80">
            <h3 className="text-xl text-slate-400 uppercase tracking-widest font-orbitron">AI Opponent</h3>
            <div className="space-y-4">
              {TEAMS.slice(0, 4).map(team => (
                <button 
                  key={team.id}
                  onClick={() => setMatchTeams(prev => ({ ...prev, ai: team }))}
                  className={`w-full flex items-center p-4 rounded-xl border transition-all ${matchTeams.ai.id === team.id ? 'bg-red-900/40 border-red-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                >
                  <span className="text-3xl mr-4">{team.logo}</span>
                  <div className="text-left">
                    <div className="font-bold text-white">{team.name}</div>
                    <div className="text-xs text-slate-400">{team.shortName} • Hard Difficulty</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={startMatch}
          className="w-full py-6 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl font-orbitron text-2xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-transform"
        >
          START MATCH
        </button>
      </div>
    </div>
  );

  const renderGameplay = () => {
    if (!matchState) return null;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row p-4 lg:p-8 gap-8 overflow-hidden">
        {/* Left Side: Pitch View */}
        <div className="flex-grow flex flex-col items-center justify-center space-y-6">
          <PitchView 
            onPitchSelect={(x, y) => !isDelivering && setCurrentDelivery(prev => ({ ...prev, pitchX: x, pitchY: y }))}
            selectedPitch={{ x: currentDelivery.pitchX, y: currentDelivery.pitchY }}
            isDelivering={isDelivering}
            deliveryResult={lastResult}
          />
          
          <div className="w-full max-w-2xl bg-slate-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Live Commentary</div>
            <p className="text-slate-300 font-medium h-12">
              {lastResult ? lastResult.commentary : strategy ? strategy : "Ready for the next delivery..."}
            </p>
          </div>
        </div>

        {/* Right Side: Scoreboard and Controls */}
        <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
          {/* Scoreboard */}
          <div className="bg-slate-900 p-6 rounded-2xl border-t-4 border-cyan-500 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm text-slate-400 font-orbitron uppercase tracking-widest">Innings 1</h3>
                <div className="text-4xl font-orbitron font-bold text-white mt-1">
                  {matchState.currentScore} / {matchState.wickets}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-orbitron uppercase">Overs</div>
                <div className="text-2xl font-orbitron text-cyan-400">{matchState.currentOver}.{matchState.ballsInOver}</div>
              </div>
            </div>

            <div className="h-px bg-slate-800"></div>

            <div className="flex justify-between text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {matchState.battingTeam.shortName}
              </div>
              <div>Target: {matchState.target}</div>
            </div>

            {/* Ball History */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {matchState.history.slice(-6).map((h, i) => (
                <div 
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    h.wicket ? 'bg-red-600 text-white' : h.runs === 4 || h.runs === 6 ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {h.wicket ? 'W' : h.runs}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 6 - (matchState.ballsInOver || 6)) }).map((_, i) => (
                <div key={`empty-${i}`} className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center shrink-0"></div>
              ))}
            </div>
          </div>

          <BowlingControls 
            delivery={currentDelivery}
            onChange={(updates) => setCurrentDelivery(prev => ({ ...prev, ...updates }))}
            onDeliver={handleDeliver}
            disabled={isDelivering}
          />

          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/30 overflow-hidden">
                <img src="https://picsum.photos/id/64/40/40" alt="Bowler" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-orbitron">BOWLING</div>
                <div className="text-sm font-bold text-white">J. Bumrah</div>
              </div>
            </div>
            <button 
              onClick={() => setScreen('home')}
              className="text-xs text-slate-500 hover:text-white uppercase tracking-tighter"
            >
              Quit Match
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-cyan-500/30">
      {screen === 'home' && renderHome()}
      {screen === 'modes' && renderModes()}
      {screen === 'setup' && renderSetup()}
      {screen === 'gameplay' && renderGameplay()}
    </div>
  );
};

export default App;
