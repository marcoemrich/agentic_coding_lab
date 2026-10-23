import { describe, it } from "vitest";

describe("Quote: base premiums", () => {
  it.todo("empty item list -> premium 5 (only the processing fee)");
  it.todo("plain sword -> 115 (100 base + 10 first insurance + 5 fee)");
  it.todo("plain amulet -> 71 (60 base + 6 first insurance + 5 fee)");
  it.todo("plain staff -> 93 (80 base + 8 first insurance + 5 fee)");
  it.todo("plain potion -> 49 (40 base + 4 first insurance + 5 fee)");
  it.todo("2 runes -> 60 (50 base + 5 first insurance + 5 fee)");
  it.todo("2 moonstones -> 60 (50 base + 5 first insurance + 5 fee)");
  it.todo("3 runes -> 71 (block: 60 base + 6 + 5)");
  it.todo("3 moonstones -> 71 (block: 60 base + 6 + 5)");
  it.todo("4 runes -> 115 (100 base, block needs exactly 3)");
  it.todo("7 runes -> 198 (175 base + 17.5 + 5 = 197.5, rounded up in MHPCO's favor)");
  it.todo("2 runes + 1 moonstone -> 88 (75 base, different types form no block; 87.5 rounded up)");
  it.todo("3 runes + 3 moonstones -> 137 (two blocks: 120 base + 12 + 5)");
});

describe("Quote: modifiers", () => {
  it.todo("cursed sword, new customer -> 165 (100 + 50 curse + 10 first insurance + 5 fee)");
  it.todo("sword enchantment 5 -> 145 (100 + 30 high enchantment + 10 + 5)");
  it.todo("cursed sword enchantment 5 -> 195 (both surcharges: 100 + 50 + 30 + 10 + 5)");
  it.todo("sword enchantment 4 -> 115 (no high-enchantment surcharge)");
  it.todo("cursed sword enchantment 4 -> 165 (curse only)");
  it.todo("customer with exactly 2 years, plain sword -> 95 (100 - 20 loyalty + 10 + 5)");
  it.todo("customer with 1 year, plain sword -> 115 (no loyalty discount)");
  it.todo("cursed sword + plain amulet -> 231 (160 base + 50 curse on the sword only + 16 + 5)");
  it.todo("enchantment-5 amulet + plain sword -> 199 (160 base + 18 on the amulet only + 16 + 5)");
  it.todo("2 years, cursed sword + plain amulet -> 199 (loyalty -32 on the 160 policy base, not on the 210)");
  it.todo("second quote of a new customer, plain sword -> 100 (100 + 10 - 15 follow-up + 5)");
  it.todo("long-standing customer's second quote, cursed sword enchantment 7 -> 160");
});

describe("Claim: reimbursement", () => {
  it.todo("steel sword enchantment 3, damage 500 -> payout 400 (minus 100 deductible)");
  it.todo("rune, damage 200 -> payout 100 (runes have no special clauses)");
  it.todo("dragon sword enchantment 5, damage 800 -> payout 700 (full reimbursement minus deductible)");
  it.todo("steel sword enchantment 9, damage 1000 -> payout 400 (50% then deductible)");
  it.todo("steel sword enchantment 7, damage 1000 -> payout 900 (no 50% clause below 8)");
  it.todo("dragon sword enchantment 8, damage 1000 -> payout 400 (threshold: 50% then deductible)");
  it.todo("dragon sword enchantment 9, damage 1000 -> payout 400 (50% rule wins over dragon material)");
  it.todo("damage 50 on a plain sword -> payout 0 (payout never negative; chosen reading)");
  it.todo("enchantment-8 sword, damage 901 -> payout 350 (350.5 rounded down)");
  it.todo("dragon attack on sword 500 + amulet 300 -> payout 600 (deductible per damage entry)");
  it.todo("two swords insured, both damaged 500 -> payout 800, cap remaining 3200");
  it.todo("damage entries are matched to same-type items in policy order (steel ench 9 sword first, dragon ench 3 sword second; damages 1000, 800 -> 1100; chosen reading)");
});

describe("Claim: cap", () => {
  it.todo("sword + amulet, damage 500 on the sword -> payout 400, cap remaining 2800 (cap 3200)");
  it.todo("cursed sword, damage 500 -> cap remaining 1600 (cap 2000 from unmodified insurance value)");
  it.todo("sword + 3 runes, rune damage 200 -> payout 100, cap remaining 3400 (cap 3500; block does not change the insurance sum)");
  it.todo("sword, claims of 1500 then 1500 -> 1400/600 then 600/0 (second payout limited to remaining cap)");
  it.todo("potion, damage 500 -> payout 400, cap remaining 400 (potion insured at 400, cap 800)");
  it.todo("staff, damage 500 -> payout 400, cap remaining 1200 (staff insured at 800, cap 1600)");
  it.todo("moonstone, damage 200 -> payout 100, cap remaining 400 (component insured at 250, cap 500)");
});

describe("Rejections: whole scenario fails with an Error", () => {
  it.todo("quote with unknown item type broomstick -> throws");
  it.todo("claim damage for an amulet when only a sword is insured -> throws");
  it.todo("claim damage with an unknown item type -> throws");
  it.todo("two sword damages when only one sword is insured -> throws");
  it.todo("claim damage with amount -200 -> throws");
});

describe("CLI claim-office", () => {
  it.todo("schema example (5 years, amulet quote, 200 fire damage) -> stdout {results:[{premium:59},{payout:100,remainingCap:1100}]}, exit 0");
  it.todo("unknown item type in a quote -> non-zero exit, error on stderr, nothing on stdout");
  it.todo("rejected claim after a valid quote -> non-zero exit, error on stderr, nothing on stdout");
});
