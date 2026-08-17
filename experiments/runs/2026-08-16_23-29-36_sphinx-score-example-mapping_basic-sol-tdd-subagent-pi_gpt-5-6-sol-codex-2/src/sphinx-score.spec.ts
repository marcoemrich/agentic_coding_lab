import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { scoreSphinx, type Card } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0: Chimera, Orthrus, Zombie", () => {
    const army: Card[] = [
      { monster: "chimera" },
      { monster: "orthrus" },
      { monster: "zombie" },
    ];

    expect(scoreSphinx(army)).toBe(0);
  });
  it("scores 2 for one Sphinx with one other type: Sphinx, Cyclops", () => {
    expect(scoreSphinx([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores 2 for one Sphinx across three types: Sphinx, Chimera, Orthrus", () => {
    expect(
      scoreSphinx([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores 3 for one Sphinx across five types: Sphinx, Chimera, Orthrus, Zombie, Hydra", () => {
    expect(
      scoreSphinx([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ]),
    ).toBe(3);
  });
  it("scores 5 for one Sphinx across six types: Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops", () => {
    expect(
      scoreSphinx([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ]),
    ).toBe(5);
  });
  it("scores 4 when two Sphinx cards see each other across three types: Sphinx, Sphinx, Chimera, Orthrus", () => {
    expect(
      scoreSphinx([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores 6 for two Sphinx cards across four types: Sphinx, Sphinx, Chimera, Orthrus, Zombie", () => {
    expect(
      scoreSphinx([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(6);
  });
  it("treats Undead Warrior ranks 1 and 3 as one type and scores 2", () => {
    expect(
      scoreSphinx([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("treats all three Undead Warrior ranks as one type and scores 3 across five types", () => {
    expect(
      scoreSphinx([
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
  it("counts repeated cards of the same monster once and scores 2", () => {
    expect(
      scoreSphinx([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
});

describe("Sphinx scoring CLI", () => {
  it("reads the whole JSON army from stdin and writes a JSON score document to stdout", () => {
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
      { input, encoding: "utf8" },
    );

    expect(JSON.parse(output)).toEqual({ score: 5 });
  });
});
