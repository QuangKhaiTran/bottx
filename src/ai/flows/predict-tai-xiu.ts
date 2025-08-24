'use server';

/**
 * @fileOverview An AI-powered prediction tool for the Tài/Xỉu game.
 *
 * - predictTaiXiu - A function that predicts the outcome of the Tài/Xỉu game.
 * - PredictTaiXiuInput - The input type for the predictTaiXiu function.
 * - PredictTaiXiuOutput - The return type for the predictTaiXiu function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictTaiXiuInputSchema = z.object({
  gameHistory: z
    .array(z.enum(['tai', 'xiu']))
    .describe('The history of game outcomes, represented as an array of strings "tai" or "xiu".'),
  currentTaiAmount: z
    .number()
    .describe('The current total amount of bets placed on Tài.'),
  currentXiuAmount: z
    .number()
    .describe('The current total amount of bets placed on Xỉu.'),
  timeRemaining: z
    .number()
    .describe('The time remaining in the current betting round, in seconds.'),
});
export type PredictTaiXiuInput = z.infer<typeof PredictTaiXiuInputSchema>;

const PredictTaiXiuOutputSchema = z.object({
  predictedOutcome: z
    .enum(['tai', 'xiu'])
    .describe('The predicted outcome of the game, either "tai" or "xiu".'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('A score between 0 and 1 indicating the confidence level of the prediction.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the prediction, explaining the factors considered.'),
});
export type PredictTaiXiuOutput = z.infer<typeof PredictTaiXiuOutputSchema>;

export async function predictTaiXiu(input: PredictTaiXiuInput): Promise<PredictTaiXiuOutput> {
  return predictTaiXiuFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictTaiXiuPrompt',
  input: {schema: PredictTaiXiuInputSchema},
  output: {schema: PredictTaiXiuOutputSchema},
  prompt: `You are an AI-powered prediction tool for the Tài/Xỉu game.
  Your goal is to predict the outcome of the next game round based on the provided information.

  Consider the following factors:
  - Game History: {{{gameHistory}}}
  - Current Tài Amount: {{{currentTaiAmount}}}
  - Current Xỉu Amount: {{{currentXiuAmount}}}
  - Time Remaining: {{{timeRemaining}}}

  Analyze the trends in the game history, the current betting amounts, and the time remaining to make an informed prediction.

  Provide the predicted outcome (tài or xỉu), a confidence score (between 0 and 1), and a brief reasoning for your prediction.
  Be concise and focus on the most relevant factors influencing your decision.

  Example:
  {
    "predictedOutcome": "tai",
    "confidenceScore": 0.75,
    "reasoning": "Tài has been dominant in the recent history, and the current Tài amount is significantly higher than Xỉu."
  }

  Now, based on the provided information, provide your prediction in JSON format:
  `,
});

const predictTaiXiuFlow = ai.defineFlow(
  {
    name: 'predictTaiXiuFlow',
    inputSchema: PredictTaiXiuInputSchema,
    outputSchema: PredictTaiXiuOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


