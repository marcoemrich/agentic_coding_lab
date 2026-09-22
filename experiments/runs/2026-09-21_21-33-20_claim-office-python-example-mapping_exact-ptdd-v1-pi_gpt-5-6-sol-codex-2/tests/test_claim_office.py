"""Executable specification for the MHPCO claim office."""

import json
import subprocess
import sys
from pathlib import Path

import pytest

from claim_office import ClaimOffice


def test_empty_item_list_has_premium_5():
    """An empty item list produces premium 5."""
    office = ClaimOffice(years_with_mhpco=0)
    assert office.quote([])["premium"] == 5


def test_sword_base_premium_is_100():
    """A plain sword has a 100 G base premium before common additions."""
    office = ClaimOffice(years_with_mhpco=0)
    assert office.quote([{"type": "sword"}])["premium"] == 115


def test_amulet_base_premium_is_60():
    """A plain amulet has a 60 G base premium before common additions."""
    assert ClaimOffice(0).quote([{"type": "amulet"}])["premium"] == 71


def test_staff_base_premium_is_80():
    """A plain staff has an 80 G base premium before common additions."""
    assert ClaimOffice(0).quote([{"type": "staff"}])["premium"] == 93


def test_potion_base_premium_is_40():
    """A plain potion has a 40 G base premium before common additions."""
    assert ClaimOffice(0).quote([{"type": "potion"}])["premium"] == 49


def test_two_runes_have_base_premium_50():
    """Two runes cost 50 G before common additions."""
    items = [{"type": "rune"}, {"type": "rune"}]
    assert ClaimOffice(0).quote(items)["premium"] == 60


def test_three_runes_have_block_base_premium_60():
    """Exactly three runes cost 60 G before common additions."""
    items = [{"type": "rune"}] * 3
    assert ClaimOffice(0).quote(items)["premium"] == 71


def test_four_runes_have_base_premium_100():
    """Four runes cost 100 G; blocks require exactly three."""
    assert ClaimOffice(0).quote([{"type": "rune"}] * 4)["premium"] == 115


def test_seven_runes_have_base_premium_175():
    """Seven runes cost 175 G; no partial grouping into blocks occurs."""
    assert ClaimOffice(0).quote([{"type": "rune"}] * 7)["premium"] == 198


def test_two_runes_and_one_moonstone_have_base_premium_75():
    """Two runes and one moonstone cost 75 G because alike means same type."""
    items = [{"type": "rune"}, {"type": "rune"}, {"type": "moonstone"}]
    assert ClaimOffice(0).quote(items)["premium"] == 88


def test_three_runes_and_three_moonstones_have_base_premium_120():
    """Three runes plus three moonstones form two 60 G blocks."""
    items = [{"type": "rune"}] * 3 + [{"type": "moonstone"}] * 3
    assert ClaimOffice(0).quote(items)["premium"] == 137


def test_curse_surcharge_is_item_specific():
    """A cursed sword and plain amulet total 210 G before policy modifiers and fee."""
    items = [{"type": "sword", "cursed": True}, {"type": "amulet"}]
    assert ClaimOffice(0).quote(items)["premium"] == 231


def test_enchantment_4_has_no_high_enchantment_surcharge():
    """A cursed enchantment-4 sword receives only the 50 G curse surcharge."""
    item = {"type": "sword", "cursed": True, "enchantment": 4}
    assert ClaimOffice(0).quote([item])["premium"] == 165


def test_enchantment_5_and_curse_surcharges_both_apply():
    """A cursed enchantment-5 sword receives 50 G and 30 G surcharges."""
    item = {"type": "sword", "cursed": True, "enchantment": 5}
    assert ClaimOffice(0).quote([item])["premium"] == 195


def test_exactly_two_years_receives_loyalty_discount():
    """A customer at the two-year threshold receives the 20% policy discount."""
    assert ClaimOffice(2).quote([{"type": "sword"}])["premium"] == 95


def test_newcomer_cursed_sword_premium_is_165():
    """Curse, first-insurance surcharge, and final fee produce 165 G."""
    item = {"type": "sword", "material": "steel", "enchantment": 3, "cursed": True}
    assert ClaimOffice(0).quote([item])["premium"] == 165


def test_longstanding_customer_second_contract_premium_is_160():
    """A new sword still gets 10%, while contract two gets 15% off, producing 160 G."""
    office = ClaimOffice(3)
    office.quote([])
    item = {"type": "sword", "material": "steel", "enchantment": 7, "cursed": True}
    assert office.quote([item])["premium"] == 160


def test_fractional_premium_rounds_up_to_198():
    """A calculated 197.5 G premium rounds up in MHPCO's favor to 198 G."""
    office = ClaimOffice(0)
    office.quote([])
    items = [{"type": "sword", "cursed": True}, {"type": "rune"}, {"type": "rune"}]
    assert office.quote(items)["premium"] == 198


def test_regular_sword_damage_500_pays_400():
    """Standard reimbursement pays damage less one 100 G deductible."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "material": "steel", "enchantment": 3}])
    result = office.claim(0, [{"itemType": "sword", "amount": 500}])
    assert result == {"payout": 400, "remainingCap": 1600}


def test_rune_damage_200_pays_100():
    """Components have no special clause and incur the 100 G deductible."""
    office = ClaimOffice(0)
    office.quote([{"type": "rune"}])
    result = office.claim(0, [{"itemType": "rune", "amount": 200}])
    assert result == {"payout": 100, "remainingCap": 400}


def test_two_damaged_items_each_incur_a_deductible():
    """Sword damage 500 and amulet damage 300 produce a total payout of 600 G."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword"}, {"type": "amulet"}])
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]
    assert office.claim(0, damages) == {"payout": 600, "remainingCap": 2600}


def test_dragon_sword_at_enchantment_8_damage_1000_pays_400():
    """At enchantment 8, half reimbursement then deductible produces 400 G."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "material": "dragon", "enchantment": 8}])
    result = office.claim(0, [{"itemType": "sword", "amount": 1000}])
    assert result == {"payout": 400, "remainingCap": 1600}


def test_dragon_sword_at_enchantment_5_damage_800_pays_700():
    """Below enchantment 8, dragon material gets full reimbursement less deductible."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "material": "dragon", "enchantment": 5}])
    assert office.claim(0, [{"itemType": "sword", "amount": 800}]) == {
        "payout": 700,
        "remainingCap": 1300,
    }


def test_steel_sword_at_enchantment_9_damage_1000_pays_400():
    """High enchantment alone halves reimbursement before the deductible."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "material": "steel", "enchantment": 9}])
    assert office.claim(0, [{"itemType": "sword", "amount": 1000}])["payout"] == 400


def test_two_insured_swords_can_each_be_claimed():
    """Two sword entries are separately insured and separately damaged."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword"}, {"type": "sword"}])
    damages = [{"itemType": "sword", "amount": 500}] * 2
    assert office.claim(0, damages) == {"payout": 800, "remainingCap": 3200}


def test_sword_and_amulet_cap_is_twice_1600():
    """A sword and amulet have insurance sum 1600 G and cap 3200 G."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword"}, {"type": "amulet"}])
    damages = [{"itemType": "sword", "amount": 5000}, {"itemType": "amulet", "amount": 5000}]
    assert office.claim(0, damages) == {"payout": 3200, "remainingCap": 0}


def test_cursed_sword_cap_uses_unmodified_insurance_value():
    """A cursed sword's cap remains 2000 G despite its premium surcharge."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "cursed": True}])
    assert office.claim(0, [{"itemType": "sword", "amount": 5000}]) == {
        "payout": 2000,
        "remainingCap": 0,
    }


def test_sword_and_three_runes_have_insurance_sum_1750():
    """A component block affects premium only, leaving the cap at 3500 G."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword"}] + [{"type": "rune"}] * 3)
    damages = [{"itemType": "sword", "amount": 5000}] + [
        {"itemType": "rune", "amount": 5000}
    ] * 3
    assert office.claim(0, damages) == {"payout": 3500, "remainingCap": 0}


def test_successive_sword_claims_pay_1400_then_600():
    """Two 1500 G claims share a 2000 G cap, leaving 600 then 0 G."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword"}])
    damage = [{"itemType": "sword", "amount": 1500}]
    assert office.claim(0, damage) == {"payout": 1400, "remainingCap": 600}
    assert office.claim(0, damage) == {"payout": 600, "remainingCap": 0}


def test_fractional_payout_rounds_down_to_350():
    """High-enchantment damage yielding 350.5 G rounds down in MHPCO's favor."""
    office = ClaimOffice(0)
    office.quote([{"type": "sword", "enchantment": 9}])
    result = office.claim(0, [{"itemType": "sword", "amount": 901}])
    assert result == {"payout": 350, "remainingCap": 1650}


def _run_cli(scenario: dict) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(Path(__file__).parents[1] / "src" / "cli.py")],
        input=json.dumps(scenario),
        text=True,
        capture_output=True,
        check=False,
    )


def test_unknown_quote_item_exits_nonzero_with_stderr_only():
    """Chosen rejection contract: nonzero CLI, descriptive stderr, empty stdout."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}],
    }
    result = _run_cli(scenario)
    assert result.returncode != 0
    assert "unknown item type" in result.stderr.lower()
    assert result.stdout == ""


def test_uninsured_claim_item_exits_nonzero_with_stderr():
    """An amulet damage against a sword-only policy rejects the whole scenario."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
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
    result = _run_cli(scenario)
    assert result.returncode != 0
    assert "not insured" in result.stderr.lower()
    assert result.stdout == ""


def test_unknown_claim_item_exits_nonzero_with_stderr():
    """An unknown damage item type rejects the whole scenario."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "mystery",
                    "damages": [{"itemType": "broomstick", "amount": 200}],
                },
            },
        ],
    }
    result = _run_cli(scenario)
    assert result.returncode != 0
    assert "unknown item type" in result.stderr.lower()
    assert result.stdout == ""


def test_more_damage_entries_than_insured_items_is_rejected():
    """Two sword damages against one insured sword reject the whole claim."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "dragon",
                    "damages": [
                        {"itemType": "sword", "amount": 200},
                        {"itemType": "sword", "amount": 200},
                    ],
                },
            },
        ],
    }
    result = _run_cli(scenario)
    assert result.returncode != 0
    assert "not insured" in result.stderr.lower()
    assert result.stdout == ""


def test_negative_damage_exits_nonzero_with_stderr():
    """A damage amount of -200 rejects the whole scenario."""
    scenario = {
        "customer": {"yearsWithMHPCO": 0},
        "steps": [
            {"op": "quote", "items": [{"type": "sword"}]},
            {
                "op": "claim",
                "policy": 0,
                "incident": {
                    "cause": "accounting error",
                    "damages": [{"itemType": "sword", "amount": -200}],
                },
            },
        ],
    }
    result = _run_cli(scenario)
    assert result.returncode != 0
    assert "negative damage" in result.stderr.lower()
    assert result.stdout == ""
