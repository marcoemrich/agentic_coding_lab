import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { calculateSphinxScore } from "./sphinx-score.js";

describe("Overlords sphinx scoring", () => {
  it("returns 0 points when the army has no sphinx cards -- Chimera, Orthrus, Zombie is 0", () => {
    expect(
      calculateSphinxScore({
        army: [{ monster: "chimera" }, { monster: "orthrus" }, { monster: "zombie" }],
      }),
    ).toBe(0);
  });

  it("scores 2 points for a sphinx and one non-sphinx type -- sphinx + cyclops is 2", () => {
    expect(
      calculateSphinxScore({
        army: [{ monster: "sphinx" }, { monster: "cyclops" }],
      }),
    ).toBe(2);
  });

  it("counts sphinx as a type in type-counting -- sphinx, chimera, orthrus is 2 (clarification 1: sphinx counts as a type)", () => {
    expect(
      calculateSphinxScore({
        army: [{ monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" }],
      }),
    ).toBe(2);
  });

  it("adds the same sphinx score for each sphinx card -- sphinx, sphinx, chimera, orthrus is 4", () => {
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

  it("with two sphinx and three types, applies the same per-sphinx rule -- sphinx, sphinx, chimera, orthrus, zombie is 6", () => {
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

  it("adds one point when there are exactly four distinct other-type counts -- sphinx, chimera, orthrus, zombie, hydra is 3", () => {
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

  it("adds two points when there are exactly five distinct other-type counts -- sphinx, chimera, orthrus, zombie, hydra, cyclops is 5", () => {
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

  it("treats undead warrior ranks as one monster type -- sphinx, undead-warrior rank 1, undead-warrior rank 3, chimera is 2", () => {
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

  it("treats all three undead-warrior ranks as one type -- sphinx, undead-warrior 1, undead-warrior 2, undead-warrior 3, cyclops, orthrus, chimera is 3", () => {
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

  it("ignores duplicate monsters when counting types -- sphinx, chimera, chimera, chimera, orthrus, orthrus is 2", () => {
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

  it("outputs 2 for CLI input {\"army\":[{\"monster\":\"sphinx\"},{\"monster\":\"chimera\"}]", () => {
    const cliResult = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: '{"army":[{"monster":"sphinx"},{"monster":"chimera"}]}',
      encoding: "utf8",
    });

    expect(cliResult.status).toBe(0);
    expect(JSON.parse(cliResult.stdout)).toEqual({ score: 2 });
  });

  it("adds one sphinx score per sphinx card in the army -- 2 sphinx cards each count fully", () => {
    expect(
      calculateSphinxScore({
        army: [
          { monster: "sphinx" },
          { monster: "sphinx" },
          { monster: "zombie" },
          { monster: "zombie" },
          { monster: "zombie" },
        ],
      }),
    ).toBe(4);
  });
});
