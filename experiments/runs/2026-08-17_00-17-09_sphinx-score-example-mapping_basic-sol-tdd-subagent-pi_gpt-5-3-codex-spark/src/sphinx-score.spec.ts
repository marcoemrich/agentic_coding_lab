import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";

import { calculateSphinxScore } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("should score 2 points for a single Sphinx with no other monster types present -- score 2", () => {
    const score = calculateSphinxScore({
      army: [{ monster: "sphinx" }],
    });
    expect(score).toBe(2);
  });
  it("should score 0 points when no Sphinx is present in the army -- score 0", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "zombie" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "chimera" },
      ],
    });
    expect(score).toBe(0);
  });
  it("should still score only 1 point for Sphinx with Chimera counts as one other type -- score 2", () => {
    const score = calculateSphinxScore({
      army: [{ monster: "sphinx" }, { monster: "chimera" }],
    });
    expect(score).toBe(2);
  });
  it("should score 2 points for Sphinx, Chimera, Orthrus -- score 2", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ],
    });
    expect(score).toBe(2);
  });
  it("should score 3 points for Sphinx, Chimera, Orthrus, Zombie, Hydra -- score 3", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ],
    });
    expect(score).toBe(3);
  });
  it("should score 5 points for Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops -- score 5", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ],
    });
    expect(score).toBe(5);
  });
  it("should score 4 points for two Sphinx in Chimera and Orthrus -- score 4", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ],
    });
    expect(score).toBe(4);
  });
  it("should score 6 points for two Sphinx in Chimera, Orthrus, Zombie -- score 6", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ],
    });
    expect(score).toBe(6);
  });
  it("should treat Undead Warrior variants as one type: Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera -- score 2", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ],
    });
    expect(score).toBe(2);
  });
  it("should treat Undead Warrior (1), (2), (3) as one type for Sphinx bonus thresholds -- score 3", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "cyclops" },
        { monster: "orthrus" },
        { monster: "chimera" },
      ],
    });
    expect(score).toBe(3);
  });
  it("should count only unique monster types in bonuses despite duplicate cards: Sphinx, Chimera x3, Orthrus x2 -- score 2", () => {
    const score = calculateSphinxScore({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "orthrus" },
      ],
    });
    expect(score).toBe(2);
  });
  it("should produce JSON score output from CLI for a valid army input -- score 5", () => {
    const armyPayload = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 3 },
        { monster: "hydra" },
        { monster: "chimera" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ],
    });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: armyPayload,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toBe(JSON.stringify({ score: 5 }));
  });
});
