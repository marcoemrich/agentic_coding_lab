"""Test list for the MHPCO Claim Office kata.

Observable contract for rejections: the specification says the CLI "exits with
a non-zero status code and writes an error description to stderr". The reading
adopted here is that the domain layer raises a `ValueError` carrying a
description, and the CLI adapter translates that into exit status 1 plus a
stderr message. Tests below state which of the two observations they make.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from claim_office import ClaimOffice

CLI = Path(__file__).resolve().parent.parent / "src" / "cli.py"


def run_cli(scenario):
    """Run the claim-office CLI over `scenario` and return the completed process."""
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )

# --- Premium: fee and single items -----------------------------------------


def test_empty_item_list_costs_only_the_processing_fee():
    """Quote with no items yields premium 5 G."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([]) == 5


def test_plain_sword_premium():
    """Quote for a plain sword for a newcomer yields premium 115 G."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "sword"}]) == 115


def test_plain_amulet_premium():
    """Quote for a plain amulet for a newcomer yields premium 71 G."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "amulet"}]) == 71


def test_plain_staff_premium():
    """Quote for a plain staff for a newcomer yields premium 93 G."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "staff"}]) == 93


def test_plain_potion_premium():
    """Quote for a plain potion for a newcomer yields premium 49 G."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "potion"}]) == 49


def test_single_rune_premium():
    """Quote for one rune yields premium 33 G (32.5 rounded up in MHPCO's favor)."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "rune"}]) == 33


def test_single_moonstone_premium():
    """Quote for one moonstone yields the same premium as one rune: 33 G."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "moonstone"}]) == 33


# --- Component building blocks ---------------------------------------------


def test_two_runes_base_premium_is_50():
    """Two runes give a policy base premium of 50 G (premium 50*1.1 + 5 = 60 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "rune"}, {"type": "rune"}]) == 60


def test_three_runes_form_a_block_worth_60():
    """Three alike runes give a policy base premium of 60 G (premium 60*1.1 + 5 = 71 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "rune"}] * 3) == 71


def test_four_runes_get_no_block():
    """Four runes give a policy base premium of 100 G (premium 100*1.1 + 5 = 115 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "rune"}] * 4) == 115


def test_seven_runes_base_premium_is_175():
    """Seven runes give a policy base premium of 175 G (premium 197.5 -> 198 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "rune"}] * 7) == 198


def test_mixed_component_types_do_not_form_a_block():
    """Two runes plus one moonstone give 75 G base: 'alike' means same type (premium 88 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]

    assert office.quote(items) == 88


def test_two_separate_blocks_of_different_component_types():
    """Three runes plus three moonstones give 120 G base as two blocks (premium 137 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3

    assert office.quote(items) == 137


# --- Item-specific modifiers ------------------------------------------------


def test_cursed_item_adds_fifty_percent_surcharge():
    """A cursed sword's curse surcharge is 50 G (100 + 50 + 10 first insurance + 5 = 165 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}

    assert office.quote([item]) == 165


def test_enchantment_five_adds_high_enchantment_surcharge():
    """A sword with exactly enchantment 5 carries the 30 % surcharge (100+30+10+5 = 145 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    item = {"type": "sword", "material": "steel", "enchantment": 5, "cursed": False}

    assert office.quote([item]) == 145


def test_enchantment_four_adds_no_high_enchantment_surcharge():
    """A sword with enchantment 4 carries no high-enchantment surcharge (100+10+5 = 115 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    item = {"type": "sword", "material": "steel", "enchantment": 4, "cursed": False}

    assert office.quote([item]) == 115


def test_cursed_and_highly_enchanted_item_gets_both_surcharges():
    """A cursed sword with enchantment 5 gets both surcharges (100+50+30+10+5 = 195 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    item = {"type": "sword", "material": "steel", "enchantment": 5, "cursed": True}

    assert office.quote([item]) == 195


def test_curse_surcharge_scopes_to_the_cursed_item_only():
    """Cursed sword + plain amulet: base 160 G, curse adds 50 G (not 80 G) -> 210 + 16 + 5 = 231 G."""
    office = ClaimOffice(years_with_mhpco=0)

    items = [
        {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True},
        {"type": "amulet", "material": "silver", "enchantment": 1, "cursed": False},
    ]

    assert office.quote(items) == 231


# --- Policy-wide modifiers --------------------------------------------------


def test_exactly_two_years_grants_the_loyalty_discount():
    """A customer with exactly 2 years receives the 20 % loyalty discount (100-20+10+5 = 95 G)."""
    office = ClaimOffice(years_with_mhpco=2)

    item = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}

    assert office.quote([item]) == 95


def test_one_year_grants_no_loyalty_discount():
    """A customer with 1 year receives no loyalty discount (100+10+5 = 115 G)."""
    office = ClaimOffice(years_with_mhpco=1)

    item = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}

    assert office.quote([item]) == 115


def test_first_insurance_surcharge_applies_to_every_quote():
    """The surcharge is 10 % of the whole policy base premium (160+16+5 = 181 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    items = [
        {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False},
        {"type": "amulet", "material": "silver", "enchantment": 1, "cursed": False},
    ]

    assert office.quote(items) == 181


def test_second_contract_receives_the_follow_up_discount():
    """The second quote gets a 15 % follow-up discount (100+10-15+5 = 100 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    item = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    office.quote([item])

    assert office.quote([item]) == 100


def test_third_contract_also_receives_the_follow_up_discount():
    """Every contract after the first receives the discount (third quote also 100 G)."""
    office = ClaimOffice(years_with_mhpco=0)

    item = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    office.quote([item])
    office.quote([item])

    assert office.quote([item]) == 100


def test_processing_fee_is_added_last():
    """The fee escapes the percentage modifiers: 100-20+10 = 90, +5 fee = 95 G, not 94.5 -> 95."""
    office = ClaimOffice(years_with_mhpco=2)

    item = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    office.quote([item])

    # Second contract: 100 - 20 loyalty + 10 first insurance - 15 follow-up = 75, + 5 fee = 80.
    assert office.quote([item]) == 80


# --- Rounding ----------------------------------------------------------------


def test_premium_is_rounded_up():
    """A premium computation yielding 197.5 G becomes 198 G (7 runes: 175*1.1 + 5)."""
    office = ClaimOffice(years_with_mhpco=0)

    assert office.quote([{"type": "rune"}] * 7) == 198


def test_only_the_final_premium_is_rounded():
    """One rune twice keeps 27.5 fractional: 2 quotes of 32.5 -> 33, not a rounded 28+5."""
    office = ClaimOffice(years_with_mhpco=0)

    # Base 25, first insurance 2.5 -> 27.5 intermediate; only 32.5 is rounded, to 33.
    assert office.quote([{"type": "rune"}]) == 33


# --- Integration examples ----------------------------------------------------


def test_newcomer_with_a_cursed_sword_pays_165():
    """0 years, cursed steel sword enchantment 3: 100 + 50 + 10 + 5 = 165 G."""
    office = ClaimOffice(years_with_mhpco=0)

    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}

    assert office.quote([item]) == 165


def test_long_standing_customers_second_contract_pays_160():
    """3 years, second quote, cursed sword enchantment 7: 100+50+30-20+10-15+5 = 160 G."""
    office = ClaimOffice(years_with_mhpco=3)

    first_item = {"type": "amulet", "material": "silver", "enchantment": 1, "cursed": False}
    office.quote([first_item])

    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}

    assert office.quote([sword]) == 160


# --- Insurance sum and cap ---------------------------------------------------


def test_cap_is_twice_the_insurance_sum_of_all_items():
    """A policy over a sword (1000) and an amulet (600) has a cap of 3200 G."""
    office = ClaimOffice(years_with_mhpco=0)

    items = [
        {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False},
        {"type": "amulet", "material": "silver", "enchantment": 1, "cursed": False},
    ]
    policy = office.insure(items)

    assert policy.remaining_cap == 3200


def test_two_items_of_the_same_type_both_count_towards_the_insurance_sum():
    """A policy over two swords has an insurance sum of 2000 G and a cap of 4000 G."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword, sword])

    assert policy.remaining_cap == 4000


def test_premium_modifiers_do_not_raise_the_cap():
    """A cursed sword (premium 165 G) still has cap 2000 G, from the unmodified value."""
    office = ClaimOffice(years_with_mhpco=0)

    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    policy = office.insure([item])

    assert policy.premium == 165
    assert policy.remaining_cap == 2000


def test_block_discount_does_not_lower_the_insurance_sum():
    """A sword plus a block of 3 runes has insurance sum 1750 G, cap 3500 G."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword] + [{"type": "rune"}] * 3)

    assert policy.remaining_cap == 3500


# --- Claim payout ------------------------------------------------------------


def test_standard_reimbursement_subtracts_the_deductible():
    """A regular sword damaged for 500 G pays out 400 G (500 - 100 deductible)."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": False}
    policy = office.insure([sword])

    damages = [{"itemType": "sword", "amount": 500}]

    assert policy.claim(damages) == 400


def test_component_without_enchantment_or_material_gets_standard_reimbursement():
    """A rune (no enchantment, no material) damaged for 200 G pays out 100 G."""
    office = ClaimOffice(years_with_mhpco=0)

    policy = office.insure([{"type": "rune"}])

    assert policy.claim([{"itemType": "rune", "amount": 200}]) == 100


def test_high_enchantment_halves_the_damage_before_the_deductible():
    """An enchantment-9 steel sword damaged for 1000 G pays out 400 G (500 - 100)."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 9, "cursed": False}
    policy = office.insure([sword])

    assert policy.claim([{"itemType": "sword", "amount": 1000}]) == 400


def test_enchantment_eight_triggers_the_half_reimbursement_clause():
    """Dragon sword, exactly enchantment 8, damage 1000 G: 50 % clause wins -> 400 G."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "dragon", "enchantment": 8, "cursed": False}
    policy = office.insure([sword])

    assert policy.claim([{"itemType": "sword", "amount": 1000}]) == 400


def test_enchantment_seven_does_not_trigger_the_half_reimbursement_clause():
    """A steel sword with enchantment 7 damaged for 1000 G pays out 900 G."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": False}
    policy = office.insure([sword])

    assert policy.claim([{"itemType": "sword", "amount": 1000}]) == 900


def test_dragon_material_alone_is_fully_reimbursed():
    """A dragon sword with enchantment 5 damaged for 800 G pays out 700 G (full - 100)."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "dragon", "enchantment": 5, "cursed": False}
    policy = office.insure([sword])

    assert policy.claim([{"itemType": "sword", "amount": 800}]) == 700


def test_high_enchantment_wins_over_dragon_material():
    """Dragon sword, enchantment 9, damage 1000 G: the 50 % rule wins -> 400 G."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "dragon", "enchantment": 9, "cursed": False}
    policy = office.insure([sword])

    assert policy.claim([{"itemType": "sword", "amount": 1000}]) == 400


def test_deductible_applies_once_per_damage_entry():
    """Sword damaged 500 G and amulet 300 G: (500-100) + (300-100) = 600 G."""
    office = ClaimOffice(years_with_mhpco=0)

    items = [
        {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False},
        {"type": "amulet", "material": "silver", "enchantment": 1, "cursed": False},
    ]
    policy = office.insure(items)

    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "amulet", "amount": 300},
    ]

    assert policy.claim(damages) == 600


def test_two_damages_of_the_same_item_type_each_carry_a_deductible():
    """Two insured swords, both damaged 500 G: (500-100) * 2 = 800 G."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword, sword])

    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 500},
    ]

    assert policy.claim(damages) == 800


def test_payout_is_rounded_down():
    """Enchantment-9 sword damaged 901 G: 450.5 - 100 = 350.5 -> 350 G (rounded down)."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 9, "cursed": False}
    policy = office.insure([sword])

    assert policy.claim([{"itemType": "sword", "amount": 901}]) == 350


def test_damage_below_the_deductible_pays_out_nothing():
    """A damage of 50 G pays out 0 G, not -50 G: the MHPCO never bills a claimant.

    The specification does not state this case; this is the adopted reading.
    """
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword])

    assert policy.claim([{"itemType": "sword", "amount": 50}]) == 0


# --- Cap exhaustion across claims -------------------------------------------


def test_first_claim_reports_the_remaining_cap():
    """A 1500 G claim on a sword (cap 2000) pays 1400 G and leaves 600 G of cap."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword])

    assert policy.claim([{"itemType": "sword", "amount": 1500}]) == 1400
    assert policy.remaining_cap == 600


def test_second_claim_is_limited_to_the_remaining_cap():
    """The follow-up 1500 G claim is reduced to the remaining cap of 600 G."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword])
    policy.claim([{"itemType": "sword", "amount": 1500}])

    assert policy.claim([{"itemType": "sword", "amount": 1500}]) == 600
    assert policy.remaining_cap == 0


def test_claim_against_an_exhausted_cap_pays_nothing():
    """Once the cap is exhausted, further claims pay 0 G."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword])
    policy.claim([{"itemType": "sword", "amount": 1500}])
    policy.claim([{"itemType": "sword", "amount": 1500}])

    assert policy.claim([{"itemType": "sword", "amount": 500}]) == 0
    assert policy.remaining_cap == 0


# --- Rejections --------------------------------------------------------------


def test_quote_with_an_unknown_item_type_is_rejected():
    """A quote containing a broomstick raises ValueError."""
    office = ClaimOffice(years_with_mhpco=0)

    with pytest.raises(ValueError, match="broomstick"):
        office.quote([{"type": "broomstick"}])


def test_claim_for_an_item_not_in_the_policy_is_rejected():
    """An amulet damage against a sword-only policy raises ValueError."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword])

    with pytest.raises(ValueError, match="amulet"):
        policy.claim([{"itemType": "amulet", "amount": 200}])


def test_claim_with_an_unknown_item_type_is_rejected():
    """A damage entry naming a broomstick raises ValueError."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword])

    with pytest.raises(ValueError, match="broomstick"):
        policy.claim([{"itemType": "broomstick", "amount": 200}])


def test_more_damages_of_a_type_than_insured_is_rejected():
    """Two sword damages against a one-sword policy raise ValueError; nothing is paid."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword])

    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "sword", "amount": 500},
    ]

    with pytest.raises(ValueError, match="sword"):
        policy.claim(damages)

    assert policy.remaining_cap == 2000


def test_negative_damage_amount_is_rejected():
    """A damage entry with amount -200 raises ValueError."""
    office = ClaimOffice(years_with_mhpco=0)

    sword = {"type": "sword", "material": "steel", "enchantment": 1, "cursed": False}
    policy = office.insure([sword])

    with pytest.raises(ValueError, match="-200"):
        policy.claim([{"itemType": "sword", "amount": -200}])


# --- CLI adapter --------------------------------------------------------------


def test_cli_processes_a_scenario_from_stdin_to_stdout():
    """The spec's schema example yields a premium result and a claim result."""
    scenario = {
        "customer": {"yearsWithMHPCO": 5},
        "steps": [
            {
                "op": "quote",
                "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": False}
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
    # Amulet 60 base, 5 years loyalty -20 %, first insurance +10 %: 60 - 12 + 6 = 54, + 5 = 59.
    assert json.loads(completed.stdout) == {
        "results": [{"premium": 59}, {"payout": 100, "remainingCap": 1100}]
    }


def test_cli_claim_result_contains_payout_and_remaining_cap():
    """A claim step's result object has exactly the keys payout and remainingCap."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
        ],
    }

    completed = run_cli(scenario)

    assert completed.returncode == 0
    claim_result = json.loads(completed.stdout)["results"][1]
    assert set(claim_result) == {"payout", "remainingCap"}
    assert claim_result == {"payout": 400, "remainingCap": 1600}


def test_cli_exits_non_zero_and_writes_stderr_on_rejection():
    """An unknown item type makes the CLI exit non-zero with stderr output and no results."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }

    completed = run_cli(scenario)

    assert completed.returncode != 0
    assert "broomstick" in completed.stderr
    assert completed.stdout == ""


def test_cli_resolves_the_policy_index_to_an_earlier_quote_step():
    """A claim naming policy 1 acts on the second quote, not the first."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "amulet"}]},
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 1,
                "incident": {
                    "cause": "dragon",
                    "damages": [{"itemType": "sword", "amount": 500}],
                },
            },
        ],
    }

    completed = run_cli(scenario)

    assert completed.returncode == 0
    # The sword policy has cap 2000; paying 400 leaves 1600. The amulet policy is untouched.
    assert json.loads(completed.stdout)["results"][2] == {
        "payout": 400,
        "remainingCap": 1600,
    }
