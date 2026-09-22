"""The policy base premium: item prices plus the alike-component block."""
import pytest

from office import policy_base_premium


def items(*specs):
    return [{"type": t} for t in specs]


@pytest.mark.parametrize(
    ("count", "expected"),
    [(2, 50), (3, 60), (4, 100), (7, 175)],
)
def test_block_of_three_alike_components(count, expected):
    assert policy_base_premium(items(*["rune"] * count)) == expected


def test_block_requires_the_same_component_type():
    assert policy_base_premium(items("rune", "rune", "moonstone")) == 75


def test_each_component_type_forms_its_own_block():
    assert policy_base_premium(items(*["rune"] * 3, *["moonstone"] * 3)) == 120


def test_main_items_and_components_add_up():
    assert policy_base_premium(items("sword", "rune", "rune", "rune")) == 160
