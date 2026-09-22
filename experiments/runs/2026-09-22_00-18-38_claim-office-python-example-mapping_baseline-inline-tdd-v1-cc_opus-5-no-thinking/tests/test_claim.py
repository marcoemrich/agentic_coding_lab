from scenario import run_scenario


def sword(**attrs):
    return {"type": "sword", "material": "steel", "enchantment": 3,
            "cursed": False, **attrs}


def claim(items, damages, years=0):
    scenario = {
        "customer": {"yearsWithMHPCO": years},
        "steps": [
            {"op": "quote", "items": items},
            {"op": "claim", "policy": 0,
             "incident": {"cause": "dragon", "damages": damages}},
        ],
    }
    return run_scenario(scenario)["results"][1]


def damage(item_type, amount):
    return {"itemType": item_type, "amount": amount}


def test_regular_damage_is_reimbursed_minus_the_deductible():
    assert claim([sword()], [damage("sword", 500)])["payout"] == 400


def test_damage_to_a_rune_is_reimbursed_minus_the_deductible():
    assert claim([{"type": "rune"}], [damage("rune", 200)])["payout"] == 100


def test_the_deductible_applies_once_per_damaged_item():
    items = [sword(), {"type": "amulet"}]
    damages = [damage("sword", 500), damage("amulet", 300)]
    assert claim(items, damages)["payout"] == 600


def test_high_enchantment_halves_the_reimbursement_before_the_deductible():
    item = sword(enchantment=9)
    assert claim([item], [damage("sword", 1000)])["payout"] == 400


def test_dragon_material_is_fully_reimbursed():
    item = sword(material="dragon", enchantment=5)
    assert claim([item], [damage("sword", 800)])["payout"] == 700


def test_the_fifty_percent_rule_wins_over_dragon_material():
    item = sword(material="dragon", enchantment=9)
    assert claim([item], [damage("sword", 1000)])["payout"] == 400


def test_enchantment_exactly_eight_triggers_the_fifty_percent_rule():
    item = sword(material="dragon", enchantment=8)
    assert claim([item], [damage("sword", 1000)])["payout"] == 400


def test_the_remaining_cap_is_reported_after_the_claim():
    result = claim([sword()], [damage("sword", 500)])
    assert result["remainingCap"] == 2000 - 400


def test_the_payout_never_goes_below_zero_for_small_damages():
    assert claim([sword()], [damage("sword", 50)])["payout"] == 0


def test_dragon_material_below_the_enchantment_threshold_pays_in_full():
    item = sword(material="dragon", enchantment=7)
    assert claim([item], [damage("sword", 1000)])["payout"] == 900
