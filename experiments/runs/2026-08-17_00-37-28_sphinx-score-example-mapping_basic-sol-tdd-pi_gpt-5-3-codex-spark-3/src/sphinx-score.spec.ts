import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { calculateSphinxScore } from "./sphinx-score";

describe("Sphinx scoring", () => {
  it("returns 0 when no Sphinx cards are in the army", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "chimera" },
          { monster: "orthrus" },
          { monster: "zombie" },
        ],
      }),
    ).toBe(0);
  });

  it("scores 2 points for one Sphinx and one other monster type (Sphinx, Cyclops)", () => {
    expect(
      calculateSphinxScore({
        army: [{ monster: "sphinx" }, { monster: "cyclops" }],
      }),
    ).toBe(2);
  });

  it("counts sphinx as a monster type in the army: Sphinx, Chimera, Orthrus => 2 points", () => {
    expect(
      calculateSphinxScore({
        army: [{ monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" }],
      }),
    ).toBe(2);
  });

  it("gives 3 points for Sphinx, Chimera, Orthrus, Zombie, Hydra => 3 points", () => {
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
  it("gives 5 points for Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops => 5 points", () => {
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
  it("a second Sphinx doubles points: Sphinx, Sphinx, Chimera, Orthrus => 4 points", () => {
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
  it("second Sphinx with extra type gives 6 points: Sphinx, Sphinx, Chimera, Orthrus, Zombie => 6 points", () => {
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
  it("treats Undead Warrior variants as one monster type: Sphinx, Undead Warrior(1), Undead Warrior(3), Chimera => 2 points", () => {
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
  it("treats all Undead variants together: Sphinx, Undead Warrior(1), Undead Warrior(2), Undead Warrior(3), Cyclops, Orthrus, Chimera => 3 points", () => {
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
  it("counts unique monster types only: Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus => 2 points", () => {
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
  it("reads army JSON from stdin and writes { \"score\": N } JSON to stdout for the Sphinx score", () => {
    const input = JSON.stringify({
      army: [{ monster: "sphinx" }, { monster: "chimera" }, { monster: "hydra" }],
    });

    const processResult = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      cwd: process.cwd(),
      input,
      encoding: "utf8",
    });

    expect(processResult.status).toBe(0);
    expect(processResult.stdout.trim()).toBe('{"score":2}');
  });
});
