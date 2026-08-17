import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { scoreSphinxArmy } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores an empty army as 0 points", () => {
    const score = scoreSphinxArmy({ army: [] });

    expect(score).toBe(0);
  });

  it("scores a single sphinx as 1 point", () => {
    const score = scoreSphinxArmy({
      army: [{ monster: "sphinx" }],
    });

    expect(score).toBe(1);
  });

  it("does sphinx count toward types: sphinx, chimera, orthrus => 2", () => {
    const score = scoreSphinxArmy({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ],
    });

    expect(score).toBe(2);
  });

  it("counts bonus for a fourth type: sphinx, chimera, orthrus, zombie, hydra => 3", () => {
    const score = scoreSphinxArmy({
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

  it("counts bonus for a fifth type: sphinx, chimera, orthrus, zombie, hydra, cyclops => 5", () => {
    const score = scoreSphinxArmy({
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
  it("sums multiple sphinx cards: sphinx, sphinx, chimera, orthrus => 4", () => {
    const score = scoreSphinxArmy({
      army: [
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ],
    });

    expect(score).toBe(4);
  });
  it("sums multiple sphinx cards with four types: sphinx, sphinx, chimera, orthrus, zombie => 6", () => {
    const score = scoreSphinxArmy({
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
  it("does not double-count duplicate monster types: sphinx, chimera, chimera, chimera, orthrus, orthrus => 2", () => {
    const score = scoreSphinxArmy({
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
  it("treats undead-warrior variants as one type: sphinx, undead-warrior (1), undead-warrior (3), chimera => 2", () => {
    const score = scoreSphinxArmy({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ],
    });

    expect(score).toBe(2);
  });
  it("treats all undead-warrior variants as one type: sphinx, undead-warrior (1), undead-warrior (2), undead-warrior (3), cyclops, orthrus, chimera => 3", () => {
    const score = scoreSphinxArmy({
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
  it("cli reads a JSON army from stdin and writes JSON score output", () => {
    const input = {
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ],
    };

    const cliResult = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
      shell: false,
    });

    expect(cliResult.status).toBe(0);
    expect(cliResult.error).toBeUndefined();
    expect(JSON.parse(cliResult.stdout.trim())).toEqual({ score: 3 });
  });
});
