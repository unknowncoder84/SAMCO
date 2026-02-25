#!/bin/bash
# Fix Git case-sensitivity issues for Netlify deployment
# Run this script from the repository root

echo "=== Fixing Git Case-Sensitivity Issues ==="
echo ""

# Navigate to frontend directory
cd frontend || exit 1

echo "Step 1: Force Git to recognize case change for store.ts..."
# Use git mv with temporary name to force case change
git mv lib/store.ts lib/store.ts.tmp
git mv lib/store.ts.tmp lib/store.ts

echo "Step 2: Force Git to recognize case change for api.ts..."
git mv lib/api.ts lib/api.ts.tmp
git mv lib/api.ts.tmp lib/api.ts

# Return to root
cd ..

echo ""
echo "Step 3: Clearing Git cache for entire repository..."
# Remove all files from Git's index (doesn't delete actual files)
git rm -r --cached .

echo ""
echo "Step 4: Re-adding all files with correct casing..."
# Re-add all files with current casing
git add .

echo ""
echo "Step 5: Committing changes..."
git commit -m "fix: Force correct file casing for Linux/Netlify compatibility"

echo ""
echo "=== Done! ==="
echo ""
echo "Next steps:"
echo "1. Run: git push"
echo "2. Go to Netlify Dashboard > Deploys"
echo "3. Click 'Trigger deploy' > 'Clear cache and deploy site'"
echo ""
