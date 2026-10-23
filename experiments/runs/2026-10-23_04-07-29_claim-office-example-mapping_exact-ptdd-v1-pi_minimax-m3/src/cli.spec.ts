import { describe, it, expect } from "vitest";
import { runCli } from "./cli.js";

describe("CLI", () => {
  describe("success path", () => {
    it("schema example: returns quote premium and claim payout/remainingCap on stdout", () => {
      const stdin = JSON.stringify({
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
      const result = runCli(stdin);
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      const output = JSON.parse(result.stdout);
      expect(output.results).toHaveLength(2);
      expect(output.results[0]).toEqual({ premium: expect.any(Number) });
      expect(output.results[1]).toEqual({
        payout: expect.any(Number),
        remainingCap: expect.any(Number),
      });
    });
    it("empty item list → premium 5", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      const result = runCli(stdin);
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
      const output = JSON.parse(result.stdout);
      expect(output.results).toEqual([{ premium: 5 }]);
    });
  });

  describe("error path", () => {
    it("unknown item type → non-zero exit, error to stderr, no stdout results", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      const result = runCli(stdin);
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toMatch(/Unknown item type/);
    });
    it("negative damage amount → non-zero exit, error to stderr, no stdout results", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      });
      const result = runCli(stdin);
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toMatch(/negative/);
    });
    it("damage item not in policy → non-zero exit, error to stderr, no stdout results", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
      const result = runCli(stdin);
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toMatch(/not part of the policy/);
    });
    it("more damages than covered items → non-zero exit, error to stderr, no stdout results", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      });
      const result = runCli(stdin);
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr).toMatch(/than covered/);
    });
  });
});
