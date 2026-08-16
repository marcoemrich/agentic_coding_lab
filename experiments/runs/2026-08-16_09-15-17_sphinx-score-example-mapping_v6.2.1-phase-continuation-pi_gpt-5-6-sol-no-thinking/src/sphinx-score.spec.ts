import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0", () => {
    expect(scoreSphinxes([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores Sphinx and Cyclops as 2, awarding the below-threshold point per type", () => {
    expect(scoreSphinxes([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores Sphinx, Chimera, and Orthrus as 2, counting Sphinx as a type", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores the repeated three-type clarification example as 2", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores Sphinx with Chimera, Orthrus, Zombie, and Hydra as 3", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" },
      { monster: "zombie" }, { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores Sphinx with five other distinct monster types as 5", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" },
      { monster: "zombie" }, { monster: "hydra" }, { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores two Sphinxes with Chimera and Orthrus as 4", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" }, { monster: "sphinx" },
      { monster: "chimera" }, { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores two Sphinxes with Chimera, Orthrus, and Zombie as 6", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" }, { monster: "sphinx" }, { monster: "chimera" },
      { monster: "orthrus" }, { monster: "zombie" },
    ])).toBe(6);
  });
  it("treats rank 1 and rank 3 Undead Warriors as one type and scores 2", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("treats all three Undead Warrior ranks as one type and scores 3", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" }, { monster: "orthrus" }, { monster: "chimera" },
    ])).toBe(3);
  });
  it("counts repeated Chimera and Orthrus cards only once per type and scores 2", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" }, { monster: "chimera" }, { monster: "chimera" },
      { monster: "orthrus" }, { monster: "orthrus" },
    ])).toBe(2);
  });
  it("exposes a CLI that reads the whole JSON army from stdin and writes a JSON score", () => {
    const stdout = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({
        army: [
          { monster: "sphinx" },
          { monster: "undead-warrior", rank: 2 },
          { monster: "hydra" },
        ],
      }),
      encoding: "utf8",
    });

    expect(JSON.parse(stdout)).toEqual({ score: 2 });
  });
});
