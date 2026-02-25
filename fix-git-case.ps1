# Fix Git case-sensitivity issues for Netlify deployment
# Run this script from the repository root in PowerShell

Write-Host "=== Fixing Git Case-Sensitivity Issues ===" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Push-Location frontend

Write-Host "Step 1: Force Git to recognize case change for store.ts..." -ForegroundColor Yellow
# Use git mv with temporary name to force case change
git mv lib/store.ts lib/store.ts.tmp
git mv lib/store.ts.tmp lib/store.ts

Write-Host "Step 2: Force Git to recognize case change for api.ts..." -ForegroundColor Yellow
git mv lib/api.ts lib/api.ts.tmp
git mv lib/api.ts.tmp lib/api.ts

# Return to root
Pop-Location

Write-Host ""
Write-Host "Step 3: Clearing Git cache for entire repository..." -ForegroundColor Yellow
# Remove all files from Git's index (doesn't delete actual files)
git rm -r --cached .

Write-Host ""
Write-Host "Step 4: Re-adding all files with correct casing..." -ForegroundColor Yellow
# Re-add all files with current casing
git add .

Write-Host ""
Write-Host "Step 5: Committing changes..." -ForegroundColor Yellow
git commit -m "fix: Force correct file casing for Linux/Netlify compatibility"

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: git push"
Write-Host "2. Go to Netlify Dashboard > Deploys"
Write-Host "3. Click 'Trigger deploy' > 'Clear cache and deploy site'"
Write-Host ""
