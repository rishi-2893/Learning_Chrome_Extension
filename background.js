// This helps the extension know when user changes tab
// And also checks if the new tab is a youtube video tab
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    
  // check if user is watching a video
    if (tab.url && tab.url.includes("youtube.com/watch")) {

      // get the video id (getting the query string)
      const queryParameters = tab.url.split("?")[1];

      // helps to work with parameters in the url
      const urlParameters = new URLSearchParams(queryParameters);
  
      // send message to content script
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
    }
  });
  
// Example link: youtube.com/watch?v=PrAli-RnIe8