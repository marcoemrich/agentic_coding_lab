import { describe, it, expect } from "vitest";
import { sphinxScore } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an empty army as 0 points", () => {
    expect(sphinxScore([])).toBe(0);
  });
  it("scores an army without a Sphinx as 0 points — Chimera, Orthrus, Zombie → 0", () => {
    expect(
      sphinxScore([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("scores a Sphinx counting itself as a type — Sphinx, Cyclops → 2 points", () => {
    expect(
      sphinxScore([{ monster: "sphinx" }, { monster: "cyclops" }]),
    ).toBe(2);
  });
  it("gives 1 point per type when at most three types — Sphinx, Chimera, Orthrus → 2 points", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("gives 2 points per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3 points", () => {
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
  it("gives 2 points per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5 points", () => {
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
  it("counts duplicate monsters as one type — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2 points", () => {
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
  it("counts Undead Warrior variants as one type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2 points", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("counts Undead Warrior variants as one type beyond three types — Sphinx, UW(1), UW(2), UW(3), Cyclops, Orthrus, Chimera → 3 points", () => {
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
  it("scores each Sphinx separately — Sphinx, Sphinx, Chimera, Orthrus → 4 points", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores each Sphinx separately beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6 points", () => {
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
});
