"""Build the Save Greenline desktop apps for Mac and Windows into dist/.

    python3 tools/build_apps.py

Run it again whenever the game changes: it copies the game exactly as it is in this folder at
that moment, and replaces what it built last time. The version number is read from one place,
packaging/VERSION.

What it leaves in dist/:
    Save Greenline.app          the Mac app (a folder macOS shows as one icon)
    Save-Greenline-Mac.dmg      disk image: the app, a shortcut to Applications, a read-me
    Save-Greenline-Mac.zip      the same app and read-me, zipped, as a second option
    Save-Greenline-Windows.zip  the game, the icon, an installer, an uninstaller, a read-me

How the apps work: neither one contains a browser. Each holds a copy of the game and opens it in
a window of its own, using Chrome or Edge already on the computer (app mode, with a profile
folder of its own so progress is kept apart from everyday browsing). With neither browser, the
game opens in the default browser as an ordinary tab.

Plainly:
  - Nothing here is signed or notarized. There is no Apple Developer ID and no Windows
    code-signing certificate. macOS and Windows both warn the first time; INSTALL.md says how
    to get past the warning.
  - The Windows files are NOT TESTED ON WINDOWS. They were written on a Mac.
  - The Mac targets need a Mac (iconutil, hdiutil, ditto, plutil). On anything else this builds
    the Windows zip only.

Standard library only, plus Pillow to draw the icon (packaging/make_icon.py). Without Pillow the
icon files already in packaging/icon/ are used as they are."""
import os
import re
import shutil
import subprocess
import sys
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "packaging"
DIST = ROOT / "dist"
WORK = DIST / ".build"                       # scratch space, removed at the end

APP_NAME = "Save Greenline"
BUNDLE_ID = "com.mitchellbconsulting.savegreenline"
EXECUTABLE = "save-greenline"                # Contents/MacOS/<this>
START_PAGE = "Open Save Greenline.html"      # sends a default browser to game/index.html#/game

GAME = ["index.html", "app", "runbooks", "prompts", "samples", "LICENSE"]   # the game, and nothing else
GAME_REQUIRED = ["index.html", "app"]
SKIP = shutil.ignore_patterns(".DS_Store", "__pycache__", "*.pyc", "Thumbs.db", ".git*")

MAC = sys.platform == "darwin"


def stop(message):
    sys.exit(f"build_apps: {message}")


def run(*cmd):
    """Run a tool quietly; on failure, show what it said and stop."""
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True)
    if r.returncode != 0:
        stop(f"`{' '.join(str(c) for c in cmd)}` failed:\n{(r.stderr or r.stdout).strip()}")
    return r.stdout


def version():
    """The one place the version lives: packaging/VERSION, a single line such as 1.0.0."""
    v = (PKG / "VERSION").read_text(encoding="utf-8").strip()
    if not re.fullmatch(r"\d+\.\d+(\.\d+)?", v):
        stop(f"packaging/VERSION should hold a version like 1.0.0, not {v!r}")
    return v


def fill(name, ver):
    """A template from packaging/, with the placeholders filled in."""
    text = (PKG / name).read_text(encoding="utf-8")
    return (text.replace("{{VERSION}}", ver).replace("{{BUNDLE_ID}}", BUNDLE_ID)
                .replace("{{EXECUTABLE}}", EXECUTABLE))


def for_windows(text, name):
    """Windows line endings, and plain ASCII so no code page can garble it."""
    try:
        return text.replace("\r\n", "\n").replace("\n", "\r\n").encode("ascii")
    except UnicodeEncodeError as e:
        stop(f"{name} must be plain ASCII for Windows; found {text[e.start:e.end]!r}")


def icons():
    """Redraw the icon when Pillow is here; otherwise use the files drawn earlier."""
    made = {"png": PKG / "icon/save-greenline-1024.png", "icns": PKG / "icon/save-greenline.icns",
            "ico": PKG / "icon/save-greenline.ico"}
    try:
        sys.dont_write_bytecode = True       # no __pycache__ left in packaging/
        sys.path.insert(0, str(PKG))
        import make_icon
        make_icon.build(PKG / "icon")
        how = "drawn fresh"
    except ImportError:
        how = "Pillow is not installed, so the files already in packaging/icon/ were used"
    if not made["ico"].exists() or (MAC and not made["icns"].exists()):
        stop("no icon files in packaging/icon/ and Pillow is not installed to draw them")
    return made, how


def copy_game(dest):
    """Copy the game as it is right now. Returns (file count, bytes)."""
    missing = [n for n in GAME_REQUIRED if not (ROOT / n).exists()]
    if missing:
        stop(f"the game is missing {missing} in {ROOT}")
    dest.mkdir(parents=True)
    for name in GAME:
        src = ROOT / name
        if not src.exists():
            print(f"  note: {name} is not in the project, so it is not in the apps")
        elif src.is_dir():
            shutil.copytree(src, dest / name, ignore=SKIP)
        else:
            shutil.copy2(src, dest / name)
    files = [p for p in dest.rglob("*") if p.is_file()]
    return len(files), sum(p.stat().st_size for p in files)


def build_mac_app(game, made, ver):
    app = DIST / f"{APP_NAME}.app"
    c = app / "Contents"
    (c / "MacOS").mkdir(parents=True)
    (c / "Resources").mkdir()
    (c / "Info.plist").write_text(fill("mac/Info.plist.template", ver), encoding="utf-8")
    (c / "PkgInfo").write_text("APPL????", encoding="ascii")
    launcher = c / "MacOS" / EXECUTABLE
    launcher.write_text(fill("mac/launcher.sh", ver), encoding="utf-8")
    launcher.chmod(0o755)
    shutil.copy2(made["icns"], c / "Resources/icon.icns")
    shutil.copy2(PKG / START_PAGE, c / "Resources" / START_PAGE)
    shutil.copytree(game, c / "Resources/game")
    run("plutil", "-lint", c / "Info.plist")
    run("bash", "-n", launcher)
    return app


def read_me_mac(folder, ver):
    (folder / "Read me first.txt").write_text(fill("mac/Read me first.txt", ver), encoding="utf-8")


def build_dmg(app, ver):
    stage = WORK / "dmg"
    stage.mkdir(parents=True)
    run("ditto", app, stage / app.name)
    os.symlink("/Applications", stage / "Applications")
    read_me_mac(stage, ver)
    dmg = DIST / "Save-Greenline-Mac.dmg"
    cmd = ["hdiutil", "create", "-volname", APP_NAME, "-srcfolder", stage, "-fs", "HFS+",
           "-format", "UDZO", "-imagekey", "zlib-level=9", "-ov", "-quiet", dmg]
    for attempt in (1, 2, 3):                # hdiutil now and then reports "resource busy"; a retry clears it
        r = subprocess.run([str(x) for x in cmd], capture_output=True, text=True)
        if r.returncode == 0:
            break
        if attempt == 3:
            stop(f"hdiutil could not make the disk image:\n{(r.stderr or r.stdout).strip()}")
        time.sleep(2)
    run("hdiutil", "verify", "-quiet", dmg)
    return dmg


def build_mac_zip(app, ver):
    folder = WORK / "zip" / f"{APP_NAME} for Mac"
    folder.mkdir(parents=True)
    run("ditto", app, folder / app.name)
    read_me_mac(folder, ver)
    out = DIST / "Save-Greenline-Mac.zip"
    run("ditto", "-c", "-k", "--norsrc", "--noextattr", "--keepParent", folder, out)   # keeps the launcher runnable
    return out


def build_windows_zip(game, made, ver):
    """Everything sits at the top of the zip, so Extract All gives one tidy folder."""
    out = DIST / "Save-Greenline-Windows.zip"
    now = time.localtime()[:6]
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        def add(name, data):
            info = zipfile.ZipInfo(name, date_time=now)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, data)

        for name in ("READ ME FIRST.txt", "Install Save Greenline.bat", "Uninstall Save Greenline.bat"):
            add(name, for_windows(fill(f"windows/{name}", ver), name))
        add(START_PAGE, (PKG / START_PAGE).read_bytes())
        add("save-greenline.ico", made["ico"].read_bytes())
        for p in sorted(game.rglob("*")):
            if p.is_file():
                z.write(p, "game/" + p.relative_to(game).as_posix())
    return out


def size(path):
    if path.is_dir():
        n = sum(p.stat().st_size for p in path.rglob("*") if p.is_file())
    else:
        n = path.stat().st_size
    return f"{n / 1024:,.0f} KB" if n < 1024 * 1024 else f"{n / 1024 / 1024:.1f} MB"


def main():
    ver = version()
    print(f"Save Greenline {ver}: building the apps into {DIST}")

    DIST.mkdir(exist_ok=True)
    for old in (WORK, DIST / f"{APP_NAME}.app"):
        shutil.rmtree(old, ignore_errors=True)
    for old in ("Save-Greenline-Mac.dmg", "Save-Greenline-Mac.zip", "Save-Greenline-Windows.zip"):
        (DIST / old).unlink(missing_ok=True)

    made, how = icons()
    print(f"  icon: {how}")

    game = WORK / "game"
    count, total = copy_game(game)
    print(f"  game: {count} files, {total / 1024:,.0f} KB, copied as they are now")
    if not (game / "app/game").is_dir():
        print("  note: app/game/ is not in the project yet. The apps open index.html#/game, which will "
              "show the home screen until the game is there. Run this again when it is.")

    built = []
    if MAC:
        app = build_mac_app(game, made, ver)
        built += [app, build_dmg(app, ver), build_mac_zip(app, ver)]
    else:
        print("  note: not on a Mac, so the Mac app, disk image and zip were skipped")
    built.append(build_windows_zip(game, made, ver))

    shutil.rmtree(WORK, ignore_errors=True)

    print("\nBuilt:")
    for p in built:
        print(f"  {size(p):>10}  dist/{p.name}")
    print("\nNot signed, not notarized: macOS and Windows both warn on first open. INSTALL.md says what to do.")
    print("The Windows installer is NOT TESTED ON WINDOWS.")


if __name__ == "__main__":
    main()
