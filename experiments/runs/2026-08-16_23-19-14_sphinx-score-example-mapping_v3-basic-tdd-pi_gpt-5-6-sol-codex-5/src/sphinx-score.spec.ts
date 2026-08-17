import { describe, expect, it } from "vitest";
import { scoreSphinx, type Card } from "./sphinx-score.js";

const sphinx: Card = { monster: "sphinx" };
const card = (monster: Exclude<Card["monster"], "sphinx" | "undead-warrior">): Card => ({ monster });
const warrior = (rank: 1 | 2 | 3): Card => ({ monster: "undead-warrior", rank });

describe("scoreSphinx", () => {
  it("scores no points without a Sphinx", () => {
    expect(scoreSphinx([card("chimera"), card("orthrus"), card("zombie")])).toBe(0);
  });

  it.each([
    [[sphinx, card("cyclops")], 2],
    [[sphinx, card("chimera"), card("orthrus")], 2],
    [[sphinx, card("chimera"), card("orthrus"), card("zombie"), card("hydra")], 3],
    [[sphinx, card("chimera"), card("orthrus"), card("zombie"), card("hydra"), card("cyclops")], 5],
  ] as const)("scores one Sphinx by the monster types on the other cards", (army, expected) => {
    expect(scoreSphinx(army)).toBe(expected);
  });

  it.each([
    [[sphinx, sphinx, card("chimera"), card("orthrus")], 4],
    [[sphinx, sphinx, card("chimera"), card("orthrus"), card("zombie")], 6],
  ] as const)("lets each Sphinx see another Sphinx", (army, expected) => {
    expect(scoreSphinx(army)).toBe(expected);
  });

  it("counts repeated monsters only once", () => {
    expect(scoreSphinx([
      sphinx,
      card("chimera"), card("chimera"), card("chimera"),
      card("orthrus"), card("orthrus"),
    ])).toBe(2);
  });

  it.each([
    [[sphinx, warrior(1), warrior(3), card("chimera")], 2],
    [[sphinx, warrior(1), warrior(2), warrior(3), card("cyclops"), card("orthrus"), card("chimera")], 3],
  ] as const)("treats all Undead Warrior ranks as one type", (army, expected) => {
    expect(scoreSphinx(army)).toBe(expected);
  });
});
