import json
import sys

from office import claim_policy, create_policy, quote_premium


def main():
    scenario = json.load(sys.stdin)
    years_with_mhpco = scenario["customer"]["yearsWithMHPCO"]
    results = []
    policies = {}
    quote_count = 0
    for step_index, step in enumerate(scenario["steps"]):
        if step["op"] == "quote":
            results.append(
                {
                    "premium": quote_premium(
                        step["items"], years_with_mhpco, quote_count > 0
                    )
                }
            )
            policies[step_index] = create_policy(step["items"])
            quote_count += 1
        else:
            policy = policies[step["policy"]]
            results.append(claim_policy(policy, step["incident"]["damages"]))
    json.dump({"results": results}, sys.stdout)


if __name__ == "__main__":
    try:
        main()
    except (KeyError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        sys.exit(1)
