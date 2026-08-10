import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("claim-office CLI entry point", () => {
  it('should read a valid scenario from stdin through tsx and write only runScenario JSON to stdout — exit 0, stderr "", stdout {"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}', () => {
    const scenario = {
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
    };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      cwd: process.cwd(),
      encoding: "utf8",
      input: JSON.stringify(scenario),
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe('{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}');
  });
  it.todo('should report malformed stdin JSON without writing a result — non-zero exit, stderr contains an error description, stdout ""');
  it.todo('should report an error thrown while processing parsed JSON without writing a result — stdin null, non-zero exit, stderr contains an error description, stdout ""');
});
