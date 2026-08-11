import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx — Chimera, Orthrus, Zombie → 0 points", () => {
    expect(
      scoreArmy([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("scores a Sphinx with one other type — Sphinx, Cyclops → 2 points", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores a Sphinx with two other types — Sphinx, Chimera, Orthrus → 2 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("counts repeated cards of a monster once — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2 points", () => {
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
  it("scores 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3 points", () => {
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
  it("scores 2 per type beyond three for two extra types — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5 points", () => {
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
  it("lets each Sphinx count the other Sphinx as a type — Sphinx, Sphinx, Chimera, Orthrus → 4 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores both Sphinxes beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6 points", () => {
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
  it("treats Undead Warrior variants as a single type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("treats all three Undead Warrior variants as one type among many — Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera → 3 points", () => {
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
