import { advanceGenerations } from "./gameOfLife.js";

interface Input {
  aliveCells: Array<[number, number]>;
  steps: number;
}

interface Output {
  aliveCells: Array<[number, number]>;
}

async function main() {
  let inputData = "";

  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  const input: Input = JSON.parse(inputData);
  const result = advanceGenerations(input.aliveCells, input.steps);
  const output: Output = { aliveCells: result };

  console.log(JSON.stringify(output));
}

main().catch(console.error);
