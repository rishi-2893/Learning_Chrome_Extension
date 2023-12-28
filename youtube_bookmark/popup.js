import { getActiveTabURL } from "./utils.js";

// Add new bookmark to the popup
const addNewBookmark = (bookmarks, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  // assigning text content
  bookmarkTitleElement.textContent = bookmark.desc;

  // assigning classes for styling
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";

  // Adds img elements with play icon, onPlay is callback function and 
  // controlsElement is parent element
  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  // bookmark.time ensures uniqueness of id
  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";

  // Setting timestamp as attribute so that we can start playing video from 
  // that timestamp you can get value of timestamp by 
  // using newBookmarkElement.getAttribute("timestamp")
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};

// Function to display bookmarks. currentBookmarks=[] is default value
const viewBookmarks = (currentBookmarks = []) => {
  // "container" class belongs in the popup.html
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  console.log(currentBookmarks);

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];

      // Add new bookmark to the popup
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
  }

  return;
};

// This is callback function called when the user clicks on "play" icon
// We add async because we are using getActiveTabURL()
const onPlay = async (e) => {
  // getting timestamp
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async (e) => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  // Go to parent node and delete the child
  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

  // This function takes an callback function (optional)
  // Pass viewBookmarks as the callback function so that any changes reflect immediately
  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    viewBookmarks
  );
};

// Generic function for onPlay and onDelete
const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

// Triggers when all the DOM is loaded
// Call back function is asynchronous because getActiveTabURL is 
//async function which returns promise. And as we want to use await
// instead of .then or .catch, we need to use "async" callback function
document.addEventListener("DOMContentLoaded", async () => {
  // Get current video
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);
  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    // "container" class belongs in the popup.html
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML =
      '<div class="title">This is not a youtube video page.</div>';
  }
});
