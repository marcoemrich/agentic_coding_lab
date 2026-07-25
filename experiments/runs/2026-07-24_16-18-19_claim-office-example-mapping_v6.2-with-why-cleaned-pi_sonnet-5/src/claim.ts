// Shared shape for any item referenced in claim processing, whether it's
// being reported as damaged or listed as insured on the policy. Damaged-item
// and insured-item inputs previously had two structurally identical
// interfaces (DamagedItemInput / InsuredItemInput); merging them removes
// that duplication and also picks up `cursed`, which claim.spec.ts already
// passes on insured items (e.g. the cursed-sword cap example).
export interface ClaimItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

/** Flat deductible (in G) subtracted from every claim payout. */
const FLAT_DEDUCTIBLE = 100;

const HIGH_ENCHANTMENT_MIN_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursementRateFor = (item: ClaimItemInput): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MIN_LEVEL) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return 1;
};

// Guards against floating-point drift before rounding, so payouts never
// round to the wrong whole gold amount (mirrors roundUpToWholeGold in
// premium.ts, but rounds down since payouts favor MHPCO the opposite way).
const roundDownToWholeGold = (amount: number): number =>
  Math.floor(Number(amount.toFixed(6)));

export const calculatePayout = (
  item: ClaimItemInput,
  amount: number
): number => {
  const reimbursedAmount = amount * reimbursementRateFor(item);
  const payoutBeforeRounding = reimbursedAmount - FLAT_DEDUCTIBLE;
  return roundDownToWholeGold(payoutBeforeRounding);
};

export interface DamageEntry {
  item: ClaimItemInput;
  amount: number;
}

export const calculateTotalPayout = (damages: DamageEntry[]): number => {
  return damages.reduce(
    (sum, { item, amount }) => sum + calculatePayout(item, amount),
    0
  );
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

// Item types outside the named lookup (e.g. rune, moonstone) are priced
// as flat-value components, mirroring the component-vs-named-item split
// used for premiums in premium.ts.
const insuranceValueFor = (item: ClaimItemInput): number =>
  INSURANCE_VALUE_BY_TYPE[item.type] ?? COMPONENT_INSURANCE_VALUE;

const CAP_MULTIPLIER = 2;

export const calculateInsuranceCap = (items: ClaimItemInput[]): number => {
  const insuranceSum = items.reduce(
    (sum, item) => sum + insuranceValueFor(item),
    0
  );
  return insuranceSum * CAP_MULTIPLIER;
};

export interface DamageInput {
  itemType: string;
  amount: number;
}

const countByType = (items: { type: string }[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

// Single place where a DamageInput becomes a full DamageEntry, so both the
// per-type count (used for validation) and the payout calculation read from
// the same derived data instead of re-deriving it from `damages` separately.
const toDamageEntries = (damages: DamageInput[]): DamageEntry[] =>
  damages.map((damage) => ({
    item: { type: damage.itemType },
    amount: damage.amount,
  }));

// Kept separate from the payout math below so processClaim's body reads as
// a single top-to-bottom validation story. Each assertion below checks one
// distinct rule, so a failure message always points at exactly one cause.

// Throws if any damage entry reports a negative amount -- a data-sanity
// check that has nothing to do with whether the item type is insured.
const assertDamageAmountsAreNonNegative = (
  damageEntries: DamageEntry[]
): void => {
  for (const { amount } of damageEntries) {
    if (amount < 0) {
      throw new Error(`Damage amount must not be negative: ${amount}`);
    }
  }
};

// Throws if the claim references more damaged items of a type than the
// policy actually insures.
const assertDamagesAreCovered = (
  insuredItems: ClaimItemInput[],
  damageEntries: DamageEntry[]
): void => {
  const insuredCounts = countByType(insuredItems);
  const damageCounts = countByType(damageEntries.map((entry) => entry.item));
  for (const [type, damagedCount] of damageCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (damagedCount > insuredCount) {
      throw new Error(
        `Claim references ${damagedCount} damaged item(s) of type '${type}', but the policy only insures ${insuredCount}.`
      );
    }
  }
};

export const processClaim = (
  insuredItems: ClaimItemInput[],
  damages: DamageInput[],
  availableCap: number = calculateInsuranceCap(insuredItems)
): ClaimResult => {
  const damageEntries = toDamageEntries(damages);
  assertDamageAmountsAreNonNegative(damageEntries);
  assertDamagesAreCovered(insuredItems, damageEntries);

  const desiredPayout = calculateTotalPayout(damageEntries);
  const payout = Math.min(desiredPayout, availableCap);
  return { payout, remainingCap: availableCap - payout };
};
