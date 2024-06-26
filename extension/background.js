chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// This event listener runs when a message is received from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "STOCK_DATA" && message?.owner === "Pradeep") {
    var encodedData = encodeURIComponent(JSON.stringify(message.symbolsData));
    var websiteUrl = "http://localhost:3000";
    chrome.tabs.create({ url: websiteUrl + "?data=" + encodedData });

    chrome.storage.local.set({ symbolsData: message.symbolsData }, function () {
      console.log("Large data stored in chrome.storage");

      setTimeout(() => {
        chrome.tabs.query({}, function (tabs) {
          tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, "HELLOOOO");
          });
        });
      }, 5000);
    });
  }
});
