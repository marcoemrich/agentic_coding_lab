import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores 0 for Chimera, Orthrus, and Zombie with no Sphinx", () => {
    expect(scoreSphinxes([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores 2 for Sphinx and Cyclops", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ])).toBe(2);
  });
  it("scores 2 for Sphinx, Chimera, and Orthrus", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores 2 when repeated Chimera and Orthrus cards do not add types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores 2 when Undead Warrior ranks 1 and 3 count as one type", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("scores 3 for Sphinx and four other distinct monster types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores 5 for Sphinx and five other distinct monster types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores 3 when all three Undead Warrior ranks count as one type", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    ])).toBe(3);
  });
  it("scores 4 for two Sphinx cards and two other monster types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores 6 for two Sphinx cards and three other monster types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("scores 7 for one Sphinx with all seven monster types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    ])).toBe(7);
  });

  it("CLI reads complete stdin and writes score 5 JSON for a six-type army", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ],
    });

    const output = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      encoding: "utf8",
      input,
    });

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
