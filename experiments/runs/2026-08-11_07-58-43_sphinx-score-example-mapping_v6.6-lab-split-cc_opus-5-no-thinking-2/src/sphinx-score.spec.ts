import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an empty army — 0 points", () => {
    expect(scoreArmy([])).toBe(0);
  });
  it("scores an army with no Sphinx: Chimera, Orthrus, Zombie — 0 points", () => {
    expect(
      scoreArmy([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("scores a lone Sphinx — 2 points (no other types, else 1)", () => {
    expect(scoreArmy([{ monster: "sphinx" }])).toBe(2);
  });
  it("scores Sphinx, Cyclops — 2 points (one other type, else 1)", () => {
    expect(
      scoreArmy([{ monster: "sphinx" }, { monster: "cyclops" }]),
    ).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus — 2 points (two other types, else 1)", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra — 3 points (one type beyond three)", () => {
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
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops — 5 points (two types beyond three)", () => {
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
  it("counts repeated cards of the same monster once: Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus — 2 points", () => {
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
  it("counts all Undead Warrior variants as one type: Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera — 2 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("counts all three Undead Warrior variants as one type: Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera — 3 points", () => {
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
  it("lets each Sphinx count the other Sphinx as a type: Sphinx, Sphinx, Chimera, Orthrus — 4 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores both Sphinxes beyond three types: Sphinx, Sphinx, Chimera, Orthrus, Zombie — 6 points", () => {
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
