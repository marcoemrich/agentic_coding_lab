import type { Customer, Item, ItemType, Policy, Incident, ClaimResult } from "./types.js";

const BASE_PREMIUMS: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES: Set<ItemType> = new Set(["rune", "moonstone"]);

function isComponent(type: ItemType): boolean {
  return COMPONENT_TYPES.has(type);
}

/**
 * Compute the base premium for a list of items.
 * Components (rune, moonstone) get the block-of-3 discount when exactly 3 alike exist.
 * Returns the sum of all item base premiums (including item-specific surcharges).
 */
function computeItemBasePremium(item: Item): number {
  const base = BASE_PREMIUMS[item.type];
  let premium = base;
  if (item.cursed) {
    premium += base * 0.5;
  }
  if ((item.enchantment ?? 0) >= 5) {
    premium += base * 0.3;
  }
  return premium;
}

/**
 * Compute component base premium with block-of-3 discount.
 * Groups by component type, gives 60 G per complete group of exactly 3,
 * and 25 G for each remaining.
 */
function computeComponentsPremium(items: Item[]): number {
  // Group by type
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  let total = 0;
  for (const [, count] of counts) {
    const blocks = Math.floor(count / 3);
    const remainder = count % 3;
    // Block of exactly 3: 60 G
    // But "block requires exactly 3" — groups of 3
    // 4 runes → no block (4 is not divisible into groups of 3 with a discount)
    // Wait: "4 runes → 100 G base premium (no block — block requires exactly 3)"
    // "7 runes → 175 G base premium"
    // 7 = 2*3 + 1: 2 blocks (60*2=120) + 1 leftover (25) = 145? But example says 175
    // Re-read: "7 runes → 175 G base premium"
    // 7 * 25 = 175... so 7 runes is just 7 * 25?
    // But "3 runes → 60 G base premium (block applies)" means 3 runes costs 60 not 75
    // Let me re-check: "4 runes → 100 G base premium (no block — block requires exactly 3)"
    // 4 * 25 = 100 ✓ — so 4 runes doesn't get any block
    // "7 runes → 175 G base premium" = 7 * 25 = 175
    // So the block of 3 is ONLY when you have EXACTLY 3, not for multiples of 3?
    // But then 3 runes + 3 moonstones = 2 blocks (120) which is consistent with exactly 3 each
    // So: count == 3 → 60 G, otherwise count * 25 G
    // This matches all examples:
    // 2 runes: 2*25=50 ✓
    // 3 runes: exactly 3 → 60 ✓
    // 4 runes: 4*25=100 ✓
    // 7 runes: 7*25=175 ✓
    // 3 runes + 3 moonstones: 60+60=120 ✓
    if (count === 3) {
      total += 60;
    } else {
      total += count * 25;
    }
  }
  return total;
}

/**
 * Compute the quote (premium) for a customer and a list of items.
 * @param customer - the customer
 * @param items - items to insure
 * @param isFirstContract - true if this is the customer's first contract
 */
export function computeQuote(customer: Customer, items: Item[], isFirstContract: boolean): number {
  // Split into components and main items
  const components = items.filter((i) => isComponent(i.type as ItemType));
  const mainItems = items.filter((i) => !isComponent(i.type as ItemType));

  // Base premium for main items (with item-specific surcharges)
  let policyBase = 0;
  for (const item of mainItems) {
    policyBase += computeItemBasePremium(item);
  }

  // Base premium for components
  policyBase += computeComponentsPremium(components);

  // Policy-wide modifiers applied to policy base (sum of item BASES, not item+surcharge)
  // Wait - from the integration example:
  // "100 base + 50 curse + 30 enchant − 20 loyalty + 10 first insurance − 15 follow-up = 155"
  // The % modifiers (loyalty, first insurance, follow-up) are applied to the BASE (100),
  // not to (100+50+30=180).
  // "item-specific modifiers (cursed, high enchantment) apply to the base premium of the affected item;
  //  policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium
  //  (the sum of all item base premiums)"
  // So policy base premium = sum of item BASE premiums (without item-specific surcharges)
  // And the item-specific surcharges are added separately

  // Let me recompute:
  // Policy base = sum of raw item base premiums (no surcharges)
  let rawPolicyBase = 0;
  for (const item of mainItems) {
    rawPolicyBase += BASE_PREMIUMS[item.type as ItemType];
  }
  // For components, the "base" is the component premium with block logic
  rawPolicyBase += computeComponentsPremium(components);

  // Item-specific surcharges (cursed, high enchantment) on main items
  let itemSurcharges = 0;
  for (const item of mainItems) {
    const base = BASE_PREMIUMS[item.type as ItemType];
    if (item.cursed) {
      itemSurcharges += base * 0.5;
    }
    if ((item.enchantment ?? 0) >= 5) {
      itemSurcharges += base * 0.3;
    }
  }
  // Note: components don't have cursed/enchantment in the problem description

  // Policy-wide modifiers on rawPolicyBase
  let policyModifiers = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= rawPolicyBase * 0.2; // loyalty discount
  }
  if (isFirstContract) {
    policyModifiers += rawPolicyBase * 0.1; // first insurance surcharge
  } else {
    policyModifiers -= rawPolicyBase * 0.15; // follow-up discount
  }
  // Note: per the second integration example, first insurance surcharge applies to EACH item
  // in the quote, regardless of contract history. Let's re-check:
  // "each item in a quote is treated as a first insurance, regardless of customer history"
  // This means: even on a follow-up contract, there's still a first insurance surcharge per item
  // The example shows BOTH first insurance (+10) AND follow-up (-15), so they stack!
  // So first insurance surcharge always applies (per item basis = on policy base)
  // And if it's not the first contract, ALSO apply follow-up discount

  // Actually re-reading: the example has BOTH surcharges for the second contract
  // So: first insurance surcharge ALWAYS applies
  // follow-up discount applies only when isFirstContract=false

  // Let me redo policy modifiers:
  policyModifiers = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= rawPolicyBase * 0.2; // loyalty
  }
  // First insurance surcharge ALWAYS applies (per item = per policy base)
  policyModifiers += rawPolicyBase * 0.1;
  // Follow-up discount only if not first contract
  if (!isFirstContract) {
    policyModifiers -= rawPolicyBase * 0.15;
  }

  const totalBeforeFee = rawPolicyBase + itemSurcharges + policyModifiers;
  const total = totalBeforeFee + 5; // processing fee

  // Round up (ceiling) in MHPCO's favor
  return Math.ceil(total);
}

/**
 * Process a claim against a policy.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  // Validate: no negative amounts
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }

  // Validate: all damage types exist in policy
  const policyItemCounts = new Map<string, number>();
  for (const item of policy.items) {
    policyItemCounts.set(item.type, (policyItemCounts.get(item.type) ?? 0) + 1);
  }

  const damageCounts = new Map<string, number>();
  for (const damage of incident.damages) {
    const type = damage.itemType;
    const knownTypes: ItemType[] = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];
    if (!knownTypes.includes(type as ItemType)) {
      throw new Error(`Unknown item type in damages: ${type}`);
    }
    damageCounts.set(type, (damageCounts.get(type) ?? 0) + 1);
  }

  for (const [type, count] of damageCounts) {
    const insured = policyItemCounts.get(type) ?? 0;
    if (count > insured) {
      throw new Error(
        `Damage entries (${count}) for ${type} exceed insured count (${insured})`
      );
    }
  }

  // Process each damage
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    // We already validated the item exists, so item is defined
    const enchantment = item?.enchantment ?? 0;
    const isDragon = item?.material === "dragon";
    const isHighEnchant = enchantment >= 8;

    let payout: number;
    if (isHighEnchant) {
      // 50% reimbursement rule (wins over dragon rule when enchant >= 8)
      payout = damage.amount * 0.5 - 100;
    } else if (isDragon) {
      // Full reimbursement
      payout = damage.amount - 100;
    } else {
      // Standard: full reimbursement minus deductible
      payout = damage.amount - 100;
    }

    if (payout < 0) payout = 0;
    totalPayout += payout;
  }

  // Round down (floor) for payouts
  totalPayout = Math.floor(totalPayout);

  // Apply cap
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const newRemainingCap = policy.remainingCap - cappedPayout;

  return {
    payout: cappedPayout,
    remainingCap: newRemainingCap,
  };
}

/**
 * Create a policy from a list of items.
 */
export function createPolicy(items: Item[], stepIndex: number): Policy {
  const insuranceSum = items.reduce((sum, item) => {
    return sum + (INSURANCE_VALUES[item.type as ItemType] ?? 0);
  }, 0);
  return {
    stepIndex,
    items,
    insuranceSum,
    cap: insuranceSum * 2,
    remainingCap: insuranceSum * 2,
  };
}

export { INSURANCE_VALUES };
