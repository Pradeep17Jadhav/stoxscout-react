# To add new purchase
1. Go to URL /addPurchase and add all the purchase info
2. Copy the object from console and add it in step 3
3. Update the JSON in data/<username>
4. If there are new stocks added, add the name of stock in data/<username>/holdings.js [extension update is required]
5. Run copyData.bat to copy holding info in both extension and react app

# To make changes in extension
1. Make required code changes
2. Run extension/mergeContent.bat
3. Go to Chrome->Extensions and Update the PortfolioManager extension