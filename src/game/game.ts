import {Player, PlayerId} from '../player/player';

export interface GameLifeCycle<TPlayer extends Player = Player> {
  onPlayerJoined(
    player: TPlayer,
    totalPlayers: number,
    reachMin: boolean,
    reachMax: boolean
  ): void;

  onPlayerLeaved(
    totalPlayers: number,
    reachMin: boolean,
    reachMax: boolean
  ): void;
}

export class Game<
  TPlayer extends Player = Player,
  TListener extends GameLifeCycle = GameLifeCycle
> implements GameLifeCycle
{
  constructor(
    public readonly name: string,
    public gameListener?: TListener,
    private readonly minPlayers?: number,
    private readonly maxPlayers?: number
  ) {}

  private readonly players: Map<PlayerId, TPlayer> = new Map();

  onPlayerJoined(
    player: Player,
    totalPlayers: number,
    reachMin: boolean,
    reachMax: boolean
  ) {
    if (this.gameListener)
      this.gameListener.onPlayerJoined(
        player,
        totalPlayers,
        reachMin,
        reachMax
      );
  }

  onPlayerLeaved(totalPlayers: number, reachMin: boolean, reachMax: boolean) {
    if (this.gameListener)
      this.gameListener.onPlayerLeaved(totalPlayers, reachMin, reachMax);
  }

  get allPlayers(): Array<TPlayer> {
    return [...this.players.values()];
  }

  summonPlayer(id: PlayerId): TPlayer | undefined {
    return this.players.get(id);
  }

  addPlayer(player: TPlayer, override: boolean = false): boolean {
    if (this.isPlayersAmountReachMax == true) {
      throw Error("Player's amount reached max limitation.");
    }

    if (this.players.has(player.id) === false || override === true) {
      this.players.set(player.id, player);
      this.onPlayerJoined(
        player,
        this.players.size,
        this.isPlayersAmountReachMin,
        this.isPlayersAmountReachMax
      );
      return true;
    }

    return false;
  }

  dropPlayer(playerId: PlayerId): boolean {
    const result = this.players.delete(playerId);
    this.onPlayerLeaved(
      this.players.size,
      this.isPlayersAmountReachMin,
      this.isPlayersAmountReachMax
    );
    return result;
  }

  get playerLimit(): {min: number; max: number} {
    return {min: this.minPlayers ?? 1, max: this.maxPlayers ?? -1};
  }

  get hasMaxPlayerLimit(): boolean {
    return this.playerLimit.max === -1;
  }

  get isPlayersAmountReachMin(): boolean {
    return this.players.size >= this.playerLimit.min;
  }

  get isPlayersAmountReachMax(): boolean {
    if (this.hasMaxPlayerLimit == false) return false;
    return this.players.size === this.playerLimit.max;
  }
}
