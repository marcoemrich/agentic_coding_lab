import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinx } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores Chimera, Orthrus, and Zombie without a Sphinx as 0 points", () => {
    expect(scoreSphinx([
      { monster: "chimera" }, { monster: "orthrus" }, { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores Sphinx and Cyclops as 2 points: else 1 means one point per Sphinx, not per type", () => {
    expect(scoreSphinx([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores Sphinx, Chimera, and Orthrus as 2 points and counts Sphinx as a type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores repeated Chimera and Orthrus cards as 2 points because duplicates are not new types", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" }, { monster: "chimera" }, { monster: "chimera" },
      { monster: "orthrus" }, { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores rank 1 and rank 3 Undead Warriors as one monster type, for 2 points total", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("scores five types including Sphinx as 3 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" },
      { monster: "zombie" }, { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores six types including Sphinx as 5 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" },
      { monster: "zombie" }, { monster: "hydra" }, { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores two Sphinxes plus Chimera and Orthrus as 4 points, so Sphinxes share one type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" }, { monster: "sphinx" },
      { monster: "chimera" }, { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores two Sphinxes among four types as 6 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" }, { monster: "sphinx" },
      { monster: "chimera" }, { monster: "orthrus" }, { monster: "zombie" },
    ])).toBe(6);
  });
  it("scores all three Undead Warrior ranks as one type among five types, for 3 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" }, { monster: "orthrus" }, { monster: "chimera" },
    ])).toBe(3);
  });
  it("reads the whole army JSON from stdin and writes a JSON score to stdout", () => {
    const input = JSON.stringify({ army: [
      { monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" },
      { monster: "zombie" }, { monster: "hydra" }, { monster: "cyclops" },
    ] });
    const output = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
