export type Rover = { x: number; y: number; heading: string };

export const moveRover = (
  x: number,
  y: number,
  heading: string,
  commands: string
): Rover => {
  if (commands.length > 1) {
    return commands.split("").reduce(
      (rover: Rover, cmd: string) => moveRover(rover.x, rover.y, rover.heading, cmd),
      { x, y, heading }
    );
  }
  if (commands === "L" || commands === "R") {
    return { x, y, heading: commands === "L" ? "W" : "E" };
  }
  const move = (coord: number, pos: string, neg: string): number =>
    commands === "F" ? (heading === pos ? coord + 1 : heading === neg ? coord - 1 : coord) : coord;
  return { x: move(x, "E", "W"), y: move(y, "N", "S"), heading };
};
