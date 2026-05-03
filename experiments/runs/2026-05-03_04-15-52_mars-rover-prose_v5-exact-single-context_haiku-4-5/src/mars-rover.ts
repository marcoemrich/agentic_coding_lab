type RoverState = { x: number; y: number; heading: string };

const leftRotations: { [key: string]: string } = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

const rightRotations: { [key: string]: string } = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

const movementDeltas: { [key: string]: { x: number; y: number } } = {
  N: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
};

export function executeCommands(
  x: number,
  y: number,
  heading: string,
  commands: string
): RoverState {
  let currentX = x;
  let currentY = y;
  let currentHeading = heading;

  for (const command of commands) {
    if (command === "L") {
      currentHeading = leftRotations[currentHeading];
    }
    if (command === "R") {
      currentHeading = rightRotations[currentHeading];
    }
    if (command === "F") {
      const delta = movementDeltas[currentHeading];
      currentX += delta.x;
      currentY += delta.y;
    }
  }

  return { x: currentX, y: currentY, heading: currentHeading };
}
