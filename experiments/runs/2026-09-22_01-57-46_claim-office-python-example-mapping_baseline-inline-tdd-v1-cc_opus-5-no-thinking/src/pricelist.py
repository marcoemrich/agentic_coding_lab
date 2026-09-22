"""The MHPCO price list of insurable items."""


class UnknownItemType(Exception):
    """Raised when an item type is not on the MHPCO price list."""


COMPONENT_INSURANCE_VALUE = 250
COMPONENT_BASE_PREMIUM = 25

_MAIN_ITEMS = {
    "sword": (1000, 100),
    "amulet": (600, 60),
    "staff": (800, 80),
    "potion": (400, 40),
}
_COMPONENTS = ("rune", "moonstone")


def is_component(item_type):
    return item_type in _COMPONENTS


def insurance_value(item_type):
    return _entry(item_type)[0]


def base_premium(item_type):
    return _entry(item_type)[1]


def _entry(item_type):
    if is_component(item_type):
        return COMPONENT_INSURANCE_VALUE, COMPONENT_BASE_PREMIUM
    if item_type not in _MAIN_ITEMS:
        raise UnknownItemType(f"unknown item type: {item_type}")
    return _MAIN_ITEMS[item_type]
