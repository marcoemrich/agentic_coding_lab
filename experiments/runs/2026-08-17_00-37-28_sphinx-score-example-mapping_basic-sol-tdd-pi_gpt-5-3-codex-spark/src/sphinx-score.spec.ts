import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

import { calculateSphinxScore } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores 0 when no Sphinx card is present -- Chimera, Orthrus, Zombie -> 0", () => {
    expect(calculateSphinxScore({
      army: [{ monster: "zombie" }, { monster: "orthrus" }, { monster: "chimera" }],
    })).toBe(0);
  });
  it("counts Sphinx in the type tally -- Sphinx, Chimera, Orthrus -> 2 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
        ],
      }),
    ).toBe(2);
  });
  it("uses the base rule once types rise beyond three -- Sphinx, Chimera, Orthrus, Zombie, Hydra -> 3 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "zombie" },
          { monster: "hydra" },
        ],
      }),
    ).toBe(3);
  });
  it("uses the beyond-three rule for 5 types -- Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops -> 5 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "zombie" },
          { monster: "hydra" },
          { monster: "cyclops" },
        ],
      }),
    ).toBe(5);
  });
  it("adds another Sphinx as another scoring unit -- Sphinx, Sphinx, Chimera, Orthrus -> 4 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
        ],
      }),
    ).toBe(4);
  });
  it("scores one Sphinx and one extra type as 2 points -- Sphinx, Cyclops -> 2 points", () => {
    expect(
      calculateSphinxScore({
        army: [{ monster: "sphinx" }, { monster: "cyclops" }],
      }),
    ).toBe(2);
  });
  it("scores one Sphinx with another non-sphinx type as still 2 points -- Sphinx, Chimera, Orthrus -> 2 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
        ],
      }),
    ).toBe(2);
  });
  it("keeps second Sphinx behavior when another non-Sphinx type appears -- Sphinx, Sphinx, Chimera, Orthrus, Zombie -> 6 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "zombie" },
        ],
      }),
    ).toBe(6);
  });
  it("counts each Undead Warrior variant as its own type -- Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera -> 2 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "undead-warrior", rank: 1 },
          { monster: "undead-warrior", rank: 3 },
          { monster: "chimera" },
        ],
      }),
    ).toBe(2);
  });
  it("counts three Undead Warrior variants as three types for bonus sizing -- Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera -> 3 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "undead-warrior", rank: 1 },
          { monster: "undead-warrior", rank: 2 },
          { monster: "undead-warrior", rank: 3 },
          { monster: "cyclops" },
          { monster: "orthrus" },
          { monster: "chimera" },
        ],
      }),
    ).toBe(3);
  });
  it("counts duplicates as one monster type -- Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus -> 2 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "chimera" },
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "orthrus" },
        ],
      }),
    ).toBe(2);
  });
  it("scores from CLI JSON -- input from stdin army object and output { score }", () => {
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({
        army: [
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "hydra" },
          { monster: "zombie" },
          { monster: "cyclops" },
        ],
      }),
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe(JSON.stringify({ score: 5 }));
  });
});
