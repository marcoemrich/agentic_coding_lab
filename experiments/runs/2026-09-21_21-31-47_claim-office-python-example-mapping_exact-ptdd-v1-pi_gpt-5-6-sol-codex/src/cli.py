import json
import sys

from claim_office import process_scenario


def main():
    scenario = json.load(sys.stdin)
    json.dump(process_scenario(scenario), sys.stdout)


if __name__ == "__main__":
    main()
