import json
import sys

from claim_office import claim_payout, initial_policy_cap, quote_premium


def execute_quote(step, years_with_mhpco, is_followup):
    items = step["items"]
    result = {
        "premium": quote_premium(items, years_with_mhpco, is_followup=is_followup)
    }
    policy = {"items": items, "remainingCap": initial_policy_cap(items)}
    return result, policy


def execute_claim(step, policies_by_quote_step):
    policy = policies_by_quote_step[step["policy"]]
    payout, remaining_cap = claim_payout(
        policy["items"], step["incident"]["damages"], policy["remainingCap"]
    )
    policy["remainingCap"] = remaining_cap
    return {"payout": payout, "remainingCap": remaining_cap}


def process_scenario(scenario):
    years_with_mhpco = scenario["customer"]["yearsWithMHPCO"]
    results = []
    policies_by_quote_step = {}
    quote_count = 0
    for step_index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            result, policy = execute_quote(
                step, years_with_mhpco, is_followup=quote_count > 0
            )
            policies_by_quote_step[step_index] = policy
            quote_count += 1
        else:
            result = execute_claim(step, policies_by_quote_step)
        results.append(result)
    return {"results": results}


def main():
    scenario = json.load(sys.stdin)
    json.dump(process_scenario(scenario), sys.stdout)


if __name__ == "__main__":
    main()
