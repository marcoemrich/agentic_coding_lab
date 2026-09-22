"""Executable specification for the MHPCO claim-office CLI."""

import json
import subprocess
import sys
from pathlib import Path

import pytest


CLI = Path(__file__).parents[1] / "src" / "cli.py"


def run_cli(steps, years=0):
    scenario = {"customer": {"yearsWithMHPCO": years}, "steps": steps}
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(scenario),
        capture_output=True,
        text=True,
        check=False,
    )


def successful_results(steps, years=0):
    completed = run_cli(steps, years)
    assert completed.returncode == 0, completed.stderr
    return json.loads(completed.stdout)["results"]


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages):
    return {
        "op": "claim",
        "policy": policy,
        "incident": {"cause": "test incident", "damages": damages},
    }


def assert_cli_rejection(steps):
    completed = run_cli(steps)
    assert completed.returncode != 0
    assert completed.stderr
    assert completed.stdout == ""


def test_empty_quote_costs_5_g():
    """An empty quote has premium 5 G."""
    assert successful_results([quote([])]) == [{"premium": 5}]


def test_sword_price_list_entry():
    """A first-insured sword costs 100 + 10% + 5 = 115 G."""
    assert successful_results([quote([{"type": "sword"}])]) == [{"premium": 115}]


def test_amulet_price_list_entry():
    """A first-insured amulet costs 60 + 10% + 5 = 71 G."""
    assert successful_results([quote([{"type": "amulet"}])]) == [{"premium": 71}]


def test_staff_price_list_entry():
    """A first-insured staff costs 80 + 10% + 5 = 93 G."""
    assert successful_results([quote([{"type": "staff"}])]) == [{"premium": 93}]


def test_potion_price_list_entry():
    """A first-insured potion costs 40 + 10% + 5 = 49 G."""
    assert successful_results([quote([{"type": "potion"}])]) == [{"premium": 49}]


def test_rune_price_list_entry():
    """A rune costs 33 G after surcharge, fee, and favorable rounding."""
    assert successful_results([quote([{"type": "rune"}])]) == [{"premium": 33}]


def test_moonstone_price_list_entry():
    """A moonstone costs 33 G after surcharge, fee, and favorable rounding."""
    assert successful_results([quote([{"type": "moonstone"}])]) == [{"premium": 33}]


def test_two_runes_have_50_g_base():
    """Two runes quote to 60 G including initial surcharge and fee."""
    items = [{"type": "rune"}, {"type": "rune"}]
    assert successful_results([quote(items)]) == [{"premium": 60}]


def test_three_runes_form_discounted_block():
    """Three runes quote to 71 G from the 60 G block base."""
    items = [{"type": "rune"}] * 3
    assert successful_results([quote(items)]) == [{"premium": 71}]


def test_four_runes_do_not_form_block():
    """Four runes quote to 115 G from a 100 G base."""
    items = [{"type": "rune"}] * 4
    assert successful_results([quote(items)]) == [{"premium": 115}]


def test_seven_runes_round_197_5_up_to_198_g():
    """Seven runes produce 197.5 G and final premium 198 G."""
    items = [{"type": "rune"}] * 7
    assert successful_results([quote(items)]) == [{"premium": 198}]


def test_two_runes_and_moonstone_do_not_form_block():
    """Two runes plus one moonstone use 75 G base, quoting to 88 G."""
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert successful_results([quote(items)]) == [{"premium": 88}]


def test_runes_and_moonstones_form_separate_blocks():
    """Three runes and three moonstones use 120 G base, quoting to 137 G."""
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert successful_results([quote(items)]) == [{"premium": 137}]


def test_curse_surcharge_is_item_scoped():
    """Cursed sword plus plain amulet quotes to 231 G including 10% and fee."""
    items = [{"type": "sword", "cursed": True}, {"type": "amulet"}]
    assert successful_results([quote(items)]) == [{"premium": 231}]


def test_enchantment_five_and_curse_both_apply():
    """A cursed enchantment-5 sword quotes to 195 G."""
    item = {"type": "sword", "cursed": True, "enchantment": 5}
    assert successful_results([quote([item])]) == [{"premium": 195}]


def test_enchantment_four_only_uses_curse_surcharge():
    """A cursed enchantment-4 sword quotes to 165 G."""
    item = {"type": "sword", "cursed": True, "enchantment": 4}
    assert successful_results([quote([item])]) == [{"premium": 165}]


def test_two_year_customer_gets_loyalty_discount():
    """A two-year customer's first sword quote is 95 G."""
    assert successful_results([quote([{"type": "sword"}])], years=2) == [
        {"premium": 95}
    ]


def test_newcomer_cursed_sword_costs_165_g():
    """A new customer's cursed steel enchantment-3 sword costs 165 G."""
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert successful_results([quote([item])]) == [{"premium": 165}]


def test_long_standing_second_contract_costs_160_g():
    """A three-year customer's second quote for cursed enchantment-7 sword is 160 G."""
    item = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    results = successful_results([quote([]), quote([item])], years=3)
    assert results == [{"premium": 5}, {"premium": 160}]


def test_regular_sword_claim_pays_400_g():
    """A 500 G regular sword damage pays 400 G and leaves 1600 G cap."""
    item = {"type": "sword", "material": "steel", "enchantment": 3}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 500}])]
    assert successful_results(steps) == [
        {"premium": 115},
        {"payout": 400, "remainingCap": 1600},
    ]


def test_rune_claim_pays_100_g():
    """A 200 G rune damage pays 100 G and leaves 400 G cap."""
    steps = [quote([{"type": "rune"}]), claim(0, [{"itemType": "rune", "amount": 200}])]
    assert successful_results(steps) == [
        {"premium": 33},
        {"payout": 100, "remainingCap": 400},
    ]


def test_dragon_sword_at_enchantment_eight_pays_400_g():
    """A dragon enchantment-8 sword damaged for 1000 G pays 400 G."""
    item = {"type": "sword", "material": "dragon", "enchantment": 8}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert successful_results(steps)[1] == {"payout": 400, "remainingCap": 1600}


def test_dragon_sword_at_enchantment_nine_pays_400_g():
    """A dragon enchantment-9 sword damaged for 1000 G pays 400 G."""
    item = {"type": "sword", "material": "dragon", "enchantment": 9}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert successful_results(steps)[1] == {"payout": 400, "remainingCap": 1600}


def test_dragon_sword_at_enchantment_five_pays_700_g():
    """A dragon enchantment-5 sword damaged for 800 G pays 700 G."""
    item = {"type": "sword", "material": "dragon", "enchantment": 5}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 800}])]
    assert successful_results(steps)[1] == {"payout": 700, "remainingCap": 1300}


def test_steel_sword_at_enchantment_nine_pays_400_g():
    """A steel enchantment-9 sword damaged for 1000 G pays 400 G."""
    item = {"type": "sword", "material": "steel", "enchantment": 9}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 1000}])]
    assert successful_results(steps)[1] == {"payout": 400, "remainingCap": 1600}


def test_two_damaged_items_each_have_a_deductible():
    """Sword damage 500 plus amulet damage 300 pays 600 G."""
    items = [{"type": "sword"}, {"type": "amulet"}]
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]
    results = successful_results([quote(items), claim(0, damages)])
    assert results[1] == {"payout": 600, "remainingCap": 2600}


def test_two_swords_can_be_damaged_separately():
    """Two insured swords damaged for 500 G each pay 800 G from a 4000 G cap."""
    items = [{"type": "sword"}, {"type": "sword"}]
    damages = [{"itemType": "sword", "amount": 500}] * 2
    assert successful_results([quote(items), claim(0, damages)])[1] == {
        "payout": 800,
        "remainingCap": 3200,
    }


def test_more_damage_entries_than_insured_items_is_rejected():
    """Two sword damages against one sword exit non-zero with stderr and no stdout."""
    damages = [{"itemType": "sword", "amount": 500}] * 2
    assert_cli_rejection([quote([{"type": "sword"}]), claim(0, damages)])


def test_sword_and_amulet_cap_is_3200_g():
    """A very large claim is limited to 3200 G with no remaining cap."""
    items = [{"type": "sword"}, {"type": "amulet"}]
    damages = [{"itemType": "sword", "amount": 10000}, {"itemType": "amulet", "amount": 10000}]
    assert successful_results([quote(items), claim(0, damages)])[1] == {
        "payout": 3200,
        "remainingCap": 0,
    }


def test_cursed_sword_cap_remains_2000_g():
    """A cursed sword's very large claim is capped at 2000 G."""
    steps = [
        quote([{"type": "sword", "cursed": True}]),
        claim(0, [{"itemType": "sword", "amount": 10000}]),
    ]
    assert successful_results(steps)[1] == {"payout": 2000, "remainingCap": 0}


def test_sword_and_three_runes_cap_is_3500_g():
    """Sword and three runes have insurance sum 1750 G and cap 3500 G."""
    items = [{"type": "sword"}] + [{"type": "rune"}] * 3
    damages = [{"itemType": "sword", "amount": 10000}] + [
        {"itemType": "rune", "amount": 10000}
    ] * 3
    assert successful_results([quote(items), claim(0, damages)])[1] == {
        "payout": 3500,
        "remainingCap": 0,
    }


def test_successive_claims_exhaust_shared_cap():
    """Two 1500 G sword claims pay 1400 G then 600 G, leaving zero."""
    damage = [{"itemType": "sword", "amount": 1500}]
    results = successful_results([quote([{"type": "sword"}]), claim(0, damage), claim(0, damage)])
    assert results[1:] == [
        {"payout": 1400, "remainingCap": 600},
        {"payout": 600, "remainingCap": 0},
    ]


def test_fractional_payout_rounds_down():
    """Enchantment-9 damage of 901 G yields 350.5 then pays 350 G."""
    item = {"type": "sword", "enchantment": 9}
    steps = [quote([item]), claim(0, [{"itemType": "sword", "amount": 901}])]
    assert successful_results(steps)[1] == {"payout": 350, "remainingCap": 1650}


def test_unknown_quote_item_is_rejected():
    """Broomstick quote exits non-zero, writes stderr, and writes no stdout."""
    assert_cli_rejection([quote([{"type": "broomstick"}])])


def test_uninsured_item_damage_is_rejected():
    """Amulet damage against sword-only policy exits non-zero with stderr and no stdout."""
    damages = [{"itemType": "amulet", "amount": 200}]
    assert_cli_rejection([quote([{"type": "sword"}]), claim(0, damages)])


def test_unknown_damage_item_is_rejected():
    """Unknown damaged type exits non-zero, writes stderr, and writes no stdout."""
    damages = [{"itemType": "broomstick", "amount": 200}]
    assert_cli_rejection([quote([{"type": "sword"}]), claim(0, damages)])


def test_negative_damage_is_rejected():
    """Damage amount -200 exits non-zero, writes stderr, and writes no stdout."""
    damages = [{"itemType": "sword", "amount": -200}]
    assert_cli_rejection([quote([{"type": "sword"}]), claim(0, damages)])


def test_staff_insurance_value_sets_1600_g_cap():
    """A staff policy has a 1600 G payout cap."""
    steps = [quote([{"type": "staff"}]), claim(0, [{"itemType": "staff", "amount": 10000}])]
    assert successful_results(steps)[1] == {"payout": 1600, "remainingCap": 0}


def test_potion_insurance_value_sets_800_g_cap():
    """A potion policy has an 800 G payout cap."""
    steps = [quote([{"type": "potion"}]), claim(0, [{"itemType": "potion", "amount": 10000}])]
    assert successful_results(steps)[1] == {"payout": 800, "remainingCap": 0}


def test_moonstone_insurance_value_sets_500_g_cap():
    """A moonstone policy has a 500 G payout cap."""
    steps = [
        quote([{"type": "moonstone"}]),
        claim(0, [{"itemType": "moonstone", "amount": 10000}]),
    ]
    assert successful_results(steps)[1] == {"payout": 500, "remainingCap": 0}
