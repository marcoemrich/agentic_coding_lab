import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinx } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores Chimera, Orthrus, Zombie with no Sphinx as 0", () => {
    expect(scoreSphinx([
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(0);
  });
  it("scores Sphinx and Cyclops as 2: the fallback is one point once", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "cyclops" },
    ])).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus as 2 and excludes Sphinx from counted types", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores the repeated Sphinx, Chimera, Orthrus example as 2", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores repeated Chimera and Orthrus cards with one Sphinx as 2", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    ])).toBe(2);
  });
  it("scores two Sphinx cards with Chimera and Orthrus as 4", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    ])).toBe(4);
  });
  it("scores Sphinx plus four distinct other types as 3", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    ])).toBe(3);
  });
  it("scores two Sphinx cards plus three distinct other types as 6", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ])).toBe(6);
  });
  it("scores Sphinx plus five distinct other types as 5", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ])).toBe(5);
  });
  it("counts rank-1 and rank-3 Undead Warriors as one type and scores 2", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    ])).toBe(2);
  });
  it("counts all three Undead Warrior ranks as one type and scores 3", () => {
    expect(scoreSphinx([
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 2 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "cyclops" },
      { monster: "orthrus" },
      { monster: "chimera" },
    ])).toBe(3);
  });
  it("reads the whole valid army JSON from stdin and writes an integer score JSON to stdout", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ],
    });

    const output = execFileSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      { input, encoding: "utf8" },
    );

    expect(JSON.parse(output)).toEqual({ score: 2 });
  });
});
