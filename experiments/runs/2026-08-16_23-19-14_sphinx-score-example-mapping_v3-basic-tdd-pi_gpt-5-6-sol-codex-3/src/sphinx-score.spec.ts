import { describe, expect, it } from "vitest";

import { scoreSphinxes, type Card } from "./sphinx-score.js";

const card = (monster: Card["monster"], rank?: 1 | 2 | 3): Card =>
  rank === undefined ? { monster } : { monster, rank };

describe("scoreSphinxes", () => {
  it.each([
    {
      army: [card("sphinx"), card("chimera"), card("orthrus")],
      score: 2,
    },
    {
      army: [
        card("sphinx"),
        card("chimera"),
        card("orthrus"),
        card("zombie"),
        card("hydra"),
      ],
      score: 3,
    },
    {
      army: [
        card("sphinx"),
        card("chimera"),
        card("orthrus"),
        card("zombie"),
        card("hydra"),
        card("cyclops"),
      ],
      score: 5,
    },
  ])("does not count itself among $army.length cards", ({ army, score }) => {
    expect(scoreSphinxes(army)).toBe(score);
  });

  it.each([
    {
      army: [
        card("sphinx"),
        card("sphinx"),
        card("chimera"),
        card("orthrus"),
      ],
      score: 4,
    },
    {
      army: [
        card("sphinx"),
        card("sphinx"),
        card("chimera"),
        card("orthrus"),
        card("zombie"),
      ],
      score: 6,
    },
  ])("lets each Sphinx count the other Sphinx", ({ army, score }) => {
    expect(scoreSphinxes(army)).toBe(score);
  });

  it("awards one fallback point in addition to the Sphinx's base point", () => {
    expect(scoreSphinxes([card("sphinx"), card("cyclops")])).toBe(2);
  });

  it.each([
    {
      army: [
        card("sphinx"),
        card("undead-warrior", 1),
        card("undead-warrior", 3),
        card("chimera"),
      ],
      score: 2,
    },
    {
      army: [
        card("sphinx"),
        card("undead-warrior", 1),
        card("undead-warrior", 2),
        card("undead-warrior", 3),
        card("cyclops"),
        card("orthrus"),
        card("chimera"),
      ],
      score: 3,
    },
  ])("treats Undead Warrior ranks as one type", ({ army, score }) => {
    expect(scoreSphinxes(army)).toBe(score);
  });

  it("counts repeated monster cards only once", () => {
    expect(
      scoreSphinxes([
        card("sphinx"),
        card("chimera"),
        card("chimera"),
        card("chimera"),
        card("orthrus"),
        card("orthrus"),
      ]),
    ).toBe(2);
  });

  it("scores zero when there is no Sphinx", () => {
    expect(
      scoreSphinxes([card("chimera"), card("orthrus"), card("zombie")]),
    ).toBe(0);
  });

  it("scores an empty army as zero", () => {
    expect(scoreSphinxes([])).toBe(0);
  });
});
