import { describe, it, expect } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest case ---
  it("should charge only the processing fee for an empty item list — premium 5 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per main item type ---
  it("should quote a plain sword — premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
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
  it("should quote a plain amulet — premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote a plain staff — premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote a plain potion — premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Component base premiums and the block of 3 alike ---
  it("should quote a single rune — base premium 25 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    // 25 base + 10% first insurance + 5 fee = 32.5, rounded up to 33 in
    // MHPCO's favour.
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote a single moonstone — base premium 25 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    // As with the rune test: 25 base + 10% + 5 fee = 32.5, rounded up to 33.
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote 2 runes — base premium 50 G (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 2 x 25 = 50 base, +10% first insurance, +5 fee = 60 exactly.
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("should quote 3 runes — base premium 60 G (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // 3 alike components form a block: 60 base, NOT 3 x 25 = 75.
    // +10% first insurance, +5 fee = 71.
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote 4 runes — base premium 100 G (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });

    // No block at 4: 4 x 25 = 100 base, +10% first insurance, +5 fee = 115.
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote 7 runes — base premium 175 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });

    // This test pins COMPONENT PRICING: no block at 7, so 7 x 25 = 175 base.
    // (The separate rounding test below shares this scenario but pins the
    // rounding rule instead.)
    // 175 base + 10% first insurance + 5 fee = 197.5, shown rounded as 198.
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("should quote 2 runes + 1 moonstone — base premium 75 G (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    });

    // "Alike" means exactly the same type, so 3 components form no block here:
    // runes (2 x 25 = 50) + moonstone (25) = 75 base, +10% + 5 fee = 87.5,
    // rounded up to 88.
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("should quote 3 runes + 3 moonstones — base premium 120 G (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
            ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
          ],
        },
      ],
    });

    // Each type blocks separately: 60 (runes) + 60 (moonstones) = 120 base —
    // not one merged block, and not 6 x 25 = 150. +10% + 5 fee = 137.
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("should add a 50% curse surcharge to the cursed item's base premium — cursed sword base 150 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    // Modifiers are ADDITIVE percentages of the item's unmodified base, not
    // compounding: 100 base + 50 curse (50% of 100) + 10 first insurance
    // (10% of 100) = 160, + 5 fee = 165.
    //
    // Both integration examples pin this. The second one — cursed sword,
    // enchantment 7, 3-year customer — is decisive: "100 + 50 curse + 30 high
    // enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5
    // = 160". Loyalty there is 20 (20% of the unmodified 100), not 20% of the
    // modifier-inflated 180. If policy-wide modifiers applied to a base that
    // already included item modifiers, that example would not total 160.
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should add a 30% high-enchantment surcharge at enchantment 5 — sword base 130 G", () => {
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

    // Enchantment 5 is the INCLUSIVE threshold (spec: level >= 5 surcharges,
    // and "sword with exactly enchantment 5 → surcharge applies").
    // 100 base + 30 high enchantment (30% of 100) + 10 first insurance = 140,
    // + 5 fee = 145.
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("should not add the high-enchantment surcharge at enchantment 4 — sword base 100 G", () => {
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

    // Exclusive side of the threshold: 4 is below 5, so no surcharge. With the
    // enchantment-5 test (145) this pins the boundary from both sides.
    // 100 base + 10 first insurance = 110, + 5 fee = 115.
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply both surcharges to a cursed sword with enchantment 5 — base 180 G", () => {
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

    // Both item-specific surcharges STACK additively — neither overrides the
    // other (spec: "if cursed, both surcharges apply").
    // 100 base + 50 curse + 30 high enchantment = 180 item base.
    // First insurance is 10% of the UNMODIFIED 100 base = 10, not 10% of 180.
    // 180 + 10 = 190, + 5 fee = 195.
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("should apply the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    // 2 years is the INCLUSIVE threshold (spec: ">= 2 years", and "customer
    // with exactly 2 years → loyalty discount applies"). Loyalty is a negative
    // additive term on the unmodified base:
    // 100 base - 20 loyalty + 10 first insurance = 90, + 5 fee = 95.
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("should not apply the loyalty discount at 1 year with MHPCO", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    // Exclusive side of the loyalty threshold: 1 year is below 2, so no
    // discount. With the exactly-2-years test (95) this pins both sides.
    // 100 base + 10 first insurance = 110, + 5 fee = 115.
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply the 10% first insurance surcharge to every item in a quote", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    // First insurance covers EVERY item: it is 10% of the summed policy base
    // (16 = 10% of 100 + 60), not 10 = 10% of the sword alone.
    // 160 base + 16 first insurance = 176, + 5 fee = 181.
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("should apply the 15% follow-up discount on each contract after the first", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    // The discount keys off the quote's ORDINAL POSITION among quote steps,
    // not off customer.yearsWithMHPCO.
    //   1st quote: 100 base + 10 first insurance = 110, + 5 fee = 115.
    //   2nd quote: 100 base + 10 first insurance - 15 follow-up = 95,
    //              + 5 fee = 100.
    //
    // First insurance STILL applies to the follow-up contract — the two
    // modifiers coexist rather than being mutually exclusive. This is the
    // spec's binding answer to its own question: "each item in a quote is
    // treated as a first insurance, regardless of customer history", and its
    // second integration example sums both "+ 10 first insurance" and
    // "- 15 follow-up" in one calculation.
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("should add the 5 G processing fee at the very end of every premium", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };
    const quoteFor = (yearsWithMHPCO: number) =>
      runScenario({
        customer: { yearsWithMHPCO },
        steps: [{ op: "quote", items: [sword] }],
      });

    const newcomer = quoteFor(0);
    const loyal = quoteFor(2);

    // Fee is added AFTER every percentage, never folded into the base.
    //   0 years: 100 + 10 first insurance = 110, + 5 fee = 115.
    //   2 years: 100 - 20 loyalty + 10 first insurance = 90, + 5 fee = 95.
    expect(newcomer).toEqual({ results: [{ premium: 115 }] });
    expect(loyal).toEqual({ results: [{ premium: 95 }] });

    // The ordering is what makes both results whole numbers. Were the fee
    // folded into the base first (105), the percentages would scale it:
    // 105 - 21 + 10.5 = 94.5, and the gap would be 21 rather than 20.
    const loyaltyGap =
      (newcomer.results[0] as { premium: number }).premium -
      (loyal.results[0] as { premium: number }).premium;
    expect(loyaltyGap).toBe(20);
  });

  // --- Modifier scope on multi-item policies ---
  it("should apply the curse surcharge only to the cursed item — cursed sword + plain amulet: 160 G base + 50 G curse = 210 G before further modifiers and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    // The spec's binding answer to "does the curse apply to the whole policy,
    // or just the cursed item?" — just the cursed item.
    //   policy base   = 100 sword + 60 amulet          = 160
    //   curse         = 50% of the SWORD's own 100     =  50  -> 210 subtotal
    //   first insur.  = 10% of the UNMODIFIED 160      =  16
    //   total         = 160 + 50 + 16 = 226, + 5 fee   = 231
    //
    // Two wrong answers this rules out:
    //   - curse as 50% of the 160 policy total -> 80, premium 261
    //   - first insurance on the curse-inflated 210 -> 21, premium 236
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ---
  it("should round a premium of 197.5 G up to 198 G (in MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });

    // This test pins the ROUNDING RULE, not component pricing (the 7-rune
    // test above shares this scenario but pins the block behaviour).
    // The spec's worked example is exactly this number: "a premium
    // calculation that yields 197.5 G → final premium 198 G (rounded up)".
    // Premiums round UP because a higher premium favours MHPCO.
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("should round a payout of 350.5 G down to 350 G (in MHPCO's favor)", () => {
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });

    // Premium: 100 base + 30 enchantment surcharge + 10 first insurance = 140,
    // + 5 fee = 145.
    //
    // Payout: enchantment 8 halves the reimbursement — 50% of 901 = 450.5 —
    // then the deductible: 450.5 - 100 = 350.5. Payouts round DOWN in MHPCO's
    // favour (the OPPOSITE direction from premiums), giving the spec's worked
    // example: 350.5 -> 350.
    //
    // remainingCap must be reduced by the ROUNDED 350, not 350.5, or the
    // remainder would itself be fractional (1649.5). So rounding necessarily
    // precedes the cap decrement.
    //
    // NOTE: 350.5 is far below the 2000 cap, so clamping is inert here. This
    // test does NOT distinguish "round then clamp" from "clamp then round" —
    // do not read the implementation's order as pinned by this test.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  it("should keep intermediate amounts as fractions and round only the final amount", () => {
    // PREMIUM side. 7 runes for a 2-year customer:
    //   base            = 7 x 25                    = 175
    //   first insurance = 10% of 175                =  17.5  <- FRACTIONAL
    //   loyalty         = -20% of 175               = -35
    //   subtotal        = 175 + 17.5 - 35           = 157.5  <- FRACTIONAL
    //   + 5 fee = 162.5, rounded UP                 = 163
    // Rounding as you go would round 17.5 to 18 and yield 164 — the wrong
    // answer this half rules out.
    const premiumResult = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });

    expect(premiumResult).toEqual({ results: [{ premium: 163 }] });

    // PAYOUT side. Distinct from the payout-rounding test, which pins the
    // DIRECTION (down). This pins that the intermediate is never rounded:
    //   reimbursement = 50% of 901                  = 450.5  <- FRACTIONAL
    //   - 100 deductible                            = 350.5
    //   floored                                     = 350
    // Rounding the intermediate first would give 451 - 100 = 351, or
    // 450 - 100 = 350 by a different path; only an unrounded 450.5 yields
    // 350.5 before the final floor.
    const payoutResult = runScenario({
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });

    expect(payoutResult).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Integration examples ---
  it("should quote a newcomer's cursed sword (0 years, steel, enchantment 3) — premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });

    // The spec's FIRST named integration example, checked end-to-end:
    //   "100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee"
    //
    // This shares a scenario with the curse-surcharge test above, which pins
    // the curse RULE in isolation. They coincide because this example happens
    // to exercise just one item-specific modifier — it is kept because the
    // spec names it as an integration example and this is its own figure.
    //
    // It is also the value that settled the modifier model: an early reading
    // had first insurance applying to the curse-inflated 150 (giving 170).
    // The additive model — every modifier a percentage of the UNMODIFIED
    // base — yields 165, and the second integration example confirms it.
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote a long-standing customer's second contract (3 years, cursed sword, enchantment 7) — premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // A first contract, so the sword below is the customer's SECOND quote
        // and therefore earns the follow-up discount.
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // The spec's SECOND integration example — five modifiers at once, every
    // one a percentage of the UNMODIFIED 100 base:
    //   100 base
    //   + 50 curse             (50% of 100)
    //   + 30 high enchantment  (30% of 100; 7 >= 5)
    //   - 20 loyalty           (20% of 100; 3 years >= 2)
    //   + 10 first insurance   (10% of 100)
    //   - 15 follow-up         (15% of 100; this is the 2nd quote)
    //   = 155, + 5 fee = 160
    //
    // First insurance COEXISTS with the follow-up discount — the spec's
    // binding answer to its own question: each item in a quote counts as a
    // first insurance regardless of customer history.
    //
    // This is the direct evidence for the additive model. Were policy-wide
    // modifiers applied to a modifier-inflated base, loyalty would be 20% of
    // 180 = 36 and the total could not be 160.
    //
    // Step 0 (plain sword, 3 years, first contract): 100 - 20 loyalty
    // + 10 first insurance = 90, + 5 fee = 95.
    expect(result).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });

  // --- Insurance sums and caps ---
  it("should compute insurance sum 1600 G and cap 3200 G for a policy covering a sword and an amulet", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });

    // Isolates the INSURANCE SUM / CAP rule. (The multi-item deductible test
    // shares this policy shape but pins the per-damage deductible; here the
    // claim is deliberately minimal — one small damage — so remainingCap
    // reads as "cap minus one payout" and the cap value is unmistakable.)
    //
    //   insurance sum = 1000 sword + 600 amulet = 1600
    //   cap           = 2 x 1600                = 3200
    //   payout        = 300 - 100 deductible    =  200
    //   remainingCap  = 3200 - 200              = 3000  <- reveals the cap
    //
    // The sum uses INSURANCE VALUES (1000 / 600), which are distinct from the
    // BASE PREMIUMS (100 / 60) that price the policy — two separate tables,
    // easy to conflate.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 200, remainingCap: 3000 }],
    });
  });
  it("should compute insurance sum 2000 G and cap 4000 G for a policy covering two swords", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });

    // Isolates the INSURANCE SUM / CAP rule for multiple IDENTICAL items.
    // (The same-type deductible test shares this policy shape but pins
    // per-entry deductibles; the single small damage here keeps the cap
    // arithmetic unmistakable.)
    //
    //   insurance sum = 2 x 1000                = 2000
    //   cap           = 2 x 2000                = 4000
    //   payout        = 300 - 100 deductible    =  200
    //   remainingCap  = 4000 - 200              = 3800  <- reveals the cap
    //
    // Insurance values sum per ITEM INSTANCE: two swords contribute 1000
    // each, rather than being deduplicated by type.
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 200, remainingCap: 3800 }],
    });
  });
  it("should compute insurance sum 1750 G for a sword and 3 runes — the block discount affects the premium only", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 300 }],
          },
        },
      ],
    });

    // The one case where the premium side and the claim side DIVERGE — the
    // 3-rune block discounts the premium but not the sum insured:
    //
    //   premium base:  100 sword +   60 (3-rune BLOCK)   =  160
    //                  + 16 first insurance + 5 fee      =  181
    //   insurance sum: 1000 sword + 3 x 250 (NO block)   = 1750
    //   cap:           2 x 1750                          = 3500
    //   payout:        300 - 100 (runes have no clause)  =  200
    //   remainingCap:  3500 - 200                        = 3300
    //
    // This is the test that holds "block affects the premium only"
    // accountable: had insuranceSumOf applied block logic, the runes would
    // have been insured at 60 rather than 750 and the cap would be wrong.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 200, remainingCap: 3300 }],
    });
  });
  it("should base the cap on the unmodified insurance value — cursed sword (premium 165 G) still has cap 2000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });

    // Premium modifiers do not touch the sum insured:
    //
    //   premium:       100 base + 50 curse + 10 first insurance + 5 fee = 165
    //                  (modifiers APPLY)
    //   insurance sum: 1000, unmodified by the curse
    //                  (modifiers do NOT apply)
    //   cap:           2 x 1000                                    = 2000
    //   payout:        300 - 100 (steel, enchantment 3: no clause) =  200
    //   remainingCap:  2000 - 200                                  = 1800
    //
    // The surcharge-direction counterpart to the sword + 3-runes test, which
    // covered the discount direction. Together they show the premium and
    // insurance tables are independent both ways: a discount cannot lower the
    // sum insured, and a surcharge cannot raise the cap.
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 200, remainingCap: 1800 }],
    });
  });

  // --- Standard reimbursement ---
  it("should reimburse a regular sword (steel, enchantment 3) damaged 500 G — payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
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

    // Steel, enchantment 3: no special clause (dragon material would reimburse
    // in full; enchantment >= 8 would halve). So full reimbursement of 500
    // minus the 100 G per-damage deductible = 400.
    // Insurance sum is 1000 (one sword), cap is 2x = 2000, leaving 1600.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should reimburse a damaged rune (damage 200 G) — payout 100 G (no enchantment or material, no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });

    // The ONLY claim test whose damaged item has neither enchantment nor
    // material — every other one uses a fully-populated sword or amulet. So
    // this is what actually exercises the `?? 0` fallback in
    // qualifiesForHalfReimbursement: with enchantment undefined it reads as
    // 0, the clause correctly does not apply, and no NaN leaks through.
    //
    //   premium:       25 base + 2.5 first insurance + 5 fee = 32.5 -> 33
    //   insurance sum: 250 (the COMPONENT INSURANCE VALUE, ten times the
    //                  component base premium of 25 — the cap is what makes
    //                  the two observably different)
    //   cap:           2 x 250                               = 500
    //   payout:        200 - 100 deductible                  = 100
    //   remainingCap:  500 - 100                             = 400
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Special clauses ---
  it("should reimburse damage to an item with enchantment >= 8 at 50% — dragon sword, enchantment 8, damage 1000 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    // Premium: 100 base + 30 high enchantment (8 >= 5) + 10 first insurance
    // = 140, + 5 fee = 145.
    //
    // Payout: enchantment 8 is the INCLUSIVE threshold for the 50% clause.
    // This item is also dragon material, which alone would reimburse in full —
    // the spec's example pins the combined case: the 50% rule wins, then the
    // deductible. 50% of 1000 = 500, - 100 = 400.
    // Insurance sum 1000, cap 2000, so 1600 remains.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should fully reimburse dragon-material damage — dragon sword, enchantment 5, damage 800 G → payout 700 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });

    // Premium: 100 base + 30 enchantment surcharge (5 >= 5, PREMIUM side)
    // + 10 first insurance = 140, + 5 fee = 145. Same as the enchantment-8
    // case, since both clear the premium threshold of 5.
    //
    // Payout: enchantment 5 is below the claim-side half-reimbursement
    // threshold of 8, so only the dragon-material clause applies: full
    // reimbursement, then the deductible. 800 - 100 = 700.
    //
    // Note full reimbursement is also the no-clause default, so this test
    // cannot distinguish the dragon clause from no clause at all — see the
    // analysis recorded with the steel/enchantment-9 test.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("should let the 50% rule win when both clauses apply — dragon sword, enchantment 9, damage 1000 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    // Premium: 100 base + 30 enchantment surcharge + 10 first insurance = 140,
    // + 5 fee = 145 — same as the enchantment-5 and -8 cases, all above 5.
    //
    // Payout: both clauses apply (enchantment 9 >= 8, and dragon material).
    // The spec says the 50% rule WINS: 50% of 1000 = 500, - 100 = 400.
    //
    // This is the PRECEDENCE guard. A dragon-first implementation would return
    // full reimbursement here and yield 900, so this test is what makes that
    // mistake fail loudly if a dragon branch is ever added.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should apply only the high-enchantment clause to a steel sword, enchantment 9, damage 1000 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    // Premium: 100 base + 30 enchantment surcharge + 10 first insurance = 140,
    // + 5 fee = 145.
    //
    // Payout: steel, so only the half-reimbursement clause applies (9 >= 8):
    // 50% of 1000 = 500, - 100 deductible = 400.
    //
    // This test differs from the dragon/enchantment-9 test ONLY in material,
    // and yields an identical result. That is the direct demonstration that
    // the dragon-material clause is unobservable: it grants full
    // reimbursement, which is already the no-clause default, so no example in
    // the spec can distinguish it. Hence no dragon branch in the code.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Deductible per damage event ---
  it("should apply the 100 G deductible once per damaged item — sword 500 G + amulet 300 G → payout 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });

    // Premium: 160 base (100 + 60) + 16 first insurance = 176, + 5 fee = 181.
    //
    // Payout: the deductible applies PER DAMAGED ITEM, not once per claim.
    //   sword:  500 - 100 = 400
    //   amulet: 300 - 100 = 200  -> 600 total
    // One deductible on the combined 800 would give 700 — that is the wrong
    // answer this test rules out.
    //
    // Insurance sum 1000 + 600 = 1600, cap 3200, leaving 2600.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("should treat two damage entries of the same type as separate damages with their own deductible", () => {
    const sword = {
      type: "sword",
      material: "steel",
      enchantment: 3,
      cursed: false,
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
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
    });

    // Premium: 200 base (2 x 100) + 20 first insurance = 220, + 5 fee = 225.
    //
    // Payout: damage ENTRIES are counted individually, not collapsed per type.
    //   500 - 100 = 400
    //   300 - 100 = 200  -> 600 total
    // Grouping by type and taking one deductible would give 700 — the wrong
    // answer this test rules out.
    //
    // Insurance sum 2 x 1000 = 2000, cap 4000, leaving 3400.
    //
    // KNOWN SEAM: payoutForDamage resolves the item with items.find(), which
    // returns the FIRST sword for both entries — the second insured sword is
    // never consulted. Harmless here because the swords are identical, but it
    // cannot detect more damage entries of a type than the policy covers.
    // That error case needs counting, not finding.
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });

  // --- Cap exhaustion ---
  it("should report the remaining cap after a claim — sword (cap 2000 G), claim 1500 G → payout 1400 G, remainingCap 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });

    // Premium: 100 base + 10 first insurance = 110, + 5 fee = 115.
    //
    // Payout: no clause applies, so 1500 - 100 deductible = 1400. The cap is
    // 2 x 1000 = 2000 and 1400 is under it, so nothing is capped here.
    // remainingCap: 2000 - 1400 = 600.
    //
    // This is the UNCAPPED baseline of a two-test pair. The companion test
    // (a second 1500 claim against the same policy) is what forces the payout
    // to actually be limited to what remains.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("should reduce a payout to the remaining cap — second claim of 1500 G → payout 600 G, remainingCap 0 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "second dragon attack",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });

    // Cap is 2 x 1000 = 2000, shared across every claim on the policy.
    //   1st claim: 1500 - 100 = 1400, under the cap -> 600 remains.
    //   2nd claim: the desired 1400 exceeds the 600 left, so the PAYOUT
    //              itself is reduced to 600 and the cap floors at 0.
    // The cap limits the money paid out, not merely the reported remainder,
    // and remainingCap must never go negative.
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Error cases ---
  it("should reject a quote containing an item with an unknown type (e.g. broomstick)", () => {
    // The spec describes CLI behaviour (non-zero exit, error on stderr, no
    // results on stdout), but runScenario is a library function with no
    // access to the process. The split: runScenario THROWS a descriptive
    // Error, and src/cli.ts translates that into stderr + an exit code.
    // The CLI tests verify that translation end-to-end.
    //
    // The matcher is deliberately loose — it pins that the message names the
    // offending type, without freezing the exact wording.
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("should reject a claim whose damage references an item not part of the policy (amulet damaged, only a sword insured)", () => {
    // "amulet" is a perfectly KNOWN item type — it is simply not covered by
    // this policy. That distinguishes this from the unknown-type cases: the
    // rejection is about POLICY COVERAGE, not type validity.
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
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
    ).toThrow(/amulet/);
  });
  it("should reject a claim whose damage references an item with an unknown type", () => {
    // Caught by the COVERAGE rule, not by a separate unknown-type check: an
    // unknown type is necessarily also uncovered, so on the claim side the
    // two spec cases collapse into one.
    //
    // The QUOTE side is genuinely different. A quote has no policy to compare
    // against, so "is this type underwritable at all" is the only question
    // available there — which is why assertQuotableItems exists and why the
    // implementation needs two validators rather than three.
    //
    // The message will read "item not covered by policy: broomstick" rather
    // than "unknown item type: broomstick". The loose matcher accepts either,
    // which is exactly why these matchers were kept loose.
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 300 }],
            },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("should reject a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured)", () => {
    // The rule is NOT "reject repeated types": the active two-sword test
    // damages "sword" twice against a TWO-sword policy and must stay valid.
    // It is "reject when the COUNT of damage entries of a type EXCEEDS the
    // count of insured items of that type" — which existence-checking
    // (assertDamagesCovered's `some`) structurally cannot express.
    //
    // Note a counting rule SUBSUMES the coverage rule: an uncovered type is
    // just the count-zero case. So the fix is likely to replace the existing
    // validator rather than add a second one, keeping the amulet and
    // broomstick tests passing through the same code path.
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
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
      }),
    ).toThrow(/sword/);
  });
  it("should reject a claim containing a damage entry with a negative amount (-200)", () => {
    // Left unchecked, a negative damage is doubly perverse:
    //   (a) the payout goes negative (-200 - 100 deductible = -300), i.e.
    //       MHPCO bills the claimant for being damaged; and
    //   (b) `remainingCap -= -300` RESTORES cover rather than consuming it,
    //       so a claimant could inflate their remaining cap at will by
    //       "claiming" negative damage.
    // That second one is the real harm the rule prevents.
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
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
    ).toThrow(/-200|negative/);
  });

  // --- Scenario / CLI end-to-end ---
  it("should return one result per step, in the order of the input steps", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 2,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    // The results array is POSITIONAL: index i is the outcome of step i.
    // Quotes and claims each produce exactly one result despite having
    // different SHAPES ({premium} vs {payout, remainingCap}).
    //
    // Step 3 claims against policy 2 — the SECOND quote — which pins that
    // policies are keyed by STEP index, not by quote ordinal.
    //
    //   [0] sword, 1st contract:  100 + 10 + 5                = 115
    //   [1] claim:                500 - 100 = 400; 2000 - 400 = 1600 left
    //   [2] amulet, 2nd contract:  60 +  6 - 9 follow-up + 5  =  62
    //   [3] claim:                300 - 100 = 200; 1200 - 200 = 1000 left
    //   [4] potion, 3rd contract:  40 +  4 - 6 follow-up + 5  =  43
    expect(result.results).toHaveLength(5);
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
        { premium: 62 },
        { payout: 200, remainingCap: 1000 },
        { premium: 43 },
      ],
    });
  });
  it("should let a claim step reference the policy created by an earlier quote step via its zero-based index", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "claim",
          policy: 1,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });

    // Step 2 claims against policy 0 while a LATER policy (step 1) exists,
    // ruling out "most recent policy" semantics. The failure mode is sharp
    // rather than subtle: under that reading the sword damage would land on
    // the amulet-only policy and assertDamagesWithinCover would THROW, so
    // this test discriminates by settling at all.
    //
    // It does NOT separate step-index keying from quote-ordinal keying —
    // here the two coincide. The ordering test covers that, claiming against
    // policy 2 where the quote ordinal is 1. Division of labour, not overlap.
    //
    //   [0] sword, 1st contract:  100 + 10 + 5             = 115
    //   [1] amulet, 2nd contract:  60 +  6 - 9 + 5         =  62
    //   [2] sword claim:          500 - 100 = 400; 2000 -> 1600 left
    //   [3] amulet claim:         300 - 100 = 200; 1200 -> 1000 left
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { premium: 62 },
        { payout: 400, remainingCap: 1600 },
        { payout: 200, remainingCap: 1000 },
      ],
    });
  });
  it("should process the schema example scenario (5 years, amulet quote then a 200 G fire claim)", () => {
    const result = runScenario({
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
    });

    // The spec's OWN schema example — the canonical input/output pair a
    // reader checks first. The spec fixes the input exactly but leaves the
    // outputs as <integer> placeholders, so these values are DERIVED from
    // the rules rather than quoted:
    //
    //   [0] amulet, 5 years (>= 2, loyalty applies), first contract:
    //       60 base + 6 first insurance - 12 loyalty = 54, + 5 fee = 59
    //   [1] silver, enchantment 2 -> no clause: 200 - 100 = 100.
    //       insurance sum 600, cap 1200, leaving 1100
    //
    // toEqual on the whole object is what makes this a SCHEMA check and not
    // merely an arithmetic one: it fails on any extra or missing key, so it
    // pins the normative field names — `premium` for quotes, `payout` and
    // `remainingCap` for claims.
    expect(result).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI should read a scenario from stdin and write {results: [...]} to stdout", () => {
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

    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    // Asserting on PARSED stdout, not the raw string, so the test pins the
    // data rather than whitespace or key order.
    //
    // This spawns a real process, so it is inherently slower than the rest of
    // the suite (tsx startup dominates) — hence the raised timeout below.
    // The scenario is the spec's own schema example, whose values are already
    // pinned by the library-level test above; what is new here is the
    // stdin -> stdout transport.
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);
  it("CLI should exit with a non-zero status and write an error to stderr for an invalid scenario, writing no results to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    // spawnSync rather than execFileSync: this run is EXPECTED to fail, and
    // spawnSync returns status/stdout/stderr instead of throwing, so all
    // three can be inspected directly.
    const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    // (a) and (c) come FREE from an uncaught throw — Node exits non-zero and
    // the stdout write never runs. (b) is nearly free too, since a stack
    // trace happens to contain the message.
    expect(run.status).not.toBe(0);
    expect(run.stdout).toBe("");
    expect(run.stderr).toMatch(/broomstick/);

    // This one is NOT free, and is spec-driven rather than stylistic: the
    // spec says the CLI "writes an error description to stderr". A multi-line
    // Node stack trace is a crash report, not a description. Pinning a short
    // single-line-ish stderr forces the CLI to translate the throw
    // deliberately instead of leaking its internals.
    expect(run.stderr).not.toMatch(/^\s+at /m);
    expect(run.stderr.trim().split("\n")).toHaveLength(1);

    // Spawns a real process (~600ms), hence the raised timeout.
  }, 30000);
});
