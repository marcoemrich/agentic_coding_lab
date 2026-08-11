import { scoreArmy } from "./sphinx-score.js";

const readStdin = async (): Promise<string> => {
  process.stdin.setEncoding("utf8");
  return (await process.stdin.toArray()).join("");
};

const { army } = JSON.parse(await readStdin());
process.stdout.write(JSON.stringify({ score: scoreArmy(army) }));
