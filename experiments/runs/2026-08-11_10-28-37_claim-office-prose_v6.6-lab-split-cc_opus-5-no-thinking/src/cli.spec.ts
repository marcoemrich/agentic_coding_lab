import { describe, it, expect } from "vitest";
import { processScenarioJson } from "./cli.js";

describe("claim-office CLI", () => {
  it("reads a scenario as JSON and writes the results as JSON — schema example 1", () => {
    const stdin = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(processScenarioJson(stdin)).toBe('{"results":[{"premium":115}]}');
  });
});
