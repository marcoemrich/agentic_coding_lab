"""Test list for the MHPCO Claim Office kata.

Every behavior from the specification is listed here, inactive, ordered from
simplest to most complex. Exactly one behavior is activated per Predictive TDD
cycle by removing its skip marker.

Observable contract reading for rejection cases: the specification states that
the CLI "exits with a non-zero status code and writes an error description to
stderr". The domain layer signals a rejection by raising ClaimOfficeError; the
CLI adapter translates that into exit status 1 plus a stderr description and
writes no results to stdout. This reading is adopted explicitly wherever the
specification only says the claim is rejected.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from claim_office import ClaimOfficeError, claim, quote, run_scenario

# ---------------------------------------------------------------------------
# Quote -- processing fee and the item price list
# ---------------------------------------------------------------------------


def test_empty_item_list_costs_only_the_processing_fee():
    """An empty item list costs only the 5 G processing fee."""
    assert quote(items=[]).premium == 5


def test_plain_sword_has_base_premium_100():
    """A sword's 100 G base premium yields 100 + 10 first insurance + 5 fee = 115 G."""
    assert quote(items=[{"type": "sword"}]).premium == 115


def test_plain_amulet_has_base_premium_60():
    """An amulet's 60 G base premium yields 60 + 6 first insurance + 5 fee = 71 G."""
    assert quote(items=[{"type": "amulet"}]).premium == 71


def test_plain_staff_has_base_premium_80():
    """A staff's 80 G base premium yields 80 + 8 first insurance + 5 fee = 93 G."""
    assert quote(items=[{"type": "staff"}]).premium == 93


def test_plain_potion_has_base_premium_40():
    """A potion's 40 G base premium yields 40 + 4 first insurance + 5 fee = 49 G."""
    assert quote(items=[{"type": "potion"}]).premium == 49


def test_single_rune_has_base_premium_25():
    """A rune's 25 G base premium yields 25 + 2.5 first insurance + 5 fee = 32.5 G, charged as 33 G."""
    assert quote(items=[{"type": "rune"}]).premium == 33


def test_single_moonstone_has_base_premium_25():
    """A moonstone's 25 G base yields 25 + 2.5 first insurance + 5 fee = 32.5 G, charged as 33 G."""
    assert quote(items=[{"type": "moonstone"}]).premium == 33


def test_policy_base_premium_sums_the_item_base_premiums():
    """A policy's base premium sums its items: 160 + 16 first insurance + 5 fee = 181 G."""
    assert quote(items=[{"type": "sword"}, {"type": "amulet"}]).premium == 181


# ---------------------------------------------------------------------------
# Quote -- the building block of 3 alike components
# ---------------------------------------------------------------------------


def test_two_runes_cost_50_base_premium():
    """Two runes fall short of a block: 50 base + 5 first insurance + 5 fee = 60 G."""
    assert quote(items=[{"type": "rune"}, {"type": "rune"}]).premium == 60


def test_three_runes_form_a_block_costing_60_base_premium():
    """Three alike components form a 60 G block: 60 + 6 first insurance + 5 fee = 71 G."""
    assert quote(items=[{"type": "rune"}] * 3).premium == 71


def test_four_runes_cost_100_base_premium_because_a_block_needs_exactly_three():
    """A block needs exactly 3, so 4 runes cost 100 base + 10 first insurance + 5 fee = 115 G."""
    assert quote(items=[{"type": "rune"}] * 4).premium == 115


def test_seven_runes_cost_175_base_premium():
    """Seven runes form no block: 175 base + 17.5 first insurance + 5 fee = 197.5 G, charged as 198 G."""
    assert quote(items=[{"type": "rune"}] * 7).premium == 198


def test_two_runes_and_one_moonstone_form_no_block_because_alike_means_same_type():
    """"Alike" means the same component type, so 2 runes + 1 moonstone form no block: 75 G."""
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert quote(items=items).premium == 88


def test_three_runes_and_three_moonstones_form_two_separate_blocks():
    """Each component type forms its own block: 60 G + 60 G = 120 G base premium."""
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert quote(items=items).premium == 137


# ---------------------------------------------------------------------------
# Quote -- item-specific modifiers
# ---------------------------------------------------------------------------


def test_cursed_item_adds_fifty_percent_of_its_own_base_premium():
    """A cursed sword adds a 50% risk surcharge: 100 G + 50 G = 150 G base premium."""
    items = [{"type": "sword", "cursed": True}]
    assert quote(items=items).premium == 165


def test_enchantment_exactly_five_adds_the_high_enchantment_surcharge():
    """Enchantment 5 meets the inclusive threshold: 100 G + 30 G = 130 G base premium."""
    items = [{"type": "sword", "enchantment": 5}]
    assert quote(items=items).premium == 145


def test_enchantment_four_adds_no_high_enchantment_surcharge():
    """Enchantment 4 falls below the threshold, so the sword costs its plain 100 G base premium."""
    items = [{"type": "sword", "enchantment": 4}]
    assert quote(items=items).premium == 115


def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    """A cursed sword at enchantment 5 carries both surcharges: 100 + 50 + 30 = 180 G."""
    items = [{"type": "sword", "enchantment": 5, "cursed": True}]
    assert quote(items=items).premium == 195


def test_enchantment_four_and_not_cursed_gets_neither_surcharge():
    """An explicitly uncursed sword at enchantment 4 carries neither surcharge: 100 G."""
    items = [{"type": "sword", "enchantment": 4, "cursed": False}]
    assert quote(items=items).premium == 115


def test_item_modifier_applies_only_to_the_affected_items_base_premium():
    """The curse surcharge is 50% of the cursed sword's 100 G, not of the 160 G policy total."""
    items = [{"type": "sword", "cursed": True}, {"type": "amulet"}]
    assert quote(items=items).premium == 231


# ---------------------------------------------------------------------------
# Quote -- policy-wide modifiers
# ---------------------------------------------------------------------------


def test_exactly_two_years_with_mhpco_earns_the_loyalty_discount():
    """Exactly 2 years earns the 20% loyalty discount: 100 - 20 + 10 first insurance + 5 fee = 95 G."""
    customer = {"yearsWithMHPCO": 2}
    assert quote(items=[{"type": "sword"}], customer=customer).premium == 95


def test_one_year_with_mhpco_earns_no_loyalty_discount():
    """One year falls short of the loyalty threshold: 100 + 10 first insurance + 5 fee = 115 G."""
    customer = {"yearsWithMHPCO": 1}
    assert quote(items=[{"type": "sword"}], customer=customer).premium == 115


def test_first_insurance_adds_the_initial_assessment_surcharge():
    """A first insurance adds 10% of the policy base premium: 100 G + 10 G = 110 G."""
    customer = {"yearsWithMHPCO": 0}
    assert quote(items=[{"type": "sword"}], customer=customer).premium == 115


def test_second_contract_earns_the_follow_up_contract_discount():
    """A follow-up contract discounts 15% of the base premium: 100 + 10 - 15 + 5 = 100 G."""
    customer = {"yearsWithMHPCO": 0}
    premium = quote(
        items=[{"type": "sword"}], customer=customer, previous_contracts=1
    ).premium
    assert premium == 100


def test_first_insurance_surcharge_still_applies_on_a_follow_up_contract():
    """Each quoted item is a first insurance: 100 + 10 - 20 loyalty - 15 follow-up + 5 fee = 80 G."""
    customer = {"yearsWithMHPCO": 3}
    premium = quote(
        items=[{"type": "sword"}], customer=customer, previous_contracts=1
    ).premium
    assert premium == 80


def test_processing_fee_is_added_once_at_the_very_end():
    """The fee is added after the modifiers, so it is neither discounted nor surcharged.

    Two swords for a loyal customer: 200 base + 20 first insurance - 40 loyalty = 180 G,
    then one 5 G fee = 185 G.
    """
    customer = {"yearsWithMHPCO": 2}
    items = [{"type": "sword"}, {"type": "sword"}]
    assert quote(items=items, customer=customer).premium == 185


# ---------------------------------------------------------------------------
# Quote -- rounding in the MHPCO's favor
# ---------------------------------------------------------------------------


def test_premium_of_197_point_5_rounds_up_to_198():
    """Premiums round up, in the MHPCO's favor: 7 runes yield 197.5 G, charged as 198 G."""
    assert quote(items=[{"type": "rune"}] * 7).premium == 198


def test_only_the_final_premium_is_rounded_not_the_intermediate_amounts():
    """Intermediates stay fractional: 25 base - 6.25 modifiers + 5 fee = 23.75 G, charged as 24 G.

    Rounding each modifier on the way would give a different answer, so this
    pins the specification's rule that only the final premium is rounded.
    """
    customer = {"yearsWithMHPCO": 3}
    premium = quote(
        items=[{"type": "rune"}], customer=customer, previous_contracts=1
    ).premium
    assert premium == 24


# ---------------------------------------------------------------------------
# Quote -- integration examples
# ---------------------------------------------------------------------------


def test_newcomer_with_a_cursed_sword_pays_165():
    """Spec integration example: 100 base + 50 curse + 10 first insurance + 5 fee = 165 G."""
    customer = {"yearsWithMHPCO": 0}
    items = [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}]
    assert quote(items=items, customer=customer, previous_contracts=0).premium == 165


def test_long_standing_customers_second_contract_pays_160():
    """Spec integration example: 100 + 50 curse + 30 enchantment - 20 loyalty + 10 first
    insurance - 15 follow-up = 155 G, plus the 5 G fee = 160 G."""
    customer = {"yearsWithMHPCO": 3}
    items = [{"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}]
    assert quote(items=items, customer=customer, previous_contracts=1).premium == 160


# ---------------------------------------------------------------------------
# Quote -- rejection
# ---------------------------------------------------------------------------


def test_quote_with_an_unknown_item_type_is_rejected():
    """An item the MHPCO does not insure is rejected, not silently priced at zero."""
    with pytest.raises(ClaimOfficeError):
        quote(items=[{"type": "broomstick"}])


# ---------------------------------------------------------------------------
# Insurance sum and cap
# ---------------------------------------------------------------------------


def test_single_sword_policy_has_insurance_sum_1000_and_cap_2000():
    """A sword is insured at 1000 G, and the payout cap is twice the insurance sum."""
    policy = quote(items=[{"type": "sword"}])
    assert policy.insurance_sum == 1000
    assert policy.cap == 2000


def test_sword_and_amulet_policy_has_insurance_sum_1600_and_cap_3200():
    """The insurance sum adds the items' insurance values: 1000 + 600 = 1600 G, cap 3200 G."""
    policy = quote(items=[{"type": "sword"}, {"type": "amulet"}])
    assert policy.insurance_sum == 1600
    assert policy.cap == 3200


def test_two_sword_policy_has_insurance_sum_2000_and_cap_4000():
    """Two swords are two insured items: sum 2 x 1000 = 2000 G, cap 4000 G."""
    policy = quote(items=[{"type": "sword"}, {"type": "sword"}])
    assert policy.insurance_sum == 2000
    assert policy.cap == 4000


def test_block_discount_does_not_reduce_the_insurance_sum():
    """The block discount is a premium offer only: the sum is still 1000 + 3 x 250 = 1750 G."""
    policy = quote(items=[{"type": "sword"}] + [{"type": "rune"}] * 3)
    assert policy.insurance_sum == 1750
    assert policy.cap == 3500


def test_premium_modifiers_do_not_raise_the_cap():
    """A cursed sword costs 165 G but is still insured at 1000 G, so the cap stays 2000 G."""
    customer = {"yearsWithMHPCO": 0}
    items = [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}]
    policy = quote(items=items, customer=customer)
    assert policy.premium == 165
    assert policy.cap == 2000


def test_staff_policy_has_insurance_sum_800_and_cap_1600():
    """A staff is insured at 800 G, so its cap is 1600 G."""
    policy = quote(items=[{"type": "staff"}])
    assert policy.insurance_sum == 800
    assert policy.cap == 1600


def test_potion_policy_has_insurance_sum_400_and_cap_800():
    """A potion is insured at 400 G, so its cap is 800 G."""
    policy = quote(items=[{"type": "potion"}])
    assert policy.insurance_sum == 400
    assert policy.cap == 800


def test_moonstone_policy_has_insurance_sum_250_and_cap_500():
    """A moonstone is a component insured at 250 G, so its cap is 500 G."""
    policy = quote(items=[{"type": "moonstone"}])
    assert policy.insurance_sum == 250
    assert policy.cap == 500


# ---------------------------------------------------------------------------
# Claim -- standard reimbursement and the deductible
# ---------------------------------------------------------------------------


def test_regular_sword_damage_500_pays_out_400():
    """No special clause applies, so 500 G damage pays 500 - 100 deductible = 400 G."""
    policy = quote(items=[{"type": "sword", "material": "steel", "enchantment": 3}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 500}]}
    assert claim(policy, incident).payout == 400


def test_rune_damage_200_pays_out_100_with_no_special_clause():
    """A rune has no enchantment or material, so 200 G damage pays 200 - 100 = 100 G."""
    policy = quote(items=[{"type": "rune"}])
    incident = {"cause": "theft", "damages": [{"itemType": "rune", "amount": 200}]}
    assert claim(policy, incident).payout == 100


def test_deductible_applies_once_per_damaged_item():
    """A dragon attack on a sword (500 G) and an amulet (300 G) pays 400 + 200 = 600 G."""
    policy = quote(items=[{"type": "sword"}, {"type": "amulet"}])
    incident = {
        "cause": "dragon attack",
        "damages": [
            {"itemType": "sword", "amount": 500},
            {"itemType": "amulet", "amount": 300},
        ],
    }
    assert claim(policy, incident).payout == 600


def test_claim_reports_the_remaining_cap():
    """A 400 G payout against a 2000 G cap leaves 1600 G of cover."""
    policy = quote(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 500}]}
    settlement = claim(policy, incident)
    assert settlement.payout == 400
    assert settlement.remaining_cap == 1600


# ---------------------------------------------------------------------------
# Claim -- special clauses
# ---------------------------------------------------------------------------


def test_high_enchantment_damage_is_reimbursed_at_fifty_percent_before_the_deductible():
    """Enchantment 9 halves the damage first: 1000 -> 500, then 500 - 100 = 400 G."""
    policy = quote(items=[{"type": "sword", "material": "steel", "enchantment": 9}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1000}]}
    assert claim(policy, incident).payout == 400


def test_enchantment_exactly_eight_triggers_the_fifty_percent_clause():
    """Enchantment 8 meets the inclusive threshold: 1000 -> 500, then 500 - 100 = 400 G."""
    policy = quote(items=[{"type": "sword", "material": "dragon", "enchantment": 8}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1000}]}
    assert claim(policy, incident).payout == 400


def test_dragon_material_damage_is_fully_reimbursed_before_the_deductible():
    """Dragon material is fully reimbursed: 800 G damage pays 800 - 100 = 700 G."""
    policy = quote(items=[{"type": "sword", "material": "dragon", "enchantment": 5}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 800}]}
    assert claim(policy, incident).payout == 700


def test_when_both_clauses_apply_the_fifty_percent_rule_wins():
    """Both clauses apply, and the 50% rule takes precedence: 500 - 100 = 400 G."""
    policy = quote(items=[{"type": "sword", "material": "dragon", "enchantment": 9}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1000}]}
    assert claim(policy, incident).payout == 400


# ---------------------------------------------------------------------------
# Claim -- rounding in the MHPCO's favor
# ---------------------------------------------------------------------------


def test_payout_of_350_point_5_rounds_down_to_350():
    """Payouts round down, in the MHPCO's favor: 901 G halved is 450.5, less 100 = 350.5 -> 350 G."""
    policy = quote(items=[{"type": "sword", "material": "steel", "enchantment": 9}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 901}]}
    assert claim(policy, incident).payout == 350


# ---------------------------------------------------------------------------
# Claim -- the cap across successive claims
# ---------------------------------------------------------------------------


def test_first_of_two_successive_claims_pays_1400_and_leaves_600_of_cap():
    """A 1500 G damage pays 1400 G against the 2000 G cap, leaving 600 G."""
    policy = quote(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1500}]}
    settlement = claim(policy, incident)
    assert settlement.payout == 1400
    assert settlement.remaining_cap == 600


def test_second_claim_is_capped_at_the_remaining_cap():
    """The desired 1400 G is reduced to the 600 G of cap left, exhausting the policy."""
    policy = quote(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": 1500}]}
    first = claim(policy, incident)
    second = claim(policy, incident, remaining_cap=first.remaining_cap)
    assert second.payout == 600
    assert second.remaining_cap == 0


# ---------------------------------------------------------------------------
# Claim -- multiple items of the same type
# ---------------------------------------------------------------------------


def test_two_damage_entries_of_the_same_type_each_carry_their_own_deductible():
    """Two insured swords, two damage entries: (500 - 100) + (300 - 100) = 600 G."""
    policy = quote(items=[{"type": "sword"}, {"type": "sword"}])
    incident = {
        "cause": "dragon attack",
        "damages": [
            {"itemType": "sword", "amount": 500},
            {"itemType": "sword", "amount": 300},
        ],
    }
    assert claim(policy, incident).payout == 600


def test_more_damage_entries_of_a_type_than_insured_is_rejected():
    """Two sword damages but only one sword insured: the whole claim is rejected."""
    policy = quote(items=[{"type": "sword"}])
    incident = {
        "cause": "dragon attack",
        "damages": [
            {"itemType": "sword", "amount": 500},
            {"itemType": "sword", "amount": 300},
        ],
    }
    with pytest.raises(ClaimOfficeError):
        claim(policy, incident)


# ---------------------------------------------------------------------------
# Claim -- rejection
# ---------------------------------------------------------------------------


def test_damage_to_an_item_outside_the_policy_is_rejected():
    """An amulet is damaged but only a sword is insured, so the claim is rejected."""
    policy = quote(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}
    with pytest.raises(ClaimOfficeError):
        claim(policy, incident)


def test_damage_to_an_unknown_item_type_is_rejected():
    """A damage entry naming an item the MHPCO does not insure is rejected."""
    policy = quote(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "broomstick", "amount": 200}]}
    with pytest.raises(ClaimOfficeError):
        claim(policy, incident)


def test_negative_damage_amount_is_rejected():
    """A damage of -200 G is not a damage, so the claim is rejected."""
    policy = quote(items=[{"type": "sword"}])
    incident = {"cause": "fire", "damages": [{"itemType": "sword", "amount": -200}]}
    with pytest.raises(ClaimOfficeError):
        claim(policy, incident)


# ---------------------------------------------------------------------------
# Scenario -- steps, sequencing and policy references
# ---------------------------------------------------------------------------


def test_scenario_with_no_steps_produces_no_results():
    """A scenario with no steps yields no results."""
    scenario = {"customer": {"yearsWithMHPCO": 0}, "steps": []}
    assert run_scenario(scenario) == {"results": []}


def test_results_match_the_steps_in_length_and_order():
    """Two quote steps yield two premiums, in order: 115 G, then 62 G as a follow-up."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {"op": "quote", "items": [{"type": "amulet"}]},
        ],
    }
    results = run_scenario(scenario)["results"]
    assert len(results) == 2
    assert results[0] == {"premium": 115}
    assert results[1] == {"premium": 62}


def test_claim_step_refers_to_an_earlier_quote_by_zero_based_step_index():
    """The claim's policy field is the index of the quote step that created the policy."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "amulet"}]},
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 1,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
        ],
    }
    results = run_scenario(scenario)["results"]
    assert results[2] == {"payout": 400, "remainingCap": 1600}


def test_schema_example_scenario_produces_a_quote_then_a_claim_result():
    """The specification's schema example: premium 59 G, then payout 100 G leaving 1100 G."""
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
    assert results[0] == {"premium": 59}
    assert results[1] == {"payout": 100, "remainingCap": 1100}


# ---------------------------------------------------------------------------
# CLI adapter
# ---------------------------------------------------------------------------


CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    """Run the claim-office CLI over a scenario, as the specification describes it."""
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


def test_cli_reads_a_scenario_from_stdin_and_writes_results_to_stdout():
    """The CLI reads a scenario from stdin and writes its results as JSON to stdout."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "sword"}]}],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    assert json.loads(result.stdout) == {"results": [{"premium": 115}]}


def test_cli_uses_the_binding_output_field_names_with_integer_values():
    """The binding field names are premium, payout and remainingCap, all integers."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "rune"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "rune", "amount": 201}],
                },
            },
        ],
    }
    result = run_cli(scenario)
    assert result.returncode == 0
    quote_result, claim_result = json.loads(result.stdout)["results"]
    assert list(quote_result) == ["premium"]
    assert sorted(claim_result) == ["payout", "remainingCap"]
    assert isinstance(quote_result["premium"], int)
    assert isinstance(claim_result["payout"], int)
    assert isinstance(claim_result["remainingCap"], int)


def test_cli_exits_non_zero_with_a_stderr_description_and_no_stdout_results_on_rejection():
    """A rejected scenario exits non-zero with a description on stderr and nothing on stdout.

    The MHPCO's refusal is a business outcome, so the CLI reports it as a
    description rather than letting a Python traceback reach stderr.
    """
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    result = run_cli(scenario)
    assert result.returncode != 0
    assert result.stdout == ""
    assert "broomstick" in result.stderr
    assert "Traceback" not in result.stderr
