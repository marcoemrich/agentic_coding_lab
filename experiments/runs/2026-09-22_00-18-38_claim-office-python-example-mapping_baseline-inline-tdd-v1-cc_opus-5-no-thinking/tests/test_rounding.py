from fractions import Fraction

from claim import _round_in_office_favour as round_payout
from premium import _round_in_office_favour as round_premium

PREMIUM_ROUNDED_UP = 198
PAYOUT_ROUNDED_DOWN = 350


def test_a_premium_of_197_and_a_half_is_rounded_up():
    assert round_premium(Fraction(395, 2)) == PREMIUM_ROUNDED_UP


def test_a_payout_of_350_and_a_half_is_rounded_down():
    assert round_payout(Fraction(701, 2)) == PAYOUT_ROUNDED_DOWN


def test_whole_premium_amounts_are_left_alone():
    assert round_premium(Fraction(PREMIUM_ROUNDED_UP)) == PREMIUM_ROUNDED_UP


def test_whole_payout_amounts_are_left_alone():
    assert round_payout(Fraction(PAYOUT_ROUNDED_DOWN)) == PAYOUT_ROUNDED_DOWN
