export type Heading = "N" | "E" | "S" | "W";

export interface RoverState {
  x: number;
  y: number;
  heading: Heading;
}

const forwardDeltas: Record<Heading, { dx: number; dy: number }> = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
};

const leftOf: Record<Heading, Heading> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

const rightOf: Record<Heading, Heading> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

const step = (state: RoverState, command: string): RoverState => {
  if (command === "L") return { ...state, heading: leftOf[state.heading] };
  if (command === "R") return { ...state, heading: rightOf[state.heading] };
  if (command === "F") {
    const { dx, dy } = forwardDeltas[state.heading];
    return { ...state, x: state.x + dx, y: state.y + dy };
  }
  return state;
};

export const rover = (state: RoverState, commands: string): RoverState =>
  Array.from(commands).reduce(step, state);
