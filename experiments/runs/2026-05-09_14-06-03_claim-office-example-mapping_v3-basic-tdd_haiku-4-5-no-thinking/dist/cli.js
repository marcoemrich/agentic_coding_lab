import { calculateQuote } from './quotes.js';
import { calculateClaim } from './claims.js';
async function main() {
    try {
        const input = await readStdin();
        const scenario = JSON.parse(input);
        const results = [];
        const policies = [];
        for (const step of scenario.steps) {
            if (step.op === 'quote') {
                try {
                    const premium = calculateQuote(scenario.customer, step.items);
                    results.push({ premium });
                    // Store policy for future claims
                    const insuranceSum = calculatePolicyInsuranceSum(step.items);
                    policies.push({
                        items: step.items,
                        remainingCap: insuranceSum * 2,
                    });
                }
                catch (error) {
                    console.error(`Error processing quote: ${error instanceof Error ? error.message : String(error)}`);
                    process.exit(1);
                }
            }
            else if (step.op === 'claim') {
                try {
                    const policyIndex = step.policy;
                    if (policyIndex < 0 || policyIndex >= policies.length) {
                        throw new Error(`Invalid policy index: ${policyIndex}`);
                    }
                    const policy = policies[policyIndex];
                    const result = calculateClaim(policy, step.incident.damages);
                    results.push(result);
                    // Update remaining cap for future claims on same policy
                    policy.remainingCap = result.remainingCap;
                }
                catch (error) {
                    console.error(`Error processing claim: ${error instanceof Error ? error.message : String(error)}`);
                    process.exit(1);
                }
            }
        }
        const output = { results };
        console.log(JSON.stringify(output));
    }
    catch (error) {
        console.error(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
function calculatePolicyInsuranceSum(items) {
    const ITEM_INSURANCE_VALUES = {
        sword: 1000,
        amulet: 600,
        staff: 800,
        potion: 400,
    };
    const COMPONENT_INSURANCE_VALUE = 250;
    let total = 0;
    for (const item of items) {
        if (item.type in ITEM_INSURANCE_VALUES) {
            total += ITEM_INSURANCE_VALUES[item.type];
        }
        else {
            // Components
            total += COMPONENT_INSURANCE_VALUE;
        }
    }
    return total;
}
function readStdin() {
    return new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
        });
        process.stdin.on('end', () => {
            resolve(data);
        });
        process.stdin.on('error', reject);
    });
}
main();
