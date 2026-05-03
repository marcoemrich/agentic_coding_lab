export type Heading = 'N' | 'E' | 'S' | 'W';

export interface RoverState {
  x: number;
  y: number;
  heading: Heading;
}

const directions: Heading[] = ['N', 'E', 'S', 'W'];

const moves: Record<Heading, { dx: number; dy: number }> = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
};

export function moveRover(state: RoverState, commands: string): RoverState {
  let { x, y, heading } = state;

  for (const cmd of commands) {
    const idx = directions.indexOf(heading);
    if (cmd === 'L') {
      heading = directions[(idx + 3) % 4];
    } else if (cmd === 'R') {
      heading = directions[(idx + 1) % 4];
    } else if (cmd === 'F') {
      x += moves[heading].dx;
      y += moves[heading].dy;
    }
  }

  return { x, y, heading };
}
