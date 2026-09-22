"""Test list for the MHPCO Claim Office kata.

Every behavior from prompt.md is represented here as an inactive test.
Exactly one behavior is activated per Predictive TDD cycle by removing its
``@pytest.mark.skip`` marker.

Observable contract readings adopted where the specification leaves a
mechanism open:

* The specification states failure cases in CLI terms ("the CLI exits with a
  non-zero status code and writes an error description to stderr"). The most
  defensible reading is that the domain raises an error and ``src/cli.py``
  translates it into exit status plus stderr. The domain-level tests therefore
  assert a raised exception; ``ValueError`` is the representative type for
  rejected input. No exact message is asserted, because the specification
  defines none -- only that a description is written.
* "rounded in the MHPCO's favor" means premiums round up (ceiling) and payouts
  round down (floor); intermediate values stay exact fractions.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from claim_office import policy_for, quote_premium, run_scenario, settle_claim

# ---------------------------------------------------------------------------
# Quote: base premiums per item type (parallel price-list catalogue)
# ---------------------------------------------------------------------------


def test_empty_item_list_premium_is_processing_fee_only():
    assert quote_premium(items=[]) == 5


def test_plain_sword_base_premium_is_100():
    # 100 base + 10 first insurance + 5 fee
    assert quote_premium(items=[{"type": "sword"}]) == 115


def test_plain_amulet_base_premium_is_60():
    # 60 base + 6 first insurance + 5 fee
    assert quote_premium(items=[{"type": "amulet"}]) == 71


def test_plain_staff_base_premium_is_80():
    # 80 base + 8 first insurance + 5 fee
    assert quote_premium(items=[{"type": "staff"}]) == 93


def test_plain_potion_base_premium_is_40():
    # 40 base + 4 first insurance + 5 fee
    assert quote_premium(items=[{"type": "potion"}]) == 49


def test_single_rune_base_premium_is_25():
    # 25 base + 2.5 first insurance + 5 fee = 32.5 -> 33
    assert quote_premium(items=[{"type": "rune"}]) == 33


def test_single_moonstone_base_premium_is_25():
    # 25 base + 2.5 first insurance + 5 fee = 32.5 -> 33
    assert quote_premium(items=[{"type": "moonstone"}]) == 33


def test_two_main_items_sum_their_base_premiums():
    items = [{"type": "sword"}, {"type": "amulet"}]
    # 160 base + 16 first insurance + 5 fee
    assert quote_premium(items=items) == 181


# ---------------------------------------------------------------------------
# Quote: component building block of 3 alike components
# ---------------------------------------------------------------------------


def test_two_runes_base_premium_is_50():
    items = [{"type": "rune"}, {"type": "rune"}]
    # 50 base + 5 first insurance + 5 fee
    assert quote_premium(items=items) == 60


def test_three_runes_form_a_block_priced_at_60():
    items = [{"type": "rune"}] * 3
    # 60 block base + 6 first insurance + 5 fee
    assert quote_premium(items=items) == 71


def test_four_runes_get_no_block_discount():
    items = [{"type": "rune"}] * 4
    # 100 base + 10 first insurance + 5 fee
    assert quote_premium(items=items) == 115


def test_seven_runes_base_premium_is_175():
    items = [{"type": "rune"}] * 7
    # 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
    assert quote_premium(items=items) == 198


def test_two_runes_plus_one_moonstone_form_no_block():
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    # 75 base + 7.5 first insurance + 5 fee = 87.5 -> 88
    assert quote_premium(items=items) == 88


def test_three_runes_and_three_moonstones_form_two_separate_blocks():
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    # 120 base (two blocks) + 12 first insurance + 5 fee
    assert quote_premium(items=items) == 137


# ---------------------------------------------------------------------------
# Quote: item-specific modifiers
# ---------------------------------------------------------------------------


def test_cursed_item_adds_fifty_percent_risk_surcharge():
    cursed = quote_premium(items=[{"type": "sword", "cursed": True}])
    plain = quote_premium(items=[{"type": "sword", "cursed": False}])
    assert cursed - plain == 50


def test_enchantment_exactly_five_adds_high_enchantment_surcharge():
    enchanted = quote_premium(items=[{"type": "sword", "enchantment": 5}])
    plain = quote_premium(items=[{"type": "sword", "enchantment": 0}])
    assert enchanted - plain == 30


def test_enchantment_four_adds_no_high_enchantment_surcharge():
    enchanted = quote_premium(items=[{"type": "sword", "enchantment": 4}])
    plain = quote_premium(items=[{"type": "sword", "enchantment": 0}])
    assert enchanted - plain == 0


def test_cursed_and_high_enchantment_surcharges_both_apply():
    both = quote_premium(items=[{"type": "sword", "cursed": True, "enchantment": 5}])
    plain = quote_premium(items=[{"type": "sword", "cursed": False, "enchantment": 0}])
    assert both - plain == 80


def test_cursed_with_enchantment_four_gets_only_curse_surcharge():
    cursed = quote_premium(items=[{"type": "sword", "cursed": True, "enchantment": 4}])
    plain = quote_premium(items=[{"type": "sword", "cursed": False, "enchantment": 4}])
    assert cursed - plain == 50


def test_cursed_surcharge_applies_only_to_the_cursed_item_not_the_policy_total():
    items = [{"type": "sword", "cursed": True}, {"type": "amulet"}]
    # 160 policy base + 50 (50 % of the sword alone, not of 160)
    # + 16 first insurance (10 % of the 160 policy base) + 5 fee
    assert quote_premium(items=items) == 231


# ---------------------------------------------------------------------------
# Quote: policy-wide modifiers
# ---------------------------------------------------------------------------


def test_loyalty_discount_applies_at_exactly_two_years():
    loyal = quote_premium(items=[{"type": "sword"}], customer={"yearsWithMHPCO": 2})
    new = quote_premium(items=[{"type": "sword"}], customer={"yearsWithMHPCO": 0})
    # 20 % of the 100 G policy base premium
    assert new - loyal == 20


def test_loyalty_discount_does_not_apply_below_two_years():
    one_year = quote_premium(items=[{"type": "sword"}], customer={"yearsWithMHPCO": 1})
    new = quote_premium(items=[{"type": "sword"}], customer={"yearsWithMHPCO": 0})
    assert one_year == new


def test_first_insurance_surcharge_applies_to_every_quoted_item():
    # every item in a quote is a first insurance: 100 base + 10 + 5 fee
    newcomer = {"yearsWithMHPCO": 0}
    assert quote_premium(items=[{"type": "sword"}], customer=newcomer) == 115


def test_follow_up_contract_discount_applies_from_the_second_contract_on():
    first = quote_premium(items=[{"type": "sword"}], preceding_contracts=0)
    second = quote_premium(items=[{"type": "sword"}], preceding_contracts=1)
    # 15 % of the 100 G policy base premium
    assert first - second == 15


def test_follow_up_contract_discount_applies_to_every_contract_after_the_first():
    second = quote_premium(items=[{"type": "sword"}], preceding_contracts=1)
    third = quote_premium(items=[{"type": "sword"}], preceding_contracts=2)
    assert third == second


def test_processing_fee_is_added_at_the_very_end():
    # 100 base + 10 first insurance - 20 loyalty = 90, then a flat 5 G fee.
    # A fee added before the discounts would yield 94.5 instead.
    loyal = {"yearsWithMHPCO": 2}
    assert quote_premium(items=[{"type": "sword"}], customer=loyal) == 95


# ---------------------------------------------------------------------------
# Quote: rounding in the MHPCO's favor
# ---------------------------------------------------------------------------


def test_premium_is_rounded_up_in_mhpco_favor():
    # 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
    premium = quote_premium(items=[{"type": "rune"}] * 7)
    assert premium == 198
    assert isinstance(premium, int)


def test_only_the_final_premium_is_rounded_not_intermediate_amounts():
    # 2 runes + 1 moonstone = 75 base; +7.5 assessment, -15 loyalty,
    # -11.25 follow-up = 56.25, + 5 fee = 61.25 -> 62.
    # Truncating each modifier first would yield 61 instead.
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    premium = quote_premium(
        items=items, customer={"yearsWithMHPCO": 3}, preceding_contracts=1
    )
    assert premium == 62


# ---------------------------------------------------------------------------
# Quote: integration examples
# ---------------------------------------------------------------------------


def test_newcomer_with_a_cursed_sword_pays_165():
    # 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165
    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    premium = quote_premium(
        items=[sword], customer={"yearsWithMHPCO": 0}, preceding_contracts=0
    )
    assert premium == 165


def test_long_standing_customers_second_contract_pays_160():
    # 100 base + 50 curse + 30 high enchantment - 20 loyalty
    # + 10 first insurance - 15 follow-up contract = 155, + 5 fee = 160
    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    premium = quote_premium(
        items=[sword], customer={"yearsWithMHPCO": 3}, preceding_contracts=1
    )
    assert premium == 160


# ---------------------------------------------------------------------------
# Quote: rejection
# ---------------------------------------------------------------------------


def test_quote_with_unknown_item_type_is_rejected():
    with pytest.raises(ValueError):
        quote_premium(items=[{"type": "broomstick"}])


# ---------------------------------------------------------------------------
# Claim: insurance sum and cap
# ---------------------------------------------------------------------------


def test_insurance_sum_is_the_sum_of_item_insurance_values_and_cap_is_twice_it():
    policy = policy_for(items=[{"type": "sword"}, {"type": "amulet"}])
    assert policy.insurance_sum == 1600
    assert policy.remaining_cap == 3200


def test_premium_modifiers_do_not_raise_the_cap():
    cursed_sword = {"type": "sword", "cursed": True}
    assert quote_premium(items=[cursed_sword]) == 165
    policy = policy_for(items=[cursed_sword])
    assert policy.insurance_sum == 1000
    assert policy.remaining_cap == 2000


def test_block_discount_does_not_reduce_the_insurance_sum():
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    policy = policy_for(items=items)
    # 1000 + 3 x 250; the block discount is a premium offer only
    assert policy.insurance_sum == 1750
    assert policy.remaining_cap == 3500


def test_two_swords_double_the_insurance_sum_and_cap():
    policy = policy_for(items=[{"type": "sword"}, {"type": "sword"}])
    assert policy.insurance_sum == 2000
    assert policy.remaining_cap == 4000


# ---------------------------------------------------------------------------
# Claim: standard reimbursement and deductible
# ---------------------------------------------------------------------------


def test_standard_damage_is_fully_reimbursed_minus_the_deductible():
    sword = {"type": "sword", "material": "steel", "enchantment": 3}
    policy = policy_for(items=[sword])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 500}]}
    assert settle_claim(policy, incident) == 400


def test_component_damage_gets_no_special_clause():
    policy = policy_for(items=[{"type": "rune"}])
    incident = {"cause": "fire", "damages": [{"itemType": "rune", "amount": 200}]}
    assert settle_claim(policy, incident) == 100


def test_deductible_applies_once_per_damaged_item():
    policy = policy_for(items=[{"type": "sword"}, {"type": "amulet"}])
    incident = {
        "cause": "dragon attack",
        "damages": [
            {"itemType": "sword", "amount": 500},
            {"itemType": "amulet", "amount": 300},
        ],
    }
    # (500 - 100) + (300 - 100)
    assert settle_claim(policy, incident) == 600


def test_repeated_item_type_damages_each_carry_their_own_deductible():
    policy = policy_for(items=[{"type": "sword"}, {"type": "sword"}])
    incident = {
        "cause": "dragon attack",
        "damages": [
            {"itemType": "sword", "amount": 500},
            {"itemType": "sword", "amount": 500},
        ],
    }
    # (500 - 100) twice, not 1000 - 100
    assert settle_claim(policy, incident) == 800


# ---------------------------------------------------------------------------
# Claim: special clauses
# ---------------------------------------------------------------------------


def test_high_enchantment_damage_is_reimbursed_at_fifty_percent():
    sword = {"type": "sword", "material": "steel", "enchantment": 9}
    policy = policy_for(items=[sword])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1000}]}
    # 50 % of 1000 = 500, then the 100 G deductible
    assert settle_claim(policy, incident) == 400


def test_high_enchantment_clause_threshold_of_eight_is_inclusive():
    sword = {"type": "sword", "material": "steel", "enchantment": 8}
    policy = policy_for(items=[sword])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1000}]}
    assert settle_claim(policy, incident) == 400


def test_enchantment_seven_damage_gets_no_fifty_percent_reduction():
    sword = {"type": "sword", "material": "steel", "enchantment": 7}
    policy = policy_for(items=[sword])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1000}]}
    assert settle_claim(policy, incident) == 900


def test_dragon_material_damage_is_fully_reimbursed():
    sword = {"type": "sword", "material": "dragon", "enchantment": 5}
    policy = policy_for(items=[sword])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 800}]}
    # only the dragon-material clause applies: full reimbursement, then deductible
    assert settle_claim(policy, incident) == 700


def test_high_enchantment_beats_dragon_material_when_both_apply():
    sword = {"type": "sword", "material": "dragon", "enchantment": 9}
    policy = policy_for(items=[sword])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1000}]}
    # both clauses apply; the 50 % rule wins: 500, then the deductible
    assert settle_claim(policy, incident) == 400


def test_dragon_material_sword_at_enchantment_exactly_eight_pays_400():
    sword = {"type": "sword", "material": "dragon", "enchantment": 8}
    policy = policy_for(items=[sword])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1000}]}
    assert settle_claim(policy, incident) == 400


# ---------------------------------------------------------------------------
# Claim: rounding and cap exhaustion
# ---------------------------------------------------------------------------


def test_payout_is_rounded_down_in_mhpco_favor():
    # 50 % of 901 = 450.5, minus the 100 G deductible = 350.5 -> 350
    sword = {"type": "sword", "material": "steel", "enchantment": 9}
    policy = policy_for(items=[sword])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 901}]}
    payout = settle_claim(policy, incident)
    assert payout == 350
    assert isinstance(payout, int)


def test_first_claim_reports_the_remaining_cap():
    policy = policy_for(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1500}]}
    assert settle_claim(policy, incident) == 1400
    assert policy.remaining_cap == 600


def test_successive_claims_are_limited_to_the_remaining_cap():
    policy = policy_for(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1500}]}
    assert settle_claim(policy, incident) == 1400
    # the desired 1400 G is reduced to the remaining cap
    assert settle_claim(policy, incident) == 600
    assert policy.remaining_cap == 0


def test_claim_against_an_exhausted_cap_pays_nothing():
    policy = policy_for(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1500}]}
    settle_claim(policy, incident)
    settle_claim(policy, incident)
    assert settle_claim(policy, incident) == 0
    assert policy.remaining_cap == 0


# ---------------------------------------------------------------------------
# Claim: rejection
# ---------------------------------------------------------------------------


def test_claim_for_an_item_outside_the_policy_is_rejected():
    policy = policy_for(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}
    with pytest.raises(ValueError):
        settle_claim(policy, incident)


def test_claim_with_an_unknown_item_type_is_rejected():
    policy = policy_for(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "broomstick", "amount": 200}]}
    with pytest.raises(ValueError):
        settle_claim(policy, incident)


def test_claim_with_more_damages_of_a_type_than_insured_is_rejected():
    policy = policy_for(items=[{"type": "sword"}])
    incident = {
        "cause": "dragon attack",
        "damages": [
            {"itemType": "sword", "amount": 500},
            {"itemType": "sword", "amount": 500},
        ],
    }
    with pytest.raises(ValueError):
        settle_claim(policy, incident)
    # the whole claim is rejected: the cap is untouched
    assert policy.remaining_cap == 2000


def test_claim_with_a_negative_damage_amount_is_rejected():
    policy = policy_for(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": -200}]}
    with pytest.raises(ValueError):
        settle_claim(policy, incident)


# ---------------------------------------------------------------------------
# Scenario orchestration
# ---------------------------------------------------------------------------


def test_scenario_results_mirror_the_steps_in_length_and_order():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
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
    results = run_scenario(scenario)["results"]
    assert results == [
        {"premium": 115},
        {"payout": 400, "remainingCap": 1600},
    ]


def test_claim_step_resolves_its_policy_by_quote_step_index():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "quote", "items": [{"type": "amulet"}]},
            {
                "op": "claim",
                "policy": 1,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 300}],
                },
            },
        ],
    }
    results = run_scenario(scenario)["results"]
    # the claim settles against the amulet policy: cap 1200, payout 300 - 100
    assert results[2] == {"payout": 200, "remainingCap": 1000}


def test_schema_example_scenario_produces_quote_and_claim_results():
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
    results = run_scenario(scenario)["results"]
    # 60 base + 6 first insurance - 12 loyalty = 54, + 5 fee = 59
    assert results[0] == {"premium": 59}
    # 200 - 100 deductible; cap 1200 - 100
    assert results[1] == {"payout": 100, "remainingCap": 1100}


# ---------------------------------------------------------------------------
# CLI adapter
# ---------------------------------------------------------------------------


CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario_json):
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=scenario_json,
        capture_output=True,
        text=True,
        check=False,
    )


def test_cli_reads_scenario_from_stdin_and_writes_results_to_stdout():
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {"op": "quote", "items": [{"type": "amulet"}]},
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
    completed = run_cli(json.dumps(scenario))
    assert completed.returncode == 0
    assert json.loads(completed.stdout) == {
        "results": [
            {"premium": 59},
            {"payout": 100, "remainingCap": 1100},
        ]
    }


def test_cli_exits_non_zero_and_reports_on_stderr_for_rejected_input():
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    completed = run_cli(json.dumps(scenario))
    assert completed.returncode != 0
    assert completed.stdout == ""
    # an error description, not an unhandled traceback
    assert "Traceback" not in completed.stderr
    assert "broomstick" in completed.stderr
