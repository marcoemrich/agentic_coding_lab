import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, "cli.ts");

const runCli = (input: unknown) => {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
  return result;
};

describe("claim-office CLI", () => {
  it("CLI schema example: amulet quote then claim -> stdout results array matches shape {premium} then {payout, remainingCap}", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0]).toHaveProperty("premium");
    expect(output.results[1]).toHaveProperty("payout");
    expect(output.results[1]).toHaveProperty("remainingCap");
  });
});
