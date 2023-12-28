// Content script runs every time url matches the pattern given in manifest.json

(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  // Function to asynchronously fetch bookmarks
  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      // getting bookmarks from chrome storage asynchronously
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    // destructuring the object returned from the background script
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      // currentVideo is a global variable
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (b) => b.time != value
      );
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify(currentVideoBookmarks),
      });

      response(currentVideoBookmarks);
    }
  });

  const newVideoLoaded = async () => {
    // check if bookmark button (that plus button) already exists
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    // Get all the bookmarks asynchronously. NOTE: currentVideoBookmarks is visible as declared at the top
    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      // create a image element which will be used as a button
      const bookmarkBtn = document.createElement("img");

      // adding attributes
      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";

      // this will pop up below message when user hovers over the button
      bookmarkBtn.title = "Click to bookmark current timestamp";

      // Try out these by going on youtube website and pasting in console
      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.append(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  const addNewBookmarkEventHandler = async () => {
    // getting current time of the video
    const currentTime = youtubePlayer.currentTime;

    // creating a new bookmark
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };

    // Get all the bookmarks asynchronously
    currentVideoBookmarks = await fetchBookmarks();

    // sync it to chrome storage
    chrome.storage.sync.set({
      // add new bookmark and sort bookmarks by there saved time
      // in chrome storage it is stored as JSON
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };

  // According to background script we send a message to content script when user changes tab
  // But what if user refreshes the youtube page? The bookmark button will not show!
  // To solve this we call newVideoLoaded() function every time so it creates the bookmark button

  let trail = "&ytExt=ON";
  if (
    !window.location.href.includes(trail) &&
    !window.location.href.includes("ab_channel")
  ) {
    window.location.href += trail;
  }

  // calling the function
})();

// convert seconds to hours:minutes:seconds
const getTime = (t) => {
  // NOTE: t is the argument passed in the getTime function (timestamp)

  // We do not care about the date part, so we set it to 0
  // Date object with a value of 0, which represents the epoch time (January 1, 1970)
  var date = new Date(0);

  // We care about time, so set the seconds to the value of t
  date.setSeconds(t);

  return date.toISOString().substring(11, 19);
  // this will return 00:07:47

  // return date.toISOString();
  // above returns 1970-01-01T00:07:47.000Z
};
