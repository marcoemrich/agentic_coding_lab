from fractions import Fraction

from premium import round_up
from claims import round_down


def test_premium_rounds_up_in_the_offices_favour():
    assert round_up(Fraction(395, 2)) == 198


def test_payout_rounds_down_in_the_offices_favour():
    assert round_down(Fraction(701, 2)) == 350


def test_whole_amounts_are_unchanged():
    assert round_up(Fraction(198)) == 198
    assert round_down(Fraction(350)) == 350
