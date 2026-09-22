"""The counter of the Most Honorable Privileged Claims Office.

A customer transacts with the office at this counter: they ask for a premium
to be quoted and for a claim to be settled. The rules behind those answers are
the office's own business, kept in the modules that own them -- the tariff it
deals in, how it rates premiums, and how it settles claims -- so that a change
to a rate or a clause is made where that knowledge lives and never here.
"""

from claim_settlement import (
    insurance_sum,
    payout_cap,
    settle_claim,
    settle_claim_against_cap,
)
from premium_rating import quote_premium

__all__ = [
    "insurance_sum",
    "payout_cap",
    "quote_premium",
    "settle_claim",
    "settle_claim_against_cap",
]
