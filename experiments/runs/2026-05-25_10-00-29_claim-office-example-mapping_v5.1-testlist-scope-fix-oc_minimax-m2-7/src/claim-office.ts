interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: Array<{
    op: "quote";
    items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>;
  } | {
    op: "claim";
    policy: number;
    incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
  }>;
}

const BASE_PREMIUMS: Record<string, number> = {
    sword: 100,
    amulet: 60,
    staff: 80,
    potion: 40,
    rune: 25,
    moonstone: 25,
  };

  const INSURANCE_VALUES: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
    rune: 250,
    moonstone: 250,
  };

  const BLOCK_SIZE = 3;
  const BLOCK_PREMIUM = 60;
  const CURSED_SURCHARGE = 50;
  const HIGH_ENCHANTMENT_THRESHOLD = 5;
  const HIGH_ENCHANTMENT_SURCHARGE = 30;
  const FIRST_INSURANCE_SURCHARGE = 10;
  const LOYALTY_DISCOUNT = 20;
  const LOYALTY_YEARS_THRESHOLD = 2;
  const FOLLOWUP_DISCOUNT = 15;
  const PROCESSING_FEE = 5;
  const DEDUCTIBLE = 100;
  const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

  function calculateComponentPremium(items: Array<{ type: string }>): number {
    const byType = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let premium = 0;
    for (const [type, count] of Object.entries(byType)) {
      const remainder = count % BLOCK_SIZE;
      const useBlock = remainder === 0 && count >= BLOCK_SIZE;
      if (useBlock) {
        premium += (count / BLOCK_SIZE) * BLOCK_PREMIUM;
      } else {
        premium += count * (BASE_PREMIUMS[type] ?? 0);
      }
    }
    return premium;
  }

  function calculateQuotePremium(items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, quoteIndex: number, customerYears: number): number {
    if (items.length === 0) {
      return 5;
    }

    let policyBasePremium = 0;
    let itemSpecificTotal = 0;

    for (const item of items) {
      const basePremium = BASE_PREMIUMS[item.type] ?? 0;
      policyBasePremium += basePremium;

      let itemPremium = basePremium;
      if (item.cursed) {
        itemPremium += basePremium * CURSED_SURCHARGE / 100;
      }
      if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemPremium += basePremium * HIGH_ENCHANTMENT_SURCHARGE / 100;
      }
      itemSpecificTotal += itemPremium;
    }

    const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_SURCHARGE / 100;
    const followupDiscount = quoteIndex > 0 ? policyBasePremium * FOLLOWUP_DISCOUNT / 100 : 0;
    const loyaltyDiscount = customerYears >= LOYALTY_YEARS_THRESHOLD ? policyBasePremium * LOYALTY_DISCOUNT / 100 : 0;

    let premium = itemSpecificTotal + firstInsuranceSurcharge - followupDiscount - loyaltyDiscount + PROCESSING_FEE;
    return Math.ceil(premium);
  }

export function processScenario(input: ScenarioInput): { results: unknown[] } {
  const results: unknown[] = [];
  const policies: Array<{ items: Array<{ type: string; material?: string; enchantment?: number }>; insuranceSum: number; cap: number }> = [];

  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];
    if (step.op === "quote") {
      const premium = calculateQuotePremium(step.items, i, input.customer.yearsWithMHPCO);
      const insuranceSum = step.items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 250), 0);
      policies.push({ items: step.items, insuranceSum, cap: insuranceSum * 2 });
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Invalid policy index: ${step.policy}`);
      }

      let totalPayout = 0;
      for (const damage of step.incident.damages) {
        const policyItem = policy.items.find(item => item.type === damage.itemType);
        let payout = damage.amount;

        if (policyItem && policyItem.enchantment !== undefined && policyItem.enchantment >= 8) {
          payout = damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE;
        }

        if (damage.amount >= 100) {
          payout -= DEDUCTIBLE;
        }

        totalPayout += payout;
      }

      totalPayout = Math.min(totalPayout, policy.cap);
      policy.cap -= totalPayout;

      results.push({ payout: Math.floor(totalPayout), remainingCap: policy.cap });
    }
  }
  return { results };
}