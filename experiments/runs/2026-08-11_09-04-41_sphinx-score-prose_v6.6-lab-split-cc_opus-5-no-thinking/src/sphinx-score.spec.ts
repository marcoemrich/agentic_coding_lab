import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  // --- No Sphinx present: only Sphinx cards produce points ---
  it("scores an empty army as 0", () => {
    expect(scoreArmy([])).toBe(0);
  });
  it("scores an army with no Sphinx as 0 — a lone hydra is worth 0", () => {
    expect(scoreArmy([{ monster: "hydra" }])).toBe(0);
  });
  it("scores an army of many non-Sphinx monsters as 0 — hydra, zombie, cyclops, orthrus is worth 0", () => {
    expect(
      scoreArmy([
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ]),
    ).toBe(0);
  });

  // --- A single Sphinx, three or fewer distinct types: 1 point each ---
  it("scores a lone Sphinx as 1 — one type is not beyond three", () => {
    expect(scoreArmy([{ monster: "sphinx" }])).toBe(1);
  });
  it("scores a Sphinx with two distinct types as 1 — sphinx, hydra is worth 1", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "hydra" }])).toBe(1);
  });
  it("scores a Sphinx with exactly three distinct types as 1 — sphinx, hydra, zombie is worth 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
      ]),
    ).toBe(1);
  });

  // --- A single Sphinx, more than three distinct types: 2 per type beyond three ---
  it("scores a Sphinx with four distinct types as 2 — sphinx, hydra, zombie, cyclops is worth 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ]),
    ).toBe(2);
  });
  it("scores a Sphinx with five distinct types as 4 — sphinx, hydra, zombie, cyclops, orthrus is worth 4", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores a Sphinx with all seven distinct types as 8 — four types beyond three is worth 8", () => {
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
    ).toBe(8);
  });

  // --- Duplicates do not add types ---
  it("counts a repeated monster as a single type — sphinx, hydra, hydra, zombie is worth 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "hydra" },
        { monster: "zombie" },
      ]),
    ).toBe(1);
  });

  // --- Undead Warrior ranks are distinct types ---
  it("counts each Undead Warrior rank as its own type — sphinx, undead-warrior rank 1, rank 2, rank 3 is worth 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
      ]),
    ).toBe(2);
  });
  it("counts two Undead Warriors of the same rank as one type — sphinx, undead-warrior rank 2, rank 2, hydra is worth 1", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ]),
    ).toBe(1);
  });

  // --- Multiple Sphinxes each score ---
  it("scores two Sphinxes with three or fewer types as 2 — 1 point each", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "hydra" },
      ]),
    ).toBe(2);
  });
  it("scores two Sphinxes with five distinct types as 8 — 4 points each", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ]),
    ).toBe(8);
  });

  // --- Integration example from the spec ---
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
