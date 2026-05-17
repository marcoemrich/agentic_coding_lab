import { runScenario } from "./claim-office.js";

export const runCli = (input: string): { exitCode: number; stdout: string; stderr: string } => {
  try {
    const scenario = JSON.parse(input);
    const result = runScenario(scenario);
    return { exitCode: 0, stdout: JSON.stringify(result), stderr: "" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { exitCode: 1, stdout: "", stderr: message };
  }
};

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const isMainModule = (): boolean => {
  const entry = process.argv[1];
  if (!entry) return false;
  const entryUrl = new URL(`file://${entry}`).href;
  return import.meta.url === entryUrl;
};

if (isMainModule()) {
  readStdin().then((input) => {
    const { exitCode, stdout, stderr } = runCli(input);
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    process.exit(exitCode);
  });
}
