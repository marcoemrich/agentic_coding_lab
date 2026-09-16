import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinx } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an empty army as 0 because it has no Sphinx", () => {
    expect(scoreSphinx([])).toBe(0);
  });
  it("scores Chimera, Orthrus, Zombie as 0 because non-Sphinx cards produce no points", () => {
    expect(scoreSphinx([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores every supported non-Sphinx monster and all Undead Warrior ranks as 0", () => {
    expect(scoreSphinx([
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    ])).toBe(0);
  });
  it("scores Sphinx, Cyclops as 2: the Sphinx type counts and the else bonus is once", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus as 2 (both occurrences of this example)", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores repeated Chimera and Orthrus cards as 2 because repeated cards are not new types", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores Undead Warrior ranks 1 and 3 as one monster type, yielding 2", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra as 3 beyond three types", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores all three Undead Warrior ranks with Cyclops, Orthrus, Chimera as 3", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    ])).toBe(3);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops as 5", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores two Sphinxes with Chimera and Orthrus as 4", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores two Sphinxes with Chimera, Orthrus, Zombie as 6", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("CLI reads the complete stdin army and writes the score as JSON using binding field names", () => {
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
      input,
      encoding: "utf8",
    });
    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
