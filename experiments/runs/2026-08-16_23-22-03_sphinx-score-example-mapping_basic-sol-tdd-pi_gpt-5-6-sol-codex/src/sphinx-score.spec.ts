import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes } from "./sphinx-score.js";

const monster = (name: string, rank?: 1 | 2 | 3) =>
  rank === undefined ? { monster: name } : { monster: name, rank };

describe("Sphinx scoring", () => {
  it("scores an army with no Sphinx as 0 -- Chimera, Orthrus, Zombie => 0", () => {
    expect(scoreSphinxes([monster("chimera"), monster("orthrus"), monster("zombie")])).toBe(0);
  });
  it("awards the Sphinx's else point once -- Sphinx, Cyclops => 2", () => {
    expect(scoreSphinxes([monster("sphinx"), monster("cyclops")])).toBe(2);
  });
  it("counts the Sphinx as a type -- Sphinx, Chimera, Orthrus => 2 (both cited examples)", () => {
    expect(scoreSphinxes([monster("sphinx"), monster("chimera"), monster("orthrus")])).toBe(2);
  });
  it("ignores repeated cards when counting types -- Sphinx, 3 Chimera, 2 Orthrus => 2", () => {
    expect(scoreSphinxes([
      monster("sphinx"),
      monster("chimera"), monster("chimera"), monster("chimera"),
      monster("orthrus"), monster("orthrus"),
    ])).toBe(2);
  });
  it("treats Undead Warrior ranks as one type -- ranks 1 and 3 with Sphinx and Chimera => 2", () => {
    expect(scoreSphinxes([
      monster("sphinx"), monster("undead-warrior", 1),
      monster("undead-warrior", 3), monster("chimera"),
    ])).toBe(2);
  });
  it("scores each Sphinx -- 2 Sphinx, Chimera, Orthrus => 4", () => {
    expect(scoreSphinxes([
      monster("sphinx"), monster("sphinx"), monster("chimera"), monster("orthrus"),
    ])).toBe(4);
  });
  it("does not count a lone Sphinx itself -- Sphinx, Chimera, Orthrus, Zombie => 2", () => {
    expect(scoreSphinxes([
      monster("sphinx"), monster("chimera"), monster("orthrus"), monster("zombie"),
    ])).toBe(2);
  });
  it("scores three non-Sphinx types for each Sphinx -- 2 Sphinx, Chimera, Orthrus, Zombie => 6", () => {
    expect(scoreSphinxes([
      monster("sphinx"), monster("sphinx"), monster("chimera"),
      monster("orthrus"), monster("zombie"),
    ])).toBe(6);
  });
  it("scores four non-Sphinx types as 3 per Sphinx -- Sphinx, Chimera, Orthrus, Zombie, Hydra => 3", () => {
    expect(scoreSphinxes([
      monster("sphinx"), monster("chimera"), monster("orthrus"),
      monster("zombie"), monster("hydra"),
    ])).toBe(3);
  });
  it("counts all Undead Warrior ranks as one among four non-Sphinx types -- ranks 1, 2, 3 plus Cyclops, Orthrus, Chimera and Sphinx => 3", () => {
    expect(scoreSphinxes([
      monster("sphinx"), monster("undead-warrior", 1), monster("undead-warrior", 2),
      monster("undead-warrior", 3), monster("cyclops"), monster("orthrus"), monster("chimera"),
    ])).toBe(3);
  });
  it("scores five non-Sphinx types as 5 per Sphinx -- Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops => 5", () => {
    expect(scoreSphinxes([
      monster("sphinx"), monster("chimera"), monster("orthrus"),
      monster("zombie"), monster("hydra"), monster("cyclops"),
    ])).toBe(5);
  });
  it("exposes the scorer through the CLI -- stdin army JSON produces stdout { score: 5 }", () => {
    const input = JSON.stringify({ army: [
      monster("sphinx"), monster("chimera"), monster("orthrus"),
      monster("zombie"), monster("hydra"), monster("cyclops"),
    ] });
    const output = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });
    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
