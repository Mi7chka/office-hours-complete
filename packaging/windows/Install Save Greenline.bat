@echo off
rem ============================================================================
rem  Save Greenline {{VERSION}}: the installer for Windows.
rem  NOT TESTED ON WINDOWS. It was written on a Mac. Read it before you trust it.
rem
rem  What it does, and nothing else:
rem    1. Copies the "game" folder that sits beside this file to
rem       %LOCALAPPDATA%\SaveGreenline\game
rem    2. Adds a "Save Greenline" shortcut to the Desktop and to the Start menu
rem  No administrator rights. Nothing is downloaded. Nothing else is changed.
rem
rem  The shortcut opens the game in a window of its own: Microsoft Edge in app
rem  mode, with a profile folder of its own (%LOCALAPPDATA%\SaveGreenline\profile)
rem  so the game's progress is kept apart from everyday browsing. If Edge is not
rem  on this computer it uses Google Chrome the same way. If neither is, the
rem  shortcut opens the game in the default browser as an ordinary tab.
rem
rem  Written without ( ) blocks on purpose: a folder name with brackets in it,
rem  such as "Program Files (x86)", breaks those. Every path stays in quotes.
rem  Folder names reach PowerShell through SG_ variables, never pasted into the
rem  command, so a name with a quote mark in it cannot break the command.
rem ============================================================================
setlocal EnableExtensions DisableDelayedExpansion
title Install Save Greenline

set "SG_VERSION={{VERSION}}"
set "SG_SRC=%~dp0"
set "SG_DEST=%LOCALAPPDATA%\SaveGreenline"
set "SG_PS=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if not exist "%SG_PS%" set "SG_PS=powershell.exe"

echo.
echo   Save Greenline %SG_VERSION%
echo   The Office Hours game, from Mitchell B Consulting
echo.

if not defined LOCALAPPDATA goto no_appdata
if not exist "%SG_SRC%game\index.html" goto not_extracted
if not exist "%SG_SRC%save-greenline.ico" goto not_extracted
if not exist "%SG_SRC%Open Save Greenline.html" goto not_extracted

rem ---- Step 1: copy the game --------------------------------------------------
echo   Step 1 of 2: copying the game onto this computer...
if not exist "%SG_DEST%\" mkdir "%SG_DEST%"
if not exist "%SG_DEST%\" goto copy_failed
rem  /MIR makes the installed game folder match this one exactly, so an update
rem  leaves no old files behind. The profile folder is beside it, not inside it,
rem  and is never touched. robocopy reports success with any number below 8.
robocopy "%SG_SRC%game" "%SG_DEST%\game" /MIR /R:1 /W:1 /NFL /NDL /NJH /NJS /NP >nul 2>&1
if errorlevel 8 goto copy_failed
copy /Y "%SG_SRC%save-greenline.ico" "%SG_DEST%\save-greenline.ico" >nul 2>&1
if errorlevel 1 goto copy_failed
copy /Y "%SG_SRC%Open Save Greenline.html" "%SG_DEST%\Open Save Greenline.html" >nul 2>&1
if errorlevel 1 goto copy_failed
if not exist "%SG_DEST%\game\index.html" goto copy_failed

rem ---- Which browser will the shortcut use? -----------------------------------
set "SG_BROWSER="
set "SG_BROWSER_NAME="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "SG_BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined SG_BROWSER if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "SG_BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if defined SG_BROWSER set "SG_BROWSER_NAME=Microsoft Edge"
if defined SG_BROWSER goto browser_chosen
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "SG_BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined SG_BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "SG_BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined SG_BROWSER if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "SG_BROWSER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if defined SG_BROWSER set "SG_BROWSER_NAME=Google Chrome"
:browser_chosen

rem ---- Step 2: the two shortcuts ----------------------------------------------
rem  PowerShell is used for three things batch cannot do well: finding the real
rem  Desktop folder (it is often inside OneDrive), writing the game's address
rem  with spaces and accents encoded properly, and making the shortcut itself.
rem  [char]34 is a double quote mark, written that way to keep this line simple.
echo   Step 2 of 2: adding the shortcuts...
"%SG_PS%" -NoProfile -Command "$ErrorActionPreference='Stop'; $d=$env:SG_DEST; $q=[char]34; $u=([System.Uri](Join-Path $d 'game\index.html')).AbsoluteUri+'#/game'; if($env:SG_BROWSER){$t=$env:SG_BROWSER; $a='--app='+$q+$u+$q+' --user-data-dir='+$q+(Join-Path $d 'profile')+$q+' --no-first-run --no-default-browser-check'}else{$t=Join-Path $d 'Open Save Greenline.html'; $a=''}; $w=New-Object -ComObject WScript.Shell; foreach($f in 'Desktop','Programs'){$l=$w.CreateShortcut((Join-Path ([Environment]::GetFolderPath($f)) 'Save Greenline.lnk')); $l.TargetPath=$t; $l.Arguments=$a; $l.WorkingDirectory=$d; $l.IconLocation=(Join-Path $d 'save-greenline.ico')+',0'; $l.Description='Save Greenline, the Office Hours game'; $l.Save()}"
if errorlevel 1 goto shortcut_failed

echo.
echo   Done. Save Greenline is installed on this computer.
echo.
echo   What this did:
echo     1. Copied the game to "%SG_DEST%"
echo     2. Put a shortcut called Save Greenline on your Desktop
echo     3. Put a shortcut called Save Greenline in your Start menu
echo   Nothing else was changed.
echo.
echo   To play: double-click Save Greenline on your Desktop.
echo   Or press the Windows key, type Save Greenline, and press Enter.
echo.
if defined SG_BROWSER echo   It opens in a window of its own, using %SG_BROWSER_NAME%.
if not defined SG_BROWSER echo   It opens in your usual web browser, as an ordinary tab, because
if not defined SG_BROWSER echo   neither Microsoft Edge nor Google Chrome was found on this computer.
echo   Your progress is saved on this computer only.
echo.
echo   To remove it later, double-click Uninstall Save Greenline in this folder.
echo.
pause
endlocal
exit /b 0

:not_extracted
echo   This installer cannot find the game files that should be next to it.
echo.
echo   That nearly always means it was started from inside the zip file.
echo   Close this window, then:
echo     1. Right-click Save-Greenline-Windows.zip and choose Extract All
echo     2. Open the folder that appears
echo     3. Double-click Install Save Greenline in that folder
echo.
echo   Nothing was changed on this computer.
goto failed

:no_appdata
echo   Windows did not say where your personal app folder is, so there is no
echo   safe place to put the game. Nothing was changed on this computer.
echo   You can still play: double-click Open Save Greenline in this folder.
goto failed

:copy_failed
echo.
echo   The game could not be copied to "%SG_DEST%"
echo.
echo   If Save Greenline is open, close it and run this again.
echo   You can also play without installing: double-click Open Save Greenline
echo   in this folder.
goto failed

:shortcut_failed
echo.
echo   The game was copied, but Windows would not let this installer add one or
echo   both shortcuts.
echo.
echo   You can still play. Open this folder and double-click Open Save Greenline:
echo     "%SG_DEST%"
goto failed

:failed
echo.
pause
endlocal
exit /b 1
