import {legalMoves, RpsMove} from '../rps-moves';
import {Player, PlayerId} from './player';

export interface RpsPlayerActions {
  throw(move?: RpsMove): void;
  reset(): void;
}

export class RpsPlayer extends Player implements RpsPlayerActions {
  constructor(id: PlayerId, name: string) {
    super(id, name);
    this.currentMove = null;
  }

  protected currentMove: RpsMove;

  get move(): RpsMove {
    return this.currentMove;
  }

  get isLegalMove(): boolean {
    return this.currentMove !== null;
  }

  throw(move?: RpsMove) {
    if (move) this.currentMove = move;
  }

  reset() {
    this.currentMove = null;
  }
}

export class RpsNpcPlayer extends RpsPlayer {
  generateRandomMove(): Exclude<RpsMove, null> {
    return legalMoves[Math.floor(Math.random() * (legalMoves.length - 1))];
  }

  throw(move?: RpsMove) {
    this.currentMove = this.generateRandomMove();
  }
}
