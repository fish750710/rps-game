import {RpsMove} from './rps-moves';

export interface RpsGameControl {
  startGame(): void;
  throw(move: RpsMove): void;
}
