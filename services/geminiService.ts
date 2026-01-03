
import { GoogleGenAI, Type } from "@google/genai";
import { BowlingDelivery, Team, Player, BallResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBatsmanReaction(
  delivery: BowlingDelivery,
  batsman: Player,
  bowler: Player,
  matchContext: any
): Promise<BallResult> {
  const prompt = `
    Context: Cricket simulation match.
    Batsman: ${batsman.name} (${batsman.battingStyle}, Rating: ${batsman.rating})
    Bowler: ${bowler.name} (Rating: ${bowler.rating})
    Delivery: ${delivery.type}, Speed: ${delivery.speed} km/h, Swing: ${delivery.swing}, Pitch X: ${delivery.pitchX}, Pitch Y: ${delivery.pitchY}
    Match Situation: ${matchContext.score}/${matchContext.wickets} in ${matchContext.overs} overs. Target: ${matchContext.target || 'N/A'}.

    Simulate the batsman's reaction and result of this specific delivery. 
    Pitch X 50 is middle stump, 0 is far wide off, 100 is leg side.
    Pitch Y 0 is a yorker, 100 is a high bouncer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            runs: { type: Type.INTEGER, description: "Runs scored (0-6)" },
            wicket: { type: Type.BOOLEAN },
            wicketType: { type: Type.STRING, description: "e.g. Bowled, Caught, LBW" },
            commentary: { type: Type.STRING, description: "Short dynamic commentary of the ball" }
          },
          required: ["runs", "wicket", "commentary"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      ...result,
      ballType: delivery.type
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback logic
    return {
      runs: Math.floor(Math.random() * 2),
      wicket: Math.random() < 0.05,
      ballType: delivery.type,
      commentary: "A solid defensive stroke."
    };
  }
}

export async function getMatchStrategy(team: Team, opponent: Team, format: string) {
    const prompt = `Provide a short 2-sentence match strategy for ${team.name} playing against ${opponent.name} in a ${format} match.`;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });
    return response.text;
}
