@echo off
rem ============================================================================
rem  Save Greenline {{VERSION}}: the uninstaller for Windows.
rem  NOT TESTED ON WINDOWS. It was written on a Mac. Read it before you trust it.
rem
rem  After a yes, it removes exactly three things:
rem    1. %LOCALAPPDATA%\SaveGreenline   (the game, and the progress saved in it)
rem    2. the "Save Greenline" shortcut on the Desktop
rem    3. the "Save Greenline" shortcut in the Start menu
rem  No administrator rights. Nothing else is touched.
rem ============================================================================
setlocal EnableExtensions DisableDelayedExpansion
title Uninstall Save Greenline

set "SG_DEST=%LOCALAPPDATA%\SaveGreenline"
set "SG_PS=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if not exist "%SG_PS%" set "SG_PS=powershell.exe"

echo.
echo   Uninstall Save Greenline
echo.
if not defined LOCALAPPDATA goto no_appdata

echo   This removes Save Greenline from this computer:
echo     1. The game, in "%SG_DEST%"
echo     2. Your saved progress in the game
echo     3. The Save Greenline shortcuts on the Desktop and in the Start menu
echo.
echo   If the Save Greenline window is open, close it first.
echo.
choice /C YN /N /M "  Remove it? Press Y for yes or N for no: "
rem  choice answers 1 for Y and 2 for N. Anything else (0, or an error) is a no.
if errorlevel 2 goto keep
if not errorlevel 1 goto keep

rem  Step out of the folder first, in case this file was started from inside it.
cd /d "%TEMP%" >nul 2>&1

rem  The shortcuts. PowerShell knows where the real Desktop is (often OneDrive).
"%SG_PS%" -NoProfile -Command "foreach($f in 'Desktop','Programs'){$p=Join-Path ([Environment]::GetFolderPath($f)) 'Save Greenline.lnk'; if(Test-Path -LiteralPath $p){Remove-Item -LiteralPath $p -Force}}" >nul 2>&1
rem  The same two again in the usual places, in case PowerShell was not allowed to run.
if exist "%USERPROFILE%\Desktop\Save Greenline.lnk" del /f /q "%USERPROFILE%\Desktop\Save Greenline.lnk" >nul 2>&1
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Save Greenline.lnk" del /f /q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Save Greenline.lnk" >nul 2>&1

rem  The game and its saved progress.
if exist "%SG_DEST%\" rmdir /s /q "%SG_DEST%" >nul 2>&1
if exist "%SG_DEST%\" goto not_all

echo.
echo   Done. Save Greenline has been removed from this computer:
echo   the game, your saved progress and both shortcuts.
echo   You can delete this folder too.
echo.
pause
endlocal
exit /b 0

:keep
echo.
echo   Nothing was removed.
echo.
pause
endlocal
exit /b 0

:not_all
echo.
echo   The shortcuts are gone, but some files could not be removed from
echo     "%SG_DEST%"
echo   Close the Save Greenline window and run this again.
echo.
pause
endlocal
exit /b 1

:no_appdata
echo   Windows did not say where your personal app folder is, so nothing was
echo   removed. See INSTALL.md in the project for how to remove it by hand.
echo.
pause
endlocal
exit /b 1
