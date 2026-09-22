import pytest

from claim import match_damaged_items
from errors import ScenarioError

SWORD = {"type": "sword", "material": "steel", "enchantment": 3}
AMULET = {"type": "amulet", "material": "silver", "enchantment": 2}


def test_a_damage_is_matched_to_the_insured_item_of_that_type():
    damages = [{"itemType": "sword", "amount": 500}]
    assert match_damaged_items([SWORD], damages) == [SWORD]


def test_two_damages_match_two_insured_items_of_the_same_type():
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 300},
    ]
    assert match_damaged_items([SWORD, SWORD], damages) == [SWORD, SWORD]


def test_damage_to_an_item_not_in_the_policy_is_rejected():
    damages = [{"itemType": "amulet", "amount": 200}]
    with pytest.raises(ScenarioError):
        match_damaged_items([SWORD], damages)


def test_more_damages_of_a_type_than_insured_items_is_rejected():
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 300},
    ]
    with pytest.raises(ScenarioError):
        match_damaged_items([SWORD], damages)


def test_damage_with_an_unknown_item_type_is_rejected():
    damages = [{"itemType": "broomstick", "amount": 200}]
    with pytest.raises(ScenarioError):
        match_damaged_items([SWORD], damages)


def test_negative_damage_amount_is_rejected():
    damages = [{"itemType": "sword", "amount": -200}]
    with pytest.raises(ScenarioError):
        match_damaged_items([SWORD], damages)


def test_damages_to_different_insured_types_are_matched_independently():
    damages = [
        {"itemType": "amulet", "amount": 300},
        {"itemType": "sword", "amount": 500},
    ]
    assert match_damaged_items([SWORD, AMULET], damages) == [AMULET, SWORD]
