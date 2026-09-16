import { describe, expect, it } from "vitest";

import { execFileSync } from "node:child_process";

import { claim } from "./claim.js";
import { quote } from "./quote.js";

/**
 * Test list for the MHPCO Claim Office kata.
 *
 * Adopted readings where prompt.md leaves a contract open:
 * - "alike" components means exactly the same item type (2 runes + 1 moonstone -> no block).
 * - a block is exactly 3 alike components; 4 or 7 alike components form no block.
 * - the first-insurance surcharge is 10 % of the policy base premium on every quote,
 *   regardless of customer history ("each item in a quote is treated as a first insurance").
 * - rejections are observable at the CLI as a non-zero exit status plus an error
 *   description on stderr and no results on stdout; the spec names no error type, so the
 *   domain layer throws a plain Error and the tests assert the CLI contract.
 */
interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliOutcome {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return {
      status: failure.status ?? 1,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

describe("MHPCO claim office", () => {
  describe("quote -- processing fee and empty policy", () => {
    it("quotes an empty item list as 5 G -- only the processing fee", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [], 0).premium).toBe(5);
    });
  });

  describe("quote -- main item base premiums and the 5 G fee", () => {
    it("quotes a plain sword for a newcomer -- 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0).premium).toBe(115);
    });
    it("quotes a plain amulet -- base premium 60 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0).premium).toBe(71);
    });
    it("quotes a plain staff -- base premium 80 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0).premium).toBe(93);
    });
    it("quotes a plain potion -- base premium 40 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0).premium).toBe(49);
    });
    it("quotes a single rune -- base premium 25 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0).premium).toBe(33);
    });
    it("quotes a single moonstone -- base premium 25 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0).premium).toBe(33);
    });
    it("sums the base premiums of several different main items -- sword + amulet = 160 G base", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }], 0).premium,
      ).toBe(181);
    });
  });

  describe("quote -- insurance values feed the claim cap, not the premium", () => {
    it("a policy for a sword has insurance sum 1000 G -- cap 2000 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0).cap).toBe(2000);
    });
    it("a policy for an amulet has insurance sum 600 G -- cap 1200 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0).cap).toBe(1200);
    });
    it("a policy for a staff has insurance sum 800 G -- cap 1600 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0).cap).toBe(1600);
    });
    it("a policy for a potion has insurance sum 400 G -- cap 800 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0).cap).toBe(800);
    });
    it("a policy for a rune has insurance sum 250 G -- cap 500 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0).cap).toBe(500);
    });
    it("a policy for a moonstone has insurance sum 250 G -- cap 500 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0).cap).toBe(500);
    });
    it("a policy for a sword and an amulet has insurance sum 1600 G -- cap 3200 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }], 0).cap,
      ).toBe(3200);
    });
    it("a policy for two swords has insurance sum 2000 G -- cap 4000 G", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "sword" }], 0).cap,
      ).toBe(4000);
    });
    it("a policy for a sword and 3 runes has insurance sum 1750 G -- cap 3500 G; the block discount does not lower the insurance sum", () => {
      const items = [
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ];
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).cap).toBe(3500);
    });
    it("a cursed sword whose premium is 165 G still has cap 2000 G -- premium modifiers do not raise the cap", () => {
      const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
      const result = quote({ yearsWithMHPCO: 0 }, [cursedSword], 0);
      expect(result.premium).toBe(165);
      expect(result.cap).toBe(2000);
    });
  });

  describe("quote -- building block of 3 alike components", () => {
    it("2 runes -- 50 G base premium (no block) -- 50 + 5 + 5 = 60 G", () => {
      const items = [{ type: "rune" }, { type: "rune" }];
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(60);
    });
    it("3 runes -- 60 G base premium (block applies) -- 60 + 6 + 5 = 71 G", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(71);
    });
    it("4 runes -- 100 G base premium (no block: block requires exactly 3) -- 100 + 10 + 5 = 115 G", () => {
      const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(115);
    });
    it("7 runes -- 175 G base premium (no block) -- 175 + 17.5 + 5 = 197.5 rounded up to 198 G", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(198);
    });
    it("3 moonstones -- 60 G base premium (the block rule applies to moonstones too) -- 71 G", () => {
      const items = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(71);
    });
    it("3 swords -- 300 G base premium (the block offer covers components only, not main items) -- 335 G", () => {
      const items = Array.from({ length: 3 }, () => ({ type: "sword" }));
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(335);
    });
    it("2 runes + 1 moonstone -- 75 G base premium (no block: different types) -- 87.5 rounded up to 88 G", () => {
      const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(88);
    });
    it("3 runes + 3 moonstones -- 120 G base premium (two separate blocks) -- 137 G", () => {
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      ];
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(137);
    });
    it("3 runes + 1 moonstone -- 85 G base premium (rune block plus one loose moonstone) -- 98.5 rounded up to 99 G", () => {
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        { type: "moonstone" },
      ];
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(99);
    });
  });

  describe("quote -- item-specific modifiers", () => {
    it("a cursed sword adds a 50 % surcharge on its own base premium -- 50 G on 100 G", () => {
      const cursedSword = { type: "sword", cursed: true };
      expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0).premium).toBe(165);
    });
    it("a cursed amulet adds 30 G -- 50 % of the amulet's 60 G base premium", () => {
      const cursedAmulet = { type: "amulet", cursed: true };
      expect(quote({ yearsWithMHPCO: 0 }, [cursedAmulet], 0).premium).toBe(101);
    });
    it("a sword with enchantment 5 adds a 30 % high-enchantment surcharge -- 30 G", () => {
      const enchantedSword = { type: "sword", enchantment: 5 };
      expect(quote({ yearsWithMHPCO: 0 }, [enchantedSword], 0).premium).toBe(145);
    });
    it("a sword with enchantment 4 adds no high-enchantment surcharge", () => {
      const sword = { type: "sword", enchantment: 4 };
      expect(quote({ yearsWithMHPCO: 0 }, [sword], 0).premium).toBe(115);
    });
    it("a cursed sword with enchantment 5 adds both surcharges -- 50 G + 30 G", () => {
      const sword = { type: "sword", enchantment: 5, cursed: true };
      expect(quote({ yearsWithMHPCO: 0 }, [sword], 0).premium).toBe(195);
    });
    it("a cursed sword with enchantment 4 adds only the curse surcharge -- 50 G", () => {
      const sword = { type: "sword", enchantment: 4, cursed: true };
      expect(quote({ yearsWithMHPCO: 0 }, [sword], 0).premium).toBe(165);
    });
  });

  describe("quote -- modifier scope on multi-item policies", () => {
    it("a cursed sword plus a plain amulet -- policy base 160 G, curse surcharge 50 G (of the sword only) = 210 G before policy-wide modifiers and fee", () => {
      const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
      // observable total: 160 base + 50 curse + 16 first insurance + 5 fee
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(231);
    });
    it("high enchantment on one of two items applies to that item's base premium only -- 160 base + 30 + 16 + 5 = 211 G", () => {
      const items = [{ type: "sword", enchantment: 7 }, { type: "amulet" }];
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(211);
    });
  });

  describe("quote -- policy-wide modifiers", () => {
    it("a customer with exactly 2 years with MHPCO receives the 20 % loyalty discount -- 100 - 20 + 10 + 5 = 95 G", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0).premium).toBe(95);
    });
    it("a customer with 1 year with MHPCO receives no loyalty discount -- 115 G", () => {
      expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0).premium).toBe(115);
    });
    it("the first-insurance surcharge of 10 % of the policy base applies to a newcomer's quote -- 2 swords: 200 + 20 + 5 = 225 G", () => {
      const items = [{ type: "sword" }, { type: "sword" }];
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(225);
    });
    it("the first-insurance surcharge also applies to a long-standing customer's new item -- 3 years, sword: 100 - 20 + 10 + 5 = 95 G", () => {
      expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 0).premium).toBe(95);
    });
    it("the customer's first quote in a scenario receives no follow-up discount -- sword 115 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0).premium).toBe(115);
    });
    it("the customer's second quote receives the 15 % follow-up discount of the policy base -- 100 - 15 + 10 + 5 = 100 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1).premium).toBe(100);
    });
    it("the customer's third quote also receives the 15 % follow-up discount -- not compounded: 100 G", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 2).premium).toBe(100);
    });
    it("policy-wide modifiers are computed from the policy base premium, not from the item premium including item surcharges -- 130 G", () => {
      const cursedSword = { type: "sword", cursed: true };
      // 100 base + 50 curse - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee
      expect(quote({ yearsWithMHPCO: 2 }, [cursedSword], 1).premium).toBe(130);
    });
  });

  describe("quote -- rounding in the MHPCO's favour", () => {
    it("a premium calculation yielding 197.5 G is rounded up to 198 G", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quote({ yearsWithMHPCO: 0 }, items, 0).premium).toBe(198);
    });
    it("intermediate amounts stay fractional -- only the final premium is rounded -- 85 - 17 + 8.5 + 5 = 81.5 rounded up to 82 G", () => {
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        { type: "moonstone" },
      ];
      expect(quote({ yearsWithMHPCO: 2 }, items, 0).premium).toBe(82);
    });
  });

  describe("quote -- rejections", () => {
    it("a quote with an unknown item type (broomstick) exits non-zero, writes an error description to stderr and no results to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };
      const outcome = runCli(scenario);
      expect(outcome.status).not.toBe(0);
      expect(outcome.stdout).toBe("");
      expect(outcome.stderr).toContain("broomstick");
    });
  });

  describe("claim -- standard reimbursement and deductible", () => {
    it("a regular sword (steel, enchantment 3) with damage 500 G pays out 400 G -- full reimbursement minus the 100 G deductible", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 500 }];
      expect(claim(policy, items, damages).payout).toBe(400);
    });
    it("damage of 200 G to a rune (insurance value 250 G) pays out 100 G -- components have no enchantment or material, so no special clause applies", () => {
      const items = [{ type: "rune" }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "rune", amount: 200 }];
      expect(claim(policy, items, damages).payout).toBe(100);
    });
    it("damage below the 100 G deductible pays out 0 G, never a negative amount", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 50 }];
      expect(claim(policy, items, damages).payout).toBe(0);
    });
  });

  describe("claim -- high-enchantment clause", () => {
    it("a steel sword with enchantment 9 and damage 1000 G pays out 400 G -- 50 % first, then the deductible", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 9 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 1000 }];
      expect(claim(policy, items, damages).payout).toBe(400);
    });
    it("a steel sword with exactly enchantment 8 and damage 1000 G pays out 400 G -- the clause applies at the threshold", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 8 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 1000 }];
      expect(claim(policy, items, damages).payout).toBe(400);
    });
    it("a steel sword with enchantment 7 and damage 1000 G pays out 900 G -- below the threshold, full reimbursement minus deductible", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 7 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 1000 }];
      expect(claim(policy, items, damages).payout).toBe(900);
    });
  });

  describe("claim -- dragon-material clause", () => {
    it("a dragon-material sword with enchantment 5 and damage 800 G pays out 700 G -- full reimbursement, then the deductible", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 800 }];
      expect(claim(policy, items, damages).payout).toBe(700);
    });
    it("a dragon-material sword with enchantment 9 and damage 1000 G pays out 400 G -- both clauses apply, the 50 % rule wins, then the deductible", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 1000 }];
      expect(claim(policy, items, damages).payout).toBe(400);
    });
    it("a dragon-material sword with exactly enchantment 8 and damage 1000 G pays out 400 G", () => {
      const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 1000 }];
      expect(claim(policy, items, damages).payout).toBe(400);
    });
  });

  describe("claim -- deductible per damage event", () => {
    it("a dragon attack damaging an insured sword (500 G) and an insured amulet (300 G) pays out 600 G -- the 100 G deductible applies once per damaged item", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "amulet", material: "silver", enchantment: 2 },
      ];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      expect(claim(policy, items, damages).payout).toBe(600);
    });
    it("two sword damage entries on a policy covering two swords are treated as separate damages, each with its own deductible -- 400 + 200 = 600 G", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 3 },
        { type: "sword", material: "steel", enchantment: 3 },
      ];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ];
      expect(claim(policy, items, damages).payout).toBe(600);
    });
  });

  describe("claim -- cap", () => {
    it("a first claim of 1500 G against a sword policy pays out 1400 G and leaves remainingCap 600 G", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const result = claim(policy, items, [{ itemType: "sword", amount: 1500 }]);
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    });
    it("a second claim of 1500 G against the same sword policy pays out 600 G and leaves remainingCap 0 G -- the desired 1400 G is reduced to the remaining cap", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [{ itemType: "sword", amount: 1500 }];
      const first = claim(policy, items, damages);
      const second = claim(policy, items, damages, first.remainingCap);
      expect(second.payout).toBe(600);
      expect(second.remainingCap).toBe(0);
    });
    it("a claim against an exhausted cap pays out 0 G and leaves remainingCap 0 G", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const result = claim(policy, items, [{ itemType: "sword", amount: 500 }], 0);
      expect(result.payout).toBe(0);
      expect(result.remainingCap).toBe(0);
    });
    it("a claim well below the cap leaves remainingCap reduced by exactly the payout -- 2000 - 400 = 1600 G", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 3 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const result = claim(policy, items, [{ itemType: "sword", amount: 500 }]);
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
  });

  describe("claim -- rounding in the MHPCO's favour", () => {
    it("a payout calculation yielding 350.5 G is rounded down to 350 G", () => {
      const items = [{ type: "sword", material: "steel", enchantment: 8 }];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      // 901 damage at 50 % = 450.5, minus the 100 G deductible = 350.5
      const result = claim(policy, items, [{ itemType: "sword", amount: 901 }]);
      expect(result.payout).toBe(350);
    });
    it("intermediate amounts stay fractional -- only the final payout is rounded -- 350.5 + 50.5 = 401 G", () => {
      const items = [
        { type: "sword", material: "steel", enchantment: 8 },
        { type: "staff", material: "oak", enchantment: 8 },
      ];
      const policy = quote({ yearsWithMHPCO: 0 }, items, 0);
      const damages = [
        { itemType: "sword", amount: 901 },
        { itemType: "staff", amount: 301 },
      ];
      expect(claim(policy, items, damages).payout).toBe(401);
    });
  });

  describe("claim -- rejections", () => {
    it("a damage entry for an item not covered by the policy (amulet damaged when only a sword is insured) exits non-zero with an error description on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };
      const outcome = runCli(scenario);
      expect(outcome.status).not.toBe(0);
      expect(outcome.stdout).toBe("");
      expect(outcome.stderr).toContain("amulet");
    });
    it("a damage entry with an unknown item type exits non-zero with an error description on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      };
      const outcome = runCli(scenario);
      expect(outcome.status).not.toBe(0);
      expect(outcome.stdout).toBe("");
      expect(outcome.stderr).toContain("broomstick");
    });
    it("more damage entries of a type than the policy covers (two sword damages, one sword insured) exits non-zero and rejects the whole claim", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };
      const outcome = runCli(scenario);
      expect(outcome.status).not.toBe(0);
      expect(outcome.stdout).toBe("");
      expect(outcome.stderr).toContain("sword");
    });
    it("a damage entry with amount -200 exits non-zero with an error description on stderr", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      };
      const outcome = runCli(scenario);
      expect(outcome.status).not.toBe(0);
      expect(outcome.stdout).toBe("");
      expect(outcome.stderr).toContain("-200");
    });
  });

  describe("CLI -- transport contract", () => {
    it("reads the scenario JSON from stdin and writes a results array of the same length and order to stdout", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };
      const outcome = runCli(scenario);
      expect(outcome.status).toBe(0);
      expect(JSON.parse(outcome.stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("writes premium for a quote step and payout plus remainingCap for a claim step -- integers only", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "rune", amount: 901 }] },
          },
        ],
      };
      const { results } = JSON.parse(runCli(scenario).stdout) as {
        results: [{ premium: number }, { payout: number; remainingCap: number }];
      };
      expect(Number.isInteger(results[0].premium)).toBe(true);
      expect(Number.isInteger(results[1].payout)).toBe(true);
      expect(Number.isInteger(results[1].remainingCap)).toBe(true);
      expect(results[0].premium).toBe(198);
    });
    it("processes steps sequentially so a claim step resolves its policy by the zero-based index of the quote step", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "theft", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      };
      const { results } = JSON.parse(runCli(scenario).stdout) as { results: unknown[] };
      // second quote gets the 15 % follow-up discount: 60 + 6 - 9 + 5 = 62
      expect(results).toEqual([
        { premium: 115 },
        { premium: 62 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("the schema example (5-year customer, silver amulet enchantment 2, fire damage 200 G) yields premium 59 G and payout 100 G with remainingCap 1100 G", () => {
      const items = [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }];
      const policy = quote({ yearsWithMHPCO: 5 }, items, 0);
      expect(policy.premium).toBe(59);
      const result = claim(policy, items, [{ itemType: "amulet", amount: 200 }]);
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(1100);
    });
  });

  describe("integration examples", () => {
    it("newcomer with a cursed steel sword (enchantment 3) -- premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      };
      const { results } = JSON.parse(runCli(scenario).stdout) as { results: unknown[] };
      expect(results).toEqual([{ premium: 165 }]);
    });
    it("long-standing customer's second contract with a cursed steel sword (enchantment 7) -- premium 160 G (100 + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1 }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      };
      const { results } = JSON.parse(runCli(scenario).stdout) as {
        results: { premium: number }[];
      };
      expect(results[1].premium).toBe(160);
    });
  });
});
