import { describe, it, expect } from "vitest";
import { createPolicy, createQuoteSession, insuranceSum, quote, runClaimOfficeCli, runScenario, validateClaimItemType, validateClaimPolicyIndex, validateDamageAmount, validateScenario, validateScenarioSchema, validateStepOp } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quotes", () => {
    it("should quote an empty item list at 5 G — 0 G base premium plus the 5 G processing fee", () => {
      expect(quote([])).toBe(5);
    });
    it("should quote one plain sword at 115 G and establish a 1000 G insurance sum — 100 G base + 10 G first-insurance surcharge + 5 G fee", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];

      expect(insuranceSum(items)).toBe(1000);
      expect(quote(items)).toBe(115);
    });
    it("should quote one plain amulet at 71 G and establish a 600 G insurance sum — 60 G base + 6 G first-insurance surcharge + 5 G fee", () => {
      const items = [{ type: "amulet", material: "plain", enchantment: 0, cursed: false }];

      expect(insuranceSum(items)).toBe(600);
      expect(quote(items)).toBe(71);
    });
    it("should quote one plain staff at 93 G and establish an 800 G insurance sum — 80 G base + 8 G first-insurance surcharge + 5 G fee", () => {
      const items = [{ type: "staff", material: "plain", enchantment: 0, cursed: false }];

      expect(insuranceSum(items)).toBe(800);
      expect(quote(items)).toBe(93);
    });
    it("should quote one plain potion at 49 G and establish a 400 G insurance sum — 40 G base + 4 G first-insurance surcharge + 5 G fee", () => {
      const items = [{ type: "potion", material: "plain", enchantment: 0, cursed: false }];

      expect(insuranceSum(items)).toBe(400);
      expect(quote(items)).toBe(49);
    });
    it("should value each rune and moonstone at 250 G with a 25 G base premium — a single component quote is 33 G after 2.5 G first-insurance surcharge, 5 G fee, and final upward rounding", () => {
      const rune = [{ type: "rune", material: "plain", enchantment: 0, cursed: false }];
      const moonstone = [{ type: "moonstone", material: "plain", enchantment: 0, cursed: false }];

      expect(insuranceSum(rune)).toBe(250);
      expect(quote(rune)).toBe(33);
      expect(insuranceSum(moonstone)).toBe(250);
      expect(quote(moonstone)).toBe(33);
    });
    it("should quote 2 runes at 60 G — 50 G base premium + 5 G first-insurance surcharge + 5 G fee", () => {
      const runes = [
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
      ];

      expect(quote(runes)).toBe(60);
    });
    it("should apply the exact block price to 3 runes and quote 71 G — 60 G block base + 6 G first-insurance surcharge + 5 G fee", () => {
      const runes = [
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
      ];

      expect(quote(runes)).toBe(71);
    });
    it("should not extract a block from 4 runes and should quote 115 G — 100 G base + 10 G first-insurance surcharge + 5 G fee", () => {
      const runes = [
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
      ];

      expect(quote(runes)).toBe(115);
    });
    it("should not extract blocks from 7 runes and should quote 198 G — 175 G base + 17.5 G first-insurance surcharge + 5 G fee = 197.5 G, rounded up", () => {
      const runes = Array.from({ length: 7 }, () => ({
        type: "rune",
        material: "plain",
        enchantment: 0,
        cursed: false,
      }));

      expect(quote(runes)).toBe(198);
    });
    it("should require components in a block to have exactly the same type — 2 runes plus 1 moonstone have a 75 G base and quote at 88 G after 7.5 G surcharge, fee, and upward rounding", () => {
      const components = [
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
        { type: "moonstone", material: "plain", enchantment: 0, cursed: false },
      ];

      expect(quote(components)).toBe(88);
    });
    it("should price separate exact blocks by component type — 3 runes plus 3 moonstones have a 120 G base and quote at 137 G", () => {
      const components = [
        ...Array.from({ length: 3 }, () => ({
          type: "rune",
          material: "plain",
          enchantment: 0,
          cursed: false,
        })),
        ...Array.from({ length: 3 }, () => ({
          type: "moonstone",
          material: "plain",
          enchantment: 0,
          cursed: false,
        })),
      ];

      expect(quote(components)).toBe(137);
    });
    it("should scope item surcharges to affected items only — cursed sword plus plain amulet has 160 G policy base, adds only 50 G curse surcharge, and quotes at 231 G after 16 G first-insurance surcharge and 5 G fee", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "plain", enchantment: 0, cursed: false },
      ];

      expect(quote(items)).toBe(231);
    });
    it("should apply loyalty at the exact 2-year threshold — a first plain sword quote is 95 G = 100 G base - 20 G loyalty + 10 G first-insurance + 5 G fee", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      const customer = { yearsWithMHPCO: 2 };

      expect(quote(items, customer)).toBe(95);
    });
    it("should stack curse and high-enchantment surcharges at enchantment 5 — a newcomer cursed sword quotes at 195 G = 100 + 50 + 30 + 10 + 5", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: true }];

      expect(quote(items)).toBe(195);
    });
    it("should not apply the high-enchantment surcharge at enchantment 4 — a cursed sword quotes at 165 G while the corresponding plain sword quotes at 115 G", () => {
      const cursedSword = [{ type: "sword", material: "steel", enchantment: 4, cursed: true }];
      const plainSword = [{ type: "sword", material: "steel", enchantment: 4, cursed: false }];

      expect(quote(cursedSword)).toBe(165);
      expect(quote(plainSword)).toBe(115);
    });
    it("should quote a newcomer's cursed steel sword at 165 G — 100 G base + 50 G curse + 10 G first-insurance + 5 G fee", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];

      expect(quote(items)).toBe(165);
    });
    it("should treat quote history as sequential contract state — a 3-year customer's second quote for a cursed enchantment-7 sword is 160 G = 100 + 50 + 30 - 20 loyalty + 10 first-insurance - 15 follow-up + 5 fee", () => {
      const session = createQuoteSession({ yearsWithMHPCO: 3 });

      session.quote([{ type: "amulet", material: "plain", enchantment: 0, cursed: false }]);

      expect(
        session.quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
      ).toBe(160);
    });
    it("should retain fractional intermediate modifiers and round only the final premium upward — a 3-year customer's second quote for one plain rune is 24 G from 25 - 5 + 2.5 - 3.75 + 5 = 23.75 G", () => {
      const session = createQuoteSession({ yearsWithMHPCO: 3 });

      session.quote([{ type: "amulet", material: "plain", enchantment: 0, cursed: false }]);

      expect(
        session.quote([{ type: "rune", material: "plain", enchantment: 0, cursed: false }]),
      ).toBe(24);
    });
  });

  describe("claims", () => {
    it("should fully reimburse ordinary damage before the per-event deductible — a steel enchantment-3 sword damaged for 500 G pays 400 G and leaves 1600 G of its 2000 G cap", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "sword", amount: 500 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("should apply no material or enchantment clause to components — a rune damaged for 200 G pays 100 G and leaves 400 G of its 500 G cap", () => {
      const policy = createPolicy([
        { type: "rune", material: "plain", enchantment: 0, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "rune", amount: 200 }])).toEqual({
        payout: 100,
        remainingCap: 400,
      });
    });
    it("should apply the enchantment clause at exactly level 8 even for dragon material — 1000 G damage is halved to 500 G then reduced by the 100 G deductible, paying 400 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 8, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("should let the 50% enchantment rule win when both special clauses apply — a dragon-material enchantment-9 sword damaged for 1000 G pays 400 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 9, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("should fully reimburse dragon material below enchantment 8 — a dragon-material enchantment-5 sword damaged for 800 G pays 700 G after the deductible", () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 5, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "sword", amount: 800 }])).toEqual({
        payout: 700,
        remainingCap: 1300,
      });
    });
    it("should halve highly enchanted non-dragon damage — a steel enchantment-9 sword damaged for 1000 G pays 400 G after halving and the deductible", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 9, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "sword", amount: 1000 }])).toEqual({
        payout: 400,
        remainingCap: 1600,
      });
    });
    it("should apply the 100 G deductible once to each damage entry — 500 G sword damage plus 300 G amulet damage pays 600 G and leaves 2600 G of a 3200 G cap", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "plain", enchantment: 0, cursed: false },
      ]);

      expect(
        policy.claim([
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]),
      ).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should insure duplicate item occurrences independently — two swords produce a 2000 G insurance sum and 4000 G cap, and two 500 G sword damages pay 800 G with two deductibles", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ];
      const policy = createPolicy(items);

      expect(insuranceSum(items)).toBe(2000);
      expect(
        policy.claim([
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("should base the cap on unmodified insurance value — a cursed sword quote is 165 G but its claim cap remains 2000 G", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
      ];
      const policy = createPolicy(items);

      expect(quote(items)).toBe(165);
      expect(policy.claim([{ itemType: "sword", amount: 100 }])).toEqual({
        payout: 0,
        remainingCap: 2000,
      });
    });
    it("should keep component block discounts out of insurance value — sword plus 3 runes has a 160 G premium base, a 1750 G insurance sum, and a 3500 G cap", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        ...Array.from({ length: 3 }, () => ({
          type: "rune",
          material: "plain",
          enchantment: 0,
          cursed: false,
        })),
      ];
      const policy = createPolicy(items);

      expect(quote(items)).toBe(181);
      expect(insuranceSum(items)).toBe(1750);
      expect(policy.claim([{ itemType: "sword", amount: 100 }])).toEqual({
        payout: 0,
        remainingCap: 3500,
      });
    });
    it("should share and exhaust policy cap across sequential claims — two 1500 G claims on one sword pay 1400 G with 600 G remaining, then 600 G with 0 G remaining", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "sword", amount: 1500 }])).toEqual({
        payout: 1400,
        remainingCap: 600,
      });
      expect(policy.claim([{ itemType: "sword", amount: 1500 }])).toEqual({
        payout: 600,
        remainingCap: 0,
      });
    });
    it("should not cap an individual damage at the item's insurance value before applying the policy cap — a 1500 G sword damage has a desired payout of 1400 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "sword", amount: 1500 }])).toEqual({
        payout: 1400,
        remainingCap: 600,
      });
    });
    it("should retain fractional claim calculations and round only the final payout downward — enchantment-8 damage of 901 G yields 350.5 G after halving and deductible, paying 350 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 8, cursed: false },
      ]);

      expect(policy.claim([{ itemType: "sword", amount: 901 }])).toEqual({
        payout: 350,
        remainingCap: 1650,
      });
    });
  });

  describe("CLI integration and validation", () => {
    it("should read the normative scenario JSON from stdin and write only binding output fields in step order — the schema example returns {results: [{premium: 59}, {payout: 100, remainingCap: 1100}]}", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
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
      };

      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("should resolve a claim policy by the zero-based index of an earlier quote while preserving independent state for each policy — results remain the same length and order as steps", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "amulet", material: "plain", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          {
            op: "claim",
            policy: 1,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      };

      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 115 },
          { premium: 71 },
          { payout: 400, remainingCap: 1600 },
          { payout: 200, remainingCap: 1000 },
        ],
      });
    });
    it("should reject an unknown quoted item type such as broomstick with non-zero exit status, an error description on stderr, and no results on stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      expect(() => validateScenario(scenario)).toThrow(/unknown item type.*broomstick/i);
    });
    it("should reject a claim for an item type absent from the policy, such as amulet damage on a sword-only policy, with non-zero exit status and an error on stderr", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ]);

      expect(() =>
        policy.claim([{ itemType: "amulet", amount: 200 }]),
      ).toThrow(/item type.*amulet.*absent|amulet.*not.*insured/i);
    });
    it("should reject an unknown claim item type with non-zero exit status and an error description on stderr", () => {
      expect(() => validateClaimItemType("broomstick")).toThrow(
        /unknown claim item type.*broomstick/i,
      );
    });
    it("should reject a negative damage amount such as -200 G with non-zero exit status and an error description on stderr", () => {
      expect(() => validateDamageAmount(-200)).toThrow(
        /damage amount.*-200.*non-negative|negative damage amount/i,
      );
    });
    it("should reject the whole claim when damage occurrences exceed insured occurrences — two sword damages against one insured sword produce no partial payout and a non-zero exit status", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ]);

      expect(() =>
        policy.claim([
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ).toThrow(/damage occurrences.*insured occurrences|more.*sword.*damage/i);
    });
    it("should reject a claim whose policy index does not identify an earlier quote step with non-zero exit status and an error on stderr", () => {
      expect(() => validateClaimPolicyIndex(1, 1)).toThrow(
        /policy index.*1.*earlier quote/i,
      );
    });
    it("should reject malformed JSON stdin with non-zero exit status, an error description on stderr, and no results on stdout", () => {
      const result = runClaimOfficeCli('{"customer":');

      expect(result.exitStatus).not.toBe(0);
      expect(result.stderr).toMatch(/malformed json|unexpected end|json/i);
      expect(result.stdout).toBe("");
    });
    it("should reject input that violates required normative schema fields or types, such as a customer missing integer yearsWithMHPCO, with non-zero exit status and no results on stdout", () => {
      const scenario = {
        customer: {},
        steps: [],
      };

      expect(() => validateScenarioSchema(scenario)).toThrow(
        /yearsWithMHPCO.*required.*integer|missing.*integer.*yearsWithMHPCO/i,
      );
    });
    it("should reject a step op other than quote or claim with non-zero exit status, an error description on stderr, and no results on stdout", () => {
      expect(() => validateStepOp("renew")).toThrow(
        /step op.*renew.*quote.*claim|unsupported.*step op.*renew/i,
      );
    });
  });
});
