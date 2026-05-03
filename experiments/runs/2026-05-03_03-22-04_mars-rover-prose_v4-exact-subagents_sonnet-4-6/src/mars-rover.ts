type Heading = "N" | "E" | "S" | "W";
type Rover = { x: number; y: number; heading: Heading };

const forwardDelta: Record<Heading, { dx: number; dy: number }> = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
};

const leftTurn: Record<Heading, Heading> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

const rightTurn: Record<Heading, Heading> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

const commandHandlers: Record<string, (rover: Rover) => Rover> = {
  F: (rover) => {
    const { dx, dy } = forwardDelta[rover.heading];
    return { ...rover, x: rover.x + dx, y: rover.y + dy };
  },
  L: (rover) => ({ ...rover, heading: leftTurn[rover.heading] }),
  R: (rover) => ({ ...rover, heading: rightTurn[rover.heading] }),
};

export function moveRover(rover: Rover, commands: string): Rover {
  return commands.split("").reduce((current, command) => {
    const handler = commandHandlers[command];
    return handler ? handler(current) : current;
  }, rover);
}
