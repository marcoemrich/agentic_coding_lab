export type Heading = "N" | "E" | "S" | "W";

export interface RoverState {
  x: number;
  y: number;
  heading: Heading;
}

const FORWARD_DELTAS: Record<Heading, { dx: number; dy: number }> = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
};

const LEFT_OF: Record<Heading, Heading> = { N: "W", W: "S", S: "E", E: "N" };
const RIGHT_OF: Record<Heading, Heading> = { N: "E", E: "S", S: "W", W: "N" };

const COMMAND_HANDLERS: Record<string, (state: RoverState) => RoverState> = {
  L: (state) => ({ ...state, heading: LEFT_OF[state.heading] }),
  R: (state) => ({ ...state, heading: RIGHT_OF[state.heading] }),
  F: (state) => {
    const { dx, dy } = FORWARD_DELTAS[state.heading];
    return { ...state, x: state.x + dx, y: state.y + dy };
  },
};

export const rover = (initial: RoverState, commands: string): RoverState =>
  Array.from(commands).reduce(
    (state, command) => COMMAND_HANDLERS[command]?.(state) ?? state,
    initial,
  );
