import { execFileSync } from "node:child_process";

import { describe, expect, it } from "vitest";

import { scoreSphinx } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores Sphinx, Cyclops as 2 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus as 2 points, because a Sphinx does not count itself as another type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra as 3 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops as 5 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores Sphinx, Sphinx, Chimera, Orthrus as 4 points, because each Sphinx sees the other Sphinx type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores Sphinx, Sphinx, Chimera, Orthrus, Zombie as 6 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("scores Sphinx, Chimera, Orthrus as 2 points, applying the else bonus once rather than per type", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores Undead Warrior ranks 1 and 3 as one type: Sphinx, both Warriors, Chimera scores 2 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("scores all three Undead Warrior ranks as one type: Sphinx, Warriors, Cyclops, Orthrus, Chimera scores 3 points", () => {
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
  it("scores repeated monsters once per type: Sphinx, three Chimeras, two Orthruses scores 2 points", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores Chimera, Orthrus, Zombie as 0 points when there is no Sphinx", () => {
    expect(scoreSphinx([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("CLI reads the whole stdin army and writes the JSON score document {\"score\":5}", () => {
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

    const output = execFileSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      { encoding: "utf8", input },
    );

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
