import { describe, it, expect } from "vitest";
import { runCli } from "./cli.js";

describe("claim-office CLI", () => {
  it("should write a results array with one entry per step to stdout and exit 0", () => {
    const input = JSON.stringify({
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

    const { exitCode, stdout } = runCli(input);

    expect(exitCode).toBe(0);
    expect(JSON.parse(stdout).results).toHaveLength(2);
  });
  it("should write the premium for a quote step", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    const { stdout } = runCli(input);

    expect(JSON.parse(stdout).results[0]).toEqual({ premium: 59 });
  });

  it("should write payout and remainingCap for a claim step, in step order", () => {
    const input = JSON.stringify({
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

    const { stdout } = runCli(input);

    expect(JSON.parse(stdout).results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });
  it("should exit with a non-zero code and write to stderr when runScenario rejects the scenario", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "broomstick",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
      ],
    });

    const { exitCode, stderr } = runCli(input);

    expect(exitCode).not.toBe(0);
    expect(stderr).toContain("broomstick");
  });

  it("should write no results to stdout when the scenario is rejected", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "broomstick",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
      ],
    });

    const { stdout } = runCli(input);

    expect(stdout).toBe("");
  });
  it("should exit with a non-zero code and write to stderr for malformed JSON input", () => {
    const { exitCode, stderr } = runCli("{ not valid json");

    expect(exitCode).not.toBe(0);
    expect(stderr).not.toBe("");
  });
});
