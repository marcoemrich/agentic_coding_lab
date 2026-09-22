import pytest

from claim_office import ClaimOffice, InputError


def test_component_blocks_are_exact_and_separate_by_type():
    office = ClaimOffice({"yearsWithMHPCO": 0})
    assert office.quote([{"type": "rune"}] * 3)["premium"] == 71

    office = ClaimOffice({"yearsWithMHPCO": 0})
    mixed = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert office.quote(mixed)["premium"] == 137


def test_item_and_policy_modifiers_have_their_own_scope():
    office = ClaimOffice({"yearsWithMHPCO": 0})
    items = [
        {"type": "sword", "cursed": True, "enchantment": 5},
        {"type": "amulet", "cursed": False, "enchantment": 2},
    ]
    # 160 base + 50 curse + 30 enchantment + 16 initial assessment + fee
    assert office.quote(items)["premium"] == 261


def test_loyalty_and_follow_up_contract_discounts():
    office = ClaimOffice({"yearsWithMHPCO": 3})
    assert office.quote([{"type": "potion"}])["premium"] == 41
    assert office.quote([
        {"type": "sword", "cursed": True, "enchantment": 7}
    ])["premium"] == 160


def test_empty_quote_and_upward_rounding():
    assert ClaimOffice({"yearsWithMHPCO": 0}).quote([]) == {"premium": 5}
    office = ClaimOffice({"yearsWithMHPCO": 0})
    # 75 + 25 curse + 7.5 initial + 5 = 112.5, rounded upward
    assert office.quote([
        {"type": "rune", "cursed": True},
        {"type": "rune", "cursed": True},
        {"type": "moonstone"},
    ])["premium"] == 113


def test_claim_standard_high_enchantment_and_dragon_rules():
    office = ClaimOffice({"yearsWithMHPCO": 0})
    office.quote([
        {"type": "sword", "material": "dragon", "enchantment": 9},
        {"type": "amulet", "material": "dragon", "enchantment": 5},
        {"type": "rune"},
    ])
    result = office.claim(0, [
        {"itemType": "sword", "amount": 1000},
        {"itemType": "amulet", "amount": 800},
        {"itemType": "rune", "amount": 200},
    ])
    assert result == {"payout": 1200, "remainingCap": 2500}


def test_each_damage_has_a_deductible_and_duplicate_items_are_matched():
    office = ClaimOffice({"yearsWithMHPCO": 0})
    office.quote([{"type": "sword"}, {"type": "sword"}])
    assert office.claim(0, [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 500},
    ]) == {"payout": 800, "remainingCap": 3200}


def test_claim_cap_is_shared_by_successive_claims():
    office = ClaimOffice({"yearsWithMHPCO": 0})
    office.quote([{"type": "sword"}])
    assert office.claim(0, [{"itemType": "sword", "amount": 1500}]) == {
        "payout": 1400, "remainingCap": 600
    }
    assert office.claim(0, [{"itemType": "sword", "amount": 1500}]) == {
        "payout": 600, "remainingCap": 0
    }


def test_invalid_item_damage_amount_and_excess_damage_are_rejected():
    office = ClaimOffice({"yearsWithMHPCO": 0})
    with pytest.raises(InputError):
        office.quote([{"type": "broomstick"}])
    office.quote([{"type": "sword"}])
    with pytest.raises(InputError):
        office.claim(0, [{"itemType": "sword", "amount": -1}])
    with pytest.raises(InputError):
        office.claim(0, [{"itemType": "amulet", "amount": 1}])
    with pytest.raises(InputError):
        office.claim(0, [
            {"itemType": "sword", "amount": 1},
            {"itemType": "sword", "amount": 1},
        ])
