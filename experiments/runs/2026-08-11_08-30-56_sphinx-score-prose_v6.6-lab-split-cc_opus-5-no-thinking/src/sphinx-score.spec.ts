import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an empty army as 0", () => {
    expect(scoreArmy([])).toBe(0);
  });
  it("scores an army without a Sphinx as 0 — a lone Zombie is worth 0", () => {
    expect(scoreArmy([{ monster: "zombie" }])).toBe(0);
  });
  it("scores an army of several non-Sphinx monsters as 0 — Zombie, Hydra, Cyclops is 0", () => {
    expect(
      scoreArmy([{ monster: "zombie" }, { monster: "hydra" }, { monster: "cyclops" }]),
    ).toBe(0);
  });
  it("scores a lone Sphinx as 1 — three types or fewer means 1 per Sphinx", () => {
    expect(scoreArmy([{ monster: "sphinx" }])).toBe(1);
  });
  it("scores two Sphinxes in a one-type army as 2 — 1 point each", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "sphinx" }])).toBe(2);
  });
  it("scores a Sphinx with three distinct types as 1 — Sphinx, Zombie, Hydra is 1", () => {
    expect(
      scoreArmy([{ monster: "sphinx" }, { monster: "zombie" }, { monster: "hydra" }]),
    ).toBe(1);
  });
  it("scores a Sphinx with four distinct types as 2 — Sphinx, Zombie, Hydra, Cyclops is 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ]),
    ).toBe(2);
  });
  it("scores two Sphinxes with four distinct types as 4 — 2 points each", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ]),
    ).toBe(4);
  });
  it("ignores duplicate cards when counting types — Sphinx, Zombie, Zombie, Hydra, Hydra is 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "zombie" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "hydra" },
      ]),
    ).toBe(1);
  });
  it("counts Undead Warrior ranks as distinct types — Sphinx plus ranks 1, 2 and 3 is 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
      ]),
    ).toBe(2);
  });
  it("counts Undead Warriors of the same rank as one type — Sphinx plus two rank-2 warriors is 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 2 },
      ]),
    ).toBe(1);
  });
  it("scores the spec example army — Sphinx, Undead Warrior rank 2, Hydra is 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ]),
    ).toBe(1);
  });
  it("scores an army with all seven monsters and a Sphinx as 2 per Sphinx", () => {
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
});
