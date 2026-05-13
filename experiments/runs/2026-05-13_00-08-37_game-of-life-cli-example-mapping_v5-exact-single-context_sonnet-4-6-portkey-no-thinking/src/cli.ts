import { advance } from "./game-of-life.js";

const input = JSON.parse(await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
}));

const result = advance(input.aliveCells, input.steps);
process.stdout.write(JSON.stringify({ aliveCells: result }) + "\n");
