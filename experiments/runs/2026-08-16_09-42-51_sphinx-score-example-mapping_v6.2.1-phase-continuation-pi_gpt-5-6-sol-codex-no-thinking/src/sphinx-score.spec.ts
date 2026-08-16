import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0 points", () => {
    expect(scoreSphinxes([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores Sphinx and Cyclops as 2 points: 'else 1' applies once per Sphinx, not per type", () => {
    expect(scoreSphinxes([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("counts Sphinx as a type: Sphinx, Chimera, and Orthrus score 2 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("still applies the 1-point fallback at three types: Sphinx, Chimera, and Orthrus score 2 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("ignores repeated cards when counting types: one Sphinx, three Chimeras, and two Orthruses score 2 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("counts two Sphinx cards as one type and scores each: two Sphinxes, Chimera, and Orthrus score 4 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores one Sphinx with five army types as 3 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores two Sphinxes with four army types as 6 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("scores one Sphinx with six army types as 5 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("treats Undead Warrior ranks 1 and 3 as one type, producing 2 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("treats all three Undead Warrior ranks as one type, producing 3 points across five types", () => {
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

  it("reads an army from stdin and writes its score as JSON", () => {
    const stdout = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      cwd: process.cwd(),
      encoding: "utf8",
      input: JSON.stringify({
        army: [
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "zombie" },
          { monster: "hydra" },
          { monster: "cyclops" },
        ],
      }),
    });

    expect(JSON.parse(stdout)).toEqual({ score: 5 });
  });
});
