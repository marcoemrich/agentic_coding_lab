import { describe, it } from "vitest";
import { claim } from "./claim.js";

describe("claim -- payout calculation", () => {
  // ----- Insurance sum / cap -----

  it.todo("two swords -> insurance sum 2000 G, cap 4000 G");
  it.todo("sword + amulet -> insurance sum 1600 G, cap 3200 G");
  it.todo("sword + 3 runes (block) -> insurance sum 1750 G (block affects premium, not sum)");
  it.todo("cursed sword -> cap 2000 G (based on unmodified insurance value)");

  // ----- Standard reimbursement -----

  it.todo("regular sword (steel, enchantment 3) damage 500 -> payout 400 (full then 100 deductible)");
  it.todo("rune damage 200 -> payout 100 (full then 100 deductible)");

  // ----- High-enchantment (>= 8) clause -----

  it.todo("steel sword enchantment 9 damage 1000 -> payout 400 (50% then deductible)");
  it.todo("steel sword enchantment 8 damage 1000 -> payout 400 (50% then deductible)");

  // ----- Dragon-material clause -----

  it.todo("dragon sword enchantment 5 damage 800 -> payout 700 (full then deductible)");
  it.todo("dragon sword enchantment 9 damage 1000 -> payout 400 (50% clause wins, then deductible)");
  it.todo("dragon sword enchantment 8 damage 1000 -> payout 400 (50% clause wins, then deductible)");

  // ----- Deductible per damage event -----

  it.todo("dragon attack damages sword 500 + amulet 300 -> payout 600 (100 deductible per damaged item)");

  // ----- Cap exhaustion -----

  it.todo("sword (cap 2000), claim 1500 -> payout 1400, remaining cap 600");
  it.todo("sword (cap 2000), two claims of 1500 -> first payout 1400 cap 600, second payout 600 cap 0");

  // ----- Rounding -----

  it.todo("payout calculation yielding 350.5 G -> final payout 350 G (round down)");

  // ----- Multiple damages of the same type -----

  it.todo("dragon attack damages two swords -> each entry treated as a separate damage with own deductible");
});

// Placeholder so the import resolves while only it.todo entries exist.
import { claim as _claimPlaceholder } from "./claim.js";
void _claimPlaceholder;
