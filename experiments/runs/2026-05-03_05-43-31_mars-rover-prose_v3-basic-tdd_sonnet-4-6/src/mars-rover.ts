type Heading = 'N' | 'E' | 'S' | 'W';

const LEFT_TURN: Record<Heading, Heading> = { N: 'W', W: 'S', S: 'E', E: 'N' };
const RIGHT_TURN: Record<Heading, Heading> = { N: 'E', E: 'S', S: 'W', W: 'N' };

export class Rover {
  constructor(
    public x: number,
    public y: number,
    public heading: Heading
  ) {}

  execute(commands: string): void {
    for (const cmd of commands) {
      if (cmd === 'L') {
        this.heading = LEFT_TURN[this.heading];
      } else if (cmd === 'R') {
        this.heading = RIGHT_TURN[this.heading];
      } else if (cmd === 'F') {
        if (this.heading === 'N') this.y++;
        else if (this.heading === 'E') this.x++;
        else if (this.heading === 'S') this.y--;
        else if (this.heading === 'W') this.x--;
      }
    }
  }
}
