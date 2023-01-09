export type PlayerId = string;

export class Player {
  constructor(public readonly id: PlayerId, public readonly name: string) {}

  public sayHi() {
    console.log(`Hi! I'm ${this.name}`);
  }
}
