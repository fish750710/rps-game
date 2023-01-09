import {Player} from '../player/player';
import {RpsNpcPlayer, RpsPlayer} from '../player/rps-player';
import {RpsGameControl} from '../rps-game-control';
import {RpsGameLifeCycle} from '../rps-game-lifecycle';
import {RpsMove} from '../rps-moves';
import {PlayerMove, RpsGameResult, scoringByPlayerMoves} from '../rps-result';
import {CountdownTimer} from '../utils/timer';
import {Game} from './game';

export class RpsGame extends Game<RpsPlayer> implements RpsGameControl {
  static readonly GAME_NAME: string = 'RPS Game';
  static readonly PLAYER_MIN: number = 2;
  static readonly GAME_ROUND_COUNTDOWN_SECONDS: number = 3.0;

  constructor(private player: RpsPlayer, private listener: RpsGameLifeCycle) {
    super(RpsGame.GAME_NAME, undefined, RpsGame.PLAYER_MIN);
    this.initPlayer();
  }

  private timer: CountdownTimer | null = null;

  startGame() {
    this.startRound();
  }

  throw(move: RpsMove) {
    this.player.throw(move);
  }

  onPlayerJoined(
    player: Player,
    totalPlayers: number,
    reachMin: boolean,
    reachMax: boolean
  ): void {
    if (reachMin) {
      this.listener.onGameReady(this);
    }
  }

  onPlayerLeaved(
    totalPlayers: number,
    reachMin: boolean,
    reachMax: boolean
  ): void {
    if (reachMin === false) {
      this.listener.onGameTerminated();
    }
  }

  private initPlayer(): void {
    this.addPlayer(this.player);

    const npcPlayerAmount: number = RpsGame.PLAYER_MIN - 1;
    for (let index = 1; index <= npcPlayerAmount; index++) {
      this.addPlayer(new RpsNpcPlayer(`NPC-${index}`, `NPC ${index}`));
    }
  }

  private startRound() {
    if (this.timer) return;

    let instance = this;
    this.timer = new CountdownTimer(RpsGame.GAME_ROUND_COUNTDOWN_SECONDS);

    this.timer.start((leftTime: number) => {
      this.listener.onRoundTick(leftTime);
      if (leftTime === 0) {
        instance.stopRound();
      }
    });

    this.listener.onRoundStart(RpsGame.GAME_ROUND_COUNTDOWN_SECONDS * 1000);
  }

  private stopRound() {
    this.timer?.stop();

    // 所有 NPC 出拳
    this.npcPlayersThrow();

    this.scoring();
    this.resetPlayersMove();

    this.timer = null;
  }

  private npcPlayersThrow() {
    this.allPlayers.forEach(player => {
      if (player.id !== this.player.id) {
        player.throw();
      }
    });
  }

  private resetPlayersMove(): void {
    this.allPlayers.forEach(player => player.reset());
  }

  private scoring(): RpsGameResult {
    const playerMoves: Array<PlayerMove> = this.allPlayers.map(v => {
      return {
        name: v.name,
        move: v.move,
      };
    });

    const result: RpsGameResult = scoringByPlayerMoves(playerMoves);
    this.listener.onRoundResult(result);

    return result;
  }
}
