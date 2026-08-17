import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinxes, type Card } from "./sphinx-score.js";

const score = (...army: Card[]): number => scoreSphinxes({ army }).score;

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0: Chimera, Orthrus, Zombie", () => {
    expect(score(
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    )).toBe(0);
  });
  it("scores Sphinx, Cyclops as 2 (the fallback is once per Sphinx, not per type)", () => {
    expect(score({ monster: "sphinx" }, { monster: "cyclops" })).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus as 2, including the Sphinx among counted types", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    )).toBe(2);
  });
  it("scores repeated Chimera and Orthrus cards as 2 because repetitions are not new types", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "orthrus" },
    )).toBe(2);
  });
  it("scores Undead Warrior ranks 1 and 3 with Chimera as 2 because ranks are one type", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "undead-warrior", rank: 1 },
      { monster: "undead-warrior", rank: 3 },
      { monster: "chimera" },
    )).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra as 3", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
    )).toBe(3);
  });
  it("scores Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops as 5", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    )).toBe(5);
  });
  it("scores two Sphinxes with Chimera and Orthrus as 4", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    )).toBe(4);
  });
  it("scores two Sphinxes with Chimera, Orthrus, and Zombie as 6", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    )).toBe(6);
  });
  it("scores Undead Warrior ranks 1, 2, and 3 with Cyclops, Orthrus, and Chimera as 3", () => {
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
  it("reconfirms Sphinx, Chimera, Orthrus as 2 for the explicit beyond-three fallback example", () => {
    expect(score(
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
    )).toBe(2);
  });
  it("CLI reads the complete stdin JSON army and writes exactly a JSON score document", () => {
    const input = JSON.stringify({ army: [
      { monster: "sphinx" },
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
      { monster: "hydra" },
      { monster: "cyclops" },
    ] }, null, 2);
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe('{"score":5}\n');
  });
});
