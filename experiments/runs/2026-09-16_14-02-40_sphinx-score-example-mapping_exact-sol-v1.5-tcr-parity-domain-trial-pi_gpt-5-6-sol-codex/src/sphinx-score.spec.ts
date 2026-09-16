import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { sphinxScore } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an empty army as 0", () => {
    expect(sphinxScore([])).toBe(0);
  });
  it("scores Chimera, Orthrus, and Zombie with no Sphinx as 0", () => {
    expect(
      sphinxScore([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("scores Sphinx and Cyclops as 2 (the else value is once per Sphinx, not per type)", () => {
    expect(sphinxScore([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores Sphinx, Chimera, and Orthrus as 2 (Sphinx counts as a type)", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores repeated Chimera and Orthrus cards by distinct monster type as 2", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores Undead Warrior ranks 1 and 3 as one monster type, for 2", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("scores Sphinx with four other types as 3", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ]),
    ).toBe(3);
  });
  it("scores all three Undead Warrior ranks as one type, for 3", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "cyclops" },
        { monster: "orthrus" },
        { monster: "chimera" },
      ]),
    ).toBe(3);
  });
  it("scores Sphinx with five other types as 5", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ]),
    ).toBe(5);
  });
  it("scores two Sphinxes with Chimera and Orthrus as 4", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores two Sphinxes with Chimera, Orthrus, and Zombie as 6", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(6);
  });
});

describe("command-line executable", () => {
  it("reads the whole army JSON from stdin and writes { score: 5 } as JSON to stdout", () => {
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
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      encoding: "utf8",
      input,
    });

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ score: 5 });
  });
});
