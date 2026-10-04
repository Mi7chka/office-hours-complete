"""Build the starter copy of this demo: the same app, holding only the weeks taught so far.

    python3 tools/make_starter.py --week 1                 # writes ../office-hours-starter
    python3 tools/make_starter.py --week 3 --out /some/folder

The complete project (this folder) is the source. The starter is what the class begins with in
Session 1; after each Wednesday, run this with the next week number and push the starter, so it
grows one tool at a time. Nothing in the output folder's .git is touched. Standard library only."""
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
# The game's engine goes whole into every starter. Its missions do not: a starter gets only the
# mission files of the weeks it holds, and the game shows the rest as locked cases with a date.
GAME = ["app/game/art.js", "app/game/sound.js", "app/game/kit.js", "app/game/game.js", "app/game/fallback.js",
        "app/game/game.css"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--week", type=int, required=True, help="the last week to include (1 to 8)")
    ap.add_argument("--out", default=str(ROOT.parent / "office-hours-starter"))
    a = ap.parse_args()
    out = Path(a.out)
    manifest = json.loads(re.search(r"window\.OH_MANIFEST\s*=\s*(\{.*\});", (ROOT / "app/manifest.js").read_text(), re.S).group(1)
                          .replace("week:", '"week":').replace("modules:", '"modules":'))
    mods = [m for m in manifest["modules"] if int(m[1]) <= a.week]
    missing = [m for m in mods if not (ROOT / "app/modules" / f"{m}.js").exists()]
    if missing:
        sys.exit(f"these weeks are not built yet in the complete project: {missing}")

    out.mkdir(parents=True, exist_ok=True)
    for p in out.iterdir():                                   # start clean, but never touch .git
        if p.name == ".git":
            continue
        shutil.rmtree(p) if p.is_dir() else p.unlink()

    def copy(rel):
        (out / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / rel, out / rel)

    for rel in KEEP + GAME:
        copy(rel)
    for m in mods:
        copy(f"app/data/{m}.js")
        copy(f"app/modules/{m}.js")
        mission = f"app/game/missions/m{int(m[1])}.js"         # the game: one case per week this copy holds
        if (ROOT / mission).exists():
            copy(mission)
        else:
            print(f"  note: {mission} is not written yet, so the game shows that case as arriving later")
    for k in range(1, a.week + 1):
        for folder, pattern in (("prompts", f"week-{k}-*"), ("samples", f"week-{k}-*"), ("runbooks", f"session-{k:02d}.json")):
            for p in sorted((ROOT / folder).glob(pattern)):
                copy(f"{folder}/{p.name}")
    (out / "app/manifest.js").write_text(
        "/* Which weeks this copy contains. The starter gains one each Wednesday; the complete project has all eight. */\n"
        f"window.OH_MANIFEST = {{ week: {a.week}, modules: {json.dumps(mods)} }};\n", encoding="utf-8")
    subprocess.run([sys.executable, str(out / "tools/build_runbooks.py")], check=True)

    course = (ROOT / "app/course.js").read_text()
    weeks = re.findall(r'\{ week: (\d+), date: "([\d-]+)", title: "([^"]+)", tool: "([^"]+)"', course)
    have = "\n".join(f"| {w} | {tool} | {title} | [runbooks/session-{int(w):02d}.md](runbooks/session-{int(w):02d}.md) |"
                     for w, d, title, tool in weeks if int(w) <= a.week)
    coming = "\n".join(f"| {w} | {d} | {tool} | {title} |" for w, d, title, tool in weeks if int(w) > a.week) or "| | | Every week is here. | |"
    readme = (ROOT / "tools/starter-README.md").read_text(encoding="utf-8")
    (out / "README.md").write_text(readme.replace("{{WEEK}}", str(a.week)).replace("{{HAVE}}", have).replace("{{COMING}}", coming), encoding="utf-8")
    exe = out / "Launch.command"
    exe.chmod(exe.stat().st_mode | 0o111)
    n = sum(1 for p in out.rglob("*") if p.is_file() and ".git" not in p.parts)
    print(f"starter for week {a.week}: {n} files in {out}")


if __name__ == "__main__":
    main()
