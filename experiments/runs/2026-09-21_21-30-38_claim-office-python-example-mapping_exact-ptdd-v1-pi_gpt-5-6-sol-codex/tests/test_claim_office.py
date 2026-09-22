import json
import subprocess
import sys
from pathlib import Path

import pytest

CLI = Path(__file__).parents[1] / "src" / "cli.py"


def process_scenario(document):
    from claim_office import process_scenario as process

    return process(document)


def scenario(steps, years=0):
    return {"customer": {"yearsWithMHPCO": years}, "steps": steps}


def quote(items):
    return {"op": "quote", "items": items}


def claim(policy, damages):
    return {
        "op": "claim",
        "policy": policy,
        "incident": {"cause": "dragon attack", "damages": damages},
    }


def item(item_type, **attributes):
    return {"type": item_type, **attributes}


def run_cli(document):
    assert CLI.exists(), "the required src/cli.py entry point must exist"
    return subprocess.run(
        [sys.executable, str(CLI)],
        input=json.dumps(document),
        text=True,
        capture_output=True,
        check=False,
    )


def test_empty_quote_costs_5_g():
    assert process_scenario(scenario([quote([])])) == {"results": [{"premium": 5}]}


@pytest.mark.parametrize(
    ("item_type", "expected_premium", "expected_cap"),
    [
        ("sword", 115, 2000),
        ("amulet", 71, 1200),
        ("staff", 93, 1600),
        ("potion", 49, 800),
        ("rune", 33, 500),
        ("moonstone", 33, 500),
    ],
)
def test_each_price_list_item_has_its_premium_and_insurance_value(
    item_type, expected_premium, expected_cap
):
    document = scenario([quote([item(item_type)]), claim(0, [])])
    assert process_scenario(document) == {
        "results": [
            {"premium": expected_premium},
            {"payout": 0, "remainingCap": expected_cap},
        ]
    }


@pytest.mark.parametrize(
    ("count", "expected_premium"), [(2, 60), (3, 71), (4, 115), (7, 198)]
)
def test_rune_block_prices_2_3_4_and_7_runes(count, expected_premium):
    document = scenario([quote([item("rune")] * count)])
    assert process_scenario(document)["results"][0]["premium"] == expected_premium


@pytest.mark.parametrize(
    ("items", "expected_premium"),
    [
        ([item("rune"), item("rune"), item("moonstone")], 88),
        ([item("rune")] * 3 + [item("moonstone")] * 3, 137),
    ],
)
def test_component_blocks_are_per_exact_type(items, expected_premium):
    assert process_scenario(scenario([quote(items)]))["results"] == [
        {"premium": expected_premium}
    ]


def test_curse_scope_on_cursed_sword_and_plain_amulet_is_231_g():
    items = [item("sword", cursed=True), item("amulet", cursed=False)]
    assert process_scenario(scenario([quote(items)]))["results"] == [{"premium": 231}]


@pytest.mark.parametrize(
    ("years", "insured_item", "expected"),
    [
        (2, item("sword", enchantment=3, cursed=False), 95),
        (0, item("sword", enchantment=5, cursed=True), 195),
        (0, item("sword", enchantment=4, cursed=True), 165),
    ],
)
def test_premium_modifier_thresholds(years, insured_item, expected):
    assert process_scenario(scenario([quote([insured_item])], years))["results"] == [
        {"premium": expected}
    ]


def test_newcomer_cursed_sword_costs_165_g():
    sword = item("sword", material="steel", enchantment=3, cursed=True)
    assert process_scenario(scenario([quote([sword])]))["results"] == [{"premium": 165}]


def test_long_standing_customers_second_contract_costs_160_g():
    sword = item("sword", material="steel", enchantment=7, cursed=True)
    document = scenario([quote([]), quote([sword])], years=3)
    assert process_scenario(document)["results"] == [{"premium": 5}, {"premium": 160}]


@pytest.mark.parametrize(
    ("insured_item", "amount", "payout", "remaining"),
    [
        (item("sword", material="steel", enchantment=3), 500, 400, 1600),
        (item("rune"), 200, 100, 400),
    ],
)
def test_standard_reimbursement(insured_item, amount, payout, remaining):
    document = scenario(
        [quote([insured_item]), claim(0, [{"itemType": insured_item["type"], "amount": amount}])]
    )
    assert process_scenario(document)["results"][1] == {
        "payout": payout,
        "remainingCap": remaining,
    }


@pytest.mark.parametrize(
    ("material", "enchantment", "amount", "expected"),
    [
        ("dragon", 8, 1000, 400),
        ("dragon", 9, 1000, 400),
        ("dragon", 5, 800, 700),
        ("steel", 9, 1000, 400),
    ],
)
def test_enchantment_threshold_and_dragon_material(material, enchantment, amount, expected):
    sword = item("sword", material=material, enchantment=enchantment)
    document = scenario([quote([sword]), claim(0, [{"itemType": "sword", "amount": amount}])])
    assert process_scenario(document)["results"][1]["payout"] == expected


def test_two_damaged_items_each_pay_a_100_g_deductible_for_600_g_total():
    items = [item("sword", material="dragon"), item("amulet", material="dragon")]
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "amulet", "amount": 300}]
    document = scenario([quote(items), claim(0, damages)])
    assert process_scenario(document)["results"][1] == {
        "payout": 600,
        "remainingCap": 2600,
    }


def test_two_swords_have_4000_g_cap_and_two_separate_deductibles():
    swords = [item("sword", material="dragon"), item("sword", material="dragon")]
    damages = [{"itemType": "sword", "amount": 500}, {"itemType": "sword", "amount": 500}]
    document = scenario([quote(swords), claim(0, damages)])
    assert process_scenario(document)["results"][1] == {
        "payout": 800,
        "remainingCap": 3200,
    }


def test_more_damage_entries_than_insured_items_is_rejected_by_cli():
    document = scenario(
        [
            quote([item("sword")]),
            claim(0, [{"itemType": "sword", "amount": 200}] * 2),
        ]
    )
    completed = run_cli(document)
    assert completed.returncode != 0
    assert completed.stderr
    assert completed.stdout == ""


@pytest.mark.parametrize(
    ("items", "expected_cap"),
    [
        ([item("sword"), item("amulet")], 3200),
        ([item("sword", cursed=True)], 2000),
        ([item("sword")] + [item("rune")] * 3, 3500),
    ],
)
def test_policy_caps_come_from_twice_the_unmodified_insurance_sum(items, expected_cap):
    document = scenario([quote(items), claim(0, [])])
    assert process_scenario(document)["results"][1]["remainingCap"] == expected_cap


def test_successive_1500_g_claims_pay_1400_then_600_and_exhaust_cap():
    sword = item("sword", material="dragon")
    damage = [{"itemType": "sword", "amount": 1500}]
    document = scenario([quote([sword]), claim(0, damage), claim(0, damage)])
    assert process_scenario(document)["results"][1:] == [
        {"payout": 1400, "remainingCap": 600},
        {"payout": 600, "remainingCap": 0},
    ]


def test_fractional_350_point_5_g_payout_rounds_down_to_350_g():
    sword = item("sword", material="steel", enchantment=8)
    document = scenario([quote([sword]), claim(0, [{"itemType": "sword", "amount": 901}])])
    assert process_scenario(document)["results"][1]["payout"] == 350


def test_unknown_quote_item_is_rejected_by_cli():
    completed = run_cli(scenario([quote([item("broomstick")])]))
    assert completed.returncode != 0
    assert completed.stderr
    assert completed.stdout == ""


@pytest.mark.parametrize("item_type", ["amulet", "broomstick"])
def test_uninsured_claim_item_is_rejected_by_cli(item_type):
    document = scenario(
        [quote([item("sword")]), claim(0, [{"itemType": item_type, "amount": 200}])]
    )
    completed = run_cli(document)
    assert completed.returncode != 0
    assert completed.stderr
    assert completed.stdout == ""


def test_negative_damage_amount_is_rejected_by_cli():
    document = scenario(
        [quote([item("sword")]), claim(0, [{"itemType": "sword", "amount": -200}])]
    )
    completed = run_cli(document)
    assert completed.returncode != 0
    assert completed.stderr
    assert completed.stdout == ""


def test_successful_cli_writes_ordered_quote_and_claim_results():
    amulet = item("amulet", material="silver", enchantment=2, cursed=False)
    document = scenario(
        [quote([amulet]), claim(0, [{"itemType": "amulet", "amount": 200}])],
        years=5,
    )
    completed = run_cli(document)
    assert completed.returncode == 0
    assert completed.stderr == ""
    assert json.loads(completed.stdout) == {
        "results": [
            {"premium": 59},
            {"payout": 100, "remainingCap": 1100},
        ]
    }
