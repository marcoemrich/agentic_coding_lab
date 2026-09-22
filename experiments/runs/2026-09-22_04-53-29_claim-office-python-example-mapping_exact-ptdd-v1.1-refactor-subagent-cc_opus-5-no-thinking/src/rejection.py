"""How the MHPCO refuses a scenario it will not transact.

A refusal is a decision of the office, stated in words the customer can
read -- not an accident of the machinery that computes premiums and
payouts. Keeping the two apart is what lets the office answer for its own
decisions and stay silent about its internal workings.
"""


class ScenarioRejected(ValueError):
    """The MHPCO declines to transact a scenario, for the stated reason."""
