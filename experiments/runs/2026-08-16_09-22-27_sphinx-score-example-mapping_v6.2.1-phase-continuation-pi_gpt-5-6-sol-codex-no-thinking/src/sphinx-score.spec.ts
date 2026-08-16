import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores 0 for Chimera, Orthrus, Zombie when there is no Sphinx", () => {
    expect(scoreSphinxes([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores 2 for Sphinx, Cyclops: else 1 means one point per type", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ])).toBe(2);
  });
  it("scores 2 for Sphinx, Chimera, Orthrus, counting Sphinx as a type", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores 2 despite repeated Chimera and Orthrus cards", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores 3 for Sphinx plus four other monster types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores 5 for Sphinx plus five other monster types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("scores 4 for two Sphinxes, Chimera, Orthrus", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores 6 for two Sphinxes, Chimera, Orthrus, Zombie", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("scores 2 when Undead Warrior ranks 1 and 3 count as one type", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("scores 3 when all three Undead Warrior ranks count as one of six types", () => {
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
  it("scores 2 for one Sphinx and exactly three other monster types", () => {
    expect(scoreSphinxes([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(2);
  });

  it("CLI reads the whole army JSON from stdin and writes a JSON integer score", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ],
    });

    const output = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
