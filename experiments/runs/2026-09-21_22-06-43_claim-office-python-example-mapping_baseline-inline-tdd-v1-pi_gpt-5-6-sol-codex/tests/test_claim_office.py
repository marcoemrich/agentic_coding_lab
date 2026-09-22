import pytest

from claim_office import ClaimOffice, InvalidScenario, premium_for


def test_base_prices_components_and_processing_fee():
    assert premium_for([], years_with_mhpco=0, contract_number=1) == 5
    assert premium_for([{"type": "sword"}], years_with_mhpco=0, contract_number=1) == 115
    assert premium_for([{"type": "rune"}] * 2, years_with_mhpco=0, contract_number=1) == 60
    assert premium_for([{"type": "rune"}] * 3, years_with_mhpco=0, contract_number=1) == 71
    assert premium_for([{"type": "rune"}] * 4, years_with_mhpco=0, contract_number=1) == 115
    assert premium_for([{"type": "rune"}] * 7, years_with_mhpco=0, contract_number=1) == 198
    assert premium_for([{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3,
                       years_with_mhpco=0, contract_number=1) == 137


def test_modifiers_have_item_and_policy_scope_and_round_up():
    items = [
        {"type": "sword", "cursed": True, "enchantment": 5},
        {"type": "amulet", "cursed": False, "enchantment": 2},
    ]
    # base 160 + sword surcharges 80 + first 16 + fee
    assert premium_for(items, years_with_mhpco=0, contract_number=1) == 261
    # same, with loyalty -32 and follow-up -24
    assert premium_for(items, years_with_mhpco=2, contract_number=2) == 205
    # 7 runes: 175 + 17.5 + 5 => 197.5, rounded in the office's favor
    assert premium_for([{"type": "rune"}] * 7, years_with_mhpco=0, contract_number=1) == 198


def test_unknown_item_is_rejected():
    with pytest.raises(InvalidScenario):
        premium_for([{"type": "broomstick"}], years_with_mhpco=0, contract_number=1)


def test_claim_rules_deductibles_and_enchantment_precedence():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [
                {"type": "sword", "material": "dragon", "enchantment": 9},
                {"type": "sword", "material": "dragon", "enchantment": 5},
                {"type": "rune"},
            ]},
            {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [
                {"itemType": "sword", "amount": 1000},
                {"itemType": "sword", "amount": 800},
                {"itemType": "rune", "amount": 200},
            ]}},
        ],
    }
    results = ClaimOffice().process(scenario)
    # (50% of 1000)-100 + 800-100 + 200-100
    assert results[1] == {"payout": 1200, "remainingCap": 3300}


def test_deductible_is_per_damage_and_fractional_payout_rounds_once_down():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [
                {"type": "sword", "enchantment": 8},
                {"type": "amulet"},
            ]},
            {"op": "claim", "policy": 0, "incident": {"cause": "attack", "damages": [
                {"itemType": "sword", "amount": 501},
                {"itemType": "amulet", "amount": 300},
            ]}},
        ],
    }
    # 250.5 - 100, plus 300 - 100 = 350.5, rounded down.
    assert ClaimOffice().process(scenario)[1]["payout"] == 350


def test_policy_cap_is_based_on_values_and_is_exhausted_across_claims():
    scenario = {
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "cursed": True}]},
            {"op": "claim", "policy": 0, "incident": {"cause": "a", "damages": [
                {"itemType": "sword", "amount": 1500},
            ]}},
            {"op": "claim", "policy": 0, "incident": {"cause": "b", "damages": [
                {"itemType": "sword", "amount": 1500},
            ]}},
        ],
    }
    assert ClaimOffice().process(scenario) == [
        {"premium": 145},
        {"payout": 1400, "remainingCap": 600},
        {"payout": 600, "remainingCap": 0},
    ]


def test_claim_rejects_uninsured_excess_unknown_and_negative_damage():
    base = {"customer": {"yearsWithMHPCO": 0}, "steps": [
        {"op": "quote", "items": [{"type": "sword"}]},
    ]}
    bad_damages = [
        [{"itemType": "amulet", "amount": 10}],
        [{"itemType": "sword", "amount": 10}, {"itemType": "sword", "amount": 20}],
        [{"itemType": "broomstick", "amount": 10}],
        [{"itemType": "sword", "amount": -200}],
    ]
    for damages in bad_damages:
        scenario = {**base, "steps": base["steps"] + [
            {"op": "claim", "policy": 0,
             "incident": {"cause": "test", "damages": damages}},
        ]}
        with pytest.raises(InvalidScenario):
            ClaimOffice().process(scenario)


def test_malformed_operations_and_policy_references_are_rejected():
    invalid_scenarios = [
        {"customer": {"yearsWithMHPCO": "two"}, "steps": []},
        {"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "dance"}]},
        {"customer": {"yearsWithMHPCO": 0}, "steps": [
            {"op": "quote", "items": [{"type": "sword", "cursed": "yes"}]},
        ]},
        {"customer": {"yearsWithMHPCO": 0}, "steps": [
            {"op": "claim", "policy": 0,
             "incident": {"cause": "fire", "damages": []}},
        ]},
        {"customer": {"yearsWithMHPCO": 0}, "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "claim", "policy": 0, "incident": {"damages": []}},
        ]},
    ]
    for scenario in invalid_scenarios:
        with pytest.raises(InvalidScenario):
            ClaimOffice().process(scenario)


def test_followup_contract_is_determined_by_prior_quotes():
    scenario = {"customer": {"yearsWithMHPCO": 3}, "steps": [
        {"op": "quote", "items": []},
        {"op": "quote", "items": [
            {"type": "sword", "cursed": True, "enchantment": 7},
        ]},
    ]}
    assert ClaimOffice().process(scenario) == [{"premium": 5}, {"premium": 160}]
