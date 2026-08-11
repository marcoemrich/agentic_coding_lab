import { describe, it, expect } from "vitest";
import { runCli } from "./cli.js";

describe("claim-office CLI", () => {
  it("turns a JSON scenario on stdin into JSON results on stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    expect(JSON.parse(runCli(input))).toEqual({ results: [{ premium: 115 }] });
  });
});
