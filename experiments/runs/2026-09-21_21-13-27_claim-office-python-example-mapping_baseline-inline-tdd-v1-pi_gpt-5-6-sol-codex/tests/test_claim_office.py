# ruff: noqa: PLR2004

import pytest

from claim_office import ClaimOffice, InvalidScenario


def item(kind, **changes):
    value = {"type": kind, "material": "steel", "enchantment": 3, "cursed": False}
    value.update(changes)
    return value


def test_base_prices_components_and_fee():
    assert ClaimOffice(0).quote([])["premium"] == 5
    assert ClaimOffice(0).quote([item("sword"), item("amulet"), item("staff"), item("potion")])["premium"] == 313
    assert ClaimOffice(0).quote([{"type": "rune"}] * 3)["premium"] == 71
    assert ClaimOffice(0).quote([{"type": "rune"}] * 4)["premium"] == 115
    assert ClaimOffice(0).quote([{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3)["premium"] == 137


def test_modifiers_have_the_correct_scope_and_rounding():
    office = ClaimOffice(0)
    assert office.quote([item("sword", cursed=True), item("amulet")])["premium"] == 231
    assert ClaimOffice(0).quote([item("sword", cursed=True)])["premium"] == 165
    loyal = ClaimOffice(3)
    loyal.quote([item("amulet")])
    assert loyal.quote([item("sword", cursed=True, enchantment=7)])["premium"] == 160
    assert ClaimOffice(2).quote([item("sword", cursed=True, enchantment=5)])["premium"] == 175
    # 175 + 17.5 assessment + 5 fee
    assert ClaimOffice(0).quote([{"type": "rune"}] * 7)["premium"] == 198


def test_standard_special_and_multiple_damage_claims():
    office = ClaimOffice(0)
    office.quote([item("sword"), item("amulet")])
    assert office.claim(0, [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]) == {
        "payout": 600,
        "remainingCap": 2600,
    }

    enchanted = ClaimOffice(0)
    enchanted.quote([item("sword", material="dragon", enchantment=9)])
    assert enchanted.claim(0, [{"itemType": "sword", "amount": 1000}])["payout"] == 400


def test_components_claim_normally_and_fraction_rounds_only_at_end():
    office = ClaimOffice(0)
    office.quote([item("sword", enchantment=8), item("amulet", enchantment=8), {"type": "rune"}])
    result = office.claim(0, [
        {"itemType": "sword", "amount": 351},
        {"itemType": "amulet", "amount": 350},
        {"itemType": "rune", "amount": 200},
    ])
    assert result["payout"] == 250  # 75.5 + 75 + 100, finally rounded down


def test_cap_is_shared_by_successive_claims():
    office = ClaimOffice(0)
    office.quote([item("sword")])
    assert office.claim(0, [{"itemType": "sword", "amount": 1500}]) == {"payout": 1400, "remainingCap": 600}
    assert office.claim(0, [{"itemType": "sword", "amount": 1500}]) == {"payout": 600, "remainingCap": 0}


def test_duplicate_inventory_is_matched_once_per_incident():
    office = ClaimOffice(0)
    office.quote([item("sword", enchantment=9), item("sword", enchantment=3)])
    result = office.claim(0, [{"itemType": "sword", "amount": 1000}, {"itemType": "sword", "amount": 1000}])
    assert result["payout"] == 1300
    with pytest.raises(InvalidScenario):
        office.claim(0, [{"itemType": "sword", "amount": 1}] * 3)


@pytest.mark.parametrize("action", [
    lambda office: office.quote([{"type": "broomstick"}]),
    lambda office: office.claim(0, [{"itemType": "amulet", "amount": 200}]),
    lambda office: office.claim(0, [{"itemType": "sword", "amount": -1}]),
])
def test_invalid_operations(action):
    office = ClaimOffice(0)
    office.quote([item("sword")])
    with pytest.raises(InvalidScenario):
        action(office)
