import { text } from "node:stream/consumers";
import { execute } from "./command.js";

const outcome = execute(await text(process.stdin));

process.stdout.write(outcome.stdout);
process.stderr.write(outcome.stderr);
process.exitCode = outcome.exitCode;
