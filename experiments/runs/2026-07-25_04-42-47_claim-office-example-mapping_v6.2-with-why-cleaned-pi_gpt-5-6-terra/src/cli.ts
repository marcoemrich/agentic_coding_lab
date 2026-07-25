import { pathToFileURL } from "node:url";
import { runScenario } from "./claim-office.js";

export const runCli = (scenarioJson: string): string => JSON.stringify(runScenario(JSON.parse(scenarioJson)));

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let stdin = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { stdin += chunk; });
  process.stdin.on("end", () => {
    try {
      process.stdout.write(runCli(stdin));
    } catch (error) {
      process.stderr.write(`${error}\n`);
      process.exitCode = 1;
    }
  });
}
