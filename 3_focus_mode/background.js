/**
 * Service workers are special JavaScript environments that are loaded
 * to handle events and terminated when they're no longer needed
 */


/**
 * This method allows the extension to set an initial state or 
 * complete some tasks on installation.
 * we will use the action's badge text itself to track whether
 * the extension is 'ON' or 'OFF'
 */
chrome.runtime.onInstalled.addListener(() => {
  // The action's badge is a colored banner on top of the extension action
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});

const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';

// When the user clicks on the extension action
// in our case extension action is the icons we have set in manifest.json
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState
    });

    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id }
      });
    } else if (nextState === 'OFF') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id }
      });
    }
  }

  chrome.scripting.executeScript({
    files: ['example.js'],
    target: { tabId: tab.id }
  })

});
