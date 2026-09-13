import { execFileSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest case ---
  it("should charge only the processing fee for an empty item list — premium 5 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(output).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Item base premiums (each + 5 G fee + 10 G first insurance) ---
  // Base premium 100 G; end-to-end for a 0-year customer this is
  // 100 base + 10 first-insurance surcharge + 5 processing fee = 115 G.
  it("should quote a plain sword — base premium 100 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  // Base premium 60 G; end-to-end for a 0-year customer this is
  // 60 base + 6 first-insurance surcharge + 5 processing fee = 71 G.
  it("should quote a plain amulet — base premium 60 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  // Base premium 80 G; end-to-end for a 0-year customer this is
  // 80 base + 8 first-insurance surcharge + 5 processing fee = 93 G.
  it("should quote a plain staff — base premium 80 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }] },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  // Base premium 40 G; end-to-end for a 0-year customer this is
  // 40 base + 4 first-insurance surcharge + 5 processing fee = 49 G.
  it("should quote a plain potion — base premium 40 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 49 }] });
  });
  // Components are insured at 250 G with a 25 G base premium each.
  // End-to-end for a 0-year customer: 25 base + 2.5 first-insurance
  // surcharge + 5 fee = 32.5, rounded UP in the MHPCO's favour = 33 G.
  it("should quote a single rune component — base premium 25 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(output).toEqual({ results: [{ premium: 33 }] });
  });
  // Moonstone is the second component type, also 25 G base premium.
  // End-to-end: 25 + 2.5 + 5 = 32.5, rounded UP = 33 G (as for a rune).
  it("should quote a single moonstone component — base premium 25 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(output).toEqual({ results: [{ premium: 33 }] });
  });

  // --- Building block of 3 alike components ---
  // 2 × 25 = 50 G base; a block needs EXACTLY 3 alike components, so no
  // discount applies. End-to-end: 50 + 5 + 5 = 60 G.
  it("should quote 2 runes — base premium 50 G (no block)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(output).toEqual({ results: [{ premium: 60 }] });
  });
  // A building block of EXACTLY 3 alike components costs 60 G base
  // instead of 3 × 25 = 75 G. End-to-end: 60 + 6 + 5 = 71 G.
  it("should quote 3 runes — base premium 60 G (block applies)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  // 4 × 25 = 100 G base — NOT block+1 (which would be 60 + 25 = 85).
  // A block requires exactly 3. End-to-end: 100 + 10 + 5 = 115 G.
  it("should quote 4 runes — base premium 100 G (no block — block requires exactly 3)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  // Spec: 7 runes → 175 G base = 60 (one block of 3) + 4 × 25 (singles).
  // NOTE: 7 × 25 also equals 175, so this example does NOT discriminate
  // between "one block plus singles" and "no block at all" — weak cover.
  // It does rule out greedy blocking: floor(7/3)=2 blocks → 2×60 + 25 = 145.
  // End-to-end: 175 + 17.5 + 5 = 197.5, rounded UP = 198 G.
  it("should quote 7 runes — base premium 175 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 198 }] });
  });

  // --- "Alike" components: same type, not same family ---
  // Resolves the spec's ❓ on "alike": same TYPE, not same family.
  // 3 components total, but {rune: 2, moonstone: 1} — no group of 3, so
  // no block: 2×25 + 1×25 = 75 G base. End-to-end: 75 + 7.5 + 5 = 87.5 → 88 G.
  // A "same family" reading would block all 3 → 60 G base (71 G), so this
  // test actively rules that interpretation out.
  it("should quote 2 runes + 1 moonstone — base premium 75 G (no block: different types)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 88 }] });
  });
  // Two separate blocks, one per type: 60 + 60 = 120 G base.
  // No flat per-item sum reaches this (6 × 25 = 150), so both the per-type
  // grouping and the per-group block price are load-bearing here.
  // End-to-end: 120 + 12 + 5 = 137 G.
  it("should quote 3 runes + 3 moonstones — base premium 120 G (two separate blocks)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Premium modifiers in isolation ---
  // A cursed item adds 50 % of THAT ITEM's base premium: 100 → +50.
  // The first-insurance surcharge is 10 % of the POLICY BASE (100), not of
  // the curse-inflated 150 — pinned by the spec's integration example:
  // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165 G.
  it("should add 50 % curse surcharge — cursed sword base premium 100 G → 150 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  // Enchantment >= 5 adds 30 % of THAT ITEM's base premium: 100 → +30.
  // Threshold is INCLUSIVE at 5 ("exactly enchantment 5 → applies"), so 5 is
  // used here to pin the boundary. Not cursed, to isolate this rule.
  // End-to-end: 100 base + 30 high-ench + 10 first insurance + 5 fee = 145 G.
  it("should add 30 % high-enchantment surcharge for enchantment 5 — sword 100 G → 130 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 145 }] });
  });
  // Negative boundary partner to the enchantment-5 test: 4 is below the
  // threshold, so no surcharge — 100 + 10 + 5 = 115 G, same as a plain sword.
  // The PAIR pins the threshold at exactly 5 inclusive: `> 5` would break the
  // enchantment-5 test, `>= 4` would break this one.
  it("should not add high-enchantment surcharge for enchantment 4 — sword stays 100 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  // Both surcharges on one item are ADDITIVE, not compounding:
  //   additive:    100 × (0.5 + 0.3) = 80 → subtotal 180 → +10 +5 = 195 G
  //   compounding: 100 × 1.5 × 1.3  = 195 → subtotal 195 → +10 +5 = 210 G
  // This test is what holds that choice down; previously only a doc comment did.
  it("should apply both surcharges to a cursed sword with enchantment 5 — 100 G → 180 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 195 }] });
  });
  // First POLICY-WIDE modifier, and the first test to read `customer`.
  // Loyalty (>= 2 years, INCLUSIVE) takes 20 % of the POLICY BASE premium —
  // not of a running total. 2 exactly, to pin the boundary; plain sword so no
  // item surcharge interferes. End-to-end: 100 − 20 + 10 + 5 = 95 G.
  it("should apply 20 % loyalty discount for exactly 2 years with MHPCO", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 95 }] });
  });
  // Negative boundary partner to the 2-year test: 1 year is below the
  // threshold, so no discount — 100 + 10 + 5 = 115 G.
  // The PAIR pins the threshold at exactly 2 inclusive: `> 2` would break the
  // 2-year test, `>= 1` would break this one. It also covers the
  // 0 < years < threshold band, which every other test (all at 0) misses.
  it("should not apply loyalty discount for 1 year with MHPCO", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  // WEAK COVER, recorded honestly: this surcharge has existed since the
  // second cycle and every other test already exercises it, so this test
  // cannot fail and cannot isolate the rule. Two swords are used rather than
  // one item so it is not a verbatim duplicate of an existing test — but
  // because 10 % is linear, a per-item reading yields the same 225 G, so it
  // does NOT discriminate policy-base from per-item-base either.
  // The surcharge is unconditional (every item in a quote counts as a first
  // insurance, regardless of customer history), so there is no negative
  // partner to bracket it with. 200 base + 20 + 5 fee = 225 G.
  it("should add 10 % initial assessment surcharge for a first insurance", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 225 }] });
  });
  // STRUCTURAL TURNING POINT: the first test needing TWO steps in one
  // scenario, so it forces out the long-standing `steps[0]` assumption.
  // The follow-up discount depends on the step's POSITION, not on the
  // customer record. Results must be one per step, in step order.
  //   step 0 (first contract):  100 + 10 + 5      = 115 G
  //   step 1 (second contract): 100 + 10 − 15 + 5 = 100 G
  // Note the first-insurance surcharge still applies on the follow-up.
  it("should apply 15 % discount on each contract after the first", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Modifier scope on multi-item policies ---
  // THE decisive modifier-scope test. Policy base = 100 + 60 = 160; the curse
  // adds 50 % of the SWORD's own 100 G = 50 (→ 210 before further modifiers),
  // NOT 50 % of the 160 G policy total. Then first insurance is 10 % of the
  // POLICY base (160) = 16, plus the 5 G fee → 231 G.
  // This DISCRIMINATES: a policy-wide curse reading gives 50 % of 160 = 80,
  // i.e. 261 G. Every earlier curse test used one item, where both readings
  // coincide — so this is the first test that can tell them apart.
  // Enchantments 3 and 2 are below the threshold of 5, isolating the curse.
  it("should apply curse surcharge to the cursed item only — cursed sword + plain amulet → 210 G before fee", () => {
    const output = runScenario({
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

    expect(output).toEqual({ results: [{ premium: 231 }] });
  });
  // Policy-wide half of the modifier-scope rule: loyalty and first insurance
  // are percentages of the SUMMED policy base (160), fee added last.
  //   160 base + 16 first insurance − 32 loyalty + 5 fee = 149 G
  //
  // HONEST LIMITS — this test discriminates neither aspect it describes:
  //  · loyalty on the summed base == a per-item reading, since percentages are
  //    linear (20 % of 100 + 20 % of 60 = 32 either way);
  //  · the fee ordering also coincides — folding the fee into the base gives
  //    165 → +16.5 − 33 = 148.5, which ceil()s to the same 149.
  // The two integration examples are what genuinely pin the stack and ordering.
  it("should apply policy-wide modifiers to the policy base premium and add the fee last", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
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

    expect(output).toEqual({ results: [{ premium: 149 }] });
  });

  // --- Rounding in the MHPCO's favor ---
  // The spec's own rounding example: 197.5 → 198 (up, in the MHPCO's favour).
  // The 7-rune case reproduces the spec's exact figure, so it is asserted here
  // even though it duplicates the 7-runes pricing test's arithmetic — the
  // description names 197.5, and the test should check what it says.
  // The 5-rune case is added as genuinely new cover: no other test exercises
  // 5 components (existing ones cover 1, 2, 3, 4, 7), and it lands on a
  // fraction too, since 25 × odd × 0.1 always ends in .5.
  it("should round a premium of 197.5 G up to 198 G", () => {
    const runes = (count: number) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: Array.from({ length: count }, () => ({ type: "rune" })),
        },
      ],
    });

    // 175 + 17.5 + 5 = 197.5 → 198
    expect(runScenario(runes(7))).toEqual({ results: [{ premium: 198 }] });
    // 125 + 12.5 + 5 = 142.5 → 143
    expect(runScenario(runes(5))).toEqual({ results: [{ premium: 143 }] });
  });
  // Payouts round DOWN — the asymmetric twin of premium rounding, both in the
  // MHPCO's favour (premiums ceil, payouts floor).
  // A fractional payout needs the 50 % clause on an ODD damage amount:
  //   901 × 0.5 = 450.5, − 100 deductible = 350.5 → floor → 350
  //   premium: 100 + 30 high-ench (9 >= 5) + 10 first insurance + 5 fee = 145
  //   cap 2000 → remainingCap = 2000 − 350 = 1650 (decremented by the ROUNDED
  //   payout, so no fraction is carried forward)
  it("should round a payout of 350.5 G down to 350 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Integration examples ---
  // Spec integration example #1: 100 base + 50 curse + 10 first insurance
  // = 160, + 5 fee = 165 G. Note the first-insurance surcharge is 10 % of the
  // POLICY BASE (100) = 10 — not 10 % of the curse-inflated 160, which would
  // give 16 and a 171 G total.
  // DUPLICATION, stated plainly: same scenario and expected value as the
  // curse-surcharge test above, so this adds no new arithmetic cover. Its value
  // is being labelled as the spec's documented end-to-end figure. Enchantment 3
  // is below the threshold, and with one item the item-vs-policy scope
  // distinction cannot discriminate — integration example #2 is the demanding one.
  it("should quote a newcomer's cursed sword (0 years, enchantment 3) — premium 165 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 165 }] });
  });
  // Spec integration example #2 — the most demanding test in the suite: all
  // five modifiers active in one calculation, every percentage on the 100 base.
  //   100 base +50 curse +30 high-ench −20 loyalty +10 first ins. −15 follow-up
  //   = 155, + 5 fee = 160 G
  // Needs TWO steps: the follow-up discount is positional (index > 0), not
  // derived from customer history, so step 1 is the "second contract".
  //   step 0: plain sword → 100 − 20 + 10 + 5 = 95 G (no follow-up at index 0)
  //
  // HIGHEST-VALUE COVER: the only test where +10 first insurance and −15
  // follow-up coexist. Treating them as mutually exclusive — the natural
  // misreading — yields 145 or 175, not 160. Also the only test combining both
  // item surcharges with the full policy-wide set.
  it("should quote a long-standing customer's second contract (3 years, cursed sword enchantment 7) — premium 160 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(output).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // --- Insurance sum and cap ---
  // OBSERVABILITY NOTE: a quote result carries only `premium` — insurance sum
  // and cap are never reported directly. The cap is observable ONLY through a
  // claim's `remainingCap`, so this test asserts a claim: remainingCap 3600
  // pins the cap at 4000, hence the insurance sum at 2000 (= 2 × 1000).
  // Insurance VALUE (1000/sword) is a different number from base PREMIUM (100).
  //   step 0 quote: 200 base + 20 first insurance + 5 fee = 225 G
  //   step 1 claim: 500 damage − 100 deductible = 400 payout; 4000 − 400 = 3600
  it("should compute insurance sum 2000 G and cap 4000 G for a policy covering two swords", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 225 }, { payout: 400, remainingCap: 3600 }],
    });
  });
  // REDUNDANT HEADLINE, stated plainly: the deductible test below already uses
  // a sword+amulet policy and asserts remainingCap 2600, which pins cap = 3200
  // (2600 + 600). This test's stated purpose adds no new cover.
  //
  // What it DOES add: a claim naming only ONE of two insured types. Every other
  // multi-item claim damages every insured type, so this is the only
  // confirmation that an UNDAMAGED insured item still counts toward the cap
  // (3200, not 2000) while contributing no payout.
  //   premium: 160 base + 16 + 5 = 181
  //   payout:  400 − 100 = 300; cap 3200 → remaining 2900
  it("should compute insurance sum 1600 G and cap 3200 G for a policy covering a sword and an amulet", () => {
    const output = runScenario({
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
          incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 400 }] },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 181 }, { payout: 300, remainingCap: 2900 }],
    });
  });
  // GENUINELY DISCRIMINATING: pins the separation of the two tables. The curse
  // raises the PREMIUM to 165 but leaves the INSURANCE VALUE at 1000, so the
  // cap stays 2000. Two wrong implementations fail here:
  //   · curse-inflated insurance value (1000 × 1.5 → cap 3000) → remaining 2600
  //   · cap derived from the premium (2 × 165 = 330) → payout clamped to 330
  //   premium: 100 + 50 curse + 10 first insurance + 5 fee = 165
  //   payout:  500 − 100 = 400; cap 2000 → remaining 1600
  // The payout duplicates the regular-sword test; the differing PREMIUM leaving
  // the cap identical is the whole point.
  it("should compute cap 2000 G for a cursed sword — premium modifiers do not raise the cap (premium 165 G)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  // COMPLEMENT of the cursed-sword cap test: that proved a premium SURCHARGE
  // does not raise the cap; this proves a premium DISCOUNT does not lower it.
  //   premium: base 100 (sword) + 60 (block of exactly 3 runes) = 160,
  //            +16 first insurance, +5 fee = 181
  //            (coincidentally equal to the sword+amulet premium above — same
  //             160 base by a different route, not a copy-paste slip)
  //   cap:     insurance values summed with NO block logic:
  //            1000 + 3×250 = 1750 → cap 3500; payout 400 → remaining 3100
  //
  // DISCRIMINATING, and the wrong implementation is plausible: INSURANCE_VALUES
  // is exactly 10× BASE_PREMIUMS for every type, so deriving one table from the
  // other (reusing groupBasePremium) would value the blocked rune group at
  // 60×10 = 600 instead of 750 → sum 1600, cap 3200, remaining 2800.
  it("should compute insurance sum 1750 G for a sword and 3 runes — block discount affects the premium only", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 181 }, { payout: 400, remainingCap: 3100 }],
    });
  });

  // --- Claim processing: standard reimbursement ---
  // Baseline: NO special clause applies (enchantment 3 < 8, material is steel
  // not dragon), so reimbursement is full damage minus the 100 G deductible.
  //   step 0 quote: 100 + 10 + 5 = 115 G
  //   step 1 claim: 500 − 100 = 400 payout; one sword insures for 1000, so
  //                 cap = 2000 and remainingCap = 1600
  // Distinct from the two-sword claim test above (cap 4000, remaining 3600):
  // this independently pins the SINGLE-item insurance sum. It does not yet
  // discriminate the special clauses — neither applies here. That is the point:
  // it is the baseline the two pending clause tests contrast against.
  it("should pay out 400 G for a regular sword (steel, enchantment 3) with damage 500 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  // A rune has NO enchantment and NO material — deliberately written as a bare
  // { type: "rune" } — so no special clause can apply.
  //   step 0 quote: 25 + 2.5 + 5 = 32.5 → 33 G
  //   step 1 claim: 200 − 100 = 100 payout; rune insures for 250, cap 500,
  //                 so remainingCap = 400
  // PROSPECTIVE VALUE: this is the only claim test on an item with absent
  // optional fields, so it guards the `undefined` path for the two pending
  // clause tests. `item.enchantment >= 8` on undefined is harmlessly false, but
  // e.g. `item.material.startsWith(...)` would throw — this catches that.
  // It also pins the component insurance value at 250; other claim tests use
  // swords (1000).
  it("should pay out 100 G for a damaged rune (damage 200 G) — no special clause applies", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claim processing: special clauses ---
  // This one example pins TWO rules at once:
  //  1. ORDER — halve then deduct: 1000/2 = 500, −100 = 400.
  //     Deducting first would give (1000−100)/2 = 450, so the order is
  //     genuinely discriminated by this expected value.
  //  2. PRECEDENCE — the sword is dragon material AND enchantment 8. Dragon
  //     material alone means full reimbursement (900 here), but the spec says
  //     the 50 % rule wins when both apply. So 400, not 900.
  // Quote side: premium is 145, NOT 115 — enchantment 8 clears the
  // high-enchantment threshold of 5, so the 30 % surcharge applies:
  //   100 base + 30 high-ench + 10 first insurance + 5 fee = 145 G
  // Cap: sword insures for 1000 → 2000; remainingCap = 2000 − 400 = 1600.
  it("should pay out 400 G for a dragon-material sword with exactly enchantment 8 and damage 1000 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
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

    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  // Both clauses apply and the 50 % rule wins: 1000 × 0.5 − 100 = 400.
  //
  // FINDING — dragon material is UNOBSERVABLE under this spec, so there is
  // deliberately no dragon-material code. Dragon means FULL reimbursement,
  // i.e. rate 1, which is identical to the default when no clause applies:
  //   · ench 8, dmg 1000 → 400  (50 % wins; dragon irrelevant)
  //   · ench 9, dmg 1000 → 400  (this test; same)
  //   · ench 5, dmg 800  → 700  (below threshold → rate 1 → 800 − 100;
  //                              same with or without dragon logic)
  // Dragon material could only become observable if another clause REDUCED the
  // payout, and the only such clause (ench >= 8) explicitly beats it. So no
  // test can force dragon logic, and none was written. Do not "fix" this.
  it("should pay out 400 G for a dragon-material sword with enchantment 9 and damage 1000 G (50 % rule wins)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
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

    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  // Completes the dragon proof: all three dragon examples pass with NO dragon
  // code, so this adds no discriminating cover for that clause either.
  //
  // Its real value is the TWO-THRESHOLD CONTRAST inside one test. Enchantment 5
  // sits exactly ON the quote-side surcharge threshold (5) but BELOW the
  // claim-side reimbursement threshold (8):
  //   premium 145 → the 30 % surcharge DOES apply
  //   payout  700 → the 50 % halving does NOT apply (800 − 100, unreduced)
  // An implementation that confused the two constants would halve to 300 here.
  it("should pay out 700 G for a dragon-material sword with enchantment 5 and damage 800 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
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

    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  // MIRROR of the ench-8 dragon test: same expected values (145/400/1600), but
  // STEEL instead of dragon. Together they establish that the 50 % clause keys
  // off enchantment ALONE and is independent of material.
  // This one DOES discriminate, unlike the three dragon examples: an
  // implementation that gated halving on material (only halving dragon items)
  // passes every dragon test and fails here, paying 900.
  //   payout: 1000 × 0.5 = 500, − 100 = 400; cap 2000 → remaining 1600
  it("should pay out 400 G for a steel sword with enchantment 9 and damage 1000 G", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Deductible per damage event ---
  // FIRST test with more than one damage entry, so the only one that can tell
  // per-ENTRY deductibles from per-INCIDENT: (500−100) + (300−100) = 600,
  // whereas one deductible per incident would give 800 − 100 = 700.
  // Earlier claim tests had a single entry, where both readings coincide.
  // Also pins the mixed-type insurance sum: 1000 + 600 = 1600 → cap 3200.
  //   premium: base 100 + 60 = 160 (different types, no block), +16, +5 = 181
  it("should apply the 100 G deductible once per damaged item — sword 500 G + amulet 300 G → payout 600 G", () => {
    const output = runScenario({
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

    expect(output).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  // Two entries of the SAME type, each taking its own deductible:
  //   (500 − 100) + (400 − 100) = 700; sum 2000 → cap 4000 → remaining 3300
  //   premium: 200 base + 20 first insurance + 5 fee = 225
  //
  // KNOWN LIMITATION, not fixed here: `insuredItems.find(...)` returns the
  // FIRST matching sword for both entries. Harmless in this test only because
  // both swords are identical, so the reimbursement rate is the same either
  // way. Two swords at enchantment 3 and 9 would wrongly get the first's rate
  // for both entries — no spec example covers that, so it stays unimplemented.
  //
  // This is also the LEGITIMATE two-entries/two-swords case that the pending
  // "more entries than insured" rejection test must NOT reject; the pair
  // together define the multiplicity rule.
  it("should treat two sword damage entries as separate damages, each with its own deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const output = runScenario({
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
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 225 }, { payout: 700, remainingCap: 3300 }],
    });
  });

  // --- Cap exhaustion across successive claims ---
  // First half of the spec's cap-exhaustion sequence.
  //   premium: 100 + 10 + 5 = 115
  //   payout:  1500 − 100 = 1400, which is UNDER the 2000 cap → paid in full
  //   remainingCap: 2000 − 1400 = 600
  //
  // HONEST LIMIT: this does NOT exercise cap limiting — 1400 is comfortably
  // below 2000, so the Math.min is a no-op. It pins the 2000 cap for a single
  // sword and the 600 remaining afterwards. Genuine exhaustion is tested by the
  // second claim below, where the desired 1400 must be cut to the remaining 600.
  it("should pay out 1400 G and leave cap remaining 600 G for a first claim of 1500 G on a sword policy", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    expect(output).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  // THE most important claim-side test. `runScenario` is pure and holds no
  // state between calls, so the first claim is re-established here as step 1;
  // all three results are asserted.
  //   step 1: min(1400, 2000) = 1400 → cap 600
  //   step 2: desires 1400 but only 600 remains → min(1400, 600) = 600 → cap 0
  //
  // Unique cover, on two counts:
  //  · the ONLY test where Math.min actually BINDS (elsewhere it is a no-op);
  //  · the ONLY test with two claims on the SAME policy, so the only one that
  //    verifies the cap decrement PERSISTS — if claimResult failed to write the
  //    decremented cap back, step 2 would pay 1400 and this would fail.
  // Also pins exact exhaustion at 0: without the clamp it would be −800.
  it("should pay out 600 G and leave cap remaining 0 G for a second claim of 1500 G on the same policy", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claim,
        claim,
      ],
    });

    expect(output).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Error cases (CLI exits non-zero) ---
  // DESIGN SPLIT: the spec frames rejection as CLI behaviour (non-zero exit,
  // stderr), but runScenario is a pure function with no process access. So the
  // library THROWS a descriptive Error and src/cli.ts (own tests) catches it,
  // writes stderr and sets the exit code. This asserts the library half.
  //
  // Matching on /broomstick/ rather than a fixed phrase: the spec wants an
  // error description useful to a user, and naming the offending type is what
  // makes it actionable. Pinning my own wording would test the phrasing I am
  // about to invent rather than the behaviour.
  //
  // Without validation this does NOT throw: BASE_PREMIUMS["broomstick"] is
  // undefined, so 1 × undefined = NaN propagates and the premium comes back NaN.
  // This is the test that finally forces that long-flagged NaN hazard.
  it("should reject a quote containing an item with an unknown type (e.g. broomstick)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  // The amulet is a KNOWN type but is not covered by this policy, so the claim
  // must be rejected. Matching on /amulet/ — naming the offending value, as with
  // the broomstick test — rather than pinning invented wording.
  //
  // Without validation this does NOT throw: `find` returns undefined and
  // reimbursementRate(undefined) returns 1 (the long-flagged placeholder), so
  // the claim quietly pays 400 − 100 = 300 against a policy that never covered
  // an amulet. This test is what retires that placeholder.
  it("should reject a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 400 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  // NO NEW IMPLEMENTATION COVER, stated plainly: `damagedItems` already rejects
  // any damage whose itemType is absent from the policy, and an unknown type is
  // trivially absent — so the same check fires as for the amulet. The spec
  // itself groups both cases in one bullet.
  // What it DOES guard is a real prior hazard: before that check existed this
  // input produced a silent NaN payout, since INSURANCE_VALUES["broomstick"] is
  // undefined. This pins rejection rather than nonsense arithmetic.
  it("should reject a claim with a damage entry of an unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
  // Not merely a wrong number but an EXPLOITABLE one. Without validation:
  //   reimbursed = (−200 × 1) − 100 = −300 → payout −300
  //   remainingCap = 2000 − (−300) = 2300, i.e. ABOVE the starting cap
  // so a negative damage entry refunds cap and inflates the claimant's own
  // coverage. That makes this more than input hygiene.
  //
  // Rejects NEGATIVE only: the spec says nothing about amount 0 and no example
  // covers it, so a positive-only rule would be untested invention.
  it("should reject a claim with a negative damage amount (amount: -200)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });
  // The rule is NOT "reject duplicate types" — it is "reject when the COUNT of
  // entries for a type EXCEEDS the count of insured items of that type".
  // Compare with the legitimate two-swords/two-entries test above, which pays
  // 700 against TWO insured swords. The two tests have IDENTICAL damages and
  // differ only in the policy, which is why a Map<type, Item> lookup would be
  // the wrong shape: it collapses exactly the count this pair depends on.
  //
  // Without multiplicity checking both entries resolve to the same single sword
  // and are both paid: (500−100) + (400−100) = 700, cap 2000 → remaining 1300 —
  // i.e. the policy pays out for a sword it never insured.
  it("should reject a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });

  // --- CLI end-to-end ---
  // The spec's OWN schema example, driven through the real CLI as a subprocess —
  // the only way to verify stdin→stdout wiring. tsx is resolved from
  // node_modules/.bin rather than via npx to avoid resolution overhead.
  //   step 0 quote (5 years, so loyalty applies; ench 2 < 5 so no surcharge):
  //     60 base − 12 loyalty + 6 first insurance + 5 fee = 59
  //   step 1 claim (amulet insures for 600 → cap 1200; ench 2 < 8 so rate 1):
  //     200 − 100 deductible = 100 payout; remainingCap = 1100
  it("should process the schema example scenario and write a results array matching the steps order", () => {
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

    const stdout = execFileSync("node_modules/.bin/tsx", ["src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });

    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  // All THREE parts of the CLI error contract, through a real subprocess.
  // The `threw` flag is asserted FIRST and is what stops this passing silently:
  // a bare try/catch would simply not run its catch block if the CLI wrongly
  // succeeded, and no assertion would fire at all.
  // execFileSync throws on a non-zero exit, exposing status/stderr/stdout on
  // the error; Node does not type that shape, hence the narrow local interface.
  it("should exit non-zero and write an error description to stderr for an invalid scenario, with no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    let threw = false;
    let failure: { status: number; stderr: string; stdout: string } | undefined;
    try {
      execFileSync("node_modules/.bin/tsx", ["src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf8",
      });
    } catch (error) {
      threw = true;
      failure = error as { status: number; stderr: string; stdout: string };
    }

    expect(threw).toBe(true);
    expect(failure?.status).not.toBe(0);
    expect(failure?.stderr).toMatch(/broomstick/);
    expect(failure?.stdout).not.toMatch(/results/);
  });
});
