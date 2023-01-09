import {legalMoves, RpsMove} from './rps-moves';

export type PlayerMove = {
  name: string;
  move: RpsMove;
};

export type RpsGameResult = {
  hasResult: boolean;
  playerMoves: Array<PlayerMove>;
  winners?: Array<PlayerMove>;
  losers?: Array<PlayerMove>;
};

export const scoringByPlayerMoves = (
  playerMoves: Array<PlayerMove>
): RpsGameResult => {
  if (playerMoves.length === 0) return {hasResult: false, playerMoves: []};

  const moveResults: Map<RpsMove, Array<PlayerMove>> = new Map();

  playerMoves.forEach(item => {
    if (moveResults.has(item.move)) {
      moveResults.get(item.move)?.push(item);
    } else {
      moveResults.set(item.move, [item]);
    }
  });
  console.log(moveResults);

  // 有人沒出拳
  if (moveResults.has(null)) {
    return {hasResult: false, playerMoves};
  }

  // 無效的回合
  if (moveResults.size !== 2) {
    return {hasResult: false, playerMoves};
  }
  // 有效結果
  else {
    let firstMove: typeof legalMoves[number] = [...moveResults.keys()][0]!;
    let secondMove: typeof legalMoves[number] = [...moveResults.keys()][1]!;

    const result: RpsGameResult = {
      hasResult: true,
      playerMoves,
    };

    switch (firstMove) {
      case 'paper':
        if (secondMove === 'rock') {
          result.losers = [...moveResults.get(secondMove)!];
          result.winners = [...moveResults.get(firstMove)!];
        } else if (secondMove == 'scissors') {
          result.winners = [...moveResults.get(secondMove)!];
          result.losers = [...moveResults.get(firstMove)!];
        }
        break;
      case 'scissors':
        if (secondMove === 'rock') {
          result.winners = [...moveResults.get(secondMove)!];
          result.losers = [...moveResults.get(firstMove)!];
        } else if (secondMove == 'paper') {
          result.losers = [...moveResults.get(secondMove)!];
          result.winners = [...moveResults.get(firstMove)!];
        }
        break;
      case 'rock':
        if (secondMove === 'paper') {
          result.winners = [...moveResults.get(secondMove)!];
          result.losers = [...moveResults.get(firstMove)!];
        } else if (secondMove == 'scissors') {
          result.losers = [...moveResults.get(secondMove)!];
          result.winners = [...moveResults.get(firstMove)!];
        }
        break;
    }

    return result;
  }
};
