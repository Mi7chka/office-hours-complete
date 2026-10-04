"""Check the words in everything this season added: the pieces, their sample data, the class notes,
the runbooks and the docs. Standard library only.

    python3 tools/check_words.py

It looks for: em dashes and en dashes, dollar amounts, exclamation points in the class notes and
runbooks, hype words, and names that must never appear. It prints each find with its file and line,
and ends with a count. It reads only this project. Version 1's tools and the game are not checked."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HYPE = ["leverage", "leveraging", "seamless", "seamlessly", "robust", "unlock", "unlocks", "unlocking", "supercharge", "deep dive", "game-changing",
        "game changer", "cutting-edge", "cutting edge", "synergy", "utilize", "utilise", "circle back", "move the needle", "revolutionary",
        "revolutionize", "world-class", "best-in-class", "next-level", "empower", "delve", "elevate", "effortless", "effortlessly", "turnkey",
        "state-of-the-art", "disrupt", "10x", "skyrocket", "transformative", "harness"]
# Names that must never appear in this public project are kept out of it: list them, one per line, in
# tools/private-words.txt, which git ignores. The check still runs on this computer; the names are never published.
_private = Path(__file__).resolve().parent / "private-words.txt"
NEVER = [w.strip().lower() for w in _private.read_text(encoding="utf-8").splitlines() if w.strip()] if _private.exists() else []
FILES = (["README.md", "MODULES.md", "tools/starter-README.md", "index.html", "app/shell.js", "app/course.js", "app/manifest.js"]
         + [str(p.relative_to(ROOT)) for pat in ("pieces/*.js", "app/data/week-*.js", "class/**/*.md", "class/**/*.txt", "class/**/*.csv", "runbooks/session-*.json", "runbooks/session-*.md")
            for p in sorted(ROOT.glob(pat))])


def main():
    finds = 0
    for rel in FILES:
        p = ROOT / rel
        if not p.exists():
            continue
        plain = rel.startswith(("class/", "runbooks/"))
        for n, line in enumerate(p.read_text(encoding="utf-8").split("\n"), 1):
            low, why = line.lower(), []
            if chr(0x2014) in line or chr(0x2013) in line:
                why.append("a dash")
            if re.search(r"\$\s?\d", line) or re.search(r"\b\d[\d,.]*\s?(dollars|bucks|usd)\b", low):
                why.append("a dollar amount")
            if plain and "!" in line and "!important" not in line and "!!" not in p.name:
                if not rel.endswith("sample-messy-list.txt"):
                    why.append("an exclamation point")
            why += [f"the word {w!r}" for w in HYPE if re.search(r"(?<![a-z])" + re.escape(w) + r"(?![a-z])", low)]
            why += [f"the name {w!r}" for w in NEVER if w in low]
            for w in why:
                finds += 1
                print(f"  {rel}:{n}: {w}: {line.strip()[:110]}")
    print(f"check_words: {len(FILES)} files read, {finds} finds")
    return 1 if finds else 0


if __name__ == "__main__":
    sys.exit(main())
