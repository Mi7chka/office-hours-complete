"""Build the class starter for one week: the folder people begin that Wednesday with.

    python3 tools/make_starter.py --week 1                 # writes ../office-hours-starter
    python3 tools/make_starter.py --week 3 --out /some/folder

The complete project (this folder) is the source. The starter for week N holds:
    - the shell, the Toolbox (the eight tools from version 1) and the game
    - every piece of the weeks BEFORE N, already built, so someone who missed a week can catch up
    - week N ready to build: its class notes, its sample data and its runbook, but NOT its piece.
      A small placeholder file holds the piece's place in the pieces folder.
    - nothing from the weeks after N
    - CLAUDE.md, the rules file for the AI (a copy of class/week-01/rules.md)

Run it again each Wednesday with the next week number and push the starter.
Nothing in the output folder's .git is touched. Standard library only."""
import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KEEP = [".gitignore", "LICENSE", "Launch.command", "Launch.bat", "index.html", "MODULES.md", "GAME.md",
        "app/shell.js", "app/shell.css", "app/course.js", "tools/build_runbooks.py"]
# The game's engine goes whole into every starter, with the case of every Toolbox tool in the copy.
GAME = ["app/game/art.js", "app/game/sound.js", "app/game/kit.js", "app/game/game.js", "app/game/game.css"]

PLACEHOLDER = """/* Week {n} · {piece} goes here.

   This file holds the place until you build the piece.
   Your build prompt makes a file with this exact name: {file}.js
   Save that file in this folder. Your computer asks whether to replace this one. Say yes.
   Then go back to the app and press "I saved the file. Look again". The piece shows by itself. */
OH.waiting({n});
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--week", type=int, required=True, help="the class week this starter is for (1 to 8)")
    ap.add_argument("--out", default=str(ROOT.parent / "office-hours-starter"))
    ap.add_argument("--toolbox", type=int, default=8, help="how many of the version 1 tools to include (default: all 8)")
    a = ap.parse_args()
    if not 1 <= a.week <= 8:
        sys.exit("--week is a number from 1 to 8")
    out = Path(a.out)
    course = (ROOT / "app/course.js").read_text(encoding="utf-8")
    manifest = json.loads(re.search(r"window\.OH_MANIFEST\s*=\s*(\{.*\});", (ROOT / "app/manifest.js").read_text(encoding="utf-8"), re.S).group(1)
                          .replace("week:", '"week":').replace("modules:", '"modules":'))
    tools = [m for m in manifest["modules"] if int(m[1]) <= a.toolbox]
    pieces = [(int(w), d, short, piece, f) for w, d, short, piece, f in
              re.findall(r'week: (\d), date: "([\d-]+)", short: "([^"]+)", .*?piece: "([^"]+)", .*?file: "([\w-]+)"', course)]
    if len(pieces) != 8:
        sys.exit("could not read the eight pieces from app/course.js")
    need = [f"pieces/{f}.js" for w, d, s, p, f in pieces if w < a.week]
    need += [f"app/data/{f}.js" for w, d, s, p, f in pieces if w <= a.week]
    need += [f"class/week-{w:02d}/{x}" for w, d, s, p, f in pieces if w <= a.week for x in ("design-note.md", "build-details.md", "checks.md")]
    need += [f"runbooks/session-{w:02d}.json" for w, d, s, p, f in pieces if w <= a.week]
    missing = [x for x in need if not (ROOT / x).exists()]
    if missing:
        sys.exit("these are not in the complete project yet:\n  " + "\n  ".join(missing))

    out.mkdir(parents=True, exist_ok=True)
    for p in out.iterdir():                                   # start clean, but never touch .git
        if p.name == ".git":
            continue
        shutil.rmtree(p) if p.is_dir() else p.unlink()

    def copy(rel):
        (out / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / rel, out / rel)

    def copy_folder(rel):
        for p in sorted((ROOT / rel).rglob("*")):
            if p.is_file() and p.name != ".DS_Store":
                copy(str(p.relative_to(ROOT)))

    for rel in KEEP + GAME:
        copy(rel)

    # the Toolbox and the game's cases
    for m in tools:
        k = int(m[1])
        copy(f"app/data/{m}.js")
        copy(f"app/modules/{m}.js")
        if (ROOT / f"app/game/missions/m{k}.js").exists():
            copy(f"app/game/missions/m{k}.js")
        for folder, pattern in (("prompts", f"week-{k}-*"), ("samples", f"week-{k}-*"), ("runbooks/toolbox", f"session-{k:02d}.json")):
            for p in sorted((ROOT / folder).glob(pattern)):
                copy(f"{folder}/{p.name}")

    # the command center: weeks before N built, week N ready to build, nothing after
    copy_folder("class/shared")
    for w, d, short, piece, f in pieces:
        if w > a.week:
            continue
        copy(f"app/data/{f}.js")
        copy(f"runbooks/session-{w:02d}.json")
        copy_folder(f"class/week-{w:02d}")
        (out / "pieces").mkdir(exist_ok=True)
        if w < a.week:
            copy(f"pieces/{f}.js")
        else:
            (out / f"pieces/{f}.js").write_text(PLACEHOLDER.format(n=w, piece=piece[0].lower() + piece[1:], file=f), encoding="utf-8")
    shutil.copy2(ROOT / "class/week-01/rules.md", out / "CLAUDE.md")        # the rules file, where Claude Code reads it by itself

    (out / "app/manifest.js").write_text(
        "/* What this copy holds. The class starter moves on one week each Wednesday; the complete project has all eight.\n"
        "   week = the class week this copy is for. modules = the Toolbox. Nobody edits a list: a piece shows up when its file is in the pieces folder. */\n"
        f"window.OH_MANIFEST = {{ week: {a.week}, modules: {json.dumps(tools)} }};\n", encoding="utf-8")
    subprocess.run([sys.executable, str(out / "tools/build_runbooks.py")], check=True)

    this = next(x for x in pieces if x[0] == a.week)
    built = "\n".join(f"| {w} | {piece} | Built. Open it from the home screen | [class/week-{w:02d}](class/week-{w:02d}) |" for w, d, s, piece, f in pieces if w < a.week) \
        or "| | Nothing yet. Week 1 is the first piece. | | |"
    coming = "\n".join(f"| {w} | {d} | {s} | {piece} |" for w, d, s, piece, f in pieces if w > a.week) or "| | | | Every week is here. |"
    readme = (ROOT / "tools/starter-README.md").read_text(encoding="utf-8")
    for k, v in (("{{WEEK}}", str(a.week)), ("{{WEEK2}}", f"{a.week:02d}"), ("{{SHORT}}", this[2]), ("{{PIECE}}", this[3]),
                 ("{{FILE}}", this[4] + ".js"), ("{{BUILT}}", built), ("{{COMING}}", coming)):
        readme = readme.replace(k, v)
    (out / "README.md").write_text(readme, encoding="utf-8")
    exe = out / "Launch.command"
    exe.chmod(exe.stat().st_mode | 0o111)
    n = sum(1 for p in out.rglob("*") if p.is_file() and ".git" not in p.parts)
    print(f"starter for week {a.week}: {n} files in {out}")
    print(f"  built: weeks {', '.join(str(w) for w, *_ in pieces if w < a.week) or 'none'}. To build: week {a.week} ({this[4]}.js). Toolbox: {len(tools)} tools.")


if __name__ == "__main__":
    main()
