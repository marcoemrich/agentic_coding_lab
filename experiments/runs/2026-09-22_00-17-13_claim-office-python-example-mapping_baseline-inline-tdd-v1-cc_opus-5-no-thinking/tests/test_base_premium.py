import pytest

from premium import base_premium


def item(type_, **kwargs):
    return {"type": type_, **kwargs}


def components(type_, count):
    return [item(type_) for _ in range(count)]


@pytest.mark.parametrize(
    ("count", "expected"),
    [(1, 25), (2, 50), (3, 60), (4, 100), (7, 175)],
)
def test_block_of_three_alike_components(count, expected):
    assert base_premium(components("rune", count)) == expected


def test_alike_means_same_type_not_same_family():
    assert base_premium(components("rune", 2) + components("moonstone", 1)) == 75


def test_two_separate_blocks_of_different_types():
    assert base_premium(components("rune", 3) + components("moonstone", 3)) == 120
