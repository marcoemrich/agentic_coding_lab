from scenario import run_scenario
from test_claim import damage, sword


def run(items, incidents, years=0):
    steps = [{"op": "quote", "items": items}]
    for damages in incidents:
        steps.append({"op": "claim", "policy": 0,
                      "incident": {"cause": "dragon", "damages": damages}})
    scenario = {"customer": {"yearsWithMHPCO": years}, "steps": steps}
    return run_scenario(scenario)["results"]


def test_successive_claims_draw_down_a_shared_cap():
    results = run([sword()], [[damage("sword", 1500)], [damage("sword", 1500)]])
    assert results[1] == {"payout": 1400, "remainingCap": 600}
    assert results[2] == {"payout": 600, "remainingCap": 0}


def test_the_cap_is_twice_the_summed_insurance_values():
    results = run([sword(), {"type": "amulet"}], [[damage("sword", 100)]])
    assert results[1]["remainingCap"] == 3200


def test_premium_modifiers_do_not_raise_the_cap():
    results = run([sword(cursed=True)], [[damage("sword", 100)]])
    assert results[1]["remainingCap"] == 2000


def test_the_block_discount_does_not_shrink_the_insurance_sum():
    items = [sword()] + [{"type": "rune"} for _ in range(3)]
    results = run(items, [[damage("sword", 100)]])
    assert results[1]["remainingCap"] == 3500


def test_two_swords_are_insured_and_damaged_separately():
    items = [sword(), sword()]
    damages = [damage("sword", 500), damage("sword", 500)]
    results = run(items, [damages])
    assert results[1] == {"payout": 800, "remainingCap": 4000 - 800}
