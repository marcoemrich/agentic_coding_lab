"""Test list for the MHPCO Claim Office kata.

Observable contract for rejection cases: the specification says the CLI
"exits with a non-zero status code and writes an error description to
stderr". The reading adopted here is that the domain layer raises a
``ValueError`` describing the problem, and the CLI adapter translates it
into a non-zero exit status plus a stderr message. Domain-level tests
assert the ``ValueError``; the CLI-level tests assert the exit status and
that stderr is non-empty while stdout carries no ``results``.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    """Run the claim-office CLI over a scenario document."""
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


from claim_office import Customer, Item, quote, run_scenario


# --- Processing fee and the empty policy -----------------------------------


def test_empty_item_list_costs_only_the_processing_fee():
    premium = quote(Customer(years_with_mhpco=0), [])

    assert premium == 5


# --- Base premiums of the four main item types -----------------------------


def test_sword_has_base_premium_100():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="sword")])

    assert premium == 115


def test_amulet_has_base_premium_60():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="amulet")])

    assert premium == 71


def test_staff_has_base_premium_80():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="staff")])

    assert premium == 93


def test_potion_has_base_premium_40():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="potion")])

    assert premium == 49


def test_single_rune_has_base_premium_25():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="rune")])

    assert premium == 33


def test_single_moonstone_has_base_premium_25():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="moonstone")])

    assert premium == 33


# --- Building block of 3 alike components ----------------------------------


def test_two_runes_cost_50_base_premium():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="rune"), Item(type="rune")])

    assert premium == 60


def test_three_runes_form_a_block_at_60_base_premium():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="rune")] * 3)

    assert premium == 71


def test_four_runes_cost_100_base_premium_no_block():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="rune")] * 4)

    assert premium == 115


def test_seven_runes_cost_175_base_premium():
    premium = quote(Customer(years_with_mhpco=0), [Item(type="rune")] * 7)

    assert premium == 198


def test_two_runes_and_one_moonstone_have_no_block():
    items = [Item(type="rune"), Item(type="rune"), Item(type="moonstone")]

    premium = quote(Customer(years_with_mhpco=0), items)

    assert premium == 88


def test_three_runes_and_three_moonstones_form_two_blocks():
    items = [Item(type="rune")] * 3 + [Item(type="moonstone")] * 3

    premium = quote(Customer(years_with_mhpco=0), items)

    assert premium == 137


# --- Item-specific premium modifiers ---------------------------------------


def test_cursed_item_adds_fifty_percent_risk_surcharge():
    cursed_sword = Item(type="sword", material="steel", enchantment=3, cursed=True)

    premium = quote(Customer(years_with_mhpco=0), [cursed_sword])

    assert premium == 165


def test_enchantment_exactly_five_adds_thirty_percent_surcharge():
    enchanted_sword = Item(type="sword", material="steel", enchantment=5)

    premium = quote(Customer(years_with_mhpco=0), [enchanted_sword])

    assert premium == 145


def test_enchantment_four_gets_no_high_enchantment_surcharge():
    sword = Item(type="sword", material="steel", enchantment=4)

    premium = quote(Customer(years_with_mhpco=0), [sword])

    assert premium == 115


def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    sword = Item(type="sword", material="steel", enchantment=5, cursed=True)

    premium = quote(Customer(years_with_mhpco=0), [sword])

    assert premium == 195


def test_item_modifiers_apply_to_the_affected_item_only():
    items = [
        Item(type="sword", material="steel", enchantment=3, cursed=True),
        Item(type="amulet", material="silver", enchantment=2),
    ]

    premium = quote(Customer(years_with_mhpco=0), items)

    assert premium == 231


# --- Policy-wide premium modifiers -----------------------------------------


def test_first_insurance_adds_ten_percent_of_policy_base_premium():
    items = [Item(type="sword", material="steel"), Item(type="amulet", material="silver")]

    premium = quote(Customer(years_with_mhpco=0), items)

    assert premium == 181


def test_exactly_two_years_with_mhpco_grants_loyalty_discount():
    premium = quote(Customer(years_with_mhpco=2), [Item(type="sword", material="steel")])

    assert premium == 95


def test_one_year_with_mhpco_grants_no_loyalty_discount():
    premium = quote(Customer(years_with_mhpco=1), [Item(type="sword", material="steel")])

    assert premium == 115


def test_second_contract_gets_fifteen_percent_follow_up_discount():
    sword_quote = {"op": "quote", "items": [{"type": "sword", "material": "steel"}]}

    results = run_scenario({"customer": {"yearsWithMHPCO": 0}, "steps": [sword_quote, sword_quote]})

    assert results == [{"premium": 115}, {"premium": 100}]


def test_first_insurance_surcharge_applies_on_every_quote():
    cursed_sword = Item(type="sword", material="steel", enchantment=7, cursed=True)

    premium = quote(Customer(years_with_mhpco=3), [cursed_sword], previous_contracts=1)

    assert premium == 160


# --- Rounding ---------------------------------------------------------------


def test_premium_rounds_up_in_mhpco_favour():
    # 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 G
    premium = quote(Customer(years_with_mhpco=0), [Item(type="rune")] * 7)

    assert premium == 198


def test_only_the_final_premium_is_rounded():
    # 1 rune: 25 base + 2.5 first insurance = 27.5 G is kept as a fraction,
    # and only the total 32.5 G is rounded up.
    premium = quote(Customer(years_with_mhpco=0), [Item(type="rune")])

    assert premium == 33


# --- Integration examples for quote ----------------------------------------


def test_newcomer_with_a_cursed_sword_pays_165():
    # 100 base + 50 curse + 10 first insurance = 160 G + 5 G fee
    cursed_sword = Item(type="sword", material="steel", enchantment=3, cursed=True)

    premium = quote(Customer(years_with_mhpco=0), [cursed_sword], previous_contracts=0)

    assert premium == 165


def test_long_standing_customer_second_contract_pays_160():
    # second quote: 100 base + 50 curse + 30 enchantment - 20 loyalty
    # + 10 first insurance - 15 follow-up = 155 G + 5 G fee
    scenario = {
        "customer": {"yearsWithMHPCO": 3},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
                ],
            },
        ],
    }

    results = run_scenario(scenario)

    assert results == [{"premium": 95}, {"premium": 160}]


# --- Insurance sum and cap --------------------------------------------------


def test_insurance_sum_is_the_sum_of_item_values_and_cap_is_twice_it():
    # insurance sum 1000 + 600 = 1600 G, so the cap is 3200 G
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel"},
                    {"type": "amulet", "material": "silver"},
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 100, "remainingCap": 3100}


def test_two_swords_give_insurance_sum_2000_and_cap_4000():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel"},
                    {"type": "sword", "material": "steel"},
                ],
            },
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 200}],
                },
            },
        ],
    }

    results = run_scenario(scenario)

    assert results[1] == {"payout": 100, "remainingCap": 3900}


def test_block_discount_does_not_lower_the_insurance_sum():
    # insurance sum 1000 + 3x250 = 1750 G, so the cap is 3500 G
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel"},
                    {"type": "rune"},
                    {"type": "rune"},
                    {"type": "rune"},
                ],
            },
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 100, "remainingCap": 3400}


def test_premium_modifiers_do_not_raise_the_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "sword", "material": "steel", "cursed": True}],
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

    results = run_scenario(scenario)

    assert results == [{"premium": 165}, {"payout": 100, "remainingCap": 1900}]


# --- Claim processing: standard reimbursement and deductible ---------------


def test_standard_damage_is_fully_reimbursed_minus_deductible():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "sword", "material": "steel", "enchantment": 3}],
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_component_damage_has_no_special_clause():
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 100, "remainingCap": 400}


def test_deductible_applies_once_per_damage_entry():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel"},
                    {"type": "amulet", "material": "silver"},
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 600, "remainingCap": 2600}


# --- Claim processing: special clauses -------------------------------------


def test_high_enchantment_damage_is_reimbursed_at_fifty_percent():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "sword", "material": "steel", "enchantment": 9}],
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_dragon_material_damage_is_fully_reimbursed():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "sword", "material": "dragon", "enchantment": 5}],
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 700, "remainingCap": 1300}


def test_high_enchantment_beats_dragon_material():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "sword", "material": "dragon", "enchantment": 9}],
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 400, "remainingCap": 1600}


def test_enchantment_exactly_eight_triggers_the_fifty_percent_clause():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "sword", "material": "dragon", "enchantment": 8}],
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 400, "remainingCap": 1600}


# --- Claim processing: cap exhaustion --------------------------------------


def test_first_claim_reduces_the_remaining_cap():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 1400, "remainingCap": 600}


def test_second_claim_is_limited_to_the_remaining_cap():
    claim_step = {
        "op": "claim",
        "policy": 0,
        "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1500}]},
    }
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
            claim_step,
            claim_step,
        ],
    }

    results = run_scenario(scenario)

    assert results[2] == {"payout": 600, "remainingCap": 0}


# --- Claim processing: rounding --------------------------------------------


def test_payout_rounds_down_in_mhpco_favour():
    # enchantment 9: 901 / 2 = 450.5 G, less the 100 G deductible = 350.5 G
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [{"type": "sword", "material": "steel", "enchantment": 9}],
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 350, "remainingCap": 1650}


# --- Claim processing: multiple items of the same type ---------------------


def test_two_damages_of_the_same_type_each_carry_a_deductible():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "sword", "material": "steel"},
                    {"type": "sword", "material": "steel"},
                ],
            },
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

    results = run_scenario(scenario)

    assert results[1] == {"payout": 800, "remainingCap": 3200}


def test_more_damages_than_insured_items_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
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


# --- Rejection cases (domain level) ----------------------------------------


def test_unknown_item_type_in_quote_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }

    with pytest.raises(ValueError):
        run_scenario(scenario)


def test_damage_to_an_item_not_in_the_policy_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
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

    with pytest.raises(ValueError):
        run_scenario(scenario)


def test_damage_with_an_unknown_item_type_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "broomstick", "amount": 200}],
                },
            },
        ],
    }

    with pytest.raises(ValueError):
        run_scenario(scenario)


def test_negative_damage_amount_is_rejected():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
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


# --- CLI adapter ------------------------------------------------------------


def test_cli_writes_results_for_a_quote_and_claim_scenario():
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
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


def test_cli_resolves_the_policy_by_zero_based_step_index():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
            {"op": "quote", "items": [{"type": "amulet", "material": "silver"}]},
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

    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        "results": [
            {"premium": 115},
            {"premium": 62},
            {"payout": 400, "remainingCap": 1600},
        ]
    }


def test_cli_exits_non_zero_on_an_unknown_item_type():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }

    completed = run_cli(scenario)

    assert completed.returncode != 0
    assert "broomstick" in completed.stderr
    assert "Traceback" not in completed.stderr
    assert completed.stdout == ""


def test_cli_exits_non_zero_on_a_damage_outside_the_policy():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
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

    assert completed.returncode != 0
    assert "amulet" in completed.stderr
    assert "Traceback" not in completed.stderr
    assert completed.stdout == ""


def test_cli_exits_non_zero_on_a_negative_damage_amount():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword", "material": "steel"}]},
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
    assert "-200" in completed.stderr
    assert "Traceback" not in completed.stderr
    assert completed.stdout == ""
