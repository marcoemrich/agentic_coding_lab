import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";
import { scoreArmyDocument } from "./cli.js";

describe("Sphinx Scoring", () => {
  // Empty / no-sphinx armies
  it("scores an empty army as 0", () => {
    expect(scoreArmy([])).toBe(0);
  });
  it("scores an army of non-sphinx monsters as 0 — [hydra, zombie] is 0", () => {
    expect(scoreArmy([{ monster: "hydra" }, { monster: "zombie" }])).toBe(0);
  });

  // A single Sphinx, few types: the "else 1" branch
  it("scores a lone sphinx as 1 — one type is not beyond three", () => {
    expect(scoreArmy([{ monster: "sphinx" }])).toBe(1);
  });
  it("scores a sphinx with two types as 1 — [sphinx, hydra] is 1", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }])).toBe(1);
  });
  it("scores a sphinx with exactly three types as 1 — [sphinx, hydra, zombie] is 1", () => {
    expect(
      scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }, { monster: "zombie" }]),
    ).toBe(1);
  });

  // The "2 per type beyond three" branch
  it("scores a sphinx with four types as 2 — [sphinx, hydra, zombie, cyclops] is 2 (one type beyond three)", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ]),
    ).toBe(2);
  });
  it("scores a sphinx with five types as 4 — [sphinx, hydra, zombie, cyclops, orthrus] is 4 (two types beyond three)", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores a sphinx with all seven monsters as 8 — four types beyond three", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
        { monster: "orthrus" },
        { monster: "chimera" },
      ]),
    ).toBe(8);
  });

  // Duplicates do not add types
  it("counts each monster type once — [sphinx, hydra, hydra, zombie, zombie] is 1 (three types)", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "zombie" },
      ]),
    ).toBe(1);
  });
  it("counts duplicate sphinx cards as a single type — [sphinx, sphinx, hydra, zombie] is 1 each, total 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
      ]),
    ).toBe(2);
  });

  // Undead Warrior rank variants are distinct types
  it("treats undead warrior ranks as distinct types — [sphinx, undead-warrior r1, undead-warrior r2, undead-warrior r3] is 2 (four types)", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
      ]),
    ).toBe(2);
  });
  it("treats undead warriors of the same rank as one type — [sphinx, undead-warrior r2, undead-warrior r2] is 1 (two types)", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 2 },
      ]),
    ).toBe(1);
  });

  // Multiple Sphinx cards each score
  it("scores every sphinx in the army — [sphinx, sphinx] is 2 (one type, 1 point each)", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "sphinx" }])).toBe(2);
  });
  it("scores two sphinxes with five types as 8 — 4 points each", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ]),
    ).toBe(8);
  });

  // Full worked example
  it("scores the spec example [sphinx, undead-warrior r2, hydra] as 1 — three types", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ]),
    ).toBe(1);
  });
});

describe("Sphinx Scoring CLI document", () => {
  it("scores a JSON army document — {\"army\":[{\"monster\":\"sphinx\"}]} yields {\"score\":1}", () => {
    expect(scoreArmyDocument('{"army":[{"monster":"sphinx"}]}')).toBe('{"score":1}');
  });
});
