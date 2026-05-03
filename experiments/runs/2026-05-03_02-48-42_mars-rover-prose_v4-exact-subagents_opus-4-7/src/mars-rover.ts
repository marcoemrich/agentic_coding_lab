type Heading = "N" | "E" | "S" | "W";

type Rover = {
  x: number;
  y: number;
  heading: Heading;
};

const INITIAL_ROVER: Rover = { x: 0, y: 0, heading: "N" };

const LEFT_OF: Record<Heading, Heading> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

const RIGHT_OF: Record<Heading, Heading> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

const FORWARD_DELTA: Record<Heading, { dx: number; dy: number }> = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
};

const COMMANDS: Record<string, (rover: Rover) => Rover> = {
  L: (rover) => ({ ...rover, heading: LEFT_OF[rover.heading] }),
  R: (rover) => ({ ...rover, heading: RIGHT_OF[rover.heading] }),
  F: (rover) => {
    const { dx, dy } = FORWARD_DELTA[rover.heading];
    return { ...rover, x: rover.x + dx, y: rover.y + dy };
  },
};

const applyCommand = (rover: Rover, command: string): Rover =>
  COMMANDS[command]?.(rover) ?? rover;

const formatRover = (rover: Rover): string =>
  `${rover.x}:${rover.y}:${rover.heading}`;

export function execute(commands: string): string {
  const finalRover = commands
    .split("")
    .reduce(applyCommand, INITIAL_ROVER);
  return formatRover(finalRover);
}
