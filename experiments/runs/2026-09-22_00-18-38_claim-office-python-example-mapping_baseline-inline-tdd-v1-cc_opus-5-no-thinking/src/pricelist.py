"""The MHPCO price list: insurance values and base premiums per item type."""

from fractions import Fraction

MAIN_ITEMS = {
    "sword": (1000, 100),
    "amulet": (600, 60),
    "staff": (800, 80),
    "potion": (400, 40),
}

COMPONENT_TYPES = ("rune", "moonstone")
COMPONENT_VALUE = 250
COMPONENT_PREMIUM = 25
BLOCK_SIZE = 3
BLOCK_PREMIUM = 60


class UnknownItemType(Exception):
    """Raised when an item type is not in the MHPCO price list."""


def is_component(item_type):
    return item_type in COMPONENT_TYPES


def insurance_value(item_type):
    if item_type in MAIN_ITEMS:
        return MAIN_ITEMS[item_type][0]
    if is_component(item_type):
        return COMPONENT_VALUE
    raise UnknownItemType(f"unknown item type: {item_type}")


def base_premium(item_type):
    if item_type in MAIN_ITEMS:
        return Fraction(MAIN_ITEMS[item_type][1])
    if is_component(item_type):
        return Fraction(COMPONENT_PREMIUM)
    raise UnknownItemType(f"unknown item type: {item_type}")


def block_premium(item_type, count):
    """Base premium for `count` alike components of one type.

    The MHPCO grants its block rate only for exactly three alike components;
    any other count is billed per component.
    """
    if count == BLOCK_SIZE:
        return Fraction(BLOCK_PREMIUM)
    return base_premium(item_type) * count
