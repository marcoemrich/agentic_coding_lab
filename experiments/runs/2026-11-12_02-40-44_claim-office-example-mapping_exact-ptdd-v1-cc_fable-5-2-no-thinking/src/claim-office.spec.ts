import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { settleClaim } from "./claim.js";
import { issuePolicy } from "./policy.js";
import type { Item } from "./price-list.js";
import { policyBasePremium, quotePremium } from "./quote.js";
import { runScenario, type Scenario } from "./scenario.js";

const sword = { type: "sword" };
const amulet = { type: "amulet" };
const staff = { type: "staff" };
const potion = { type: "potion" };
const rune = { type: "rune" };
const moonstone = { type: "moonstone" };
const times = <T>(count: number, element: T): T[] => Array.from({ length: count }, () => element);

const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

const claimOfficeExecutable = fileURLToPath(new URL("../bin/claim-office", import.meta.url));
const runClaimOffice = (scenario: unknown) =>
  spawnSync(claimOfficeExecutable, { input: JSON.stringify(scenario), encoding: "utf8" });

const expectRejection = (scenario: unknown, errorDescription: string): void => {
  const { status, stdout, stderr } = runClaimOffice(scenario);
  expect(status).not.toBe(0);
  expect(stdout).toBe("");
  expect(stderr).toBe(`${errorDescription}\n`);
};

const payoutFor = (item: Item, amount: number): number =>
  settleClaim(issuePolicy([item]), [{ itemType: item.type, amount }]).payout;

describe("MHPCO Claim Office", () => {
  describe("quote: processing fee and base premiums", () => {
    it("empty item list -> premium 5 G (only the processing fee)", () => {
      expect(quotePremium([], newcomer)).toBe(5);
    });
    it("sword -> 100 G base premium", () => {
      expect(policyBasePremium([sword])).toBe(100);
    });
    it("amulet -> 60 G base premium", () => {
      expect(policyBasePremium([amulet])).toBe(60);
    });
    it("staff -> 80 G base premium", () => {
      expect(policyBasePremium([staff])).toBe(80);
    });
    it("potion -> 40 G base premium", () => {
      expect(policyBasePremium([potion])).toBe(40);
    });
    it("sword + amulet -> policy base premium 160 G (sum of item base premiums)", () => {
      expect(policyBasePremium([sword, amulet])).toBe(160);
    });
    it("rune -> 25 G base premium", () => {
      expect(policyBasePremium([rune])).toBe(25);
    });
    it("moonstone -> 25 G base premium", () => {
      expect(policyBasePremium([moonstone])).toBe(25);
    });
    it("2 runes -> 50 G base premium", () => {
      expect(policyBasePremium(times(2, rune))).toBe(50);
    });
    it("3 runes -> 60 G base premium (block applies)", () => {
      expect(policyBasePremium(times(3, rune))).toBe(60);
    });
    it("4 runes -> 100 G base premium (no block: block requires exactly 3)", () => {
      expect(policyBasePremium(times(4, rune))).toBe(100);
    });
    it("7 runes -> 175 G base premium", () => {
      expect(policyBasePremium(times(7, rune))).toBe(175);
    });
    it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
      expect(policyBasePremium([...times(2, rune), moonstone])).toBe(75);
    });
    it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
      expect(policyBasePremium([...times(3, rune), ...times(3, moonstone)])).toBe(120);
    });
    it("3 swords -> 300 G base premium (the block offer is for components only)", () => {
      expect(policyBasePremium(times(3, sword))).toBe(300);
    });
    it("unknown item type broomstick -> quote is rejected (reading: the domain throws an Error naming the type; the CLI turns it into a non-zero exit)", () => {
      expect(() => policyBasePremium([{ type: "broomstick" }])).toThrow(/broomstick/);
    });
  });

  describe("quote: premium modifiers", () => {
    it("plain sword, newcomer's first contract -> 115 G (100 base + 10 first insurance + 5 fee)", () => {
      expect(quotePremium([sword], newcomer)).toBe(115);
    });
    it("newcomer with a cursed sword (steel, enchantment 3) -> 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      expect(quotePremium([cursedSword], newcomer)).toBe(165);
    });
    it("sword with exactly enchantment 5, not cursed -> 145 G (high-enchantment surcharge 30 applies)", () => {
      expect(quotePremium([{ ...sword, enchantment: 5 }], newcomer)).toBe(145);
    });
    it("sword with enchantment 4, not cursed -> 115 G (no high-enchantment surcharge, no curse surcharge)", () => {
      expect(quotePremium([{ ...sword, enchantment: 4, cursed: false }], newcomer)).toBe(115);
    });
    it("cursed sword with exactly enchantment 5 -> 195 G (both surcharges apply: 50 + 30)", () => {
      expect(quotePremium([{ ...sword, enchantment: 5, cursed: true }], newcomer)).toBe(195);
    });
    it("cursed sword with enchantment 4 -> 165 G (only the curse surcharge applies)", () => {
      expect(quotePremium([{ ...sword, enchantment: 4, cursed: true }], newcomer)).toBe(165);
    });
    it("cursed sword + plain amulet -> 231 G (base 160; curse adds 50 = 50 % of the sword's base premium, not of the policy total; + 16 first insurance + 5 fee)", () => {
      expect(quotePremium([{ ...sword, cursed: true }, amulet], newcomer)).toBe(231);
    });
    it("plain sword + amulet with enchantment 5 -> 199 G (high-enchantment adds 18 = 30 % of the amulet's base premium; + 16 first insurance + 5 fee)", () => {
      expect(quotePremium([sword, { ...amulet, enchantment: 5 }], newcomer)).toBe(199);
    });
    it("cursed rune -> 45 G (reading: the curse surcharge applies to a component's own base premium: 25 + 12.5 curse + 2.5 first insurance + 5 fee)", () => {
      expect(quotePremium([{ ...rune, cursed: true }], newcomer)).toBe(45);
    });
    it("customer with exactly 2 years with MHPCO, plain sword -> 95 G (100 - 20 loyalty + 10 first insurance + 5 fee)", () => {
      expect(quotePremium([sword], { ...newcomer, yearsWithMHPCO: 2 })).toBe(95);
    });
    it("customer with 1 year with MHPCO, plain sword -> 115 G (no loyalty discount)", () => {
      expect(quotePremium([sword], { ...newcomer, yearsWithMHPCO: 1 })).toBe(115);
    });
    it("customer with 3 years, cursed sword -> 145 G (loyalty 20 = 20 % of the policy base premium, not of the surcharged amount)", () => {
      expect(quotePremium([{ ...sword, cursed: true }], { ...newcomer, yearsWithMHPCO: 3 })).toBe(145);
    });
    it("follow-up contract (one previous contract), newcomer, plain sword -> 100 G (100 + 10 first insurance - 15 follow-up + 5 fee)", () => {
      expect(quotePremium([sword], { ...newcomer, previousContracts: 1 })).toBe(100);
    });
    it("rounding in the MHPCO's favor: 7 runes for a newcomer yield 197.5 G -> premium 198 G (rounded up)", () => {
      expect(quotePremium(times(7, rune), newcomer)).toBe(198);
    });
    it("intermediate amounts stay fractional: 2 cursed runes for a newcomer -> 85 G (50 + 2 x 12.5 curse + 5 first insurance + 5 fee, not 86)", () => {
      expect(quotePremium(times(2, { ...rune, cursed: true }), newcomer)).toBe(85);
    });
  });

  describe("policy: insurance sum and cap (twice the insurance sum)", () => {
    it("sword -> insurance sum 1000 G, cap 2000 G", () => {
      expect(issuePolicy([sword]).remainingCap).toBe(2000);
    });
    it("amulet -> insurance sum 600 G, cap 1200 G", () => {
      expect(issuePolicy([amulet]).remainingCap).toBe(1200);
    });
    it("staff -> insurance sum 800 G, cap 1600 G", () => {
      expect(issuePolicy([staff]).remainingCap).toBe(1600);
    });
    it("potion -> insurance sum 400 G, cap 800 G", () => {
      expect(issuePolicy([potion]).remainingCap).toBe(800);
    });
    it("rune -> insurance sum 250 G, cap 500 G", () => {
      expect(issuePolicy([rune]).remainingCap).toBe(500);
    });
    it("moonstone -> insurance sum 250 G, cap 500 G", () => {
      expect(issuePolicy([moonstone]).remainingCap).toBe(500);
    });
    it("sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
      expect(issuePolicy([sword, amulet]).remainingCap).toBe(3200);
    });
    it("two swords -> insurance sum 2000 G, cap 4000 G", () => {
      expect(issuePolicy(times(2, sword)).remainingCap).toBe(4000);
    });
    it("cursed sword -> cap 2000 G (premium modifiers do not raise the cap)", () => {
      expect(issuePolicy([{ ...sword, cursed: true }]).remainingCap).toBe(2000);
    });
    it("sword + 3 runes (a block) -> insurance sum 1750 G, cap 3500 G (block discount does not affect the insurance sum)", () => {
      expect(issuePolicy([sword, ...times(3, rune)]).remainingCap).toBe(3500);
    });
  });

  describe("claim: payout", () => {
    it("regular sword (steel, enchantment 3), damage 500 G -> payout 400 G, remaining cap 1600 G", () => {
      const policy = issuePolicy([{ ...sword, material: "steel", enchantment: 3 }]);
      expect(settleClaim(policy, [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune, damage 200 G -> payout 100 G (no special clause for components)", () => {
      expect(payoutFor(rune, 200)).toBe(100);
    });
    it("steel sword, enchantment 9, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
      expect(payoutFor({ ...sword, material: "steel", enchantment: 9 }, 1000)).toBe(400);
    });
    it("steel sword, enchantment 7, damage 1000 G -> payout 900 G (below the enchantment 8 threshold: full reimbursement minus deductible)", () => {
      expect(payoutFor({ ...sword, material: "steel", enchantment: 7 }, 1000)).toBe(900);
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G (high-enchantment clause applies, then deductible)", () => {
      expect(payoutFor({ ...sword, material: "dragon", enchantment: 8 }, 1000)).toBe(400);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (the 50 % rule wins over dragon material)", () => {
      expect(payoutFor({ ...sword, material: "dragon", enchantment: 9 }, 1000)).toBe(400);
    });
    it("dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)", () => {
      expect(payoutFor({ ...sword, material: "dragon", enchantment: 5 }, 800)).toBe(700);
    });
    it("dragon attack damages a sword (500 G) and an amulet (300 G) -> payout 600 G (deductible once per damaged item)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      expect(settleClaim(issuePolicy([sword, amulet]), damages).payout).toBe(600);
    });
    it("two insured swords, two sword damage entries (500 G and 300 G) -> payout 600 G (each entry has its own deductible)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(settleClaim(issuePolicy(times(2, sword)), damages).payout).toBe(600);
    });
    it("sword damage 500 G + amulet damage 50 G -> payout 400 G (reading: a damage below the deductible pays nothing and never reduces other entries)", () => {
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 50 },
      ];
      expect(settleClaim(issuePolicy([sword, amulet]), damages).payout).toBe(400);
    });
    it("rounding in the MHPCO's favor: steel sword, enchantment 9, damage 901 G yields 350.5 G -> payout 350 G (rounded down)", () => {
      expect(payoutFor({ ...sword, material: "steel", enchantment: 9 }, 901)).toBe(350);
    });
    it("intermediate amounts stay fractional: two enchantment-9 swords, damage 901 G each -> payout 701 G (350.5 + 350.5)", () => {
      const policy = issuePolicy(times(2, { ...sword, enchantment: 9 }));
      expect(settleClaim(policy, times(2, { itemType: "sword", amount: 901 })).payout).toBe(701);
    });
    it("two sword damages but only one sword insured -> the whole claim is rejected (reading: the domain throws an Error; the CLI turns it into a non-zero exit)", () => {
      const damages = times(2, { itemType: "sword", amount: 500 });
      expect(() => settleClaim(issuePolicy([sword]), damages)).toThrow(/sword/);
    });
    it("amulet damaged when only a sword is insured -> claim is rejected (throws an Error)", () => {
      expect(() => settleClaim(issuePolicy([sword]), [{ itemType: "amulet", amount: 300 }])).toThrow(/amulet/);
    });
    it("damage entry with an unknown item type (broomstick) -> claim is rejected (throws an Error)", () => {
      expect(() => settleClaim(issuePolicy([sword]), [{ itemType: "broomstick", amount: 300 }])).toThrow(/broomstick/);
    });
    it("damage entry with amount -200 -> claim is rejected (throws an Error)", () => {
      expect(() => settleClaim(issuePolicy([sword]), [{ itemType: "sword", amount: -200 }])).toThrow(/-200/);
    });
  });

  describe("scenario: sequential steps", () => {
    it("schema example: 5 years, quote silver amulet (enchantment 2), claim fire damage 200 G -> results [{premium: 59}, {payout: 100, remainingCap: 1100}]", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
    it("the customer's second quote in a scenario is a follow-up contract: newcomer, two plain sword quotes -> premiums 115 G and 100 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("every contract after the first gets the follow-up discount: three plain sword quotes -> premiums 115 G, 100 G, 100 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: times(3, { op: "quote", items: [sword] }),
      };
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 100 }, { premium: 100 }] });
    });
    it("long-standing customer's second contract: 3 years, second quote, cursed sword (steel, enchantment 7) -> 160 G (100 + 50 + 30 - 20 + 10 - 15 + 5)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [potion] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      };
      expect(runScenario(scenario).results[1]).toEqual({ premium: 160 });
    });
    it("a claim refers to its policy by zero-based step index: quote sword, quote amulet, claim policy 1 amulet 300 G -> payout 200 G, remainingCap 1000 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [amulet] },
          { op: "claim", policy: 1, incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 300 }] } },
        ],
      };
      expect(runScenario(scenario).results[2]).toEqual({ payout: 200, remainingCap: 1000 });
    });
    it("cap exhaustion: sword insured, two successive claims of 1500 G -> first payout 1400 G / remaining 600 G, second payout 600 G / remaining 0 G", () => {
      const claim1500 = { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] } };
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [sword] }, claim1500, claim1500],
      };
      expect(runScenario(scenario).results.slice(1)).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("the cap is tracked per policy: two sword policies, one 1500 G claim each -> both payout 1400 G, remainingCap 600 G", () => {
      const incident = { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] };
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
          { op: "claim", policy: 0, incident },
          { op: "claim", policy: 1, incident },
        ],
      };
      expect(runScenario(scenario).results.slice(2)).toEqual(times(2, { payout: 1400, remainingCap: 600 }));
    });
    it("claim whose policy index does not refer to an earlier quote step -> rejected (reading: an unresolvable policy reference is an invalid claim; throws an Error)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "claim", policy: 5, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } },
        ],
      };
      expect(() => runScenario(scenario)).toThrow(/policy 5/);
    });
  });

  describe("claim-office CLI (stdin JSON -> stdout JSON)", () => {
    it('schema example on stdin -> exit 0, stdout {"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}, empty stderr', () => {
      const { status, stdout, stderr } = runClaimOffice({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });
      expect({ status, stderr, output: JSON.parse(stdout) }).toEqual({
        status: 0,
        stderr: "",
        output: { results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] },
      });
    });
    it("quote with unknown item type broomstick -> non-zero exit, error description on stderr, no results on stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };
      expectRejection(scenario, "Unknown item type: broomstick");
    });
    it("claim damage for an item that is not part of the policy -> non-zero exit, error description on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 300 }] } },
        ],
      };
      expectRejection(scenario, "Damaged item is not covered by the policy: amulet");
    });
    it("claim with more damages of a type than the policy covers -> non-zero exit, whole claim rejected (no results on stdout)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: times(2, { itemType: "sword", amount: 500 }) } },
        ],
      };
      expectRejection(scenario, "Damaged item is not covered by the policy: sword");
    });
    it("claim damage entry with amount -200 -> non-zero exit, error description on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      };
      expectRejection(scenario, "Damage amount must not be negative: -200");
    });
  });
});
