import json
import sys


def main(keyword):
    out = set()
    with open("json/AllSets.json") as json_file:
        sets = json.load(json_file)
    with open("json/stack/current.json") as current_file:
        current = json.load(current_file)
        card_names = set(c["name"].lower() for c in current["card"])

    for card_set in sets.values():
        for card in card_set["cards"]:
            name = card["name"].lower()
            oracle = card.get("text")
            condition = oracle and keyword in oracle.lower()
            if condition and name in card_names:
                out.add(name)

    for name in out:
        print name


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print "this script takes exactly one arg"
    else:
        keyword = sys.argv[1].lower()
        main(keyword)
