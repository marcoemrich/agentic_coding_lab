import pytest

from claim_office import ClaimOfficeError, process_scenario


def scenario(steps, years=0):
    return {"customer": {"yearsWithMHPCO": years}, "steps": steps}


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages):
    return {
        "op": "claim",
        "policy": policy,
        "incident": {"cause": "mishap", "damages": damages},
    }


def item(item_type, **attributes):
    return {"type": item_type, **attributes}


def damage(item_type, amount):
    return {"itemType": item_type, "amount": amount}


@pytest.mark.parametrize(
    ("item_type", "premium"),
    [("sword", 115), ("amulet", 71), ("staff", 93), ("potion", 49)],
)
def test_main_item_base_premium_initial_assessment_and_fee(item_type, premium):
    assert process_scenario(scenario([quote([item(item_type)])])) == {
        "results": [{"premium": premium}]
    }


def test_empty_quote_only_costs_processing_fee():
    assert process_scenario(scenario([quote([])]))["results"][0]["premium"] == 5


@pytest.mark.parametrize(
    ("count", "expected"), [(2, 60), (3, 71), (4, 115), (7, 198)]
)
def test_component_block_requires_exactly_three_alike(count, expected):
    items = [item("rune") for _ in range(count)]
    assert process_scenario(scenario([quote(items)]))["results"][0]["premium"] == expected


def test_blocks_are_separate_by_component_type():
    items = [item("rune") for _ in range(3)] + [item("moonstone") for _ in range(3)]
    assert process_scenario(scenario([quote(items)]))["results"][0]["premium"] == 137


def test_item_modifiers_only_apply_to_affected_item():
    items = [item("sword", cursed=True), item("amulet")]
    assert process_scenario(scenario([quote(items)]))["results"][0]["premium"] == 231


def test_modifier_thresholds_stack_and_round_up_only_at_end():
    items = [item("sword", cursed=True, enchantment=5)]
    assert process_scenario(scenario([quote(items)]))["results"][0]["premium"] == 195


def test_loyalty_applies_at_exactly_two_years():
    assert process_scenario(scenario([quote([item("sword")])], years=2))["results"][0] == {
        "premium": 95
    }


def test_followup_contract_discount_and_first_insurance_both_apply():
    steps = [quote([]), quote([item("sword", cursed=True, enchantment=7)])]
    assert process_scenario(scenario(steps, years=3))["results"][1] == {"premium": 160}


def test_standard_and_high_enchantment_claims_with_deductibles():
    steps = [
        quote([item("sword", material="steel", enchantment=3), item("amulet", enchantment=8)]),
        claim(0, [damage("sword", 500), damage("amulet", 701)]),
    ]
    assert process_scenario(scenario(steps))["results"][1] == {
        "payout": 650,
        "remainingCap": 2550,
    }


def test_dragon_material_does_not_override_high_enchantment_clause():
    steps = [
        quote([item("sword", material="dragon", enchantment=9)]),
        claim(0, [damage("sword", 1000)]),
    ]
    assert process_scenario(scenario(steps))["results"][1]["payout"] == 400


def test_dragon_item_below_high_threshold_is_fully_reimbursed():
    steps = [
        quote([item("sword", material="dragon", enchantment=5)]),
        claim(0, [damage("sword", 800)]),
    ]
    assert process_scenario(scenario(steps))["results"][1]["payout"] == 700


def test_each_damage_has_a_deductible_and_duplicate_items_are_supported():
    steps = [
        quote([item("sword"), item("sword")]),
        claim(0, [damage("sword", 500), damage("sword", 500)]),
    ]
    assert process_scenario(scenario(steps))["results"][1] == {
        "payout": 800,
        "remainingCap": 3200,
    }


def test_component_claim_uses_standard_reimbursement():
    steps = [quote([item("rune")]), claim(0, [damage("rune", 200)])]
    assert process_scenario(scenario(steps))["results"][1]["payout"] == 100


def test_policy_cap_is_based_on_values_and_exhausts_across_claims():
    steps = [
        quote([item("sword", cursed=True)]),
        claim(0, [damage("sword", 1500)]),
        claim(0, [damage("sword", 1500)]),
    ]
    assert process_scenario(scenario(steps))["results"][1:] == [
        {"payout": 1400, "remainingCap": 600},
        {"payout": 600, "remainingCap": 0},
    ]


def test_component_discount_does_not_reduce_insurance_sum():
    steps = [quote([item("sword"), item("rune"), item("rune"), item("rune")])]
    # Exercise the cap with no damage so it remains twice 1750.
    steps.append(claim(0, []))
    assert process_scenario(scenario(steps))["results"][1]["remainingCap"] == 3500


@pytest.mark.parametrize(
    "steps",
    [
        [quote([item("broomstick")])],
        [quote([item("sword")]), claim(0, [damage("amulet", 100)])],
        [quote([item("sword")]), claim(0, [damage("sword", -200)])],
        [quote([item("sword")]), claim(0, [damage("sword", 100), damage("sword", 100)])],
        [claim(0, [])],
    ],
)
def test_invalid_scenarios_are_rejected(steps):
    with pytest.raises(ClaimOfficeError):
        process_scenario(scenario(steps))
