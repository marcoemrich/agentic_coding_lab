import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores 0 for an army with no Sphinx — Chimera, Orthrus, Zombie → 0 points", () => {
    expect(
      scoreArmy([{ monster: "chimera" }, { monster: "orthrus" }, { monster: "zombie" }]),
    ).toBe(0);
  });
  it("scores a Sphinx counting itself among the types — Sphinx, Cyclops → 2 points", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores exactly three types as 1 point per Sphinx plus its own point — Sphinx, Chimera, Orthrus → 2 points", () => {
    expect(
      scoreArmy([{ monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" }]),
    ).toBe(2);
  });
  it("scores four types as 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ]),
    ).toBe(3);
  });
  it("scores five types as 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ]),
    ).toBe(5);
  });
  it("counts duplicate cards of the same monster as one type — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores each Sphinx independently and counts Sphinx as one type — Sphinx, Sphinx, Chimera, Orthrus → 4 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores each Sphinx independently beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(6);
  });
  it("treats Undead Warrior ranks as a single type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("treats all three Undead Warrior ranks as a single type among many — Sphinx, UW(1), UW(2), UW(3), Cyclops, Orthrus, Chimera → 3 points", () => {
    expect(
      scoreArmy([
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
