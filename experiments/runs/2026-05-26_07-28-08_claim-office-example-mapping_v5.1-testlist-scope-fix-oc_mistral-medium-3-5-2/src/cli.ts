import { readFileSync } from "fs";

const input = readFileSync(0, "utf-8");
const scenario = JSON.parse(input);

const basePremiums = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const insuranceValues = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

let quoteCount = 0;
const policies: { insuranceSum: number; cap: number; remainingCap: number; itemCounts: Record<string, number>; items: Array<{type: string; enchantment?: number; material?: string}> }[] = [];

const results = scenario.steps.map((step) => {
  if (step.op === "quote") {
    if (step.items.length === 0) return { premium: 5 };
    
    quoteCount++;
    
    let policyBase = 0;
    let itemModifiers = 0;
    const componentCounts = { rune: 0, moonstone: 0 };
    let insuranceSum = 0;
    
    const itemCounts: Record<string, number> = {};
    const items: Array<{type: string; enchantment?: number; material?: string}> = [];
    
    for (const item of step.items) {
      const type = item.type;
      const base = basePremiums[type];
      const insuranceValue = insuranceValues[type];
      if (base === undefined || insuranceValue === undefined) {
        process.stderr.write(`Error: unknown item type '${type}'\n`);
        process.exit(1);
      }
      
      insuranceSum += insuranceValue;
      itemCounts[type] = (itemCounts[type] || 0) + 1;
      items.push({ type, enchantment: item.enchantment, material: item.material });
      
      if (type === "rune" || type === "moonstone") {
        componentCounts[type]++;
        continue;
      }
      
      policyBase += base;
      
      if (item.cursed) {
        itemModifiers += base * 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        itemModifiers += base * 0.3;
      }
    }
    
    for (const [type, count] of Object.entries(componentCounts)) {
      if (count === 0) continue;
      const base = basePremiums[type];
      if (count % 3 === 0) {
        policyBase += (count / 3) * 60;
      } else {
        policyBase += count * base;
      }
    }
    
    let total = policyBase + itemModifiers;
    
    total += policyBase * 0.1;
    
    if (scenario.customer.yearsWithMHPCO >= 2) {
      total -= policyBase * 0.2;
    }
    
    if (quoteCount > 1) {
      total -= policyBase * 0.15;
    }
    
    total += 5;
    
    const premium = Math.floor(total + 0.5);
    
    const cap = insuranceSum * 2;
    policies.push({ insuranceSum, cap, remainingCap: cap, itemCounts, items });
    
    return { premium };
  }
  
  if (step.op === "claim") {
    const policy = policies[step.policy];
    if (!policy) {
      process.stderr.write(`Error: policy ${step.policy} not found\n`);
      process.exit(1);
    }
    
    const damageCounts: Record<string, number> = {};
    for (const damage of step.incident.damages) {
      const itemType = damage.itemType;
      damageCounts[itemType] = (damageCounts[itemType] || 0) + 1;
    }
    
    for (const [itemType, count] of Object.entries(damageCounts)) {
      const policyCount = policy.itemCounts[itemType] || 0;
      if (count > policyCount) {
        process.stderr.write(`Error: claim has ${count} damages for '${itemType}' but policy only covers ${policyCount}\n`);
        process.exit(1);
      }
    }
    
    let totalPayout = 0;
    
    for (const damage of step.incident.damages) {
      const itemType = damage.itemType;
      const amount = damage.amount;
      
      if (amount < 0) {
        process.stderr.write("Error: negative damage amount\n");
        process.exit(1);
      }
      
      let reimbursement = amount;
      
      const policyItem = policy.items.find(item => item.type === itemType);
      
      if (policyItem) {
        if (policyItem.enchantment !== undefined && policyItem.enchantment >= 8) {
          reimbursement = amount * 0.5;
        } else if (policyItem.material === "dragon") {
          reimbursement = amount;
        }
      }
      
      reimbursement -= 100;
      
      if (reimbursement < 0) reimbursement = 0;
      
      totalPayout += reimbursement;
    }
    
    if (totalPayout > policy.remainingCap) {
      totalPayout = policy.remainingCap;
    }
    
    const remainingCap = policy.remainingCap - totalPayout;
    policies[step.policy].remainingCap = remainingCap;
    
    const payout = Math.floor(totalPayout);
    
    return { payout, remainingCap };
  }
  
  return {};
});

console.log(JSON.stringify({ results }));
