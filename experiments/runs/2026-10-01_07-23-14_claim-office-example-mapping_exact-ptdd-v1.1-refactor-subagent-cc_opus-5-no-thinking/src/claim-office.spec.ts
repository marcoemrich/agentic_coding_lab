import { describe, expect, it } from "vitest";

import {
  policyBasePremium,
  premiumAfterItemModifiers,
  premiumBeforeFee,
  quote,
} from "./claim-office.js";

// MHPCO Claim Office — complete inactive test list.
//
// Observable contracts chosen where the specification leaves a mechanism open:
//  * The spec states rejection cases as "the CLI exits with a non-zero status
//    code and writes an error description to stderr". The domain layer is
//    therefore specified to throw an Error (no type or message is established
//    by the spec, so only "throws" is asserted), and the CLI adapter is
//    specified to translate a thrown Error into exit code 1 + stderr text with
//    no `results` on stdout. Tests below name which of the two they observe.
//  * "rounded in the MHPCO's favor" = premium rounded up (ceil), payout
//    rounded down (floor); intermediates stay fractional.

describe("MHPCO Claim Office", () => {
  describe("quote — processing fee and empty policy", () => {
    it("quotes an empty item list as premium 5 G (processing fee only)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
    });
  });

  describe("quote — price list base premiums (one item, no modifiers, long-standing customer excluded)", () => {
    it("quotes a plain sword as base premium 100 G", () => {
      expect(policyBasePremium([{ type: "sword" }])).toBe(100);
    });
    it("quotes a plain amulet as base premium 60 G", () => {
      expect(policyBasePremium([{ type: "amulet" }])).toBe(60);
    });
    it("quotes a plain staff as base premium 80 G", () => {
      expect(policyBasePremium([{ type: "staff" }])).toBe(80);
    });
    it("quotes a plain potion as base premium 40 G", () => {
      expect(policyBasePremium([{ type: "potion" }])).toBe(40);
    });
    it("quotes a single rune as base premium 25 G", () => {
      expect(policyBasePremium([{ type: "rune" }])).toBe(25);
    });
    it("quotes a single moonstone as base premium 25 G", () => {
      expect(policyBasePremium([{ type: "moonstone" }])).toBe(25);
    });
  });

  describe("quote — component building block of 3 alike components", () => {
    it("quotes 2 runes as base premium 50 G (no block)", () => {
      expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
    });
    it("quotes 3 runes as base premium 60 G (block applies)", () => {
      expect(
        policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
      ).toBe(60);
    });
    it("quotes 4 runes as base premium 100 G (no block — block requires exactly 3)", () => {
      expect(policyBasePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
    });
    it("quotes 7 runes as base premium 175 G (no block at 7)", () => {
      expect(policyBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
    });
    it("quotes 2 runes + 1 moonstone as base premium 75 G (no block: different types)", () => {
      expect(
        policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
      ).toBe(75);
    });
    it("quotes 3 swords as base premium 300 G (no block — the building block is offered for components only)", () => {
      expect(policyBasePremium(Array.from({ length: 3 }, () => ({ type: "sword" })))).toBe(300);
    });
    it("quotes 3 runes + 3 moonstones as base premium 120 G (two separate blocks of the same type)", () => {
      const items = [
        ...Array.from({ length: 3 }, () => ({ type: "rune" })),
        ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
      ];
      expect(policyBasePremium(items)).toBe(120);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("adds a 50 % curse surcharge to a cursed sword's base premium — premium 160 G before fee", () => {
      expect(
        premiumAfterItemModifiers([{ type: "sword", cursed: true }]),
      ).toBe(150);
    });
    it("adds a 30 % high-enchantment surcharge to a sword with enchantment 5 — threshold is inclusive", () => {
      expect(premiumAfterItemModifiers([{ type: "sword", enchantment: 5 }])).toBe(130);
    });
    it("adds no high-enchantment surcharge to a sword with enchantment 4", () => {
      expect(premiumAfterItemModifiers([{ type: "sword", enchantment: 4 }])).toBe(100);
    });
    it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
      expect(
        premiumAfterItemModifiers([{ type: "sword", cursed: true, enchantment: 5 }]),
      ).toBe(180);
    });
    it("applies only the curse surcharge to a cursed sword with enchantment 4", () => {
      expect(
        premiumAfterItemModifiers([{ type: "sword", cursed: true, enchantment: 4 }]),
      ).toBe(150);
    });
    // The spec leaves "the base premium of the affected item" open for a
    // component priced inside a 3-alike block. Reading adopted: the component's
    // own 25 G tariff, not a third of the 60 G block price (which would give
    // 70 G). The spec characterises the block as an aggregate discount that
    // "affects the premium only, not the insurance sum", i.e. it is not pushed
    // down into per-item figures.
    it("charges a cursed component's surcharge on its own 25 G tariff, not a third of the 60 G block — 3 runes with one cursed: 72.5 G", () => {
      expect(
        premiumAfterItemModifiers([
          { type: "rune", cursed: true },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(72.5);
    });
    it("applies the curse surcharge per affected item, not to the policy total — cursed sword + plain amulet: policy base 160 G, curse adds 50 G → 210 G before policy modifiers and fee", () => {
      expect(
        premiumAfterItemModifiers([
          { type: "sword", cursed: true },
          { type: "amulet" },
        ]),
      ).toBe(210);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    // Reading adopted for every test in this group: the spec's integration
    // examples compute policy-wide modifiers as percentages OF THE POLICY BASE
    // PREMIUM, summed onto the running total -- not as multiplicative factors
    // on the premium after item modifiers. The 3-year second-contract example
    // is 100 + 50 + 30 - 20 + 10 - 15, where -20 is 20 % of the 100 G base,
    // not of the 180 G running total.
    it("applies a 20 % loyalty discount to the policy base premium for a customer with exactly 2 years with MHPCO — threshold is inclusive", () => {
      // sword base 100; loyalty -20; first insurance +10 (applies to every quote)
      expect(premiumBeforeFee({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(90);
    });
    it("applies no loyalty discount for a customer with 1 year with MHPCO", () => {
      // sword base 100; no loyalty; first insurance +10
      expect(premiumBeforeFee({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0)).toBe(110);
    });
    it("applies a 10 % first-insurance surcharge on the policy base premium of a customer's first quote", () => {
      // sword base 100; newcomer, no loyalty; first insurance +10
      expect(premiumBeforeFee({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(110);
    });
    it("applies the 10 % first-insurance surcharge to every quote, since each quoted item is treated as a first insurance regardless of customer history", () => {
      // 3-year customer's second contract: base 100; loyalty -20;
      // first insurance +10 (still applies); follow-up -15
      expect(premiumBeforeFee({ yearsWithMHPCO: 3 }, [{ type: "sword" }], 1)).toBe(75);
    });
    it("applies a 15 % follow-up-contract discount on the customer's second quote in a scenario", () => {
      // 0-year customer's second contract: base 100; first insurance +10; follow-up -15
      expect(premiumBeforeFee({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(95);
    });
    it("applies the 15 % follow-up-contract discount to the third quote as well (every contract after the first)", () => {
      // third contract: the discount applies to EVERY contract after the first,
      // not only the second -- base 100; first insurance +10; follow-up -15
      expect(premiumBeforeFee({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 2)).toBe(95);
    });
    it("adds the 5 G processing fee at the very end, after all percentage modifiers", () => {
      // newcomer's first quote: base 100; first insurance +10; fee +5
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
    });
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    it.todo("rounds a premium of 197.5 G up to 198 G");
    it.todo("keeps intermediate amounts fractional and rounds only the final premium");
  });

  describe("quote — integration examples", () => {
    it.todo("quotes a newcomer's cursed steel sword (enchantment 3, 0 years, no previous contract) as premium 165 G");
    it.todo("quotes a 3-year customer's second contract for a cursed steel sword (enchantment 7) as premium 160 G");
  });

  describe("quote — rejection", () => {
    it.todo("domain: throws an Error when a quote includes an item with an unknown type (e.g. broomstick)");
  });

  describe("claim — insurance sum and cap", () => {
    it.todo("caps a sword policy at 2000 G (twice the 1000 G insurance sum)");
    it.todo("sums insurance values across items — sword + amulet gives insurance sum 1600 G, cap 3200 G");
    it.todo("bases the cap on unmodified insurance value — a cursed sword (premium 165 G) still has cap 2000 G");
    it.todo("includes components at full insurance value — sword + 3 runes gives insurance sum 1750 G, cap 3500 G (the block discount affects the premium only)");
    it.todo("sums repeated items of the same type — two swords give insurance sum 2000 G, cap 4000 G");
  });

  describe("claim — standard reimbursement and deductible", () => {
    it.todo("pays out 400 G for a regular steel sword (enchantment 3) with damage 500 G (full reimbursement minus 100 G deductible)");
    it.todo("pays out 100 G for a damaged rune (insurance value 250 G) with damage 200 G — no enchantment level or material, so no special clause");
    it.todo("applies the 100 G deductible once per damaged item — sword 500 G + amulet 300 G in one incident pays out 600 G");
    it.todo("treats each damages entry as a separate damage with its own deductible — two sword entries against a two-sword policy");
  });

  describe("claim — special clauses", () => {
    it.todo("reimburses damage to an item with enchantment 9 at 50 % — steel sword, damage 1000 G, payout 400 G (50 % first, then deductible)");
    it.todo("reimburses damage to an item with exactly enchantment 8 at 50 % — threshold is inclusive");
    it.todo("fully reimburses damage to a dragon-material item — dragon sword, enchantment 5, damage 800 G, payout 700 G");
    it.todo("lets the 50 % high-enchantment rule win when both clauses apply — dragon sword, enchantment 9, damage 1000 G, payout 400 G");
    it.todo("applies the high-enchantment clause then the deductible for a dragon sword with exactly enchantment 8, damage 1000 G — payout 400 G");
  });

  describe("claim — cap exhaustion across successive claims", () => {
    it.todo("pays out 1400 G and leaves remainingCap 600 G for a 1500 G claim against a sword policy (cap 2000 G)");
    it.todo("reduces the second 1500 G claim to the remaining 600 G and leaves remainingCap 0 G");
    it.todo("reports the full remaining cap when a claim does not exhaust it");
  });

  describe("claim — payout rounding in the MHPCO's favor", () => {
    it.todo("rounds a payout of 350.5 G down to 350 G");
  });

  describe("claim — rejection", () => {
    it.todo("domain: throws an Error when a damage entry references an item type that is not part of the policy (amulet damaged, only a sword insured)");
    it.todo("domain: throws an Error when a damage entry references an unknown item type");
    it.todo("domain: throws an Error when damages contain more entries of a type than the policy covers (two sword damages, one sword insured)");
    it.todo("domain: throws an Error when a damage entry has a negative amount (-200)");
  });

  describe("CLI — stdin/stdout contract", () => {
    it.todo("reads a scenario from stdin and writes {results} with one entry per step, in order");
    it.todo("writes {premium} for a quote step and {payout, remainingCap} for a claim step");
    it.todo("resolves a claim step's policy field as the zero-based index of the quote step that created the policy");
    it.todo("processes the schema example end to end — amulet quote then a 200 G amulet claim");
    it.todo("exits with a non-zero status code and writes an error description to stderr, writing no results to stdout, when the scenario is rejected");
  });
});
