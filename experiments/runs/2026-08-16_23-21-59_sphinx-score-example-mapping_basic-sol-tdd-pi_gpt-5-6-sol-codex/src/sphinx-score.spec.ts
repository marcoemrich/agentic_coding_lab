import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes, type Card } from "./sphinx-score.js";

const score = (...army: Card[]): number => scoreSphinxes(army);

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0", () => {
    expect(score({ monster: "chimera" }, { monster: "orthrus" }, { monster: "zombie" })).toBe(0);
  });
  it("scores Sphinx and Cyclops as 2", () => {
    expect(score({ monster: "sphinx" }, { monster: "cyclops" })).toBe(2);
  });
  it("scores Sphinx, Chimera, and Orthrus as 2", () => {
    expect(score({ monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" })).toBe(2);
  });
  it("scores repeated Chimera and Orthrus cards as 2", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    )).toBe(2);
  });
  it("counts Undead Warrior ranks 1 and 3 as one type and scores 2", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    )).toBe(2);
  });
  it("scores five army types as 3", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    )).toBe(3);
  });
  it("scores six army types as 5", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    )).toBe(5);
  });
  it("counts all three Undead Warrior ranks as one type and scores 3", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    )).toBe(3);
  });
  it("scores two Sphinx cards across three types as 4", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    )).toBe(4);
  });
  it("scores two Sphinx cards across four types as 6", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    )).toBe(6);
  });
  it("reads the whole JSON stdin document and writes score 5 as JSON", () => {
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
      encoding: "utf8",
      input,
    });

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
