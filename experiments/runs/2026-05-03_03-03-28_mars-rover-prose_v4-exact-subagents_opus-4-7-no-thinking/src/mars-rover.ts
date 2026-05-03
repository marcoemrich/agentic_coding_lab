type Heading = "N" | "E" | "S" | "W";
type State = { x: number; y: number; heading: Heading };

const LEFT_OF: Record<Heading, Heading> = { N: "W", W: "S", S: "E", E: "N" };
const RIGHT_OF: Record<Heading, Heading> = { N: "E", E: "S", S: "W", W: "N" };
const FORWARD_DELTA: Record<Heading, [number, number]> = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0],
};

const COMMANDS: Record<string, (state: State) => State> = {
  L: (state) => ({ ...state, heading: LEFT_OF[state.heading] }),
  R: (state) => ({ ...state, heading: RIGHT_OF[state.heading] }),
  F: (state) => {
    const [dx, dy] = FORWARD_DELTA[state.heading];
    return { ...state, x: state.x + dx, y: state.y + dy };
  },
};

const INITIAL_STATE: State = { x: 0, y: 0, heading: "N" };

export function execute(commands: string): string {
  const { x, y, heading } = [...commands].reduce(
    (state, command) => COMMANDS[command](state),
    INITIAL_STATE,
  );
  return `${x}:${y}:${heading}`;
}
