"""The MHPCO price list."""
from fractions import Fraction

from errors import ClaimOfficeError

COMPONENT_INSURANCE_VALUE = Fraction(250)
COMPONENT_BASE_PREMIUM = Fraction(25)
BLOCK_SIZE = 3
BLOCK_BASE_PREMIUM = Fraction(60)

_MAIN_ITEMS = {
    "sword": (Fraction(1000), Fraction(100)),
    "amulet": (Fraction(600), Fraction(60)),
    "staff": (Fraction(800), Fraction(80)),
    "potion": (Fraction(400), Fraction(40)),
}

_COMPONENTS = ("rune", "moonstone")


def is_known(item_type):
    return item_type in _MAIN_ITEMS or item_type in _COMPONENTS


def is_component(item_type):
    return item_type in _COMPONENTS


def insurance_value(item_type):
    if item_type in _MAIN_ITEMS:
        return _MAIN_ITEMS[item_type][0]
    if item_type in _COMPONENTS:
        return COMPONENT_INSURANCE_VALUE
    raise ClaimOfficeError(f"unknown item type: {item_type!r}")


def base_premium(item_type):
    if item_type in _MAIN_ITEMS:
        return _MAIN_ITEMS[item_type][1]
    if item_type in _COMPONENTS:
        return COMPONENT_BASE_PREMIUM
    raise ClaimOfficeError(f"unknown item type: {item_type!r}")
