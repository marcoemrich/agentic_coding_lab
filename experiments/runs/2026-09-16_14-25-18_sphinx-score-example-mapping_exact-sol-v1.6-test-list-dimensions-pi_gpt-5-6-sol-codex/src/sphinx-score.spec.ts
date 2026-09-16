import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { sphinxScore } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an empty army as 0", () => {
    expect(sphinxScore([])).toBe(0);
  });
  it("scores Chimera, Orthrus, Zombie with no Sphinx as 0", () => {
    expect(
      sphinxScore([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("scores a lone Sphinx as 2: its printed 1 point plus the else 1 point", () => {
    expect(sphinxScore([{ monster: "sphinx" }])).toBe(2);
  });
  it("scores Sphinx and Cyclops as 2 when there are two monster types", () => {
    expect(
      sphinxScore([{ monster: "sphinx" }, { monster: "cyclops" }]),
    ).toBe(2);
  });
  it("scores Sphinx, Chimera, Orthrus as 2 and counts Sphinx among three types", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores repeated Chimera and Orthrus cards as 2 because cards of one monster share a type", () => {
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
  it("scores Undead Warrior ranks 1 and 3 as one type, yielding 2 with Sphinx and Chimera", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("scores Sphinx plus four other types as 3: one point plus 2 for one type beyond three", () => {
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
  it("scores Sphinx plus five other types as 5: one point plus 2 per type beyond three", () => {
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
  it("scores two Sphinx cards with Chimera and Orthrus as 4", () => {
    expect(
      sphinxScore([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores two Sphinx cards plus three other types as 6", () => {
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
  it("scores all three Undead Warrior ranks as one type, yielding 3 with four other monster types", () => {
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
  it("reads the whole binding JSON army from stdin and writes the binding JSON score to stdout", () => {
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

    const output = execFileSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input,
      encoding: "utf8",
    });

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
