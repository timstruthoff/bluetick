@echo off
set /p id="Summary: "
git add -A
git commit -m "%id%"
git push origin master