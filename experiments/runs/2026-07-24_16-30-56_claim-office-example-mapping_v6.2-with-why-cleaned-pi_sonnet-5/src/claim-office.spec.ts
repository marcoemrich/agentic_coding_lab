import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  roundUpToWholeG,
  roundDownToWholeG,
  computeBasePremium,
  computeInsuranceSum,
  computeCap,
  computeQuotePremium,
  processClaim,
} from "./claim-office.js";

const CLI_PATH = join(dirname(fileURLToPath(import.meta.url)), "cli.ts");

describe("MHPCO Claim Office", () => {
  // --- Rounding ---
  it("rounds a premium of 197.5 G up to 198 G (favor of MHPCO)", () => {
    expect(roundUpToWholeG(197.5)).toBe(198);
  });
  it("rounds a payout of 350.5 G down to 350 G (favor of MHPCO)", () => {
    expect(roundDownToWholeG(350.5)).toBe(350);
  });

  // --- Base premium: main items & components ---
  it("computes base premium 0 G for an empty item list", () => {
    expect(computeBasePremium([])).toBe(0);
  });
  it("computes base premium 100 G for a single sword", () => {
    expect(computeBasePremium([{ type: "sword" }])).toBe(100);
  });
  it("computes base premium 60 G for a single amulet", () => {
    expect(computeBasePremium([{ type: "amulet" }])).toBe(60);
  });
  it("computes base premium 80 G for a single staff", () => {
    expect(computeBasePremium([{ type: "staff" }])).toBe(80);
  });
  it("computes base premium 40 G for a single potion", () => {
    expect(computeBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("computes base premium 50 G for 2 runes (no block)", () => {
    expect(computeBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("computes base premium 60 G for 3 runes (block applies)", () => {
    expect(
      computeBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])
    ).toBe(60);
  });
  it("computes base premium 100 G for 4 runes (no block -- requires exactly 3)", () => {
    expect(
      computeBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(100);
  });
  it("computes base premium 175 G for 7 runes (no block)", () => {
    expect(
      computeBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(175);
  });
  it("computes base premium 75 G for 2 runes + 1 moonstone (no block, different types)", () => {
    expect(
      computeBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])
    ).toBe(75);
  });
  it("computes base premium 120 G for 3 runes + 3 moonstones (two separate blocks)", () => {
    expect(
      computeBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ])
    ).toBe(120);
  });

  // --- Insurance sum & cap ---
  it("computes insurance sum 1600 G for a sword and an amulet", () => {
    expect(
      computeInsuranceSum([{ type: "sword" }, { type: "amulet" }])
    ).toBe(1600);
  });
  it("computes insurance sum 2000 G for two swords", () => {
    expect(
      computeInsuranceSum([{ type: "sword" }, { type: "sword" }])
    ).toBe(2000);
  });
  it("computes insurance sum 1750 G for a sword and a block of 3 runes", () => {
    expect(
      computeInsuranceSum([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(1750);
  });
  it("computes cap 2000 G for a cursed sword based on unmodified insurance value 1000 G", () => {
    expect(computeCap([{ type: "sword", cursed: true }])).toBe(2000);
  });

  // --- Full quote premium pipeline ---
  it("computes premium 5 G for an empty item list (only the processing fee)", () => {
    expect(computeQuotePremium([], { yearsWithMHPCO: 0 })).toBe(5);
  });
  it("computes premium 165 G for a newcomer's cursed sword (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      computeQuotePremium([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0 })
    ).toBe(165);
  });
  it("computes premium 95 G for a customer with exactly 2 years and a plain sword (loyalty discount applies)", () => {
    expect(
      computeQuotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 })
    ).toBe(95);
  });
  it("computes premium 145 G for a newcomer's sword with exactly enchantment 5 (high-enchantment surcharge applies)", () => {
    expect(
      computeQuotePremium([{ type: "sword", enchantment: 5 }], { yearsWithMHPCO: 0 })
    ).toBe(145);
  });
  it("computes premium 115 G for a newcomer's sword with enchantment 4 (no high-enchantment surcharge)", () => {
    expect(
      computeQuotePremium([{ type: "sword", enchantment: 4 }], { yearsWithMHPCO: 0 })
    ).toBe(115);
  });
  it("computes premium 195 G for a newcomer's cursed sword with enchantment 5 (both surcharges apply)", () => {
    expect(
      computeQuotePremium(
        [{ type: "sword", cursed: true, enchantment: 5 }],
        { yearsWithMHPCO: 0 }
      )
    ).toBe(195);
  });
  it("computes premium 231 G for a cursed sword + plain amulet policy (curse surcharge scoped to the cursed item only)", () => {
    expect(
      computeQuotePremium(
        [{ type: "sword", cursed: true }, { type: "amulet" }],
        { yearsWithMHPCO: 0 }
      )
    ).toBe(231);
  });
  it("computes premium 160 G for a long-standing customer's second contract with a cursed, highly enchanted sword", () => {
    expect(
      computeQuotePremium(
        [{ type: "sword", cursed: true, enchantment: 7 }],
        { yearsWithMHPCO: 3 },
        { isFollowUpContract: true }
      )
    ).toBe(160);
  });

  // --- Claim processing ---
  it("pays out 400 G for a regular sword (enchantment 3), damage 500 G (full reimbursement minus deductible)", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 3 }];
    const result = processClaim(policyItems, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });
  it("pays out 100 G for a damaged rune (damage 200 G, no enchantment or material)", () => {
    const policyItems = [{ type: "rune" }];
    const result = processClaim(policyItems, {
      cause: "fire",
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });
  it("pays out 400 G for a dragon-material sword, enchantment exactly 8, damage 1000 G (high-enchantment clause applies)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const result = processClaim(policyItems, {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("pays out 400 G for a dragon-material sword, enchantment 9, damage 1000 G (both clauses apply; 50% rule wins)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const result = processClaim(policyItems, {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("pays out 700 G for a dragon-material sword, enchantment 5, damage 800 G (only dragon-material clause applies)", () => {
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const result = processClaim(policyItems, {
      cause: "dragon attack",
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });
  it("pays out 400 G for a steel sword, enchantment 9, damage 1000 G (only high-enchantment clause applies)", () => {
    const policyItems = [{ type: "sword", material: "steel", enchantment: 9 }];
    const result = processClaim(policyItems, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("pays out 600 G total when a dragon attack damages an insured sword (500 G) and amulet (300 G) (deductible applies per damaged item)", () => {
    const policyItems = [{ type: "sword" }, { type: "amulet" }];
    const result = processClaim(policyItems, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });
  it("pays out 800 G total when two insured swords are each damaged 500 G (each entry has its own deductible)", () => {
    const policyItems = [{ type: "sword" }, { type: "sword" }];
    const result = processClaim(policyItems, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });
  it("pays out 1400 G with remaining cap 600 G for a first 1500 G claim on a sword (insurance sum 1000, cap 2000)", () => {
    const policyItems = [{ type: "sword" }];
    const result = processClaim(policyItems, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("pays out 600 G with remaining cap 0 G for a second 1500 G claim after remaining cap is 600 G", () => {
    const policyItems = [{ type: "sword" }];
    const result = processClaim(
      policyItems,
      {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
      { remainingCap: 600 }
    );
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
  it("rejects a claim where damages contain more entries of an item type than the policy insures", () => {
    const policyItems = [{ type: "sword" }];
    expect(() =>
      processClaim(policyItems, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      })
    ).toThrow();
  });
  it("rejects a claim where a damage entry's item is not part of the policy", () => {
    const policyItems = [{ type: "sword" }];
    expect(() =>
      processClaim(policyItems, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 300 }],
      })
    ).toThrow();
  });
  it("rejects a claim with a damage entry amount of -200 G", () => {
    const policyItems = [{ type: "sword" }];
    expect(() =>
      processClaim(policyItems, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      })
    ).toThrow();
  });

  // --- CLI integration ---
  it("CLI exits non-zero and writes an error to stderr for a quote with an unknown item type", () => {
    const result = spawnSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("CLI exits non-zero and writes an error to stderr for a claim referencing an item not on the policy", () => {
    const result = spawnSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("CLI exits non-zero and writes an error to stderr for a claim with a negative damage amount", () => {
    const result = spawnSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
      encoding: "utf-8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("CLI processes a full scenario (quote then claim) and writes the results JSON matching the schema example", () => {
    const result = spawnSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
      }),
      encoding: "utf-8",
    });
    expect(result.status).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.results).toHaveLength(2);
    expect(typeof output.results[0].premium).toBe("number");
    expect(typeof output.results[1].payout).toBe("number");
    expect(typeof output.results[1].remainingCap).toBe("number");
  });
});
