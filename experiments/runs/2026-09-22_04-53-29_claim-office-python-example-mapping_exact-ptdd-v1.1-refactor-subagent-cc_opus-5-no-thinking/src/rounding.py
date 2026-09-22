"""How the MHPCO rounds the money that changes hands on a policy.

The office states one rule and applies it in both directions: a final amount
is rounded to whole G in the MHPCO's own favour. Which way that falls follows
from who pays whom. Money the office receives is rounded up; money the office
hands over is rounded down. Only a final amount is rounded -- every
intermediate stays an exact fraction, so a half G is never lost early.
"""

import math


def money_received_rounded_in_mhpco_favour(amount):
    """Return an amount the MHPCO receives, rounded to whole G in its favour."""
    return math.ceil(amount)


def money_paid_out_rounded_in_mhpco_favour(amount):
    """Return an amount the MHPCO hands over, rounded to whole G in its favour."""
    return math.floor(amount)
