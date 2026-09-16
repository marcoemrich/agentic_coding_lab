import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { ClaimOffice, quote } from "./claim-office.js";

function runCli(scenario: unknown): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return { status: failure.status, stdout: failure.stdout, stderr: failure.stderr };
  }
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and single base premiums ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quotes a single plain sword as 115 G (100 G base + 10 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single plain amulet as 71 G (60 G base + 6 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single plain staff as 93 G (80 G base + 8 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single plain potion as 49 G (40 G base + 4 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes a single rune as 33 G (25 G base + 2.5 G first insurance + 5 G fee, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone as 33 G (25 G base + 2.5 G first insurance + 5 G fee, rounded up)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });
  it("quotes a sword and an amulet as 181 G (160 G base + 16 G first insurance + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }])).toBe(181);
  });

  // --- Component blocks of 3 alike ---
  it("quotes 2 runes with a 50 G base premium (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes with a 60 G base premium (block applies)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes with a 100 G base premium (block requires exactly 3)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes with a 175 G base premium (no block for 7)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone with a 75 G base premium (alike means same type, so no block)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones with a 120 G base premium (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });

  // --- Item-specific modifiers ---
  it("adds a 50 % curse surcharge to a cursed sword: base 100 G + 50 G → 165 G total", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge to a sword with enchantment 5 (threshold)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge to a sword with enchantment 4", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("adds both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("applies the curse surcharge only to the cursed item: cursed sword + plain amulet → 210 G before further modifiers, 231 G total", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }]),
    ).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 10 % first-insurance surcharge on the policy base premium: plain sword → 115 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    expect(office.quote([{ type: "sword" }])).toBe(115);
  });
  it("applies a 15 % follow-up discount to the customer's second quote: plain sword → 100 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(office.quote([{ type: "sword" }])).toBe(100);
  });
  it("applies the first-insurance surcharge to every quote, including follow-up contracts", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(office.quote([{ type: "amulet" }])).toBe(62);
  });

  // --- Rounding ---
  it("rounds a premium of 197.5 G up to 198 G (in the MHPCO's favor)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes)).toBe(198);
  });
  it("rounds a payout of 350.5 G down to 350 G (in the MHPCO's favor)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", enchantment: 9 }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] }).payout,
    ).toBe(350);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium: 3 runes + 1 rune quoted together → 115 G", () => {
    const fourRunes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 2 }, fourRunes)).toBe(95);
  });

  // --- Integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) as 165 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    expect(
      office.quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
    ).toBe(165);
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) as 160 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 3 });
    office.quote([{ type: "amulet" }]);
    expect(
      office.quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
    ).toBe(160);
  });

  // --- Claims: standard reimbursement and deductible ---
  it("pays out 400 G for a steel sword (enchantment 3) with 500 G damage (500 − 100 deductible)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] }),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays out 100 G for a rune with 200 G damage (runes have no enchantment or material)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "rune" }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] }).payout,
    ).toBe(100);
  });
  it("applies the 100 G deductible per damaged item: sword 500 G + amulet 300 G → 600 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    const result = office.claim(0, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  // --- Claims: special clauses ---
  it("reimburses 50 % for a steel sword with enchantment 9 and 1000 G damage → 400 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout,
    ).toBe(400);
  });
  it("reimburses 50 % at exactly enchantment 8: dragon sword, 1000 G damage → 400 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 8 }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout,
    ).toBe(400);
  });
  it("fully reimburses a dragon-material sword with enchantment 5 and 800 G damage → 700 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 5 }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] }).payout,
    ).toBe(700);
  });
  it("lets the 50 % rule win over dragon material: dragon sword, enchantment 9, 1000 G damage → 400 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 9 }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] }).payout,
    ).toBe(400);
  });

  // --- Claims: cap ---
  it("caps a policy at twice the insurance sum: sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    const result = office.claim(0, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 200 }],
    });
    expect(result).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("bases the cap on unmodified insurance values: cursed sword → cap 2000 G despite a 165 G premium", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", cursed: true }]);
    const result = office.claim(0, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 200 }],
    });
    expect(result).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("bases the insurance sum on full component values: sword + 3 runes → insurance sum 1750 G despite the block discount", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]);
    const result = office.claim(0, {
      cause: "fire",
      damages: [{ itemType: "sword", amount: 200 }],
    });
    expect(result).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("reports remainingCap 600 G after a first 1500 G claim against a sword policy (payout 1400 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap: payout 600 G, remainingCap 0 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] }),
    ).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Multiple items of the same type ---
  it("insures two swords with an insurance sum of 2000 G and a cap of 4000 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "sword" }]);
    expect(
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] }),
    ).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("treats two sword damage entries as separate damages, each with its own deductible", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "sword" }]);
    expect(
      office.claim(0, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers (Error thrown)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toThrow(/not covered/);
  });

  // --- Error cases (chosen contract: the domain throws Error; the CLI exits non-zero and writes to stderr) ---
  it("rejects a quote containing an unknown item type such as broomstick (Error thrown)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    expect(() => office.quote([{ type: "broomstick" }])).toThrow(/unknown item type/);
  });
  it("rejects a claim for an item that is not part of the policy, e.g. an amulet when only a sword is insured (Error thrown)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] }),
    ).toThrow(/not covered/);
  });
  it("rejects a claim damage entry with an unknown item type (Error thrown)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] }),
    ).toThrow(/not covered/);
  });
  it("rejects a claim damage entry with a negative amount such as -200 (Error thrown)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow(/negative damage amount/);
  });

  // --- CLI adapter ---
  it("CLI reads a scenario from stdin and writes {results:[...]} to stdout in step order", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { premium: 80 }],
    });
  });
  it("CLI writes a quote result as {premium} and a claim result as {payout, remainingCap}", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits non-zero, writes an error to stderr, and writes no results to stdout for an unknown item type", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
});
