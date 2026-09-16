import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0 -- Chimera, Orthrus, Zombie", () => {
    expect(scoreSphinxes([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores one Sphinx with one other type as 2 -- Sphinx, Cyclops", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ])).toBe(2);
  });
  it("counts the Sphinx as a type and scores three types as 2 -- Sphinx, Chimera, Orthrus", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores the repeated three-type clarification as 2 -- Sphinx, Chimera, Orthrus", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("counts repeated monsters once and scores three types as 2 -- Sphinx, three Chimeras, two Orthruses", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("counts all Undead Warrior ranks as one type and scores four cards as 2 -- Sphinx, Warriors 1 and 3, Chimera", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("scores five distinct types as 3 -- Sphinx, Chimera, Orthrus, Zombie, Hydra", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores six distinct types as 5 -- Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores each of two Sphinx cards with three army types for 4 -- two Sphinxes, Chimera, Orthrus", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores each of two Sphinx cards with four army types for 6 -- two Sphinxes, Chimera, Orthrus, Zombie", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("counts all three Undead Warrior ranks as one type and scores five types as 3 -- Sphinx, Warriors 1/2/3, Cyclops, Orthrus, Chimera", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    ])).toBe(3);
  });
  it("CLI reads the complete binding army JSON from stdin and writes integer score JSON -- six types produce { score: 5 }", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
        { monster: "orthrus" },
      ],
    });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ score: 5 });
  });
});
