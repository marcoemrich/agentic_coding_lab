import { describe, it, expect } from "vitest";
import { scoreArmy, type Monster } from "./sphinx-score.js";

type CardSpec = Monster | [monster: Monster, rank: number];

const army = (...cards: CardSpec[]) =>
  cards.map((card) =>
    Array.isArray(card) ? { monster: card[0], rank: card[1] } : { monster: card },
  );

describe("Sphinx scoring", () => {
  // No Sphinx
  it("scores an army with no Sphinx as 0 — Chimera, Orthrus, Zombie → 0", () => {
    expect(scoreArmy(army("chimera", "orthrus", "zombie"))).toBe(0);
  });

  // "…else 1" — at or below three types, the bonus is a flat 1
  it("scores a lone Sphinx with one other type as 2 — Sphinx, Cyclops → 2", () => {
    expect(scoreArmy(army("sphinx", "cyclops"))).toBe(2);
  });
  it("scores a Sphinx with three types in the army as 2 — Sphinx, Chimera, Orthrus → 2", () => {
    expect(scoreArmy(army("sphinx", "chimera", "orthrus"))).toBe(2);
  });

  // Duplicate cards of the same monster collapse to one type
  it("ignores duplicate cards of the same monster — Sphinx, Chimera x3, Orthrus x2 → 2", () => {
    expect(
      scoreArmy(army("sphinx", "chimera", "chimera", "chimera", "orthrus", "orthrus")),
    ).toBe(2);
  });

  // Beyond three types: 2 per type beyond three, on top of the base point
  it("scores 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3", () => {
    expect(scoreArmy(army("sphinx", "chimera", "orthrus", "zombie", "hydra"))).toBe(3);
  });
  it("scores 2 per type beyond three for a wider army — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5", () => {
    expect(
      scoreArmy(army("sphinx", "chimera", "orthrus", "zombie", "hydra", "cyclops")),
    ).toBe(5);
  });

  // A Sphinx does not count itself, but does count another Sphinx
  it("does not count itself towards its own types — Sphinx, Sphinx, Chimera, Orthrus → 4", () => {
    expect(scoreArmy(army("sphinx", "sphinx", "chimera", "orthrus"))).toBe(4);
  });
  it("counts the other Sphinx towards types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6", () => {
    expect(scoreArmy(army("sphinx", "sphinx", "chimera", "orthrus", "zombie"))).toBe(6);
  });

  // Undead Warrior variants are one type
  it("treats Undead Warrior variants as one type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2", () => {
    expect(
      scoreArmy(army("sphinx", ["undead-warrior", 1], ["undead-warrior", 3], "chimera")),
    ).toBe(2);
  });
  it("treats all three Undead Warrior variants as one type — Sphinx, UW (1), UW (2), UW (3), Cyclops, Orthrus, Chimera → 3", () => {
    expect(
      scoreArmy(
        army(
          "sphinx",
          ["undead-warrior", 1],
          ["undead-warrior", 2],
          ["undead-warrior", 3],
          "cyclops",
          "orthrus",
          "chimera",
        ),
      ),
    ).toBe(3);
  });
});
