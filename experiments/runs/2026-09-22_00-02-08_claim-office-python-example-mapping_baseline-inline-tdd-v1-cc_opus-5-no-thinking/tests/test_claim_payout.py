from claim import process_claim

SWORD = {"type": "sword", "material": "steel", "enchantment": 3}
AMULET = {"type": "amulet", "material": "silver", "enchantment": 2}


def test_deductible_applies_once_per_damaged_item():
    damages = [
        {"itemType": "sword", "amount": 500},
        {"itemType": "amulet", "amount": 300},
    ]
    payout, remaining = process_claim([SWORD, AMULET], damages, remaining_cap=3200)
    assert payout == 600
    assert remaining == 2600


def test_payout_is_limited_by_the_remaining_cap():
    damages = [{"itemType": "sword", "amount": 1500}]
    payout, remaining = process_claim([SWORD], damages, remaining_cap=2000)
    assert payout == 1400
    assert remaining == 600


def test_a_second_claim_is_reduced_to_the_remaining_cap():
    damages = [{"itemType": "sword", "amount": 1500}]
    payout, remaining = process_claim([SWORD], damages, remaining_cap=600)
    assert payout == 600
    assert remaining == 0


def test_payout_is_rounded_down_in_mhpcos_favour():
    # 901 halved = 450.5, minus the 100 deductible = 350.5 -> 350
    sword = {"type": "sword", "material": "steel", "enchantment": 9}
    payout, remaining = process_claim([sword], [{"itemType": "sword", "amount": 901}], 2000)
    assert payout == 350
    assert remaining == 1650
