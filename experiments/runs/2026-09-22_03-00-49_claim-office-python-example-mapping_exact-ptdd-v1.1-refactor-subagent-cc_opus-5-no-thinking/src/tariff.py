"""The office's tariff: the item types it deals in and their rated columns."""

from collections import Counter

MAIN_ITEM_BASE_PREMIUMS = {"sword": 100, "amulet": 60, "staff": 80, "potion": 40}

MAIN_ITEM_INSURANCE_VALUES = {"sword": 1000, "amulet": 600, "staff": 800, "potion": 400}

COMPONENT_TYPES = frozenset({"rune", "moonstone"})
COMPONENT_INSURANCE_VALUE = 250
COMPONENT_BASE_PREMIUM = 25

BASE_PREMIUMS = {
    **MAIN_ITEM_BASE_PREMIUMS,
    **{component: COMPONENT_BASE_PREMIUM for component in COMPONENT_TYPES},
}

INSURANCE_VALUES = {
    **MAIN_ITEM_INSURANCE_VALUES,
    **{component: COMPONENT_INSURANCE_VALUE for component in COMPONENT_TYPES},
}


def tariff_entry_of(tariff, item_type):
    """The office only deals in item types listed in its tariff.

    Premium rating and claim settlement read different columns of the same
    tariff, but recognize the same set of item types.
    """
    if item_type not in tariff:
        raise ValueError(f"unknown item type: {item_type}")
    return tariff[item_type]


def base_premium_of(item_type):
    return tariff_entry_of(BASE_PREMIUMS, item_type)


def insurance_value_of(item_type):
    return tariff_entry_of(INSURANCE_VALUES, item_type)


def is_component(item_type):
    return item_type in COMPONENT_TYPES


def alike_component_counts(item_types):
    """Components are alike when they share the same type."""
    return Counter(item_type for item_type in item_types if is_component(item_type))
