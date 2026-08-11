import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quoting: base price list -------------------------------------------
  it("quotes an empty item list as just the 5 G processing fee — 5 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a single sword — base 100 G, +10% first insurance, +5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a single amulet — base 60 G, +10% first insurance, +5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a single staff — base 80 G, +10% first insurance, +5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a single potion — base 40 G, +10% first insurance, +5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes a single rune component — base 25 G, +10% first insurance rounded up, +5 G fee = 33 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a single moonstone component — base 25 G, +10% first insurance rounded up, +5 G fee = 33 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "moonstone",
              material: "stone",
              enchantment: 1,
              cursed: false,
            },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes several different main items by summing their base premiums — sword + amulet = 160 G, +10%, +5 G fee = 181 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            {
              type: "amulet",
              material: "silver",
              enchantment: 1,
              cursed: false,
            },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 181 }] });
  });

  // An item the price list does not carry is worth nothing to insure, so the
  // quote is the bare processing fee. Nothing in the spec names this case; the
  // test exists to keep the behaviour deliberate rather than accidental.
  it("prices an item type that is not on the price list at nothing — 5 G fee only", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Quoting: component building block -----------------------------------
  it("quotes 3 alike components as a building block for 60 G instead of 75 G — +10%, +5 G fee = 71 G", () => {
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 1,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, rune] }],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 6 alike components as two building blocks — 120 G, +10%, +5 G fee = 137 G", () => {
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 1,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [rune, rune, rune, rune, rune, rune] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
  it("quotes 4 alike components as one building block plus one single — 85 G, +10% rounded up, +5 G fee = 99 G", () => {
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 1,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, rune, rune] }],
    });

    expect(result).toEqual({ results: [{ premium: 99 }] });
  });
  it("does not form a building block from 3 components of different kinds — 2 runes + 1 moonstone = 75 G, +10% rounded up, +5 G fee = 88 G", () => {
    const rune = {
      type: "rune",
      material: "stone",
      enchantment: 1,
      cursed: false,
    };
    const moonstone = { ...rune, type: "moonstone" };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, moonstone] }],
    });

    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  // --- Quoting: risk surcharges --------------------------------------------
  it("adds a 50% risk surcharge for a cursed item — cursed sword 100 G -> 150 G, +10%, +5 G fee = 170 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: true },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("adds a 30% risk surcharge for a highly enchanted item (enchantment >= 5) — sword 100 G -> 130 G, +10%, +5 G fee = 148 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 148 }] });
  });
  it("does not add the enchantment surcharge below level 5 — sword at 4 stays 100 G, +10%, +5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("adds both surcharges for a cursed and highly enchanted item — sword 100 G -> 180 G, +10%, +5 G fee = 203 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: true },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 203 }] });
  });

  // --- Quoting: customer modifiers -----------------------------------------
  it("gives a 20% loyalty discount for a customer with >= 2 years — sword 100 G -> 80 G, +10%, +5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("gives no loyalty discount below 2 years with MHPCO — sword stays 100 G, +10%, +5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  // The 10% initial assessment surcharge is asserted by every first-contract
  // premium above, and the repeat-contract test contrasts it with the 15%
  // discount that replaces it.
  it("gives a 15% discount on each contract after the first — first sword 115 G, second 90 G", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 1,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 90 }],
    });
  });

  // Processing fee and round-up are asserted by every premium expectation
  // above — the rune (27.5 -> 28) and combined staff (126.72 -> 127) cases
  // pin the rounding direction.

  // --- Quoting: combinations -----------------------------------------------
  it("combines surcharges, loyalty discount, first-insurance surcharge and fee in one quote — 132 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 8, cursed: true },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 132 }] });
  });

  // --- Claims: basics -------------------------------------------------------
  it("pays a claim minus the 100 G deductible per damage event — 200 G damage pays 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 71 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("pays nothing when the damage does not exceed the deductible — 100 G damage pays 0 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "clumsiness",
            damages: [{ itemType: "amulet", amount: 100 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 71 }, { payout: 0, remainingCap: 1200 }],
    });
  });
  it("applies the deductible once per incident, not per damaged item — 200 G + 300 G pays 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            {
              type: "amulet",
              material: "silver",
              enchantment: 1,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "cave-in",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 2800 }],
    });
  });
  // remainingCap is asserted by every claim test above, so it needs no test of
  // its own.

  // --- Claims: reimbursement rules -----------------------------------------
  it("reimburses damage to an item with enchantment >= 8 at 50% of the damage amount — 400 G damage pays 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 148 }, { payout: 100, remainingCap: 1900 }],
    });
  });
  it("fully reimburses damage to an item made of dragon material — 400 G damage pays 300 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 1,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon fire",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 300, remainingCap: 1700 }],
    });
  });
  it("fully reimburses dragon material even when the item is highly enchanted — 400 G damage pays 300 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "dragon",
              enchantment: 8,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon fire",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 148 }, { payout: 300, remainingCap: 1700 }],
    });
  });

  // --- Claims: cap ----------------------------------------------------------
  it("caps the total payout per policy at twice the insurance sum — 2000 G damage on a potion pays 800 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "shattering",
            damages: [{ itemType: "potion", amount: 2000 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 49 }, { payout: 800, remainingCap: 0 }],
    });
  });
  // This is the spec's Schema example 2, which is also the case that pins cap
  // draw-down across successive claims on one policy.
  it("processes the spec's quote-then-two-claims scenario in order, drawing the cap down", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "amulet", amount: 250 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [
        { premium: 58 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  });
  it("pays nothing once the cap is exhausted — remaining cap stays 0", () => {
    const potion = {
      type: "potion",
      material: "glass",
      enchantment: 1,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [potion] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "shattering",
            damages: [{ itemType: "potion", amount: 2000 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "further shattering",
            damages: [{ itemType: "potion", amount: 500 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [
        { premium: 49 },
        { payout: 800, remainingCap: 0 },
        { payout: 0, remainingCap: 0 },
      ],
    });
  });

  // --- Contract counting ----------------------------------------------------
  it("counts contracts, not steps — the first quote is the first contract even when a claim precedes it", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 1,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "claim",
          policy: 1,
          incident: {
            cause: "rust",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        { op: "quote", items: [sword] },
      ],
    });

    expect(result).toEqual({
      results: [
        { payout: 400, remainingCap: 1600 },
        { premium: 115 },
      ],
    });
  });

  // --- Scenarios ------------------------------------------------------------
  it("processes the spec's quote-only scenario — one result with a premium of 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("keeps separate caps for two policies of the same customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "shattering",
            damages: [{ itemType: "potion", amount: 2000 }],
          },
        },
        {
          op: "quote",
          items: [
            {
              type: "amulet",
              material: "silver",
              enchantment: 2,
              cursed: false,
            },
          ],
        },
        {
          op: "claim",
          policy: 2,
          incident: {
            cause: "tarnish",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [
        { premium: 49 },
        { payout: 800, remainingCap: 0 },
        { premium: 56 },
        { payout: 200, remainingCap: 1000 },
      ],
    });
  });
});
