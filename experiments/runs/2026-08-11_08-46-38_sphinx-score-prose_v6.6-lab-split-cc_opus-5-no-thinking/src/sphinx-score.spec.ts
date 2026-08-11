import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  // Baseline: no Sphinx, no points
  it("scores an empty army as 0", () => {
    expect(scoreArmy([])).toBe(0);
  });
  it("scores an army with no sphinx as 0 — [hydra] scores 0", () => {
    expect(scoreArmy([{ monster: "hydra" }])).toBe(0);
  });
  it("scores an army of only non-sphinx monsters as 0 — [hydra, zombie, cyclops, orthrus] scores 0", () => {
    expect(
      scoreArmy([
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ]),
    ).toBe(0);
  });

  // A single Sphinx, three or fewer types → 1 point each
  it("scores a lone sphinx as 1 — [sphinx] has 1 type, not beyond three, so 1", () => {
    expect(scoreArmy([{ monster: "sphinx" }])).toBe(1);
  });
  it("scores a sphinx with two types as 1 — [sphinx, hydra] has 2 types, so 1", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }])).toBe(1);
  });
  it("scores a sphinx with exactly three types as 1 — [sphinx, hydra, zombie] has 3 types, so 1", () => {
    expect(
      scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }, { monster: "zombie" }]),
    ).toBe(1);
  });

  // Beyond three types → 2 per type beyond three
  it("scores a sphinx with four types as 2 — [sphinx, hydra, zombie, cyclops] has 4 types, 2 x 1 beyond three", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ]),
    ).toBe(2);
  });
  it("scores a sphinx with five types as 4 — [sphinx, hydra, zombie, cyclops, orthrus] has 5 types, 2 x 2 beyond three", () => {
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
  it("scores a sphinx with all seven types as 8 — [sphinx, undead-warrior, zombie, hydra, cyclops, orthrus, chimera] has 7 types, 2 x 4 beyond three", () => {
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

  // Duplicates of the same monster count as one type
  it("counts duplicate monsters as a single type — [sphinx, hydra, hydra, zombie] has 3 types, so 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "hydra" },
        { monster: "zombie" },
      ]),
    ).toBe(1);
  });

  // Undead Warrior rank variants are distinct types
  it("treats undead-warrior ranks as distinct types — [sphinx, undead-warrior rank 1, undead-warrior rank 2, undead-warrior rank 3] has 4 types, so 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
      ]),
    ).toBe(2);
  });
  it("counts repeated undead-warriors of the same rank as one type — [sphinx, undead-warrior rank 2, undead-warrior rank 2] has 2 types, so 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 2 },
      ]),
    ).toBe(1);
  });

  // Multiple Sphinxes each score
  it("scores each sphinx separately below the threshold — [sphinx, sphinx, hydra] has 2 types, so 2 sphinxes x 1 = 2", () => {
    expect(
      scoreArmy([{ monster: "sphinx" }, { monster: "sphinx" }, { monster: "hydra" }]),
    ).toBe(2);
  });
  it("scores each sphinx separately beyond the threshold — [sphinx, sphinx, hydra, zombie, cyclops] has 4 types, so 2 sphinxes x 2 = 4", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ]),
    ).toBe(4);
  });

  // Integration example
  it("scores the spec example army — [sphinx, undead-warrior rank 2, hydra] has 3 types, so 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ]),
    ).toBe(1);
  });
});
