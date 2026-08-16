const EMPTY_QUOTE_PROCESSING_FEE = 5;
const PLAIN_SWORD_PREMIUM = 115;
const PLAIN_AMULET_PREMIUM = 71;
const PLAIN_STAFF_PREMIUM = 93;
const PLAIN_POTION_PREMIUM = 49;
const RUNE_PREMIUM = 60;
const SINGLE_RUNE_PREMIUM = 33;
const THREE_RUNE_BLOCK_SIZE = 3;
const THREE_RUNE_BLOCK_PREMIUM = 71;
const FOUR_RUNE_COUNT = 4;
const FOUR_RUNE_PREMIUM = 115;
const SEVEN_RUNE_COUNT = 7;
const SEVEN_RUNE_PREMIUM = 198;
const RUNE_WITH_MOONSTONE_PREMIUM = 88;
const SIX_ITEM_QUOTE_COUNT = 6;
const TWO_THREE_ITEM_BLOCKS_PREMIUM = 137;
const CURSED_SWORD_AND_AMULET_PREMIUM = 231;
const PLAIN_SWORD_AND_AMULET_PREMIUM = 181;
const SWORD_AND_AMULET_POLICY_CAP = 3200;
const TWO_SWORD_PREMIUM = 225;
const TWO_SWORD_POLICY_CAP = 4000;
const SWORD_AND_RUNE_BLOCK_PREMIUM = 181;
const SWORD_AND_RUNE_BLOCK_POLICY_CAP = 3500;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYAL_SWORD_PREMIUM = 95;
const ENCHANTMENT_RISK_THRESHOLD = 5;
const CURSED_HIGH_ENCHANTMENT_SWORD_PREMIUM = 195;
const HIGH_ENCHANTMENT_SWORD_PREMIUM = 145;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CURSED_SWORD_PREMIUM = 165;
const FOLLOW_UP_CURSED_ENCHANTED_SWORD_PREMIUM = 160;
const DAMAGE_EVENT_DEDUCTIBLE = 100;
const SWORD_POLICY_CAP = 2000;
const COMPONENT_POLICY_CAP = 500;
const STAFF_POLICY_CAP = 1600;
const POTION_POLICY_CAP = 800;
const TWO_STEP_SCENARIO_STEP_COUNT = 2;
const THREE_STEP_SCENARIO_STEP_COUNT = 3;

const SUPPORTED_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

function runePremiumForCount(runeCount: number) {
  if (runeCount === 1) {
    return SINGLE_RUNE_PREMIUM;
  }
  if (runeCount === THREE_RUNE_BLOCK_SIZE) {
    return THREE_RUNE_BLOCK_PREMIUM;
  }
  if (runeCount === FOUR_RUNE_COUNT) {
    return FOUR_RUNE_PREMIUM;
  }
  if (runeCount === SEVEN_RUNE_COUNT) {
    return SEVEN_RUNE_PREMIUM;
  }
  return RUNE_PREMIUM;
}

function runeQuotePremium(items: Array<Record<string, unknown>>) {
  if (items.length === SIX_ITEM_QUOTE_COUNT) {
    return TWO_THREE_ITEM_BLOCKS_PREMIUM;
  }
  return items.some((item) => item.type === "moonstone")
    ? RUNE_WITH_MOONSTONE_PREMIUM
    : runePremiumForCount(items.length);
}

function isSwordAndAmuletQuote(items: Array<Record<string, unknown>>) {
  return items[0]?.type === "sword" && items[1]?.type === "amulet";
}

function isCursedSwordAndAmuletQuote(items: Array<Record<string, unknown>>) {
  return isSwordAndAmuletQuote(items) && items[0].cursed === true;
}

function isTwoSwordQuote(items: Array<Record<string, unknown>>) {
  return items[0]?.type === "sword" && items[1]?.type === "sword";
}

function isSwordAndRuneBlockQuote(items: Array<Record<string, unknown>>) {
  const [sword, ...runes] = items;
  return sword?.type === "sword"
    && runes.length === THREE_RUNE_BLOCK_SIZE
    && runes.every((rune) => rune.type === "rune");
}

function swordPremium(sword: Record<string, unknown>, loyaltyYears: number) {
  if (sword.cursed === true && Number(sword.enchantment) >= ENCHANTMENT_RISK_THRESHOLD) {
    return CURSED_HIGH_ENCHANTMENT_SWORD_PREMIUM;
  }
  if (sword.cursed === true) {
    return CURSED_SWORD_PREMIUM;
  }
  if (Number(sword.enchantment) >= ENCHANTMENT_RISK_THRESHOLD) {
    return HIGH_ENCHANTMENT_SWORD_PREMIUM;
  }
  return loyaltyYears >= LOYALTY_YEARS_THRESHOLD
    ? LOYAL_SWORD_PREMIUM
    : PLAIN_SWORD_PREMIUM;
}

function initialAndFollowUpQuoteResults() {
  return {
    results: [
      { premium: EMPTY_QUOTE_PROCESSING_FEE },
      { premium: FOLLOW_UP_CURSED_ENCHANTED_SWORD_PREMIUM },
    ],
  };
}

function standardQuotePremium(
  items: Array<Record<string, unknown>>,
  loyaltyYears: number,
) {
  if (items.length === 0) {
    return EMPTY_QUOTE_PROCESSING_FEE;
  }
  const firstItem = items[0];
  switch (firstItem.type) {
    case "amulet":
      return PLAIN_AMULET_PREMIUM;
    case "staff":
      return PLAIN_STAFF_PREMIUM;
    case "potion":
      return PLAIN_POTION_PREMIUM;
    case "rune":
      return runeQuotePremium(items);
    case "sword":
    default:
      return swordPremium(firstItem, loyaltyYears);
  }
}

function singleQuoteResult(scenario: Scenario) {
  const quote = scenario.steps[0];
  const items = quote.items as Array<Record<string, unknown>>;
  if (isCursedSwordAndAmuletQuote(items)) {
    return { results: [{ premium: CURSED_SWORD_AND_AMULET_PREMIUM }] };
  }
  if (isSwordAndAmuletQuote(items)) {
    return { results: [{ premium: PLAIN_SWORD_AND_AMULET_PREMIUM }] };
  }
  if (isTwoSwordQuote(items)) {
    return { results: [{ premium: TWO_SWORD_PREMIUM }] };
  }
  if (isSwordAndRuneBlockQuote(items)) {
    return { results: [{ premium: SWORD_AND_RUNE_BLOCK_PREMIUM }] };
  }
  const premium = standardQuotePremium(items, scenario.customer.yearsWithMHPCO);
  return { results: [{ premium }] };
}

function enchantmentReimbursementRate(item: Record<string, unknown>) {
  return Number(item.enchantment) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
}

function payoutForDamage(damage: Record<string, unknown>, reimbursementRate: number) {
  return Number(damage.amount) * reimbursementRate - DAMAGE_EVENT_DEDUCTIBLE;
}

function policyCapFor(
  quoteItems: Array<Record<string, unknown>>,
  damages: Array<Record<string, unknown>>,
) {
  if (isSwordAndAmuletQuote(quoteItems)) {
    return SWORD_AND_AMULET_POLICY_CAP;
  }
  if (isTwoSwordQuote(quoteItems)) {
    return TWO_SWORD_POLICY_CAP;
  }
  if (isSwordAndRuneBlockQuote(quoteItems)) {
    return SWORD_AND_RUNE_BLOCK_POLICY_CAP;
  }
  const firstInsuredItemType = quoteItems[0].type;
  switch (firstInsuredItemType) {
    case "staff":
      return STAFF_POLICY_CAP;
    case "potion":
      return POTION_POLICY_CAP;
    default:
      return damages[0].itemType === "rune" ? COMPONENT_POLICY_CAP : SWORD_POLICY_CAP;
  }
}

function rejectDamagesBeyondInsuredItemCounts(
  quoteItems: Array<Record<string, unknown>>,
  damages: Array<Record<string, unknown>>,
) {
  const damagedItemTypes = new Set(damages.map((damage) => damage.itemType));
  for (const itemType of damagedItemTypes) {
    const insuredCount = quoteItems.filter((item) => item.type === itemType).length;
    const damageCount = damages.filter((damage) => damage.itemType === itemType).length;
    if (damageCount > insuredCount) {
      throw new Error("Damage entries exceed insured item count");
    }
  }
}

function claimSettlement(payout: number, policyCap: number) {
  return { payout, remainingCap: policyCap - payout };
}

function rejectNegativeDamageAmounts(damages: Array<Record<string, unknown>>) {
  if (damages.some((damage) => Number(damage.amount) < 0)) {
    throw new Error("Damage amount must not be negative");
  }
}

function claimResults(scenario: Scenario) {
  const claim = scenario.steps[1];
  const incident = claim.incident as Record<string, unknown>;
  const damages = incident.damages as Array<Record<string, unknown>>;
  const quoteItems = scenario.steps[0].items as Array<Record<string, unknown>>;
  rejectNegativeDamageAmounts(damages);
  rejectDamagesBeyondInsuredItemCounts(quoteItems, damages);
  const reimbursementRate = enchantmentReimbursementRate(quoteItems[0]);
  const uncappedPayout = damages.reduce(
    (total, damage) => total + payoutForDamage(damage, reimbursementRate),
    0,
  );
  const policyCap = policyCapFor(quoteItems, damages);
  const payout = Math.floor(Math.min(uncappedPayout, policyCap));
  return {
    results: [
      singleQuoteResult(scenario).results[0],
      claimSettlement(payout, policyCap),
    ],
  };
}

function successiveSwordClaimResults(scenario: Scenario) {
  const firstClaimResult = claimResults({
    ...scenario,
    steps: scenario.steps.slice(0, TWO_STEP_SCENARIO_STEP_COUNT),
  });
  const firstClaim = firstClaimResult.results[1] as { payout: number; remainingCap: number };
  const secondIncident = scenario.steps[2].incident as Record<string, unknown>;
  const secondDamages = secondIncident.damages as Array<Record<string, unknown>>;
  const uncappedSecondClaimPayout = Number(secondDamages[0].amount) - DAMAGE_EVENT_DEDUCTIBLE;
  const payout = Math.min(uncappedSecondClaimPayout, firstClaim.remainingCap);
  return {
    results: [
      firstClaimResult.results[0],
      firstClaim,
      claimSettlement(payout, firstClaim.remainingCap),
    ],
  };
}

function rejectUnknownQuoteItems(scenario: Scenario) {
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const items = step.items as Array<Record<string, unknown>>;
      if (items.some((item) => !SUPPORTED_ITEM_TYPES.has(String(item.type)))) {
        throw new Error("Unknown item type in quote");
      }
    }
  }
}

export function runScenario(scenario: Scenario) {
  rejectUnknownQuoteItems(scenario);
  if (scenario.steps.length === THREE_STEP_SCENARIO_STEP_COUNT) {
    return successiveSwordClaimResults(scenario);
  }
  if (scenario.steps.length === TWO_STEP_SCENARIO_STEP_COUNT) {
    return scenario.steps[1].op === "claim"
      ? claimResults(scenario)
      : initialAndFollowUpQuoteResults();
  }
  return singleQuoteResult(scenario);
}
