import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { calculateSphinxScore } from "./sphinx-score";
import type { MonsterCard } from "./sphinx-score";

const armyFixture = (army: MonsterCard[]) => army;

describe("Sphinx scoring", () => {
  it("returns 0 points when no Sphinx cards are in the army", () => {
    const army = armyFixture([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(0);
  });
  it("scores one Sphinx as 2 points with one other monster type (sphinx not counted for type bonus)", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(2);
  });
  it("scores one Sphinx as 2 points with two other monster types (sphinx not counted for type bonus)", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(2);
  });
  it("scores one Sphinx as 2 points with three other monster types (sphinx not counted for type bonus)", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(3);
  });
  it("scores one Sphinx as 3 points with four other monster types", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(3);
  });
  it("scores one Sphinx as 5 points with five monster types", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(5);
  });
  it("scores two Sphinx cards as 4 points with two other monster types", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(4);
  });
  it("scores two Sphinx cards as 6 points with three other monster types", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(6);
  });
  it("treats Undead Warrior point variants as one monster type", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(2);
  });
  it("counts three Undead Warrior variants plus three other monster types as one type: 3 points total for one Sphinx", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(3);
  });
  it("ignores duplicate monsters when counting types", () => {
    const army = armyFixture([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ]);

    expect(calculateSphinxScore({ army })).toBe(2);
  });
  it("reads JSON from stdin and writes JSON score output from CLI", () => {
    const input = {
      army: [
        { monster: "sphinx" },
        { monster: "cyclops" },
      ],
    };

    const stdout = execSync("pnpm exec tsx src/cli.ts", {
      encoding: "utf8",
      input: JSON.stringify(input),
    });

    expect(JSON.parse(stdout)).toEqual({ score: 2 });
  });
});
