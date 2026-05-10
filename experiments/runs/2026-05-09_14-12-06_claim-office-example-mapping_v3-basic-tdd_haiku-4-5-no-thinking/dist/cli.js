import { calculateQuote } from './quote.js';
import { calculateClaim } from './claim.js';
function calculateInsuranceSum(items) {
    const ITEM_VALUES = {
        sword: 1000,
        amulet: 600,
        staff: 800,
        potion: 400,
    };
    const COMPONENT_VALUE = 250;
    let sum = 0;
    for (const item of items) {
        if (ITEM_VALUES[item.type] !== undefined) {
            sum += ITEM_VALUES[item.type];
        }
        else if (item.type === 'rune' || item.type === 'moonstone') {
            sum += COMPONENT_VALUE;
        }
        else {
            throw new Error(`Unknown item type: ${item.type}`);
        }
    }
    return sum;
}
async function main() {
    try {
        let input = '';
        // Read from stdin
        const stdin = process.stdin;
        stdin.setEncoding('utf8');
        for await (const chunk of stdin) {
            input += chunk;
        }
        const scenario = JSON.parse(input);
        const results = [];
        const policies = [];
        for (const step of scenario.steps) {
            if (step.op === 'quote') {
                // Validate items
                for (const item of step.items) {
                    const validTypes = ['sword', 'amulet', 'staff', 'potion', 'rune', 'moonstone'];
                    if (!validTypes.includes(item.type)) {
                        throw new Error(`Unknown item type: ${item.type}`);
                    }
                }
                const premium = calculateQuote({
                    customer: scenario.customer,
                    items: step.items,
                    isFirstInsurance: policies.length === 0,
                });
                const insuranceSum = calculateInsuranceSum(step.items);
                policies.push({
                    items: step.items,
                    insuranceSum,
                    remainingCap: insuranceSum * 2,
                });
                results.push({ premium });
            }
            else if (step.op === 'claim') {
                if (step.policy < 0 || step.policy >= policies.length) {
                    throw new Error(`Invalid policy index: ${step.policy}`);
                }
                const policy = policies[step.policy];
                const claimResult = calculateClaim({
                    policy: {
                        items: policy.items,
                        insuranceSum: policy.insuranceSum,
                        remainingCap: policy.remainingCap,
                    },
                    damages: step.incident.damages,
                });
                // Update remaining cap for this policy
                policy.remainingCap = claimResult.remainingCap;
                results.push({
                    payout: claimResult.payout,
                    remainingCap: claimResult.remainingCap,
                });
            }
        }
        const output = { results };
        console.log(JSON.stringify(output));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(String(error));
        }
        process.exit(1);
    }
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
