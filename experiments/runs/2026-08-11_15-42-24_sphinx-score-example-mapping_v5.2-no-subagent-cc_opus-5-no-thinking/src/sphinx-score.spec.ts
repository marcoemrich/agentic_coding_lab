import { describe, it, expect } from "vitest";
import {
  scoreArmy,
  type Card,
  type Monster,
  type Rank,
} from "./sphinx-score.js";

const army = (...cards: (Monster | Card)[]): Card[] =>
  cards.map((card) => (typeof card === "string" ? { monster: card } : card));

const undeadWarrior = (rank: Rank): Card => ({
  monster: "undead-warrior",
  rank,
});

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0 — Chimera, Orthrus, Zombie → 0", () => {
    expect(scoreArmy(army("chimera", "orthrus", "zombie"))).toBe(0);
  });
  it("scores a Sphinx with one other type as 2 — Sphinx, Cyclops → 2", () => {
    expect(scoreArmy(army("sphinx", "cyclops"))).toBe(2);
  });
  it("scores a Sphinx with three types in the army as 2 — Sphinx, Chimera, Orthrus → 2", () => {
    expect(scoreArmy(army("sphinx", "chimera", "orthrus"))).toBe(2);
  });
  it("counts repeated cards of the same monster once — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2", () => {
    expect(
      scoreArmy(
        army("sphinx", "chimera", "chimera", "chimera", "orthrus", "orthrus"),
      ),
    ).toBe(2);
  });
  it("pays 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3", () => {
    expect(
      scoreArmy(army("sphinx", "chimera", "orthrus", "zombie", "hydra")),
    ).toBe(3);
  });
  it("pays 2 for each further type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5", () => {
    expect(
      scoreArmy(
        army("sphinx", "chimera", "orthrus", "zombie", "hydra", "cyclops"),
      ),
    ).toBe(5);
  });
  it("counts all Undead Warrior variants as one type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2", () => {
    expect(
      scoreArmy(
        army("sphinx", undeadWarrior(1), undeadWarrior(3), "chimera"),
      ),
    ).toBe(2);
  });
  it("counts all three Undead Warrior variants as one type beyond three — Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera → 3", () => {
    expect(
      scoreArmy(
        army(
          "sphinx",
          undeadWarrior(1),
          undeadWarrior(2),
          undeadWarrior(3),
          "cyclops",
          "orthrus",
          "chimera",
        ),
      ),
    ).toBe(3);
  });
  it("scores each Sphinx, with a second Sphinx counting as a type — Sphinx, Sphinx, Chimera, Orthrus → 4", () => {
    expect(
      scoreArmy(army("sphinx", "sphinx", "chimera", "orthrus")),
    ).toBe(4);
  });
  it("scores each Sphinx beyond three types with a second Sphinx — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6", () => {
    expect(
      scoreArmy(army("sphinx", "sphinx", "chimera", "orthrus", "zombie")),
    ).toBe(6);
  });
});
