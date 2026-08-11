#!/usr/bin/env node
import { text } from "node:stream/consumers";
import { run, type Scenario } from "./claim-office.js";

const scenario = JSON.parse(await text(process.stdin)) as Scenario;
process.stdout.write(JSON.stringify(run(scenario)));
