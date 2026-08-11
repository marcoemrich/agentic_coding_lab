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
  it("scores a Sphinx with one other type as 2 points — Sphinx, Cyclops → 2", () => {
    expect(sphinxScore([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores a Sphinx counting itself among the types — Sphinx, Chimera, Orthrus → 2", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores 3 points at five types — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3", () => {
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
  it("scores 5 points at six types — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5", () => {
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
  it("counts duplicate cards of a monster as one type — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2", () => {
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
  it("counts all Undead Warrior rank variants as a single type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("counts Undead Warrior variants as one type beyond three types — Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera → 3", () => {
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
  it("scores each Sphinx separately with Sphinx as a single type — Sphinx, Sphinx, Chimera, Orthrus → 4", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores two Sphinxes beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6", () => {
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
