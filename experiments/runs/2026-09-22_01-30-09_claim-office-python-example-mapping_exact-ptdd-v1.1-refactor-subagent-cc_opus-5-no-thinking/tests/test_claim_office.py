"""The MHPCO Claim Office kata's examples, one test per example.

Each test states one example from the specification: the scenario document the
office is handed, and what it must decide for it. The scenario is written out
as the literal JSON the CLI contract binds, so the tests also witness the
normative field names.

Reading adopted for rejection cases: the specification states the CLI "exits with a
non-zero status code and writes an error description to stderr". The domain layer is
tested by asserting that the operation raises a `ValueError` (the representative
Python exception type for an invalid domain input), and the CLI adapter is tested
separately for the exit status and stderr contract.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from claim_office import run_scenario

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    """Run the claim-office CLI over a scenario document, as a user would."""
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


A_PLAIN_SWORD = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
"""An ordinary insured sword: steel, moderately enchanted, not cursed.

The MHPCO's rules about deductibles, caps, and scenario sequencing are read
against an item that triggers no special clause of its own, so the examples
that illustrate those rules all insure this same unremarkable sword. Where an
example turns on a sword's own attributes it states them itself instead.
"""

AN_ORDINARY_AMULET = {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
"""A second unremarkable insured item, for examples that need two of them.

Rules about per-item deductibles and the insurance sum need a policy to cover
more than one item, and this amulet triggers no special clause either, so what
those examples show is the rule rather than the items.
"""

# ---------------------------------------------------------------------------
# Base premiums per main item (price list)
# ---------------------------------------------------------------------------


def test_empty_item_list_yields_only_the_processing_fee():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": []}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 5}]}


def test_single_sword_has_base_premium_100():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "sword"}]}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 115}]}


def test_single_amulet_has_base_premium_60():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "amulet"}]}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 71}]}


def test_single_staff_has_base_premium_80():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "staff"}]}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 93}]}


def test_single_potion_has_base_premium_40():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "potion"}]}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 49}]}


def test_single_rune_has_base_premium_25():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "rune"}]}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 33}]}


def test_single_moonstone_has_base_premium_25():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "moonstone"}]}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 33}]}


def test_policy_base_premium_sums_item_base_premiums():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}, {"type": "amulet"}]}
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 181}]}


# ---------------------------------------------------------------------------
# Building block of 3 alike components
# ---------------------------------------------------------------------------


def test_two_runes_have_base_premium_50():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}]}
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 60}]}


def test_three_runes_form_a_block_with_base_premium_60():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "rune"}] * 3}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 71}]}


def test_four_runes_have_no_block_and_base_premium_100():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "rune"}] * 4}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 115}]}


def test_seven_runes_have_base_premium_175():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "rune"}] * 7}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 198}]}


def test_alike_means_same_type_so_mixed_components_form_no_block():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}],
            }
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 88}]}


def test_two_separate_blocks_of_three_alike_components():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3,
            }
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 137}]}


# ---------------------------------------------------------------------------
# Item-specific premium modifiers
# ---------------------------------------------------------------------------


def test_cursed_item_adds_50_percent_risk_surcharge():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
                ],
            }
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 165}]}


def test_enchantment_exactly_5_adds_30_percent_surcharge():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 5, "cursed": False}
                ],
            }
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 145}]}


def test_enchantment_4_adds_no_high_enchantment_surcharge():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 4, "cursed": False}
                ],
            }
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 115}]}


def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 5, "cursed": True}
                ],
            }
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 195}]}


def test_item_modifier_applies_only_to_the_affected_items_base_premium():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True},
                    AN_ORDINARY_AMULET,
                ],
            }
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 231}]}


# ---------------------------------------------------------------------------
# Policy-wide premium modifiers
# ---------------------------------------------------------------------------


def test_loyalty_discount_applies_at_exactly_two_years():
    scenario = {
        "customer": {"yearsWithMHPCO": 2},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]}
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 95}]}


def test_no_loyalty_discount_below_two_years():
    scenario = {
        "customer": {"yearsWithMHPCO": 1},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]}
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 115}]}


def test_first_insurance_surcharge_is_10_percent_of_policy_base():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]}
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 115}]}


def test_follow_up_contract_discount_applies_from_the_second_quote():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {"op": "quote", "items": [A_PLAIN_SWORD]},
        ],
    }

    assert run_scenario(scenario) == {
        "results": [{"premium": 115}, {"premium": 100}]
    }


def test_follow_up_contract_discount_applies_to_every_quote_after_the_first():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {"op": "quote", "items": [A_PLAIN_SWORD]},
        ],
    }

    assert run_scenario(scenario) == {
        "results": [{"premium": 115}, {"premium": 100}, {"premium": 100}]
    }


def test_processing_fee_is_added_after_all_modifiers():
    scenario = {
        "customer": {"yearsWithMHPCO": 2},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {"op": "quote", "items": [A_PLAIN_SWORD]},
        ],
    }

    # Second quote: 100 base - 20 loyalty + 10 first insurance - 15 follow-up
    # = 75, and only then + 5 processing fee.
    assert run_scenario(scenario)["results"][1] == {"premium": 80}


# ---------------------------------------------------------------------------
# Rounding
# ---------------------------------------------------------------------------


def test_premium_rounds_up_in_mhpco_favor():
    # 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "rune"}] * 7}],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 198}]}


def test_only_the_final_premium_is_rounded():
    # A cursed rune for a long-standing customer produces fractional
    # intermediate amounts that cancel exactly: 25 base + 12.5 curse
    # - 5 loyalty + 2.5 first insurance = 35, + 5 fee = 40 exactly.
    # Rounding each fractional intermediate up instead would yield 41.
    scenario = {
        "customer": {"yearsWithMHPCO": 2},
        "steps": [
            {"op": "quote", "items": [{"type": "rune", "cursed": True}]},
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 40}]}


def test_payout_rounds_down_in_mhpco_favor():
    # Enchantment 9 halves the damage: 50 % of 901 = 450.5, then - 100
    # deductible = 350.5, which the office rounds down to 350.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 9, "cursed": False}
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

    assert run_scenario(scenario)["results"][1] == {"payout": 350, "remainingCap": 1650}


# ---------------------------------------------------------------------------
# Quote integration examples
# ---------------------------------------------------------------------------


def test_newcomer_with_a_cursed_sword_pays_165():
    # 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
                ],
            }
        ],
    }

    assert run_scenario(scenario) == {"results": [{"premium": 165}]}


def test_long_standing_customers_second_contract_pays_160():
    # Second quote: 100 base + 50 curse + 30 high enchantment - 20 loyalty
    # + 10 first insurance - 15 follow-up contract = 155, + 5 fee = 160.
    # The first insurance surcharge still applies to the new A_PLAIN_SWORD, because
    # each item in a quote is treated as a first insurance.
    cursed_sword = {
        "type": "sword",
        "material": "steel",
        "enchantment": 7,
        "cursed": True,
    }
    scenario = {
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [cursed_sword]},
            {"op": "quote", "items": [cursed_sword]},
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"premium": 160}


# ---------------------------------------------------------------------------
# Insurance sum and cap
# ---------------------------------------------------------------------------


def test_insurance_sum_is_the_sum_of_item_insurance_values():
    # Insurance sum 1000 + 600 = 1600 G, so the cap is 3200 G. A damage of
    # exactly the deductible pays nothing and leaves the whole cap.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    A_PLAIN_SWORD,
                    AN_ORDINARY_AMULET,
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": 100}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 0, "remainingCap": 3200}


def test_two_swords_double_the_insurance_sum_and_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD, A_PLAIN_SWORD]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": 100}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 0, "remainingCap": 4000}


def test_component_block_discount_does_not_reduce_the_insurance_sum():
    # Insurance sum 1000 + 3 x 250 = 1750 G, cap 3500 G, even though the three
    # runes form a building block that discounts the premium.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    A_PLAIN_SWORD,
                    *([{"type": "rune"}] * 3),
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": 100}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 0, "remainingCap": 3500}


def test_premium_modifiers_do_not_raise_the_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": 100}],
                },
            },
        ],
    }

    results = run_scenario(scenario)["results"]

    assert results[0] == {"premium": 165}
    assert results[1] == {"payout": 0, "remainingCap": 2000}


# ---------------------------------------------------------------------------
# Claim processing: deductible and standard reimbursement
# ---------------------------------------------------------------------------


def test_standard_reimbursement_subtracts_the_100_deductible():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 400, "remainingCap": 1600}


def test_component_damage_has_no_special_clause_and_only_the_deductible():
    # A rune has neither an enchantment level nor a material, so no special
    # clause applies: 200 - 100 deductible = 100. Cap is 2 x 250 = 500.
    scenario = {
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

    assert run_scenario(scenario)["results"][1] == {"payout": 100, "remainingCap": 400}


def test_deductible_applies_once_per_damage_entry():
    # (500 - 100) + (300 - 100) = 600, not 800 - 100. Cap 2 x 1600 = 3200.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    A_PLAIN_SWORD,
                    AN_ORDINARY_AMULET,
                ],
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

    assert run_scenario(scenario)["results"][1] == {"payout": 600, "remainingCap": 2600}


def test_damage_below_the_deductible_yields_no_payout():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "clumsiness",
                    "damages": [{"itemType": "sword", "amount": 50}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 0, "remainingCap": 2000}


# ---------------------------------------------------------------------------
# Claim processing: special clauses
# ---------------------------------------------------------------------------


def test_high_enchantment_damage_is_reimbursed_at_50_percent():
    # 50 % of 1000 = 500, then - 100 deductible = 400. Cap 2000 -> 1600 left.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 9, "cursed": False}
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 1000}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 400, "remainingCap": 1600}


def test_enchantment_7_does_not_trigger_the_50_percent_clause():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 7, "cursed": False}
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 1000}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 900, "remainingCap": 1100}


def test_dragon_material_damage_is_fully_reimbursed():
    # Only the dragon-material clause applies: full reimbursement, then the
    # deductible: 800 - 100 = 700. Cap 2000 -> 1300 left.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "dragon", "enchantment": 5, "cursed": False}
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 800}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 700, "remainingCap": 1300}


def test_dragon_material_sword_at_exactly_enchantment_8_pays_400():
    # The high-enchantment clause applies at exactly 8 and wins over the
    # dragon-material clause: 50 % of 1000 = 500, then - 100 = 400.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "dragon", "enchantment": 8, "cursed": False}
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 1000}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 400, "remainingCap": 1600}


def test_high_enchantment_clause_beats_dragon_material():
    # Both clauses apply and the 50 % rule wins: 500, then - 100 = 400.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "dragon", "enchantment": 9, "cursed": False}
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 1000}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 400, "remainingCap": 1600}


# ---------------------------------------------------------------------------
# Claim processing: cap exhaustion across successive claims
# ---------------------------------------------------------------------------


def test_first_claim_reduces_the_remaining_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
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

    assert run_scenario(scenario)["results"][1] == {"payout": 1400, "remainingCap": 600}


def test_second_claim_is_limited_to_the_remaining_cap():
    claim = {
        "op": "claim",
        "policy": 0,
        "incident": {
            "cause": "fire",
            "damages": [{"itemType": "sword", "amount": 1500}],
        },
    }
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            claim,
            claim,
        ],
    }

    results = run_scenario(scenario)["results"]

    assert results[1] == {"payout": 1400, "remainingCap": 600}
    assert results[2] == {"payout": 600, "remainingCap": 0}


def test_claim_against_an_exhausted_cap_pays_nothing():
    claim = {
        "op": "claim",
        "policy": 0,
        "incident": {
            "cause": "fire",
            "damages": [{"itemType": "sword", "amount": 1500}],
        },
    }
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            claim,
            claim,
            claim,
        ],
    }

    assert run_scenario(scenario)["results"][3] == {"payout": 0, "remainingCap": 0}


# ---------------------------------------------------------------------------
# Multiple items of the same type in a claim
# ---------------------------------------------------------------------------


def test_each_damage_entry_of_a_repeated_type_is_treated_separately():
    # Two swords insured (cap 4000). Two A_PLAIN_SWORD damages of 500 G each bear a
    # deductible apiece: (500 - 100) x 2 = 800.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD, A_PLAIN_SWORD]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [
                        {"itemType": "sword", "amount": 500},
                        {"itemType": "sword", "amount": 500},
                    ],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][1] == {"payout": 800, "remainingCap": 3200}


def test_more_damage_entries_of_a_type_than_insured_rejects_the_claim():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [
                        {"itemType": "sword", "amount": 500},
                        {"itemType": "sword", "amount": 500},
                    ],
                },
            },
        ],
    }

    with pytest.raises(ValueError):
        run_scenario(scenario)


# ---------------------------------------------------------------------------
# Rejection cases in the domain (reading: ValueError)
# ---------------------------------------------------------------------------


def test_quote_with_an_unknown_item_type_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }

    with pytest.raises(ValueError):
        run_scenario(scenario)


def test_claim_for_an_item_not_in_the_policy_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
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

    with pytest.raises(ValueError):
        run_scenario(scenario)


def test_claim_with_an_unknown_damaged_item_type_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
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

    with pytest.raises(ValueError):
        run_scenario(scenario)


def test_claim_with_a_negative_damage_amount_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
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

    with pytest.raises(ValueError):
        run_scenario(scenario)


# ---------------------------------------------------------------------------
# Scenario sequencing
# ---------------------------------------------------------------------------


def test_results_mirror_the_input_steps_in_length_and_order():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
            {"op": "quote", "items": [A_PLAIN_SWORD]},
        ],
    }

    results = run_scenario(scenario)["results"]

    assert results == [
        {"premium": 115},
        {"payout": 400, "remainingCap": 1600},
        {"premium": 100},
    ]


def test_claim_step_refers_to_the_policy_of_the_indexed_quote_step():
    # Policy 0 covers a A_PLAIN_SWORD (cap 2000); policy 1 covers an amulet (cap 1200).
    # A claim naming policy 1 must settle against the amulet policy, and an
    # amulet damage would be refused by policy 0's schedule.
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {"op": "quote", "items": [AN_ORDINARY_AMULET]},
            {
                "op": "claim",
                "policy": 1,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 500}],
                },
            },
        ],
    }

    assert run_scenario(scenario)["results"][2] == {"payout": 400, "remainingCap": 800}


def test_each_policy_tracks_its_own_remaining_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
            {"op": "quote", "items": [AN_ORDINARY_AMULET]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
            {
                "op": "claim",
                "policy": 1,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 500}],
                },
            },
        ],
    }

    results = run_scenario(scenario)["results"]

    assert results[2] == {"payout": 400, "remainingCap": 1600}
    assert results[3] == {"payout": 400, "remainingCap": 800}


# ---------------------------------------------------------------------------
# CLI adapter contract
# ---------------------------------------------------------------------------


def test_cli_writes_the_results_document_to_stdout():
    scenario = {
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

    completed = run_cli(scenario)

    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        # 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


def test_cli_result_objects_use_the_normative_field_names():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
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

    completed = run_cli(scenario)
    document = json.loads(completed.stdout)

    assert set(document) == {"results"}
    assert set(document["results"][0]) == {"premium"}
    assert set(document["results"][1]) == {"payout", "remainingCap"}


def test_cli_rejects_an_unknown_item_type_with_a_non_zero_exit_status():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }

    completed = run_cli(scenario)

    assert completed.returncode != 0
    assert completed.stderr.strip() != ""
    assert completed.stdout == ""


def test_cli_rejects_a_claim_for_an_uninsured_item_with_a_non_zero_exit_status():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
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

    completed = run_cli(scenario)

    assert completed.returncode != 0
    assert completed.stderr.strip() != ""
    assert completed.stdout == ""


def test_cli_rejects_a_negative_damage_amount_with_a_non_zero_exit_status():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [A_PLAIN_SWORD]},
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

    completed = run_cli(scenario)

    assert completed.returncode != 0
    assert completed.stderr.strip() != ""
    assert completed.stdout == ""
