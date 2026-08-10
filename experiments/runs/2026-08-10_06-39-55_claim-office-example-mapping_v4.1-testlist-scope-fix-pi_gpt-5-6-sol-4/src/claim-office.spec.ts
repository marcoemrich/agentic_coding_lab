import { describe, expect, it } from "vitest";
import { runCli, runCliWithStatus } from "./cli.js";
import {
  claimPayout,
  followUpDiscount,
  initialAssessmentSurcharge,
  insuranceSum,
  incidentPayout,
  payoutCap,
  processClaim,
  processingFee,
  quote,
  roundPayout,
  roundPremium,
  type Item,
} from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quotes", () => {
    it("should quote an empty item list at 5 G — 0 G premium plus the 5 G processing fee", () => {
      expect(quote([], 0, 0)).toBe(5);
    });
    it("should use the MHPCO price list — sword 1000 G value/100 G base, amulet 600/60, staff 800/80, and potion 400/40", () => {
      const items: Item[] = [
        { type: "sword" },
        { type: "amulet" },
        { type: "staff" },
        { type: "potion" },
      ];

      expect(quote(items, 0, 0)).toBe(285);
    });
    it("should value each rune or moonstone at 250 G with a 25 G base premium", () => {
      expect(quote([{ type: "rune" } satisfies Item], 0, 0)).toBe(30);
      expect(quote([{ type: "moonstone" } satisfies Item], 0, 0)).toBe(30);
    });

    it("should price 2 runes at a 50 G base premium — no three-component block", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }], 0, 0)).toBe(55);
    });
    it("should price exactly 3 runes at a 60 G base premium — one alike-component block", () => {
      expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0, 0)).toBe(65);
    });
    it("should price 4 runes at a 100 G base premium — the block requires exactly 3", () => {
      expect(
        quote(
          [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
          0,
          0,
        ),
      ).toBe(105);
    });
    it("should price 7 runes at a 175 G base premium — no block when the count is not exactly 3", () => {
      expect(
        quote(
          [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
          0,
          0,
        ),
      ).toBe(180);
    });
    it("should price 2 runes plus 1 moonstone at a 75 G base premium — unlike component types do not form a block", () => {
      expect(
        quote(
          [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          0,
          0,
        ),
      ).toBe(80);
    });
    it("should price 3 runes plus 3 moonstones at a 120 G base premium — two separate same-type blocks of 60 G", () => {
      expect(
        quote(
          [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
          0,
          0,
        ),
      ).toBe(125);
    });

    it("should add a 50% cursed surcharge to only the affected item — cursed sword 100 G + plain amulet 60 G + 50 G = 210 G before policy modifiers and fee", () => {
      const items: Item[] = [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ];

      expect(quote(items, 0, 0)).toBe(215);
    });
    it("should apply item-specific curse and enchantment modifiers to affected item bases, policy-wide loyalty/contract modifiers to the summed base, and the 5 G fee last", () => {
      const items: Item[] = [
        { type: "sword", cursed: true, enchantment: 5 },
        { type: "amulet" },
      ];

      expect(quote(items, 2, 1)).toBe(185);
    });
    it("should apply the 20% loyalty discount at exactly 2 years with MHPCO", () => {
      expect(quote([{ type: "sword" }], 2, 0)).toBe(95);
    });
    it("should add both the 30% high-enchantment surcharge and 50% curse surcharge for a cursed sword at exactly enchantment 5", () => {
      expect(
        quote([{ type: "sword", cursed: true, enchantment: 5 }], 0, 0),
      ).toBe(185);
    });
    it("should add no high-enchantment surcharge at enchantment 4, while still adding 50% only when cursed", () => {
      expect(quote([{ type: "sword", enchantment: 4 }], 0, 0)).toBe(105);
      expect(
        quote(
          [{ type: "sword", cursed: true, enchantment: 4 }],
          0,
          0,
        ),
      ).toBe(155);
    });
    it("should add a 10% initial assessment surcharge to every newly quoted item regardless of customer contract history", () => {
      const items: Item[] = [{ type: "sword" }, { type: "amulet" }];

      expect(initialAssessmentSurcharge(items, 0)).toBe(16);
      expect(initialAssessmentSurcharge(items, 3)).toBe(16);
    });
    it("should apply a 15% follow-up discount to each quote contract after the customer's first quote in the same sequential scenario", () => {
      const items: Item[] = [{ type: "sword" }, { type: "amulet" }];

      expect(followUpDiscount(items, 0)).toBe(0);
      expect(followUpDiscount(items, 1)).toBe(24);
      expect(followUpDiscount(items, 2)).toBe(24);
    });
    it("should add exactly one 5 G processing fee to every policy premium after all other calculations", () => {
      expect(processingFee(180)).toBe(185);
      expect(processingFee(0)).toBe(5);
    });

    it("should quote a newcomer's first cursed steel sword at enchantment 3 for 165 G — 100 base + 50 curse + 10 initial assessment + 5 fee", () => {
      const items: Item[] = [
        { type: "sword", material: "steel", cursed: true, enchantment: 3 },
      ];

      expect(quote(items, 0, 0)).toBe(165);
    });
    it("should quote a long-standing customer's second-contract cursed sword at enchantment 7 for 160 G — 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 initial assessment - 15 follow-up + 5 fee", () => {
      const items: Item[] = [
        { type: "sword", cursed: true, enchantment: 7 },
      ];

      expect(quote(items, 2, 1)).toBe(160);
    });
    it("should retain fractional intermediates and round a final premium of 197.5 G up to 198 G in MHPCO's favor", () => {
      const sevenRuneBasePremium = 175;
      const fractionalInitialAssessment = sevenRuneBasePremium * 0.1;

      expect(
        roundPremium(
          processingFee(sevenRuneBasePremium + fractionalInitialAssessment),
        ),
      ).toBe(198);
    });
  });

  describe("claims and policy state", () => {
    it("should reimburse a regular steel sword at enchantment 3 with 500 G damage at 400 G — full damage minus one 100 G deductible", () => {
      const item: Item = {
        type: "sword",
        material: "steel",
        enchantment: 3,
      };

      expect(claimPayout(item, 500)).toBe(400);
    });
    it("should reimburse 200 G rune damage at 100 G — components use standard reimbursement minus one 100 G deductible", () => {
      const item: Item = { type: "rune" };

      expect(claimPayout(item, 200)).toBe(100);
    });
    it("should reimburse a dragon-material sword at exactly enchantment 8 with 1000 G damage at 400 G — the 50% enchantment clause wins, then 100 G deductible", () => {
      const item: Item = {
        type: "sword",
        material: "dragon",
        enchantment: 8,
      };

      expect(claimPayout(item, 1000)).toBe(400);
    });
    it("should reimburse a dragon-material sword at enchantment 9 with 1000 G damage at 400 G — when both clauses apply, 50% then the 100 G deductible", () => {
      const item: Item = {
        type: "sword",
        material: "dragon",
        enchantment: 9,
      };

      expect(claimPayout(item, 1000)).toBe(400);
    });
    it("should reimburse a dragon-material sword at enchantment 5 with 800 G damage at 700 G — dragon material pays in full, then the 100 G deductible", () => {
      const item: Item = {
        type: "sword",
        material: "dragon",
        enchantment: 5,
      };

      expect(claimPayout(item, 800)).toBe(700);
    });
    it("should reimburse a steel sword at enchantment 9 with 1000 G damage at 400 G — 50% enchantment reimbursement, then the 100 G deductible", () => {
      const item: Item = {
        type: "sword",
        material: "steel",
        enchantment: 9,
      };

      expect(claimPayout(item, 1000)).toBe(400);
    });
    it("should pay 600 G when one incident damages a sword for 500 G and an amulet for 300 G — separate 100 G deductible for each damage event", () => {
      const items: Item[] = [{ type: "sword" }, { type: "amulet" }];
      const damages = [
        { itemType: "sword" as const, amount: 500 },
        { itemType: "amulet" as const, amount: 300 },
      ];

      expect(incidentPayout(items, damages)).toBe(600);
    });
    it("should keep fractional intermediates and round a final payout of 350.5 G down to 350 G in MHPCO's favor", () => {
      expect(roundPayout(350.5)).toBe(350);
    });

    it("should give a two-sword policy a 2000 G insurance sum and 4000 G payout cap", () => {
      const items: Item[] = [{ type: "sword" }, { type: "sword" }];

      expect(insuranceSum(items)).toBe(2000);
      expect(payoutCap(items)).toBe(4000);
    });
    it("should treat two sword damage entries as separate insured occurrences with separate 100 G deductibles when two swords are covered", () => {
      const items: Item[] = [{ type: "sword" }, { type: "sword" }];
      const damages = [
        { itemType: "sword" as const, amount: 500 },
        { itemType: "sword" as const, amount: 500 },
      ];

      expect(incidentPayout(items, damages)).toBe(800);
    });
    it("should give a sword-and-amulet policy a 1600 G insurance sum and 3200 G cap", () => {
      const items: Item[] = [{ type: "sword" }, { type: "amulet" }];

      expect(insuranceSum(items)).toBe(1600);
      expect(payoutCap(items)).toBe(3200);
    });
    it("should cap a cursed sword policy at 2000 G from its unmodified 1000 G value even when its premium is 165 G", () => {
      const items: Item[] = [
        { type: "sword", material: "steel", cursed: true, enchantment: 3 },
      ];

      expect(quote(items, 0, 0)).toBe(165);
      expect(insuranceSum(items)).toBe(1000);
      expect(payoutCap(items)).toBe(2000);
    });
    it("should give a sword-and-3-rune policy a 1750 G insurance sum and 3500 G cap — the component block changes premium only", () => {
      const items: Item[] = [
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ];

      expect(insuranceSum(items)).toBe(1750);
      expect(payoutCap(items)).toBe(3500);
    });
    it("should pay 1400 G and leave 600 G cap on the first 1500 G sword claim — desired payout 1500 - 100 against a 2000 G cap", () => {
      const items: Item[] = [{ type: "sword" }];
      const damages = [{ itemType: "sword" as const, amount: 1500 }];

      expect(processClaim(items, damages, payoutCap(items))).toEqual({
        payout: 1400,
        remainingCap: 600,
      });
    });
    it("should process successive claims against shared policy state — pay 1400 G leaving 600 G, then pay only 600 G leaving 0 G for a second 1500 G claim", () => {
      const items: Item[] = [{ type: "sword" }];
      const damages = [{ itemType: "sword" as const, amount: 1500 }];

      const firstClaim = processClaim(items, damages, payoutCap(items));
      expect(firstClaim).toEqual({ payout: 1400, remainingCap: 600 });

      const secondClaim = processClaim(items, damages, firstClaim.remainingCap);
      expect(secondClaim).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("CLI integration and exact schema", () => {
    it("should read the binding customer/steps stdin schema and emit one ordered result per step using exactly premium for quotes and payout/remainingCap for claims", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      expect(runCli(stdin)).toBe(
        JSON.stringify({
          results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
        }),
      );
    });
    it("should process the normative quote-then-claim schema example sequentially — 5-year customer's amulet quote is 59 G, then 200 G damage pays 100 G and leaves 1100 G cap", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });

      expect(runCli(stdin)).toBe(
        JSON.stringify({
          results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
        }),
      );
    });
    it("should resolve a claim's integer policy field as the zero-based index of an earlier quote step", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 1,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });

      const output = JSON.parse(runCli(stdin)) as {
        results: Array<Record<string, number>>;
      };

      expect(output.results[2]).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should reject a claim whose policy index does not identify an earlier quote step with non-zero status and an error on stderr", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 1,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });

      const result = runCliWithStatus(stdin);

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("should reject scenarios missing required customer, yearsWithMHPCO, or steps fields, or using non-integer yearsWithMHPCO, with non-zero status and stderr", () => {
      const invalidScenarios = [
        { steps: [] },
        { customer: {}, steps: [] },
        { customer: { yearsWithMHPCO: 0 } },
        { customer: { yearsWithMHPCO: 1.5 }, steps: [] },
      ];

      for (const scenario of invalidScenarios) {
        const result = runCliWithStatus(JSON.stringify(scenario));

        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
      }
    });
    it("should reject quote steps missing op/items/type or using non-array items or non-string item type, with non-zero status and stderr", () => {
      const invalidQuoteSteps = [
        { items: [{ type: "sword" }] },
        { op: "quote" },
        { op: "quote", items: [{}] },
        { op: "quote", items: { type: "sword" } },
        { op: "quote", items: [{ type: 42 }] },
      ];

      for (const step of invalidQuoteSteps) {
        const result = runCliWithStatus(
          JSON.stringify({
            customer: { yearsWithMHPCO: 0 },
            steps: [step],
          }),
        );

        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
      }
    });
    it("should reject claim steps missing op/policy/incident/cause/damages/itemType/amount or using schema-invalid field types, with non-zero status and stderr", () => {
      const invalidClaimSteps = [
        {
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "claim",
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        { op: "claim", policy: 0 },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire" },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ amount: 500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword" }] },
        },
        {
          op: "claim",
          policy: "0",
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: 42,
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: { itemType: "sword", amount: 500 },
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: 42, amount: 500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: "500" }],
          },
        },
      ];

      for (const step of invalidClaimSteps) {
        const result = runCliWithStatus(
          JSON.stringify({
            customer: { yearsWithMHPCO: 0 },
            steps: [{ op: "quote", items: [{ type: "sword" }] }, step],
          }),
        );

        expect(result.status).not.toBe(0);
        expect(result.stderr).not.toBe("");
      }
    });
    it("should reject any step op other than exactly quote or claim with non-zero status and stderr", () => {
      const result = runCliWithStatus(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "Quote", items: [{ type: "sword" }] }],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });

    it("should reject an unknown quoted item type such as broomstick with non-zero status, an error on stderr, and no results on stdout", () => {
      const result = runCliWithStatus(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject damage to an uninsured known type such as an amulet on a sword-only policy with non-zero status and stderr", () => {
      const result = runCliWithStatus(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
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
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("should reject a damage entry with an unknown item type with non-zero status and stderr", () => {
      const result = runCliWithStatus(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "broomstick", amount: 200 }],
              },
            },
          ],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
    it("should reject two sword damage entries when only one sword is insured — non-zero status and the whole claim rejected", () => {
      const result = runCliWithStatus(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 500 },
                ],
              },
            },
          ],
        }),
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
      expect(result.stdout).toBe("");
    });
    it("should reject a damage amount of -200 G with non-zero status and an error on stderr", () => {
      const result = runCliWithStatus(
        JSON.stringify({
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
      );

      expect(result.status).not.toBe(0);
      expect(result.stderr).not.toBe("");
    });
  });
});
