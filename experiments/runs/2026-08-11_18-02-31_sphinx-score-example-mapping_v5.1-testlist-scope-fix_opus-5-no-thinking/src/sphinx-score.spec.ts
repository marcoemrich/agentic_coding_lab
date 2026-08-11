import { describe, it, expect } from "vitest";
import { scoreArmy } from "./sphinx-score.js";

const army = (...monsters: string[]) =>
  monsters.map((monster) => ({ monster }));

/** An Undead Warrior of the given point variant. */
const undeadWarrior = (rank: number) => ({ monster: "undead-warrior", rank });

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0 — Chimera, Orthrus, Zombie → 0", () => {
    expect(scoreArmy(army("chimera", "orthrus", "zombie"))).toBe(0);
  });
  it("scores a lone Sphinx with one other type as 2 — Sphinx, Cyclops → 2", () => {
    expect(scoreArmy(army("sphinx", "cyclops"))).toBe(2);
  });
  it("scores a Sphinx with two other types as 2 — Sphinx, Chimera, Orthrus → 2", () => {
    expect(scoreArmy(army("sphinx", "chimera", "orthrus"))).toBe(2);
  });
  it("counts several cards of the same monster as one type — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2", () => {
    expect(
      scoreArmy(
        army("sphinx", "chimera", "chimera", "chimera", "orthrus", "orthrus"),
      ),
    ).toBe(2);
  });
  it("counts all three Undead Warrior variants as a single type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2", () => {
    expect(
      scoreArmy([
        ...army("sphinx"),
        undeadWarrior(1),
        undeadWarrior(3),
        ...army("chimera"),
      ]),
    ).toBe(2);
  });
  it("does not count the scoring Sphinx itself as a type — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3", () => {
    expect(
      scoreArmy(army("sphinx", "chimera", "orthrus", "zombie", "hydra")),
    ).toBe(3);
  });
  it("scores 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5", () => {
    expect(
      scoreArmy(
        army("sphinx", "chimera", "orthrus", "zombie", "hydra", "cyclops"),
      ),
    ).toBe(5);
  });
  it("counts Undead Warrior variants as one type beyond three — Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera → 3", () => {
    expect(
      scoreArmy([
        ...army("sphinx"),
        undeadWarrior(1),
        undeadWarrior(2),
        undeadWarrior(3),
        ...army("cyclops", "orthrus", "chimera"),
      ]),
    ).toBe(3);
  });
  it("lets each Sphinx count the other Sphinx as a type — Sphinx, Sphinx, Chimera, Orthrus → 4", () => {
    expect(
      scoreArmy(army("sphinx", "sphinx", "chimera", "orthrus")),
    ).toBe(4);
  });
  it("scores both Sphinxes beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6", () => {
    expect(
      scoreArmy(army("sphinx", "sphinx", "chimera", "orthrus", "zombie")),
    ).toBe(6);
  });
});
