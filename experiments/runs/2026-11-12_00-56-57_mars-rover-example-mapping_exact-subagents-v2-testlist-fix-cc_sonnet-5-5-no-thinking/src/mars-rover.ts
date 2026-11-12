export type Direction = "N" | "E" | "S" | "W";

export interface Rover {
  x: number;
  y: number;
  direction: Direction;
}

const DIRECTION_AFTER_LEFT_TURN: Record<Direction, Direction> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

const DIRECTION_AFTER_RIGHT_TURN: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

function facing(rover: Rover, direction: Direction): Rover {
  return { ...rover, direction };
}

const STEP_FORWARD: Record<Direction, { dx: number; dy: number }> = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
};

function movedForward(rover: Rover): Rover {
  const { dx, dy } = STEP_FORWARD[rover.direction];
  return { ...rover, x: rover.x + dx, y: rover.y + dy };
}

const ACTION_FOR_COMMAND: Record<string, (rover: Rover) => Rover> = {
  L: (rover) => facing(rover, DIRECTION_AFTER_LEFT_TURN[rover.direction]),
  R: (rover) => facing(rover, DIRECTION_AFTER_RIGHT_TURN[rover.direction]),
  F: movedForward,
};

export function executeCommands(rover: Rover, commands: string): Rover {
  return [...commands].reduce(
    (current, command) => ACTION_FOR_COMMAND[command](current),
    rover,
  );
}
