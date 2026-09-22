"""Test list for the MHPCO Claim Office kata.

Every behavior from prompt.md is listed here, inactive, ordered simple -> complex.
The observable contract is the scenario engine: a scenario (customer + steps)
produces a results list. Rejection cases are specified as a non-zero CLI exit
with an error on stderr; the defensible reading adopted here is that the domain
raises an error which the CLI adapter turns into that exit status. The test list
names that error type ClaimOfficeError and asserts it with pytest.raises for
domain-level rejection, plus CLI-level tests for the exit status itself.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from claim_office import ClaimOfficeError, run_scenario

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    """Run the claim-office CLI the way the specification describes it."""
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


# --- Processing fee / empty policy -------------------------------------------

def test_empty_item_list_costs_only_the_processing_fee():
    results = run_scenario(
        {"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "quote", "items": []}]}
    )

    assert results == [{"premium": 5}]


# --- Base premiums per main item type ----------------------------------------

def test_sword_base_premium_is_100_g():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "sword"}]}],
        }
    )

    assert results == [{"premium": 115}]


def test_amulet_base_premium_is_60_g():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "amulet"}]}],
        }
    )

    assert results == [{"premium": 71}]


def test_staff_base_premium_is_80_g():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "staff"}]}],
        }
    )

    assert results == [{"premium": 93}]


def test_potion_base_premium_is_40_g():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "potion"}]}],
        }
    )

    assert results == [{"premium": 49}]


def test_single_rune_base_premium_is_25_g():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "rune"}]}],
        }
    )

    assert results == [{"premium": 33}]


def test_single_moonstone_base_premium_is_25_g():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "moonstone"}]}],
        }
    )

    assert results == [{"premium": 33}]


# --- Building block of 3 alike components ------------------------------------

def test_two_runes_cost_50_g_base_premium():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}]}
            ],
        }
    )

    assert results == [{"premium": 60}]


def test_three_runes_form_a_block_costing_60_g_base_premium():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [{"type": "rune"}, {"type": "rune"}, {"type": "rune"}],
                }
            ],
        }
    )

    assert results == [{"premium": 71}]


def test_four_runes_cost_100_g_base_premium_because_a_block_requires_exactly_three():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "rune"}] * 4}],
        }
    )

    assert results == [{"premium": 115}]


def test_seven_runes_cost_175_g_base_premium():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "rune"}] * 7}],
        }
    )

    assert results == [{"premium": 198}]


def test_alike_means_same_type_so_two_runes_and_a_moonstone_form_no_block():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {"type": "rune"},
                        {"type": "rune"},
                        {"type": "moonstone"},
                    ],
                }
            ],
        }
    )

    assert results == [{"premium": 88}]


def test_three_runes_and_three_moonstones_form_two_separate_blocks_costing_120_g():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3,
                }
            ],
        }
    )

    assert results == [{"premium": 137}]


# --- Item-specific premium modifiers -----------------------------------------

def test_cursed_item_adds_a_50_percent_risk_surcharge():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 3,
                            "cursed": True,
                        }
                    ],
                }
            ],
        }
    )

    assert results == [{"premium": 165}]


def test_enchantment_of_exactly_5_adds_a_30_percent_risk_surcharge():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 5,
                            "cursed": False,
                        }
                    ],
                }
            ],
        }
    )

    assert results == [{"premium": 145}]


def test_enchantment_of_4_adds_no_high_enchantment_surcharge():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 4,
                            "cursed": False,
                        }
                    ],
                }
            ],
        }
    )

    assert results == [{"premium": 115}]


def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 5,
                            "cursed": True,
                        }
                    ],
                }
            ],
        }
    )

    assert results == [{"premium": 195}]


# --- Policy-wide premium modifiers -------------------------------------------

def test_exactly_two_years_with_mhpco_grants_the_loyalty_discount():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 2},
            "steps": [{"op": "quote", "items": [{"type": "sword"}]}],
        }
    )

    assert results == [{"premium": 95}]


def test_one_year_with_mhpco_grants_no_loyalty_discount():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 1},
            "steps": [{"op": "quote", "items": [{"type": "sword"}]}],
        }
    )

    assert results == [{"premium": 115}]


def test_first_insurance_surcharge_of_10_percent_applies_to_every_quote():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "staff"}]}],
        }
    )

    assert results == [{"premium": 93}]


def test_second_contract_gets_a_15_percent_follow_up_discount():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "quote", "items": [{"type": "sword"}]},
            ],
        }
    )

    assert results == [{"premium": 115}, {"premium": 100}]


def test_third_contract_also_gets_the_follow_up_discount():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "sword"}]}] * 3,
        }
    )

    assert results == [{"premium": 115}, {"premium": 100}, {"premium": 100}]


# --- Modifier scope on multi-item policies -----------------------------------

def test_item_modifiers_apply_to_the_affected_item_not_to_the_policy_total():
    """Base 160 G + 50 G curse (50 % of the sword alone) + 16 G first
    insurance + 5 G fee = 231 G. A policy-wide curse would give 240 G + fee.
    """
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {"type": "sword", "cursed": True},
                        {"type": "amulet", "cursed": False},
                    ],
                }
            ],
        }
    )

    assert results == [{"premium": 231}]


# --- Rounding in the MHPCO's favour ------------------------------------------

def test_premium_is_rounded_up_in_the_mhpco_favour():
    """7 runes yield 175 + 17.5 + 5 = 197.5 G, which the MHPCO rounds up."""
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "rune"}] * 7}],
        }
    )

    assert results == [{"premium": 198}]


def test_payout_is_rounded_down_in_the_mhpco_favour():
    """Enchantment 9 halves a 901 G damage to 450.5 G; less the 100 G
    deductible that is 350.5 G, which the MHPCO rounds down.
    """
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 9,
                            "cursed": False,
                        }
                    ],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 901}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 350, "remainingCap": 1650}


# --- Integration examples for the premium ------------------------------------

def test_newcomer_with_a_cursed_sword_pays_165_g():
    """100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee."""
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 3,
                            "cursed": True,
                        }
                    ],
                }
            ],
        }
    )

    assert results == [{"premium": 165}]


def test_long_standing_customers_second_contract_costs_160_g():
    """100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
    + 10 G first insurance - 15 G follow-up = 155 G + 5 G fee = 160 G.
    The first-insurance surcharge still applies on a follow-up contract.
    """
    cursed_sword = {
        "type": "sword",
        "material": "steel",
        "enchantment": 7,
        "cursed": True,
    }
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 3},
            "steps": [
                {"op": "quote", "items": [{"type": "potion"}]},
                {"op": "quote", "items": [cursed_sword]},
            ],
        }
    )

    assert results[1] == {"premium": 160}


# --- Claim: standard reimbursement -------------------------------------------

def test_standard_damage_is_fully_reimbursed_minus_the_100_g_deductible():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 3,
                            "cursed": False,
                        }
                    ],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 500}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_component_damage_is_reimbursed_minus_the_deductible_without_special_clauses():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "rune"}]},
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "rune", "amount": 200}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 100, "remainingCap": 400}


# --- Claim: special clauses --------------------------------------------------

def test_enchantment_of_at_least_8_reimburses_half_the_damage_before_the_deductible():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 9,
                            "cursed": False,
                        }
                    ],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 1000}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_dragon_material_damage_is_fully_reimbursed_before_the_deductible():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "dragon",
                            "enchantment": 5,
                            "cursed": False,
                        }
                    ],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 800}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 700, "remainingCap": 1300}


def test_dragon_material_sword_at_enchantment_exactly_8_is_reimbursed_at_50_percent():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "dragon",
                            "enchantment": 8,
                            "cursed": False,
                        }
                    ],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 1000}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_high_enchantment_clause_wins_over_the_dragon_material_clause():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "dragon",
                            "enchantment": 9,
                            "cursed": False,
                        }
                    ],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 1000}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 400, "remainingCap": 1600}


# --- Claim: deductible per damage event --------------------------------------

def test_deductible_applies_once_per_damaged_item():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [{"type": "sword"}, {"type": "amulet"}],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "dragon attack",
                        "damages": [
                            {"itemType": "sword", "amount": 500},
                            {"itemType": "amulet", "amount": 300},
                        ],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 600, "remainingCap": 2600}


def test_damage_below_the_deductible_yields_no_payout_for_that_item():
    """The specification does not state this case. Reading adopted: a payout
    is what the MHPCO owes, so a damage smaller than the deductible earns
    nothing rather than a negative amount that would reduce the cap or
    offset another item's payout.
    """
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "scratch",
                        "damages": [{"itemType": "sword", "amount": 50}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 0, "remainingCap": 2000}


# --- Claim: insurance sum and cap --------------------------------------------

def test_insurance_sum_is_the_sum_of_the_items_insurance_values():
    """Sword 1000 G + amulet 600 G = 1600 G insurance sum, so the cap is
    3200 G; a 200 G damage pays 100 G and leaves 3100 G of cap.
    """
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}, {"type": "amulet"}]},
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 200}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 100, "remainingCap": 3100}


def test_premium_modifiers_do_not_raise_the_cap():
    """The cursed sword's premium is 165 G, but its cap rests on the
    unmodified 1000 G insurance value: 2000 G, less a 400 G payout.
    """
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "sword",
                            "material": "steel",
                            "enchantment": 3,
                            "cursed": True,
                        }
                    ],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 500}],
                    },
                },
            ],
        }
    )

    assert results[0] == {"premium": 165}
    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_component_block_discount_does_not_reduce_the_insurance_sum():
    """The block prices 3 runes at 60 G instead of 75 G, but they are still
    insured at 250 G each: sum 1750 G, cap 3500 G.
    """
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {
                    "op": "quote",
                    "items": [{"type": "sword"}] + [{"type": "rune"}] * 3,
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 200}],
                    },
                },
            ],
        }
    )

    assert results[0] == {"premium": 181}
    assert results[1] == {"payout": 100, "remainingCap": 3400}


def test_two_swords_double_the_insurance_sum_and_the_cap():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}, {"type": "sword"}]},
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 200}],
                    },
                },
            ],
        }
    )

    assert results[0] == {"premium": 225}
    assert results[1] == {"payout": 100, "remainingCap": 3900}


def test_first_claim_reduces_the_remaining_cap():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "sword", "amount": 1500}],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 1400, "remainingCap": 600}


def test_second_claim_is_limited_to_the_remaining_cap():
    claim_step = {
        "op": "claim",
        "policy": 0,
        "incident": {
            "cause": "fire",
            "damages": [{"itemType": "sword", "amount": 1500}],
        },
    }
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                claim_step,
                claim_step,
            ],
        }
    )

    assert results[1] == {"payout": 1400, "remainingCap": 600}
    assert results[2] == {"payout": 600, "remainingCap": 0}


# --- Claim: multiple items of the same type ----------------------------------

def test_each_damage_entry_of_the_same_type_gets_its_own_deductible():
    results = run_scenario(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}, {"type": "sword"}]},
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "dragon attack",
                        "damages": [
                            {"itemType": "sword", "amount": 500},
                            {"itemType": "sword", "amount": 300},
                        ],
                    },
                },
            ],
        }
    )

    assert results[1] == {"payout": 600, "remainingCap": 3400}


def test_more_damage_entries_of_a_type_than_insured_items_rejects_the_claim():
    """The specification fixes the CLI contract (non-zero exit, stderr).
    Reading adopted for the domain: the claim raises ClaimOfficeError, which
    the CLI adapter reports.
    """
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [
                        {"itemType": "sword", "amount": 500},
                        {"itemType": "sword", "amount": 300},
                    ],
                },
            },
        ],
    }

    with pytest.raises(ClaimOfficeError):
        run_scenario(scenario)


# --- Rejection cases ---------------------------------------------------------

def test_quote_with_an_unknown_item_type_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }

    with pytest.raises(ClaimOfficeError):
        run_scenario(scenario)


def test_claim_for_an_item_outside_the_policy_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 300}],
                },
            },
        ],
    }

    with pytest.raises(ClaimOfficeError):
        run_scenario(scenario)


def test_claim_for_an_unknown_item_type_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "broomstick", "amount": 300}],
                },
            },
        ],
    }

    with pytest.raises(ClaimOfficeError):
        run_scenario(scenario)


def test_claim_with_a_negative_damage_amount_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": -200}],
                },
            },
        ],
    }

    with pytest.raises(ClaimOfficeError):
        run_scenario(scenario)


# --- CLI adapter -------------------------------------------------------------

def test_cli_writes_the_results_document_to_stdout():
    completed = run_cli(
        {
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {
                            "type": "amulet",
                            "material": "silver",
                            "enchantment": 2,
                            "cursed": False,
                        }
                    ],
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "amulet", "amount": 200}],
                    },
                },
            ],
        }
    )

    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        "results": [
            {"premium": 59},
            {"payout": 100, "remainingCap": 1100},
        ]
    }


def test_cli_exits_non_zero_and_reports_the_error_on_stderr_for_a_rejected_scenario():
    completed = run_cli(
        {
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
        }
    )

    assert completed.returncode != 0
    assert completed.stderr.strip() != ""
    assert completed.stdout == ""
