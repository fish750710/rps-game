import {RpsGame} from './game/rps-game';
import {RpsNpcPlayer, RpsPlayer} from './player/rps-player';
import {RpsGameControl} from './rps-game-control';
import {RpsGameLifeCycle} from './rps-game-lifecycle';
import {RpsGameResult} from './rps-result';

class LetsPlay implements RpsGameLifeCycle {
  constructor() {
    this.player = new RpsNpcPlayer('tom-123', 'Tom');
    new RpsGame(this.player, this);
  }

  private player: RpsPlayer;
  private game?: RpsGame;

  get gameController(): RpsGameControl | undefined {
    return this.game;
  }

  onGameReady(game: RpsGame) {
    console.log('Game Ready!');
    this.game = game;

    this.gameController?.startGame();
    this.fakeThrowInSeconds(1);
    this.fakeThrowInSeconds(3);
    this.fakeThrowInSeconds(5);
  }

  onGameTerminated() {
    console.error('Game Terminated!');
    // TODO: disable choose buttons
  }

  onRoundTick(leftMilliseconds: number): void {
    // console.log(
    //   `[Game Round Tick]: Show result in ${leftMilliseconds / 1000} seconds`
    // );
  }

  onRoundStart(durationMilliseconds: number): void {
    console.log(
      `Game round stated countdown(${durationMilliseconds / 1000} seconds)`
    );
  }

  onRoundResult(result: RpsGameResult): void {
    if (result.hasResult) {
      console.log(`${result.winners!.length} winners.`);
      console.log('Winners', result.winners);
      console.log('Losers', result.losers);
    } else {
      console.log('No winners');
      console.log(result.playerMoves);
    }
  }

  fakeThrowInSeconds(seconds: number = 3) {
    const delay = Math.floor(Math.random() * seconds * 1000);
    setTimeout(() => {
      this.player.throw();
      console.log(
        `${this.player.name} throw ${this.player.move} in ${
          delay / 1000
        } seconds.`
      );
    }, delay);
  }
}

new LetsPlay();
