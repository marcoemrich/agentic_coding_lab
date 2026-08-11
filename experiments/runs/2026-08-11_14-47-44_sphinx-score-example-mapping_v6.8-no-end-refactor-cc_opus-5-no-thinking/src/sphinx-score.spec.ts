import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores 0 for an army with no Sphinx — Chimera, Orthrus, Zombie → 0", () => {
    expect(
      scoreArmy([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("scores 2 for a Sphinx with two types total — Sphinx, Cyclops → 2", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores 2 counting the Sphinx itself as a type — Sphinx, Chimera, Orthrus → 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores 3 for five types — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3", () => {
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
  it("scores 5 for six types — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5", () => {
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
  it("counts duplicate cards of the same monster once — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2", () => {
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
  it("treats Undead Warrior variants as one type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("treats Undead Warrior variants as one type in a larger army — Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera → 3", () => {
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
  it("scores each Sphinx separately — Sphinx, Sphinx, Chimera, Orthrus → 4", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores each Sphinx separately beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6", () => {
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
});
