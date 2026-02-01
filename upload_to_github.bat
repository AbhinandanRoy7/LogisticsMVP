@echo off
echo Initializing Git repository...
git init
git add .
git commit -m "Initial MVP Release"
git branch -M main
git remote add origin https://github.com/AbhinandanRoy7/LogisticsMVP.git
echo Pushing to GitHub...
git push -u origin main
pause
