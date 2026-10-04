# Install Save Greenline as an app

Save Greenline is the game that goes with Wednesday Office Hours. You can play it two ways:

- **In your browser, with nothing to install.** Follow "Open it" in [README.md](README.md).
- **As an app on your computer, with its own icon and its own window.** That is what this page covers.

It is the same game either way. Pick whichever you like.

Two things to know before you start:

1. **Your computer will warn you the first time.** Neither app is signed. Signing means paying
   Apple or a certificate company to vouch for who made a program, and that has not been done for
   this one. So a Mac and a Windows computer will both stop and ask before they run it. The exact
   screens, and how to get past them, are below.
2. **The app is small because it has no browser of its own.** It holds a copy of the game and
   opens it in a window of its own, using Google Chrome or Microsoft Edge already on your
   computer. With neither one, it opens in whatever browser you have, as an ordinary tab.

The game does not go online and sends nothing anywhere.

## Get the file for your computer

From the project's Releases page: https://github.com/Mi7chka/office-hours-complete/releases

| Your computer | The file |
|---|---|
| Mac | `Save-Greenline-Mac.dmg` |
| Mac, if the first one will not open | `Save-Greenline-Mac.zip` |
| Windows | `Save-Greenline-Windows.zip` |

---

## Mac

You need macOS 11 or newer.

### Install

1. Double-click `Save-Greenline-Mac.dmg`. A window opens showing Save Greenline, a shortcut to
   Applications, and a read-me.
2. Drag **Save Greenline** onto **Applications**.
3. Open your Applications folder and double-click **Save Greenline**.
4. macOS stops it. That is expected. Follow the next part once, and it will not ask again.

If you downloaded the zip instead: double-click it, open the folder that appears, and drag
Save Greenline into Applications. Then carry on from step 3.

Put it in Applications before you open it. It runs from other folders too, but from Downloads
macOS may also ask whether your browser can read your Downloads folder.

### The first time you open it

**On macOS 15 Sequoia or newer**, a box appears that says something like:

> **"Save Greenline" Not Opened**
> Apple could not verify "Save Greenline" is free of malware that may harm your Mac or compromise
> your privacy.

1. Click **Done**. Do not click Move to Trash.
2. Open the Apple menu at the top left of the screen and choose **System Settings**.
3. Click **Privacy & Security** in the list on the left.
4. Scroll down to the part called **Security**. It says: "Save Greenline" was blocked to protect
   your Mac.
5. Click **Open Anyway**.
6. Click **Open Anyway** again, then type your Mac password or use Touch ID.

The game opens. From then on a double-click is all it takes.

The Open Anyway button only shows for about an hour after you try to open the app. If you do not
see it, double-click Save Greenline again, then look again.

**On macOS 14 Sonoma or older**, there is a shorter way:

1. In Applications, hold the **Control** key and click **Save Greenline** (or right-click it).
2. Choose **Open**.
3. In the box that appears, click **Open**.

On these older versions the box says something like: "Save Greenline" cannot be opened because the
developer cannot be verified. The wording changes a little from one version of macOS to the next.
The steps do not.

### What to expect once it is open

- With Chrome or Edge on your Mac, the game has a window of its own. While it is open, the Dock
  shows a second Chrome (or Edge) icon for it. That is normal.
- To quit, press **Command** and **Q**, as with any Mac app.
- With neither Chrome nor Edge, the game opens in your usual browser, Safari for example, as an
  ordinary tab.

---

## Windows

You need Windows 10 or Windows 11.

**An honest note.** The Windows installer was written on a Mac and, at this version, has not been
tested on a Windows computer. If it gives you trouble, skip to "Play without installing" below.
It works on its own.

### Install

1. Right-click `Save-Greenline-Windows.zip` and choose **Extract All**, then **Extract**. Do not
   skip this. If you only double-click into the zip, the installer cannot find the game.
2. In the folder that opens, double-click **Install Save Greenline**. Windows may show its name
   as `Install Save Greenline.bat`.
3. Windows stops it. That is expected. Follow the next part.
4. A black window copies the game and adds two shortcuts. When it says Done, press any key.
5. Double-click **Save Greenline** on your Desktop. It is also in the Start menu.

### The warning

Windows will probably show a blue box that says:

> **Windows protected your PC**
> Microsoft Defender SmartScreen prevented an unrecognized app from starting. Running this app
> might put your PC at risk.

1. Click **More info**.
2. Click **Run anyway**.

On some computers the box says instead "Open File - Security Warning. The publisher could not be
verified." There, click **Run**.

### What the installer does

Three things, and nothing else:

- Copies the game to a folder called `SaveGreenline` in your own app folder
  (`%LOCALAPPDATA%\SaveGreenline`)
- Puts a shortcut called Save Greenline on your Desktop
- Puts a shortcut called Save Greenline in your Start menu

It does not ask for an administrator password and it downloads nothing. The installer is a plain
text file. To read it before you run it, right-click it and choose **Edit**.

The shortcut opens the game in a window of its own using Microsoft Edge, which is already on
almost every Windows computer. Without Edge it uses Google Chrome the same way. With neither, it
opens in whatever browser you have, as an ordinary tab.

### Play without installing

After extracting the zip, double-click **Open Save Greenline** in the same folder. The game opens
in your browser as an ordinary tab. Nothing is copied anywhere.

---

## Your progress

Your progress is saved on that one computer only. It is not sent anywhere and it does not follow
you to another computer.

- **Mac:** in a folder called `Save Greenline` inside `~/Library/Application Support`
- **Windows:** inside `%LOCALAPPDATA%\SaveGreenline`

Progress in the app is separate from progress in the browser version. What you do in one does not
show in the other.

If the app opened the game in your usual browser as a tab (because the computer has neither Chrome
nor Edge), that browser keeps the progress instead.

## Update

- **Mac:** quit the game. Download the new copy and drag it into Applications. When the Mac asks,
  choose **Replace**. Your progress is kept. macOS will ask you to allow the new copy, the same
  way as the first time.
- **Windows:** download the new zip, extract it, and run **Install Save Greenline** again. The
  game is replaced and your progress is kept.

## Remove

**Mac**

1. Drag Save Greenline from Applications to the Trash.
2. To remove your saved progress as well: in Finder, open the **Go** menu and choose
   **Go to Folder**. Paste `~/Library/Application Support` and press Return. Move the folder
   called `Save Greenline` to the Trash.

**Windows**

1. Close the game.
2. In the folder you extracted, double-click **Uninstall Save Greenline** and press **Y**. That
   removes the game, your saved progress and both shortcuts.

If you no longer have that folder, do it by hand: delete the two shortcuts. Then hold the Windows
key and press **R**, type `%LOCALAPPDATA%` and press Enter, and delete the folder called
`SaveGreenline`.

---

## For whoever builds the apps

```
python3 tools/build_apps.py
```

That writes everything into `dist/` from the project as it is at that moment. Run it again after
the game changes. The version number lives in one place, `packaging/VERSION`. The icon, the Mac
launcher, the Windows installer and the read-me files are in `packaging/`. The Mac files can only
be built on a Mac. Pillow is needed only to redraw the icon.

Nothing is signed or notarized. Signing would remove the warnings above. It costs money each year:
an Apple Developer ID for the Mac, a code-signing certificate for Windows.
