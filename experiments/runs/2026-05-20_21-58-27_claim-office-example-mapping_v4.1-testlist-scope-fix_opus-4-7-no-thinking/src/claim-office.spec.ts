import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, claim, processScenario, type Item } from "./claim-office.js";

function runCli(input: object): { status: number | null; stdout: string; stderr: string } {
  const res = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
  return { status: res.status, stdout: res.stdout, stderr: res.stderr };
}

describe("MHPCO Claim Office", () => {
  // ---------------------------------------------------------------
  // QUOTE — base premiums and edge cases
  // ---------------------------------------------------------------

  it("empty item list returns premium 5 G (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  it("single plain sword for newcomer first insurance: 100 + 10 + 5 = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: false }])).toBe(115);
  });

  it("single plain amulet for newcomer first insurance: 60 + 6 + 5 = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }])).toBe(71);
  });

  it("single plain staff for newcomer first insurance: 80 + 8 + 5 = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff", material: "oak", enchantment: 1, cursed: false }])).toBe(93);
  });

  it("single plain potion for newcomer first insurance: 40 + 4 + 5 = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion", material: "glass", enchantment: 0, cursed: false }])).toBe(49);
  });

  // ---------------------------------------------------------------
  // QUOTE — components (runes, moonstones) and block discount
  // ---------------------------------------------------------------

  it("2 runes have base premium 50 G (no block, requires exactly 3)", () => {
    // base 25+25=50; first-insurance 10% per item = 5; fee 5 → 60
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
    ])).toBe(60);
  });

  it("3 runes have base premium 60 G (block applies)", () => {
    // base 60 (block) + 10% first-ins on base = 6; fee 5 → 71
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ])).toBe(71);
  });

  it("4 runes have base premium 100 G (no block — block requires exactly 3)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },{ type: "rune" },{ type: "rune" },{ type: "rune" },
    ])).toBe(115);
  });

  it("7 runes have base premium 175 G (one block of 3 at 60 + 4 singles at 25 = 60+100)", () => {
    // Per spec: block requires EXACTLY 3, so 7 runes → 7*25 = 175 base; +10% = 17.5; +5 fee = 197.5 → ceil 198
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },{ type: "rune" },{ type: "rune" },{ type: "rune" },
      { type: "rune" },{ type: "rune" },{ type: "rune" },
    ])).toBe(198);
  });

  // ---------------------------------------------------------------
  // QUOTE — "alike" components clarification (❓)
  // ---------------------------------------------------------------

  it("2 runes + 1 moonstone: 75 G base premium (no block — different types)", () => {
    // 2 runes: base 50 → 50 + 5 = 55; 1 moonstone: base 25 → 25 + 2.5 = 27.5
    // total: 82.5 + 5 fee = 87.5 → ceil 88
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },{ type: "rune" },{ type: "moonstone" },
    ])).toBe(88);
  });

  it("3 runes + 3 moonstones: 120 G base premium (two separate blocks)", () => {
    // rune block: 60, moonstone block: 60 → total base 120
    // 10% first-ins: 12. fee 5. Total: 137
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },{ type: "rune" },{ type: "rune" },
      { type: "moonstone" },{ type: "moonstone" },{ type: "moonstone" },
    ])).toBe(137);
  });

  // ---------------------------------------------------------------
  // QUOTE — item-specific modifiers (cursed, high enchantment)
  // ---------------------------------------------------------------

  it("cursed sword adds 50% surcharge to that item's base premium (curse rule in isolation)", () => {
    // sword base 100 + curse 50 = 150; first-ins 10% on 100 base only (item-specific modifiers
    // include curse so first-insurance applies to item-base): per spec items each have first-insurance.
    // Reading spec: first insurance carries 10% surcharge applied as item-specific or policy-wide?
    // Spec: "A first insurance carries a 10 % initial assessment surcharge" — and the integration:
    // newcomer cursed sword (enchant 3): 100 + 50 + 10 + 5 = 165 G  (first-ins is +10 = 10% of 100)
    // So first-insurance is 10% of ITEM BASE PREMIUM, NOT base+curse.
    // Therefore for cursed sword: 100 + 50 + 10 + 5 = 165
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ])).toBe(165);
  });

  it("sword with enchantment 5 triggers high-enchantment surcharge (threshold inclusive)", () => {
    // sword base 100 + enchantment 30% (30) + first-ins 10 + fee 5 = 145
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 5, cursed: false },
    ])).toBe(145);
  });

  it("sword with enchantment 4 has no high-enchantment surcharge", () => {
    // sword base 100 + first-ins 10 + fee 5 = 115 (no enchantment surcharge since 4 < 5)
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 4, cursed: false },
    ])).toBe(115);
  });

  it("cursed sword with enchantment 5 stacks both surcharges on the item's base premium", () => {
    // sword base 100 + curse 50 + high-ench 30 + first-ins 10 + fee 5 = 195
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 5, cursed: true },
    ])).toBe(195);
  });

  // ---------------------------------------------------------------
  // QUOTE — modifier scope on multi-item policies (❓)
  // ---------------------------------------------------------------

  it("policy with cursed sword + plain amulet: curse surcharge applies only to sword's base (210 G before further modifiers/fee)", () => {
    // sword base 100 + curse 50 + first-ins 10 = 160; amulet base 60 + first-ins 6 = 66; total = 226; +fee 5 = 231
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 2, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ])).toBe(231);
  });

  it("item-specific modifiers apply to item base premium; policy-wide modifiers apply to policy base premium; fee added at the end", () => {
    // 3-year customer (loyalty -20%), cursed sword + plain amulet
    // sword: 100 + 50 curse + 10 first-ins = 160
    // amulet: 60 + 6 first-ins = 66
    // sum: 226
    // loyalty 20% of policy base (100 + 60 = 160) = 32 → subtract 32
    // 226 - 32 = 194; + fee 5 = 199
    expect(quote({ yearsWithMHPCO: 3 }, [
      { type: "sword", material: "steel", enchantment: 2, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ])).toBe(199);
  });

  // ---------------------------------------------------------------
  // QUOTE — policy-wide modifiers
  // ---------------------------------------------------------------

  it("long-standing customer (2 years exactly): 20% loyalty discount applies", () => {
    // 2 yr customer + plain sword: policy base 100; sword 100 + first-ins 10 = 110
    // loyalty -20% of 100 = -20; 110 - 20 = 90; +5 fee = 95
    expect(quote({ yearsWithMHPCO: 2 }, [
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
    ])).toBe(95);
  });

  it("customer with 1 year: no loyalty discount", () => {
    // 1 yr customer + plain sword: 100 + 10 + 5 = 115 (no loyalty)
    expect(quote({ yearsWithMHPCO: 1 }, [
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
    ])).toBe(115);
  });

  it("first insurance: 10% surcharge per item", () => {
    // two swords (newcomer): each gets 10% first-ins
    // 100+10 + 100+10 + 5 = 225
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 1, cursed: false },
      { type: "sword", material: "steel", enchantment: 1, cursed: false },
    ])).toBe(225);
  });

  it("follow-up contract (after first quote in scenario): 15% policy-wide discount applies", () => {
    // newcomer 2nd quote: policy base 100; sword 100 + first-ins 10 = 110
    // follow-up -15% of 100 = -15; 110 - 15 = 95; +5 = 100
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 1, cursed: false },
    ], { previousQuoteCount: 1 })).toBe(100);
  });

  it("each item in a follow-up quote still incurs the per-item first insurance surcharge", () => {
    // two swords as a follow-up: policy base 200; items 100+10+100+10 = 220
    // follow-up -15% of 200 = -30; 220 - 30 = 190; +5 = 195
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 1, cursed: false },
      { type: "sword", material: "steel", enchantment: 1, cursed: false },
    ], { previousQuoteCount: 1 })).toBe(195);
  });

  // ---------------------------------------------------------------
  // QUOTE — rounding (rounded UP in MHPCO favor)
  // ---------------------------------------------------------------

  it("premium computed at 197.5 G rounds UP to 198 G", () => {
    // 7 runes example: 7*25=175 base + 17.5 first-ins = 192.5 + 5 = 197.5 → ceil 198
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" },{ type: "rune" },{ type: "rune" },{ type: "rune" },
      { type: "rune" },{ type: "rune" },{ type: "rune" },
    ])).toBe(198);
  });

  it("intermediate amounts are kept as fractions; only final premium is rounded", () => {
    // 3 yr customer + plain amulet: policy base 60; amulet 60 + first-ins 6 = 66
    // loyalty -20% of 60 = -12; 66 - 12 = 54; +5 = 59
    expect(quote({ yearsWithMHPCO: 3 }, [
      { type: "amulet", material: "silver", enchantment: 1, cursed: false },
    ])).toBe(59);
  });

  // ---------------------------------------------------------------
  // QUOTE — integration examples
  // ---------------------------------------------------------------

  it("newcomer cursed sword (steel, enchantment 3): 100 + 50 + 10 + 5 = 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ])).toBe(165);
  });

  it("3-year customer's 2nd contract, cursed sword (steel, enchantment 7): 100 + 50 + 30 − 20 + 10 − 15 + 5 = 160 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [
      { type: "sword", material: "steel", enchantment: 7, cursed: true },
    ], { previousQuoteCount: 1 })).toBe(160);
  });

  // ---------------------------------------------------------------
  // QUOTE — errors
  // ---------------------------------------------------------------

  it("quote with unknown item type (e.g. broomstick) throws/errors", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow();
  });

  // ---------------------------------------------------------------
  // CLAIM — base reimbursement and deductible
  // ---------------------------------------------------------------

  it("regular sword (steel, enchantment 3) damage 500 G → payout 400 G (full − 100 deductible)", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 3, cursed: false }];
    const damages = [{ itemType: "sword", amount: 500 }];
    expect(claim(items, damages).payout).toBe(400);
  });

  it("rune (no enchantment, no material) damage 200 G → payout 100 G (full − 100 deductible)", () => {
    const items: Item[] = [{ type: "rune" }];
    const damages = [{ itemType: "rune", amount: 200 }];
    expect(claim(items, damages).payout).toBe(100);
  });

  it("deductible applies once per damaged item: dragon attack damaging sword 500 G + amulet 300 G → payout 600 G", () => {
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claim(items, damages).payout).toBe(600);
  });

  // ---------------------------------------------------------------
  // CLAIM — high enchantment clause (≥8 → 50%)
  // ---------------------------------------------------------------

  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then 100 deductible)", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(claim(items, damages).payout).toBe(400);
  });

  it("sword with enchantment 7 (below 8): standard reimbursement applies (no 50% clause)", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 7, cursed: false }];
    const damages = [{ itemType: "sword", amount: 500 }];
    expect(claim(items, damages).payout).toBe(400); // 500 - 100 = 400
  });

  // ---------------------------------------------------------------
  // CLAIM — dragon material clause (full reimbursement)
  // ---------------------------------------------------------------

  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full − 100 deductible)", () => {
    const items: Item[] = [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }];
    const damages = [{ itemType: "sword", amount: 800 }];
    expect(claim(items, damages).payout).toBe(700); // dragon material → full 800, - 100 = 700
  });

  // ---------------------------------------------------------------
  // CLAIM — interaction between enchantment threshold and dragon material
  // ---------------------------------------------------------------

  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins, then deductible)", () => {
    const items: Item[] = [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(claim(items, damages).payout).toBe(400);
  });

  it("dragon-material sword, enchantment 8 exactly, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)", () => {
    const items: Item[] = [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    expect(claim(items, damages).payout).toBe(400);
  });

  // ---------------------------------------------------------------
  // CLAIM — multiple items of the same type (❓)
  // ---------------------------------------------------------------

  it("policy with two swords: insurance sum 2000 G, cap 4000 G", () => {
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
    ];
    // Cap = 4000 — check via a claim that exceeds 2000: damage 3000 sword → payout 2900 but cap is 4000, so 2900
    const damages = [{ itemType: "sword", amount: 3000 }];
    const result = claim(items, damages);
    expect(result.remainingCap).toBe(4000 - 2900); // 1100
  });

  it("two sword damage entries → each treated as a separate damage with its own deductible", () => {
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
    ];
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    const result = claim(items, damages);
    expect(result.payout).toBe(800); // (500-100) + (500-100) = 800
  });

  it("more damage entries of a type than insured items of that type → error (claim rejected)", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 2, cursed: false }];
    const damages = [
      { itemType: "sword", amount: 200 },
      { itemType: "sword", amount: 200 },
    ];
    expect(() => claim(items, damages)).toThrow();
  });

  // ---------------------------------------------------------------
  // CLAIM — cap exhaustion
  // ---------------------------------------------------------------

  it("policy with sword + amulet: insurance sum 1600 G, cap 3200 G", () => {
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    // damage 2000 (sword): 2000-100=1900; cap=3200, so payout=1900, remainingCap=3200-1900=1300
    const result = claim(items, [{ itemType: "sword", amount: 2000 }]);
    expect(result.remainingCap).toBe(1300);
  });

  it("cursed sword: cap is 2000 G based on unmodified insurance value (premium modifiers do not raise cap)", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 2, cursed: true }];
    // damage 2500: 2500-100=2400, but cap 2000, payout=2000, remainingCap=0
    const result = claim(items, [{ itemType: "sword", amount: 2500 }]);
    expect(result.payout).toBe(2000);
    expect(result.remainingCap).toBe(0);
  });

  it("policy with sword + 3 runes (block): insurance sum 1750 G (block affects premium only, not insurance sum)", () => {
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 2, cursed: false },
      { type: "rune" },{ type: "rune" },{ type: "rune" },
    ];
    // cap = 2*1750 = 3500; damage sword 3000 → 2900, payout=2900, remainingCap=600
    const result = claim(items, [{ itemType: "sword", amount: 3000 }]);
    expect(result.remainingCap).toBe(600);
  });

  it("sword (cap 2000 G): first claim 1500 G → payout 1400 G, remaining cap 600 G", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 2, cursed: false }];
    const result = claim(items, [{ itemType: "sword", amount: 1500 }]);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });

  it("sword (cap 2000 G): second successive claim 1500 G → payout 600 G (capped), remaining cap 0 G", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 2, cursed: false }];
    // pass remainingCap=600 as 3rd arg
    const result = claim(items, [{ itemType: "sword", amount: 1500 }], 600);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // ---------------------------------------------------------------
  // CLAIM — rounding (rounded DOWN in MHPCO favor)
  // ---------------------------------------------------------------

  it("payout computed at 350.5 G rounds DOWN to 350 G", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 9, cursed: false }];
    const damages = [{ itemType: "sword", amount: 901 }];
    expect(claim(items, damages).payout).toBe(350);
  });

  it("intermediate payout amounts kept as fractions; only final payout rounded", () => {
    // ench 9 sword 901 → 0.5*901-100 = 350.5
    // ench 9 sword 902 → 0.5*902-100 = 351
    // sum = 701.5 → floor = 701
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 9, cursed: false },
      { type: "sword", material: "steel", enchantment: 9, cursed: false },
    ];
    const damages = [
      { itemType: "sword", amount: 901 },
      { itemType: "sword", amount: 902 },
    ];
    expect(claim(items, damages).payout).toBe(701);
  });

  // ---------------------------------------------------------------
  // CLAIM — errors
  // ---------------------------------------------------------------

  it("claim references damage entry whose item is not part of the policy → error", () => {
    // amulet damaged when only a sword is insured
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 2, cursed: false }];
    const damages = [{ itemType: "amulet", amount: 200 }];
    expect(() => claim(items, damages)).toThrow();
  });

  it("claim references damage entry with unknown item type → error", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 2, cursed: false }];
    const damages = [{ itemType: "broomstick", amount: 200 }];
    expect(() => claim(items, damages)).toThrow();
  });

  it("claim contains damage entry with negative amount (e.g. -200) → error", () => {
    const items: Item[] = [{ type: "sword", material: "steel", enchantment: 2, cursed: false }];
    const damages = [{ itemType: "sword", amount: -200 }];
    expect(() => claim(items, damages)).toThrow();
  });

  // ---------------------------------------------------------------
  // CLI / scenario-level integration
  // ---------------------------------------------------------------

  it("scenario with one quote step writes results array with premium integer", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }] },
      ],
    };
    const out = processScenario(scenario);
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  it("scenario with quote then claim: claim references policy by zero-based step index", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const out = processScenario(scenario);
    expect(out.results).toHaveLength(2);
    expect(out.results[1]).toHaveProperty("payout");
    expect(out.results[1]).toHaveProperty("remainingCap");
  });

  it("results array length and order matches input steps array", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
      ],
    };
    const out = processScenario(scenario);
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toEqual({ premium: 115 });
  });

  it("CLI exits non-zero on unknown item type in quote (no results written to stdout)", () => {
    const res = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(res.status).not.toBe(0);
    expect(res.stdout).not.toMatch(/"results"/);
  });

  it("CLI exits non-zero on claim referencing item not in policy", () => {
    const res = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(res.status).not.toBe(0);
  });

  it("CLI exits non-zero on claim with negative damage amount", () => {
    const res = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(res.status).not.toBe(0);
  });

  it("CLI exits non-zero on too-many-damages-for-type", () => {
    const res = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 200 },
        ] } },
      ],
    });
    expect(res.status).not.toBe(0);
  });
});
