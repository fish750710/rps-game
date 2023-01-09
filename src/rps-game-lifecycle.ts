import {RpsGame} from './game/rps-game';
import {RpsGameResult} from './rps-result';

export interface RpsGameLifeCycle {
  onGameReady(game: RpsGame): void;
  onGameTerminated(): void;
  onRoundStart(durationMilliseconds: number): void;
  onRoundTick(leftMilliseconds: number): void;
  onRoundResult(result: RpsGameResult): void;
}
