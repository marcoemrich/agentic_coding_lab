import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

import { scoreSphinx, type Card } from "./sphinx-score.js";

const card = (monster: Card["monster"], rank?: Card["rank"]): Card => ({
  monster,
  ...(rank === undefined ? {} : { rank }),
});

const armies: Array<{ name: string; army: Card[]; score: number }> = [
  {
    name: "no Sphinx",
    army: [card("chimera"), card("orthrus"), card("zombie")],
    score: 0,
  },
  {
    name: "one other monster type",
    army: [card("sphinx"), card("cyclops")],
    score: 2,
  },
  {
    name: "two other monster types",
    army: [card("sphinx"), card("chimera"), card("orthrus")],
    score: 2,
  },
  {
    name: "four other monster types",
    army: [card("sphinx"), card("chimera"), card("orthrus"), card("zombie"), card("hydra")],
    score: 3,
  },
  {
    name: "five other monster types",
    army: [card("sphinx"), card("chimera"), card("orthrus"), card("zombie"), card("hydra"), card("cyclops")],
    score: 5,
  },
  {
    name: "a second Sphinx with two other types",
    army: [card("sphinx"), card("sphinx"), card("chimera"), card("orthrus")],
    score: 4,
  },
  {
    name: "a second Sphinx with three other types",
    army: [card("sphinx"), card("sphinx"), card("chimera"), card("orthrus"), card("zombie")],
    score: 6,
  },
  {
    name: "Undead Warrior ranks as one type",
    army: [card("sphinx"), card("undead-warrior", 1), card("undead-warrior", 3), card("chimera")],
    score: 2,
  },
  {
    name: "all Undead Warrior ranks still as one type",
    army: [card("sphinx"), card("undead-warrior", 1), card("undead-warrior", 2), card("undead-warrior", 3), card("cyclops"), card("orthrus"), card("chimera")],
    score: 3,
  },
  {
    name: "duplicate cards as one type",
    army: [card("sphinx"), card("chimera"), card("chimera"), card("chimera"), card("orthrus"), card("orthrus")],
    score: 2,
  },
];

describe("scoreSphinx", () => {
  it.each(armies)("scores $name", ({ army, score }) => {
    expect(scoreSphinx(army)).toBe(score);
  });
});

describe("the command-line interface", () => {
  it("reads the complete JSON army from stdin and writes a JSON score", () => {
    const input = JSON.stringify({
      army: [card("sphinx"), card("undead-warrior", 2), card("hydra")],
    });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ score: 2 });
  });
});
