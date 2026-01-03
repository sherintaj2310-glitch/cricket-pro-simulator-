
export enum GameMode {
  T20 = 'T20',
  ODI = 'ODI',
  TEST = 'TEST',
  IPL = 'IPL',
  CAREER = 'CAREER'
}

export enum BallType {
  OUTSWING = 'Outswing',
  INSWING = 'Inswing',
  SLOWER = 'Slower Ball',
  OFF_CUTTER = 'Off Cutter',
  LEG_CUTTER = 'Leg Cutter',
  DOOSRA = 'Doosra',
  OFF_SPIN = 'Off Spin',
  LEG_SPIN = 'Leg Spin',
  GOOGLY = 'Googly'
}

export interface PlayerStats {
  runs: number;
  wickets: number;
  average: number;
  strikeRate: number;
}

export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicketkeeper';
  battingStyle: string;
  bowlingStyle: string;
  rating: number;
  stats: PlayerStats;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  players: Player[];
  color: string;
}

export interface MatchState {
  overs: number;
  target: number | null;
  currentScore: number;
  wickets: number;
  currentOver: number;
  ballsInOver: number;
  battingTeam: Team;
  bowlingTeam: Team;
  history: BallResult[];
}

export interface BallResult {
  runs: number;
  wicket: boolean;
  wicketType?: string;
  ballType: BallType;
  commentary: string;
}

export interface BowlingDelivery {
  type: BallType;
  speed: number; // 110-160
  pitchX: number; // 0-100 (horizontal across pitch)
  pitchY: number; // 0-100 (vertical length: yorker to bouncer)
  swing: number; // -10 to 10
}
