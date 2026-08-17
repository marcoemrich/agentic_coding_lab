import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an army with no Sphinx as 0 -- Chimera, Orthrus, Zombie => 0", () => {
    expect(scoreSphinxes([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("counts the Sphinx type and awards one point per type up to three -- Sphinx, Cyclops => 2", () => {
    expect(scoreSphinxes([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("counts distinct monster types rather than cards -- Sphinx, Chimera x3, Orthrus x2 => 2", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores three types as 2 -- Sphinx, Chimera, Orthrus => 2", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("treats Undead Warrior ranks as one type -- ranks 1 and 3 with Sphinx and Chimera => 2", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("scores one Sphinx with five types as 3 -- Sphinx, Chimera, Orthrus, Zombie, Hydra => 3", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores one Sphinx with six types as 5 -- Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops => 5", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores each of two Sphinx cards with the same three types -- two Sphinxes, Chimera, Orthrus => 4", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores each of two Sphinx cards with four types -- two Sphinxes, Chimera, Orthrus, Zombie => 6", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("treats all three Undead Warrior ranks as one type in a seven-card army -- score 3", () => {
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
  it("CLI reads the whole JSON army from stdin and writes { score: 5 } to stdout", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ],
    });
    const output = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      encoding: "utf8",
      input,
    });

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
