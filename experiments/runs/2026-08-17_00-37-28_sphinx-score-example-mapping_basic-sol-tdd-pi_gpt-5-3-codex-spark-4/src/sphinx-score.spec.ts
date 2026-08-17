import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { calculateSphinxScore } from "./sphinx-score";

describe("Sphinx scoring", () => {
  it("scores 0 when no Sphinx cards are present -- 0 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "zombie" },
          { monster: "hydra" },
        ],
      }),
    ).toBe(0);
  });

  it("scores 2 when one Sphinx is present with one other monster type (Cyclops) -- 2 points", () => {
    expect(
      calculateSphinxScore({
        army: [{ monster: "sphinx" }, { monster: "cyclops" }],
      }),
    ).toBe(2);
  });

  it("scores 2 when one Sphinx is present with two monster types (Chimera, Orthrus) -- 2 points", () => {
    expect(
      calculateSphinxScore({
        army: [{ monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" }],
      }),
    ).toBe(2);
  });

  it("scores 3 when one Sphinx is present with four distinct non-Sphinx types (Chimera, Orthrus, Zombie, Hydra) -- 3 points", () => {
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

  it("scores 5 when one Sphinx is present with five distinct non-Sphinx types (Chimera, Orthrus, Zombie, Hydra, Cyclops) -- 5 points", () => {
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

  it("scores 2 when duplicates of a non-Sphinx type do not increase the count (Sphinx, Chimera x3, Orthrus x2) -- 2 points", () => {
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

  it("scores 4 when two Sphinx cards are both worth 2 points each in the same army (Sphinx, Sphinx, Chimera, Orthrus) -- 4 points", () => {
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

  it("scores 6 when two Sphinx cards each evaluate as 3 points each with four distinct non-Sphinx types (Sphinx, Sphinx, Chimera, Orthrus, Zombie, Cyclops) -- 6 points", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "sphinx" },
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "zombie" },
          { monster: "cyclops" },
        ],
      }),
    ).toBe(6);
  });

  it("counts Undead Warrior rank variants as one monster type: Sphinx with Undead Warrior 1, Undead Warrior 3, and Chimera -- 2 points", () => {
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

  it("counts all three Undead Warrior variants as a single type when computing bonuses: Sphinx, Undead Warrior 1, Undead Warrior 2, Undead Warrior 3, Cyclops, Orthrus, Chimera -- 3 points", () => {
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

  it("reads input JSON and writes output JSON from the CLI command -- e.g. { score: 5 } for Sphinx, Chimera, Orthrus, Hydra, Zombie, Cyclops", () => {
    const result = spawnSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      {
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
      },
    );

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout).score).toBe(5);
  });
});
