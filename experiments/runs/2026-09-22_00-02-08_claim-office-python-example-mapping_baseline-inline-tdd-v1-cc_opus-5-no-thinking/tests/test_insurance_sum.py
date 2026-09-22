import pytest

from errors import ScenarioError
from policy import insurance_sum


def test_sword_insurance_value():
    assert insurance_sum([{"type": "sword"}]) == 1000


def test_insurance_sum_of_a_sword_and_an_amulet():
    assert insurance_sum([{"type": "sword"}, {"type": "amulet"}]) == 1600


def test_two_swords_are_insured_twice():
    assert insurance_sum([{"type": "sword"}, {"type": "sword"}]) == 2000


def test_block_discount_does_not_reduce_the_insurance_sum():
    items = [{"type": "sword"}] + [{"type": "rune"} for _ in range(3)]
    assert insurance_sum(items) == 1750


def test_unknown_item_type_is_rejected():
    with pytest.raises(ScenarioError):
        insurance_sum([{"type": "broomstick"}])
