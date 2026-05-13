import { simulate, Cell } from "./game-of-life.js";

const readStdin = (): Promise<string> => {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk: string) => { data += chunk; });
    process.stdin.on("end", () => { resolve(data); });
  });
};

const main = async () => {
  const input = JSON.parse(await readStdin());
  const aliveCells: Cell[] = input.aliveCells;
  const steps: number = input.steps;
  const result = simulate(aliveCells, steps);
  const sorted = result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  console.log(JSON.stringify({ aliveCells: sorted }));
};

main();
