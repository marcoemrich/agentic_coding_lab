import { claimOffice } from "./claim-office.js";

let input = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk: string) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input);
    const result = claimOffice(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err: any) {
    process.stderr.write(err.message + "\n");
    process.exitCode = 1;
  }
});
