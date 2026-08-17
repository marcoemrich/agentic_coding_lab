import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinx } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores Chimera, Orthrus, Zombie with no Sphinx as 0 points", () => {
    expect(scoreSphinx([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores Sphinx and Cyclops as 2 points: below four types, else means 1 point per type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, and Orthrus as 2 points: the Sphinx counts as a type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus as 2 points: repeated cards do not add types", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores Sphinx, Undead Warrior ranks 1 and 3, and Chimera as 2 points: ranks are one monster type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("scores two Sphinxes, Chimera, and Orthrus as 4 points: each Sphinx scores independently without adding a type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, and Hydra as 3 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores Sphinx and all three Undead Warrior ranks, Cyclops, Orthrus, and Chimera as 3 points", () => {
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
  it("scores two Sphinxes, Chimera, Orthrus, and Zombie as 6 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra, and Cyclops as 5 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
});

describe("command-line interface", () => {
  it("reads the complete JSON army from stdin and writes the integer score as JSON using the binding field names", () => {
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
