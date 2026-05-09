import { Customer, Item, ItemType, Damage, Policy } from './types.js';

const BASE_PREMIUMS: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25
};

const INSURANCE_VALUES: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250
};

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const CURSED_SURCHARGE = 0.50;
const ENCHANTMENT_SURCHARGE = 0.30;
const LOYALTY_DISCOUNT = 0.20;
const FIRST_INSURANCE_SURCHARGE = 0.10;
const SUBSEQUENT_DISCOUNT = 0.15;

export class MHPCO {
  private customer: Customer;
  private policies: Policy[] = [];
  private quoteCount = 0;

  constructor(customer: Customer) {
    this.customer = customer;
  }

  quote(items: Item[]): number {
    const isFirstQuote = this.quoteCount === 0;
    this.quoteCount++;

    // Calculate base premium
    let basePremium = this.calculateBasePremium(items);

    // Apply surcharges and discounts
    let premium = basePremium;

    // Apply per-item surcharges multiplicatively
    for (const item of items) {
      let itemMultiplier = 1;

      // Cursed surcharge
      if (item.cursed) {
        itemMultiplier *= (1 + CURSED_SURCHARGE);
      }

      // Highly enchanted surcharge
      if (item.enchantment >= ENCHANTMENT_SURCHARGE_THRESHOLD) {
        itemMultiplier *= (1 + ENCHANTMENT_SURCHARGE);
      }

      premium += (BASE_PREMIUMS[item.type] * itemMultiplier - BASE_PREMIUMS[item.type]);
    }

    // Apply loyalty discount
    if (this.customer.yearsWithMHPCO >= 2) {
      premium *= (1 - LOYALTY_DISCOUNT);
    }

    // Apply first insurance surcharge only for brand new customers on first quote
    if (isFirstQuote && this.customer.yearsWithMHPCO === 0) {
      premium *= (1 + FIRST_INSURANCE_SURCHARGE);
    } else if (!isFirstQuote) {
      // Apply subsequent contract discount
      premium *= (1 - SUBSEQUENT_DISCOUNT);
    }

    // Add processing fee
    premium += PROCESSING_FEE;

    // Round up in MHPCO's favor (handle floating point precision)
    // Add a small epsilon before ceiling to handle floating point errors
    const finalPremium = Math.ceil(premium - 1e-9);

    // Store policy
    const insuranceValue = items.reduce((sum, item) => {
      const baseValue = INSURANCE_VALUES[item.type];
      return sum + baseValue;
    }, 0);

    this.policies.push({
      items,
      insuranceValue,
      premiumPaid: finalPremium,
      paidOut: 0
    });

    return finalPremium;
  }

  claim(policyIndex: number, damages: Damage[]): { payout: number; remainingCap: number } {
    const policy = this.policies[policyIndex];
    if (!policy) {
      throw new Error(`Policy not found at index ${policyIndex}`);
    }

    // Calculate total damage
    let totalDamage = 0;
    for (const damage of damages) {
      const item = policy.items.find(i => i.type === damage.itemType);
      if (!item) {
        throw new Error(`Item ${damage.itemType} not found in policy`);
      }

      let reimbursement = damage.amount;

      // Check for high enchantment (>= 8): 50% reimbursement
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        reimbursement = damage.amount * 0.5;
      }

      // Check for dragon material: 100% reimbursement (full amount)
      // Dragon material means full reimbursement, which is already the default
      if (item.material === 'dragon') {
        reimbursement = damage.amount;
      }

      totalDamage += reimbursement;
    }

    // Apply deductible
    const adjustedDamage = Math.max(0, totalDamage - DEDUCTIBLE);

    // Calculate remaining cap
    const cap = policy.insuranceValue * 2;
    const remainingCap = cap - policy.paidOut;
    const payout = Math.min(adjustedDamage, remainingCap);

    // Update policy
    policy.paidOut += payout;

    return {
      payout,
      remainingCap: cap - policy.paidOut
    };
  }

  private calculateBasePremium(items: Item[]): number {
    // Group components
    const itemsByType = new Map<ItemType, Item[]>();
    for (const item of items) {
      if (!itemsByType.has(item.type)) {
        itemsByType.set(item.type, []);
      }
      itemsByType.get(item.type)!.push(item);
    }

    let total = 0;

    for (const [type, typeItems] of itemsByType) {
      if (this.isComponent(type)) {
        // Handle component grouping
        const groups = Math.floor(typeItems.length / 3);
        const remaining = typeItems.length % 3;

        // Groups of 3: special price of 60G
        total += groups * 60;

        // Remaining components: 25G each
        total += remaining * BASE_PREMIUMS[type];
      } else {
        // Regular items: sum of base premiums
        total += typeItems.reduce((sum, item) => sum + BASE_PREMIUMS[type], 0);
      }
    }

    return total;
  }

  private isComponent(type: ItemType): boolean {
    return type === 'rune' || type === 'moonstone';
  }
}
