import { quote } from "./quote.js";
import { claim } from "./claim.js";
export function processScenario(input) {
    const results = [];
    const policies = [];
    let contractNumber = 0;
    for (const step of input.steps) {
        if (step.op === "quote") {
            contractNumber++;
            const quoteResult = quote(step.items, input.customer, contractNumber);
            policies.push({
                items: step.items,
                insuranceSum: quoteResult.insuranceSum,
                cap: 2 * quoteResult.insuranceSum,
                remainingCap: 2 * quoteResult.insuranceSum,
                premium: quoteResult.premium,
            });
            results.push({ premium: quoteResult.premium });
        }
        else {
            const policy = policies[step.policy];
            if (policy === undefined) {
                throw new Error(`invalid policy index: ${step.policy}`);
            }
            const claimResult = claim({ policy, damages: step.incident.damages });
            policies[step.policy] = { ...policy, remainingCap: claimResult.remainingCap };
            results.push(claimResult);
        }
    }
    return { results };
}
