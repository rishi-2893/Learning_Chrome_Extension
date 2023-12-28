# Inject with static declarations

1. Use static content script declarations in manifest.json for **scripts that should be automatically run on a well known set of pages**
2. Summary: Content scripts run automatically on pages that match the patterns
3. Statically declared scripts are registered in the manifest under the "content_scripts" field
4. Can include JavaScript files, **CSS files**, or both.
5. All **auto-run content scripts** must specify match patterns.
```json
{
 "name": "My extension",
 ...
 "content_scripts": [
   {
     "matches": ["https://*.nytimes.com/*"],
     "css": ["my-styles.css"],
     "js": ["content-script.js"]
   }
 ],
 ...
}

```


# Inject with dynamic declarations
1. dynamic declarations can include JavaScript files, CSS files, or both
2. https://developer.chrome.com/docs/extensions/mv3/content_scripts/#dynamic-declarative



# Inject programmatically
1. To inject a content script programmatically, your extension needs host permissions for the page
2. Host permissions can either be granted by requesting them as part of your extension's manifest (see host_permissions) or temporarily via activeTab
3. activeTab-based extension
```json
{
  "name": "My extension",
  ...
  "permissions": [
    "activeTab",  <-----------
    "scripting"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_title": "Action Button"
  }
}
```
4. Content scripts can be injected as files
```js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-script.js"]
  });
});
```


