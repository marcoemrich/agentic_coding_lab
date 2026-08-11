import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  // No Sphinx in the army — only Sphinx cards produce points
  it("scores an empty army as 0", () => {
    expect(scoreArmy([])).toBe(0);
  });
  it("scores an army with no Sphinx as 0 — [hydra, zombie] is 0", () => {
    expect(scoreArmy([{ monster: "hydra" }, { monster: "zombie" }])).toBe(0);
  });

  // Single Sphinx, type count at or below three → 1 point per type
  it("scores a lone Sphinx as 1 — 1 type, not beyond three, 1 per type", () => {
    expect(scoreArmy([{ monster: "sphinx" }])).toBe(1);
  });
  it("scores [sphinx, hydra] as 2 — 2 types at 1 per type", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }])).toBe(2);
  });
  it("scores [sphinx, hydra, zombie] as 3 — 3 types at 1 per type", () => {
    expect(
      scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }, { monster: "zombie" }]),
    ).toBe(3);
  });

  // Single Sphinx, type count beyond three → 2 points per type
  it("scores [sphinx, hydra, zombie, cyclops] as 8 — 4 types at 2 per type", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ]),
    ).toBe(8);
  });
  it("scores [sphinx, hydra, zombie, cyclops, orthrus] as 10 — 5 types at 2 per type", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ]),
    ).toBe(10);
  });

  // Duplicate cards collapse to a single type
  it("counts repeated monsters once — [sphinx, hydra, hydra] is 2", () => {
    expect(
      scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }, { monster: "hydra" }]),
    ).toBe(2);
  });

  // Undead Warrior ranks are distinct types
  it("counts one Undead Warrior rank as one type — [sphinx, undead-warrior(2), hydra] is 3", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ]),
    ).toBe(3);
  });
  it("counts two Undead Warrior ranks as two types — [sphinx, undead-warrior(1), undead-warrior(2)] is 3", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
      ]),
    ).toBe(3);
  });
  it("counts three Undead Warrior ranks as three types — [sphinx, undead-warrior(1), undead-warrior(2), undead-warrior(3)] is 8", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
      ]),
    ).toBe(8);
  });
  it("counts repeated Undead Warriors of the same rank once — [sphinx, undead-warrior(2), undead-warrior(2)] is 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 2 },
      ]),
    ).toBe(2);
  });

  // Multiple Sphinx cards each score
  it("scores each Sphinx card — [sphinx, sphinx] is 2", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "sphinx" }])).toBe(2);
  });
  it("scores each Sphinx card beyond three types — [sphinx, sphinx, hydra, zombie, cyclops] is 16", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ]),
    ).toBe(16);
  });

  // Full-army combination
  it("scores a full army of all seven monsters with all Undead Warrior ranks — 9 types at 2 per type is 18", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
        { monster: "orthrus" },
        { monster: "chimera" },
      ]),
    ).toBe(18);
  });
});
