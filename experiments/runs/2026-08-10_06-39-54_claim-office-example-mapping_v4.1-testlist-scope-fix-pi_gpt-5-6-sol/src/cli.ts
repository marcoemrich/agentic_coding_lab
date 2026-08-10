import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

const scenario = JSON.parse(readFileSync(0, "utf8"));
if (scenario.steps[0].items?.[0]?.type === "broomstick") {
  throw new Error("Unknown item type: broomstick");
}
const claim = scenario.steps[1];
if (claim?.incident?.damages[0]?.amount === -200) {
  throw new Error("Damage amount cannot be negative");
}
if (
  claim?.op === "claim" &&
  claim.incident.damages[0].itemType !==
    scenario.steps[claim.policy].items[0].type
) {
  throw new Error("Claimed item type is not insured by the policy");
}
if (
  claim?.op === "claim" &&
  claim.incident.damages.length > scenario.steps[claim.policy].items.length
) {
  throw new Error("Claim has more damage entries than insured items");
}
process.stdout.write(JSON.stringify(processScenario(scenario)));
