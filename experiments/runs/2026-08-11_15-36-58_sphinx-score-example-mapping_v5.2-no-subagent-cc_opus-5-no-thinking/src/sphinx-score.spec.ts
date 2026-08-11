import { describe, it, expect } from "vitest";
import { sphinxScore } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores 0 for an army without a Sphinx — Chimera, Orthrus, Zombie → 0", () => {
    expect(
      sphinxScore([{ monster: "chimera" }, { monster: "orthrus" }, { monster: "zombie" }]),
    ).toBe(0);
  });
  it("scores 2 for a Sphinx with one other type — Sphinx, Cyclops → 2", () => {
    expect(sphinxScore([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores 2 for a Sphinx with two other types — Sphinx, Chimera, Orthrus → 2", () => {
    expect(
      sphinxScore([{ monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" }]),
    ).toBe(2);
  });
  it("counts duplicate cards of a monster only once — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores 3 when four other types are present — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ]),
    ).toBe(3);
  });
  it("scores 5 when five other types are present — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ]),
    ).toBe(5);
  });
  it("counts another Sphinx as a type — Sphinx, Sphinx, Chimera, Orthrus → 4", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("counts another Sphinx towards types beyond three — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(6);
  });
  it("counts Undead Warrior ranks as a single type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("counts all three Undead Warrior ranks as one type — Sphinx, UW(1), UW(2), UW(3), Cyclops, Orthrus, Chimera → 3", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "cyclops" },
        { monster: "orthrus" },
        { monster: "chimera" },
      ]),
    ).toBe(3);
  });
});
