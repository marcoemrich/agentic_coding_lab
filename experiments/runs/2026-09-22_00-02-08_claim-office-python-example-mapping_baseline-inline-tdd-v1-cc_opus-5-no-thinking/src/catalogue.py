"""The MHPCO price list."""

from errors import ScenarioError

MAIN_ITEM_BASE_PREMIUMS = {
    "sword": 100,
    "amulet": 60,
    "staff": 80,
    "potion": 40,
}

MAIN_ITEM_INSURANCE_VALUES = {
    "sword": 1000,
    "amulet": 600,
    "staff": 800,
    "potion": 400,
}

COMPONENT_TYPES = ("rune", "moonstone")
COMPONENT_BASE_PREMIUM = 25
COMPONENT_INSURANCE_VALUE = 250


def is_component(item_type):
    return item_type in COMPONENT_TYPES


def is_known_type(item_type):
    return is_component(item_type) or item_type in MAIN_ITEM_BASE_PREMIUMS


def require_known_type(item_type):
    if not is_known_type(item_type):
        raise ScenarioError(f"unknown item type: {item_type!r}")


def insurance_value(item_type):
    require_known_type(item_type)
    if is_component(item_type):
        return COMPONENT_INSURANCE_VALUE
    return MAIN_ITEM_INSURANCE_VALUES[item_type]
