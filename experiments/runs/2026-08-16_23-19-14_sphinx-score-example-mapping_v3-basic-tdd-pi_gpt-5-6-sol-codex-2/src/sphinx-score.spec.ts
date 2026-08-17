import { describe, expect, it } from "vitest";
import { scoreSphinxes, type Card } from "./sphinx-score.js";

describe("scoreSphinxes", () => {
  it.each([
    [["sphinx", "chimera", "orthrus"], 2],
    [["sphinx", "chimera", "orthrus", "zombie", "hydra"], 3],
    [["sphinx", "chimera", "orthrus", "zombie", "hydra", "cyclops"], 5],
  ] as const)("does not count a Sphinx's own card among the types it sees", (monsters, score) => {
    expect(scoreSphinxes(monsters.map(card))).toBe(score);
  });

  it.each([
    [["sphinx", "sphinx", "chimera", "orthrus"], 4],
    [["sphinx", "sphinx", "chimera", "orthrus", "zombie"], 6],
  ] as const)("counts multiple Sphinx cards as one type", (monsters, score) => {
    expect(scoreSphinxes(monsters.map(card))).toBe(score);
  });

  it.each([
    [["sphinx", "cyclops"], 2],
    [["sphinx", "chimera", "orthrus"], 2],
  ] as const)("awards one fallback point, not one per type", (monsters, score) => {
    expect(scoreSphinxes(monsters.map(card))).toBe(score);
  });

  it("treats all Undead Warrior ranks as one type", () => {
    expect(scoreSphinxes([
      card("sphinx"),
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      card("chimera"),
    ])).toBe(2);

    expect(scoreSphinxes([
      card("sphinx"),
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      card("cyclops"),
      card("orthrus"),
      card("chimera"),
    ])).toBe(3);
  });

  it("counts repeated cards of a monster as one type", () => {
    expect(scoreSphinxes([
      card("sphinx"),
      card("chimera"), card("chimera"), card("chimera"),
      card("orthrus"), card("orthrus"),
    ])).toBe(2);
  });

  it("scores zero when the army has no Sphinx", () => {
    expect(scoreSphinxes([card("chimera"), card("orthrus"), card("zombie")])).toBe(0);
  });

  it("scores an empty army as zero", () => {
    expect(scoreSphinxes([])).toBe(0);
  });

  it("gives a lone Sphinx its base and fallback points", () => {
    expect(scoreSphinxes([card("sphinx")])).toBe(2);
  });
});

function card(monster: Exclude<Card["monster"], "undead-warrior">): Card {
  return { monster };
}
