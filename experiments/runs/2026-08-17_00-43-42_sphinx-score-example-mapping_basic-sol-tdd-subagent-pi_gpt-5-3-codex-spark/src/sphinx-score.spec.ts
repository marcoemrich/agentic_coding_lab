import { describe, expect, it } from "vitest";
import { calculateSphinxScore } from "./sphinx-score.js";

describe("Sphinx scoring", () => {
  it("scores 0 points when there is no sphinx in the army -- 0", () => {
    const score = calculateSphinxScore({
      army: [{ monster: "chimera" }, { monster: "orthrus" }, { monster: "zombie" }],
    });

    expect(score).toBe(0);
  });

  it("scores 1 point for a single sphinx -- 1", () => {
    const score = calculateSphinxScore({ army: [{ monster: "sphinx" }] });

    expect(score).toBe(1);
  });

  it("counts sphinx as an army type -- sphinx, chimera, orthrus => 2", () => {
    const score = calculateSphinxScore({
      army: [{ monster: "sphinx" }, { monster: "chimera" }, { monster: "orthrus" }],
    });

    expect(score).toBe(2);
  });

  it("counts sphinx as a type beyond three with many monsters -> sphinx, chimera, orthrus, zombie, hydra => 3", () => {
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

  it("applies one extra point for a fourth type -- sphinx, chimera, orthrus, zombie, hydra, cyclops => 5", () => {
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

  it("adds 2 points for each additional sphinx -- sphinx, sphinx, chimera, orthrus => 4", () => {
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

  it("adds 2 points for each additional sphinx with five types present -- sphinx, sphinx, chimera, orthrus, zombie => 6", () => {
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

  it("gives one point for each sphinx plus type bonus only once -- sphinx, cyclops => 2", () => {
    const score = calculateSphinxScore({
      army: [{ monster: "sphinx" }, { monster: "cyclops" }],
    });

    expect(score).toBe(2);
  });

  it("treats undead warrior variants as one monster type -- sphinx, undead-warrior 1, undead-warrior 3, chimera => 2", () => {
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

  it("treats zombie/orthrus/chimera variants as one sphinx type still -- sphinx, undead-warrior 1, undead-warrior 2, undead-warrior 3, cyclops, orthrus, chimera => 3", () => {
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

  it("ignores duplicate monsters and does not count extra duplicates as new types -- sphinx, chimera, chimera, chimera, orthrus, orthrus => 2", () => {
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
});
