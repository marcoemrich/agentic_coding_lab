import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { scoreSphinxes, type Card } from "./sphinx-score.js";

const score = (army: Card[]): number => scoreSphinxes({ army }).score;

describe("Sphinx scoring", () => {
  it("Chimera, Orthrus, and Zombie with no Sphinx score 0", () => {
    expect(score([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("Sphinx and Cyclops score 2", () => {
    expect(score([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("Sphinx, Chimera, and Orthrus score 2", () => {
    expect(score([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("repeated Chimera and Orthrus cards still score 2", () => {
    expect(score([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("Undead Warrior ranks 1 and 3 count as one type, scoring 2", () => {
    expect(score([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("Sphinx with Chimera, Orthrus, Zombie, and Hydra scores 3", () => {
    expect(score([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("Sphinx with five other distinct monster types scores 5", () => {
    expect(score([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("all three Undead Warrior ranks count as one type in a five-type army, scoring 3", () => {
    expect(score([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    ])).toBe(3);
  });
  it("two Sphinxes with Chimera and Orthrus score 4", () => {
    expect(score([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("two Sphinxes with Chimera, Orthrus, and Zombie score 6", () => {
    expect(score([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("CLI reads complete JSON stdin and writes JSON score 5", () => {
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

    const output = execFileSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      { encoding: "utf8", input },
    );

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
