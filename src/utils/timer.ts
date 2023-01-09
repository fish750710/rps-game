export class CountdownTimer {
  private leftMilliseconds: number;
  private interval: NodeJS.Timeout | undefined;

  constructor(private seconds: number = 3) {
    this.leftMilliseconds = this.seconds * 1000;
  }
  
  start(callback: (leftTime: number) => void): void {
    if (this.interval) return;
    this.interval = setInterval(() => {
      this.leftMilliseconds = Math.max(this.leftMilliseconds - 100, 0);
      callback(this.leftMilliseconds);
      if (this.leftMilliseconds === 0) this.stop();
    }, 100);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
