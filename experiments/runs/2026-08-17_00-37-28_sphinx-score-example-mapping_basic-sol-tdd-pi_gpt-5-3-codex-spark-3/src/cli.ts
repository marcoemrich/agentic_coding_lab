import { calculateSphinxScore, ArmyInput } from "./sphinx-score";

const readAllStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }

  return Buffer.concat(chunks).toString("utf8");
};

const run = async () => {
  const inputText = await readAllStdin();
  const input: ArmyInput = JSON.parse(inputText) as ArmyInput;
  const score = calculateSphinxScore(input);
  const output = JSON.stringify({ score });
  process.stdout.write(output);
};

void run();
