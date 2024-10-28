# To modify master list of stocks
1. Add the stock object in server/listCreator.js
2. execute node server/listCreator.js to update the list 


# To add new purchase
1. Go to URL /addPurchase and add all the purchase info
2. Run copyData.bat to copy holding info in both extension and react app

# To make changes in extension
1. Make required code changes
2. Run extension/mergeContent.bat
3. Go to Chrome->Extensions and Update the PortfolioManager extensionF.json
