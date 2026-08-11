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
  describe("No Sphinx", () => {
    it("scores 0 for an army without a Sphinx — Chimera, Orthrus, Zombie → 0 points", () => {
      expect(scoreArmy(army("chimera", "orthrus", "zombie"))).toBe(0);
    });
  });

  describe("Does a Sphinx count towards the types in the army?", () => {
    it("scores 2 for a Sphinx with two other types — Sphinx, Chimera, Orthrus → 2 points", () => {
      expect(scoreArmy(army("sphinx", "chimera", "orthrus"))).toBe(2);
    });
    it("scores 3 when the other cards show four types — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3 points", () => {
      expect(
        scoreArmy(army("sphinx", "chimera", "orthrus", "zombie", "hydra")),
      ).toBe(3);
    });
    it("scores 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5 points", () => {
      expect(
        scoreArmy(
          army("sphinx", "chimera", "orthrus", "zombie", "hydra", "cyclops"),
        ),
      ).toBe(5);
    });
  });

  describe("A second Sphinx", () => {
    it("lets a Sphinx count another Sphinx but not itself — Sphinx, Sphinx, Chimera, Orthrus → 4 points", () => {
      expect(scoreArmy(army("sphinx", "sphinx", "chimera", "orthrus"))).toBe(4);
    });
    it("scores each of two Sphinxes beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6 points", () => {
      expect(
        scoreArmy(army("sphinx", "sphinx", "chimera", "orthrus", "zombie")),
      ).toBe(6);
    });
  });

  describe("Beyond three types", () => {
    it("scores 2 for a Sphinx with one other type — Sphinx, Cyclops → 2 points", () => {
      expect(scoreArmy(army("sphinx", "cyclops"))).toBe(2);
    });
  });

  describe("Several cards of the same monster", () => {
    it("counts a monster type only once no matter how many cards — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2 points", () => {
      expect(
        scoreArmy(
          army("sphinx", "chimera", "chimera", "chimera", "orthrus", "orthrus"),
        ),
      ).toBe(2);
    });
  });

  describe("Undead Warrior variants", () => {
    it("treats all Undead Warrior rank variants as one type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2 points", () => {
      expect(
        scoreArmy(
          army("sphinx", undeadWarrior(1), undeadWarrior(3), "chimera"),
        ),
      ).toBe(2);
    });
    it("treats three Undead Warrior variants as one type among four — Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera → 3 points", () => {
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
  });
});
