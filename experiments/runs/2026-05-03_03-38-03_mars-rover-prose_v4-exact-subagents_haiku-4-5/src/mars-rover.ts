export class MarsRover {
  private static readonly LEFT_TURNS: Record<string, string> = {
    N: "W",
    W: "S",
    S: "E",
    E: "N",
  };

  private static readonly RIGHT_TURNS: Record<string, string> = {
    N: "E",
    E: "S",
    S: "W",
    W: "N",
  };

  private static readonly MOVEMENT_DELTAS: Record<string, { dx: number; dy: number }> = {
    N: { dx: 0, dy: 1 },
    E: { dx: 1, dy: 0 },
    S: { dx: 0, dy: -1 },
    W: { dx: -1, dy: 0 },
  };

  private static readonly COMMAND_HANDLERS: Record<string, (rover: MarsRover) => void> = {
    L: (rover) => rover.rotateLeft(),
    R: (rover) => rover.rotateRight(),
    F: (rover) => rover.moveForward(),
  };

  constructor(
    public x: number,
    public y: number,
    public heading: string,
  ) {}

  rotateLeft(): void {
    const newHeading = MarsRover.LEFT_TURNS[this.heading];
    if (newHeading) {
      this.heading = newHeading;
    }
  }

  rotateRight(): void {
    const newHeading = MarsRover.RIGHT_TURNS[this.heading];
    if (newHeading) {
      this.heading = newHeading;
    }
  }

  moveForward(): void {
    const delta = MarsRover.MOVEMENT_DELTAS[this.heading];
    if (delta) {
      this.x += delta.dx;
      this.y += delta.dy;
    }
  }

  execute(command: string): void {
    const handler = MarsRover.COMMAND_HANDLERS[command];
    if (handler) {
      handler(this);
    }
  }
}
