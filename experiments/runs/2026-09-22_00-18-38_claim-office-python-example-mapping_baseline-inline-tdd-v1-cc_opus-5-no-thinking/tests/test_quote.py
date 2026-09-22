from scenario import run_scenario


def premium(items, years=0, prior_steps=None):
    steps = list(prior_steps or [])
    steps.append({"op": "quote", "items": items})
    result = run_scenario({"customer": {"yearsWithMHPCO": years}, "steps": steps})
    return result["results"][-1]["premium"]


def test_empty_item_list_costs_only_the_processing_fee():
    assert premium([]) == 5


def test_single_sword_costs_base_premium_plus_fee():
    assert premium([{"type": "sword"}]) == 100 + 10 + 5


def test_single_amulet_costs_base_premium_plus_fee():
    assert premium([{"type": "amulet"}]) == 60 + 6 + 5


def test_single_staff_costs_base_premium_plus_fee():
    assert premium([{"type": "staff"}]) == 80 + 8 + 5


def test_single_potion_costs_base_premium_plus_fee():
    assert premium([{"type": "potion"}]) == 40 + 4 + 5
