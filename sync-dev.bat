@echo off
REM Spryzen+ Dev Sync Script
REM Syncs source from Google Drive to C:\spryzen-dev for npm/build
REM Run this whenever you add new files to Google Drive

echo Syncing source from Google Drive to C:\spryzen-dev...
robocopy "G:\My Drive\IronWall+\spryzen-website" "C:\spryzen-dev" /E /XD node_modules .next /XF "*.log"
echo Sync complete!
