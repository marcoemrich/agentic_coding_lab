import { readFileSync } from "node:fs";
import { run } from "./claim-office.js";

const input = readFileSync(0, "utf8");
const result = run(JSON.parse(input));
process.stdout.write(JSON.stringify(result));
