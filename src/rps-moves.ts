export const legalMoves = ['rock', 'paper', 'scissors'] as const;

export type RpsMove = typeof legalMoves[number] | null;
