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
  it("scores Sphinx and Cyclops as 2 points (else 1 is per Sphinx, not per type)", () => {
    expect(scoreSphinxes([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("counts Sphinx as a type: Sphinx, Chimera, and Orthrus score 2 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("counts each monster type once despite repeated cards: Sphinx, three Chimeras, and two Orthruses score 2 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
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
  it("scores two Sphinxes with Chimera and Orthrus as 4 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores two Sphinxes with Chimera, Orthrus, and Zombie as 6 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("treats differently ranked Undead Warriors as one type in a three-type army, scoring 2 points", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("treats all three Undead Warrior ranks as one type in a five-type army, scoring 3 points", () => {
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
});
