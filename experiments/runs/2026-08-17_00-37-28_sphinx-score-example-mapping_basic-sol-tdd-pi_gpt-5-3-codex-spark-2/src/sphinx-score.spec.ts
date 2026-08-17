import { describe, expect, it } from "vitest";

import { calculateSphinxScore } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("returns 0 for no sphinx cards -- Chimera, Orthrus, Zombie -> 0");

  it("returns 1 for only a single sphinx -- [sphinx] -> 1");

  it("treats sphinx as a type in the army -- Sphinx, Chimera, Orthrus -> 2");

  it("counts beyond three types only by unique monster types -- Sphinx, Chimera -> 2");

  it("returns 3 when there are four monster types including Sphinx -- Sphinx, Chimera, Orthrus, Zombie, Hydra -> 3");

  it("returns 5 when there are six monster types including Sphinx -- Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops -> 5");

  it("adds sphinx cards linearly -- Sphinx, Sphinx, Chimera, Orthrus -> 4");

  it("adds sphinx cards with four types -- Sphinx, Sphinx, Chimera, Orthrus, Zombie -> 6");

  it("treats Undead Warrior variants as one monster type -- Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera -> 2");

  it("treats Undead Warrior variants as one monster type with all variants present -- Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera -> 3");

  it("counts each monster type once even with duplicates -- Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus -> 2");

  it("reads stdin army JSON and writes { \"score\" } as JSON from the CLI", async () => {
    const { spawnSync } = await import("node:child_process");
    const result = spawnSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      {
        encoding: "utf8",
        input: JSON.stringify({
          army: [
            { monster: "sphinx" },
            { monster: "chimera" },
            { monster: "undead-warrior", rank: 2 },
          ],
        }),
      },
    );

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ score: 2 });
  });
});
