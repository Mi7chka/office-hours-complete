#!/bin/bash
# Save Greenline {{VERSION}}: the launcher inside the Mac app (Contents/MacOS/save-greenline).
#
# It opens the copy of the game that sits inside this app (Contents/Resources/game/index.html#/game)
# in a window of its own:
#   1. Google Chrome in app mode, if Chrome is installed
#   2. Microsoft Edge in app mode, if Edge is installed
#   3. otherwise the default browser, as an ordinary tab
# Chrome and Edge are given a profile folder of their own, in
# ~/Library/Application Support/Save Greenline/profile, so the game's progress is kept apart from
# everyday browsing and stays put when the app is replaced by a newer copy.
#
# Nothing is installed, nothing is downloaded, and this script sends nothing anywhere.
#
# For testing, from Terminal:
#   SAVE_GREENLINE_DRY_RUN=1   print what would be opened, and open nothing
#   SAVE_GREENLINE_BROWSER=chrome | edge | default   use that one and skip the others
#
# Written for the bash that ships with macOS (3.2). No python, no other tools: a Mac without
# Apple's developer tools must be able to run this.

set -u

VERSION="{{VERSION}}"
DRY_RUN="${SAVE_GREENLINE_DRY_RUN:-}"
ONLY="${SAVE_GREENLINE_BROWSER:-}"

# Where things are. This script is <app>/Contents/MacOS/save-greenline.
SELF_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd -P)"
RES_DIR="$(cd "$SELF_DIR/../Resources" 2>/dev/null && pwd -P)"
GAME_FILE="$RES_DIR/game/index.html"
START_PAGE="$RES_DIR/Open Save Greenline.html"
PROFILE_DIR="$HOME/Library/Application Support/Save Greenline/profile"

# Show a message box, or print it in a dry run.
tell_user() {
  if [ -n "$DRY_RUN" ]; then
    printf 'message: %s\n' "$1"
    return 0
  fi
  /usr/bin/osascript \
    -e 'on run argv' \
    -e 'display alert "Save Greenline" message (item 1 of argv) buttons {"OK"} default button 1' \
    -e 'end run' -- "$1" >/dev/null 2>&1 || true
}

# Turn a full path into a file:// address. Every byte that is not plainly safe is written as %XX,
# so spaces, accents and symbols in a folder name all survive.
file_url() {
  local LC_ALL=C
  local path="$1" out="" ch i
  for (( i = 0; i < ${#path}; i++ )); do
    ch="${path:$i:1}"
    case "$ch" in
      [A-Za-z0-9/._~-]) out="$out$ch" ;;
      *) out="$out$(printf '%%%02X' "$(( $(printf '%d' "'$ch") & 255 ))")" ;;
    esac
  done
  printf 'file://%s' "$out"
}

# Print where an app is installed (the first of the two usual places), or fail.
find_app() {
  local dir
  for dir in "/Applications" "$HOME/Applications"; do
    if [ -d "$dir/$1" ]; then
      printf '%s' "$dir/$1"
      return 0
    fi
  done
  return 1
}

# Run a command, or only print it in a dry run.
run() {
  if [ -n "$DRY_RUN" ]; then
    printf 'command:'
    printf ' %q' "$@"
    printf '\n'
    return 0
  fi
  "$@"
}

if [ -n "$DRY_RUN" ]; then
  printf 'Save Greenline %s, dry run: nothing will be opened\n' "$VERSION"
  printf 'game file: %s\n' "$GAME_FILE"
  printf 'profile folder: %s\n' "$PROFILE_DIR"
fi

if [ -z "$RES_DIR" ] || [ ! -f "$GAME_FILE" ]; then
  tell_user "The game files are missing from this copy of Save Greenline. Please download it again."
  exit 1
fi

GAME_URL="$(file_url "$GAME_FILE")#/game"

BROWSER_APP=""
BROWSER_NAME=""
if [ -z "$ONLY" ] || [ "$ONLY" = "chrome" ]; then
  if BROWSER_APP="$(find_app "Google Chrome.app")"; then BROWSER_NAME="Google Chrome"; fi
fi
if [ -z "$BROWSER_APP" ]; then
  if [ -z "$ONLY" ] || [ "$ONLY" = "edge" ]; then
    if BROWSER_APP="$(find_app "Microsoft Edge.app")"; then BROWSER_NAME="Microsoft Edge"; fi
  fi
fi

if [ -n "$BROWSER_APP" ]; then
  if [ -n "$DRY_RUN" ]; then
    printf 'browser: %s, in a window of its own\n' "$BROWSER_NAME"
  else
    mkdir -p "$PROFILE_DIR" 2>/dev/null || true
  fi
  # -n starts a separate copy of the browser, so this works while the everyday browser is open.
  if run /usr/bin/open -n -a "$BROWSER_APP" --args \
      "--app=$GAME_URL" \
      "--user-data-dir=$PROFILE_DIR" \
      --no-first-run \
      --no-default-browser-check; then
    exit 0
  fi
  # The browser would not start: carry on to the default browser.
fi

# No Chrome and no Edge: open in the default browser. An address ending in #/game cannot be
# handed to the default browser reliably, so open a small page that goes there by itself.
if [ -n "$DRY_RUN" ]; then
  printf 'browser: the default browser, as an ordinary tab\n'
fi
if [ -f "$START_PAGE" ]; then
  TARGET="$START_PAGE"
else
  TARGET="$GAME_FILE"
fi
if run /usr/bin/open "$TARGET"; then
  exit 0
fi

tell_user "Save Greenline could not open a web browser. Install Google Chrome or Microsoft Edge, then try again."
exit 1
