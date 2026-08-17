import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { scoreSphinxes } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an army with no Sphinx as 0 -- Chimera, Orthrus, Zombie => 0", () => {
    expect(
      scoreSphinxes([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("scores Sphinx with one additional type as 2 -- Sphinx, Cyclops => 2", () => {
    expect(
      scoreSphinxes([
        { monster: "sphinx" },
        { monster: "cyclops" },
      ]),
    ).toBe(2);
  });
  it("scores Sphinx with one duplicate type still as 2 -- Sphinx, Chimera, Chimera, Orthrus => 2", () => {
    expect(
      scoreSphinxes([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("counts the Sphinx type and returns 2 for three types -- Sphinx, Chimera, Orthrus => 2", () => {
    expect(
      scoreSphinxes([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("counts only one Undead Warrior type across ranks 1 and 3 -- Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera => 2", () => {
    expect(
      scoreSphinxes([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("scores 1 Sphinx with five types as 3 -- Sphinx, Chimera, Orthrus, Zombie, Hydra => 3", () => {
    expect(
      scoreSphinxes([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ]),
    ).toBe(3);
  });
  it("scores 1 Sphinx with six types as 5 -- Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops => 5", () => {
    expect(
      scoreSphinxes([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ]),
    ).toBe(5);
  });
  it("scores each of two Sphinx cards with the same two other types as 4 -- Sphinx, Sphinx, Chimera, Orthrus => 4", () => {
    expect(
      scoreSphinxes([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores each of two Sphinx cards with three other types as 6 -- Sphinx, Sphinx, Chimera, Orthrus, Zombie => 6", () => {
    expect(
      scoreSphinxes([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(6);
  });
  it("counts all three Undead Warrior ranks as one type -- Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera => 3", () => {
    expect(
      scoreSphinxes([
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
  it("CLI reads whole stdin and writes JSON score output -- { score: 5 }", () => {
    const output = execSync("pnpm exec tsx src/cli.ts", {
      input: JSON.stringify({
        army: [
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "zombie" },
          { monster: "hydra" },
          { monster: "cyclops" },
        ],
      }),
      stdio: "pipe",
    });

    expect(JSON.parse(output.toString())).toEqual({ score: 5 });
  });
});
