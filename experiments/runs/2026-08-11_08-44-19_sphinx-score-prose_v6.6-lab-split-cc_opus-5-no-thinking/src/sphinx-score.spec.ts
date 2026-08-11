import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  // Simplest cases — no Sphinx, no points
  it("scores an empty army as 0", () => {
    expect(scoreArmy([])).toBe(0);
  });
  it("scores an army with no Sphinx as 0 — a lone hydra is worth 0", () => {
    expect(scoreArmy([{ monster: "hydra" }])).toBe(0);
  });
  it("scores an army of only non-Sphinx monsters as 0 — hydra, zombie, cyclops, orthrus is worth 0", () => {
    expect(
      scoreArmy([
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ]),
    ).toBe(0);
  });

  // A single Sphinx, three or fewer types — 1 point each
  it("scores a lone Sphinx as 1 — one type is not beyond three", () => {
    expect(scoreArmy([{ monster: "sphinx" }])).toBe(1);
  });
  it("scores a Sphinx with one other type as 1 — sphinx, hydra is worth 1", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }])).toBe(1);
  });
  it("scores a Sphinx with three types total as 1 — sphinx, hydra, zombie is worth 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
      ]),
    ).toBe(1);
  });

  // A single Sphinx, more than three types — 2 points each
  it("scores a Sphinx with four types total as 2 — sphinx, hydra, zombie, cyclops is worth 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ]),
    ).toBe(2);
  });
  it("scores a Sphinx with seven types total as 2 — every monster once is worth 2", () => {
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
    ).toBe(2);
  });

  // Duplicates do not add types
  it("counts repeated monsters as one type — sphinx, hydra, hydra, hydra is worth 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "hydra" },
        { monster: "hydra" },
      ]),
    ).toBe(1);
  });
  it("counts repeated monsters as one type when beyond three — sphinx, hydra, hydra, zombie, cyclops is worth 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ]),
    ).toBe(2);
  });

  // Multiple Sphinxes — each scores
  it("scores each Sphinx separately — two sphinxes alone are worth 2", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "sphinx" }])).toBe(2);
  });
  it("scores each Sphinx at 2 when beyond three types — two sphinxes with hydra, zombie, cyclops are worth 4", () => {
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
  it("counts Sphinx duplicates as a single type — three sphinxes alone are worth 3", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "sphinx" },
      ]),
    ).toBe(3);
  });

  // Undead Warrior rank variants are one type
  it("counts Undead Warrior ranks as a single type — sphinx, undead-warrior ranks 1, 2, 3 is worth 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
      ]),
    ).toBe(1);
  });
  it("counts Undead Warrior as one type among others — sphinx, undead-warrior ranks 1 and 2, hydra, zombie is worth 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
        { monster: "zombie" },
      ]),
    ).toBe(2);
  });

  // Spec example
  it("scores the spec example — sphinx, undead-warrior rank 2, hydra is worth 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ]),
    ).toBe(1);
  });
});
