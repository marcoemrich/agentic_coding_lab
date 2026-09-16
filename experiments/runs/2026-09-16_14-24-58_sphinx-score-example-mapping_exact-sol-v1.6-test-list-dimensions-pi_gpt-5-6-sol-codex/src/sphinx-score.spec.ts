// @ts-expect-error Node declarations are not a project dependency.
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinx } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0", () => {
    expect(scoreSphinx([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores a lone Sphinx as its 1 point plus the fallback 1, totaling 2", () => {
    expect(scoreSphinx([{ monster: "sphinx" }])).toBe(2);
  });
  it("scores Sphinx and Cyclops as 2 when no type is beyond the first three other types", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, and Orthrus as 2, with the Sphinx excluded from its own viewed types", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, and Hydra as 3", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra, and Cyclops as 5", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores two Sphinxes, Chimera, and Orthrus as 4 because each Sphinx sees the other", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores two Sphinxes, Chimera, Orthrus, and Zombie as 6", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("treats Undead Warrior ranks 1 and 3 as one type and scores the army as 2", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("treats all three Undead Warrior ranks as one type and scores the army as 3", () => {
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
  it("counts repeated Chimera and Orthrus cards once per type and scores the army as 2", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("CLI reads the whole multiline JSON input and writes a JSON object with integer score 5", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ],
    }, null, 2);

    const output = execFileSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      { input, encoding: "utf8" },
    );

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
