
import { Team, BallType } from './types';

export const TEAMS: Team[] = [
  {
    id: 'ind',
    name: 'India',
    shortName: 'IND',
    logo: '🇮🇳',
    color: '#0038A8',
    players: [
      { id: 'i1', name: 'R. Sharma', role: 'Batsman', battingStyle: 'RHB', bowlingStyle: 'Off-Spin', rating: 92, stats: { runs: 10500, wickets: 10, average: 48.5, strikeRate: 140 } },
      { id: 'i2', name: 'V. Kohli', role: 'Batsman', battingStyle: 'RHB', bowlingStyle: 'Medium', rating: 95, stats: { runs: 13500, wickets: 5, average: 58.2, strikeRate: 138 } },
      { id: 'i3', name: 'J. Bumrah', role: 'Bowler', battingStyle: 'RHB', bowlingStyle: 'Fast', rating: 96, stats: { runs: 500, wickets: 350, average: 22.1, strikeRate: 125 } },
    ]
  },
  {
    id: 'aus',
    name: 'Australia',
    shortName: 'AUS',
    logo: '🇦🇺',
    color: '#FFD700',
    players: [
      { id: 'a1', name: 'P. Cummins', role: 'Bowler', battingStyle: 'RHB', bowlingStyle: 'Fast', rating: 94, stats: { runs: 1200, wickets: 400, average: 24.5, strikeRate: 110 } },
      { id: 'a2', name: 'T. Head', role: 'Batsman', battingStyle: 'LHB', bowlingStyle: 'Off-Spin', rating: 89, stats: { runs: 4500, wickets: 25, average: 42.1, strikeRate: 155 } },
    ]
  },
  {
    id: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    logo: '🔵',
    color: '#004BA0',
    players: []
  },
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    logo: '🟡',
    color: '#FFFF00',
    players: []
  }
];

export const BALL_VARIATIONS: BallType[] = [
  BallType.OUTSWING, BallType.INSWING, BallType.SLOWER, BallType.OFF_CUTTER,
  BallType.LEG_CUTTER, BallType.DOOSRA, BallType.OFF_SPIN, BallType.LEG_SPIN, BallType.GOOGLY
];

export const STADIUMS = [
  { id: 'lords', name: "Lord's Cricket Ground", city: 'London' },
  { id: 'wankhede', name: 'Wankhede Stadium', city: 'Mumbai' },
  { id: 'mcg', name: 'Melbourne Cricket Ground', city: 'Melbourne' },
];
