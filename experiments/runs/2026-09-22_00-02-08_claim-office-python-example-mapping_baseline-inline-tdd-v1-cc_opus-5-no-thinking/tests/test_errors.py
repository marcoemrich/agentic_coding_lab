import pytest

from errors import ScenarioError
from premium import quote_premium


def test_unknown_item_type_is_rejected():
    with pytest.raises(ScenarioError):
        quote_premium({"yearsWithMHPCO": 0}, [{"type": "broomstick"}], contract_index=0)
