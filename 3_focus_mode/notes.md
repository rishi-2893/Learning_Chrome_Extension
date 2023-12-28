# Install below or add jsconfig.json for code suggestions

1. npm install --save-dev chrome-types

# Extension Action

1. The extension action controls the extension’s toolbar icon.
2. So whenever the user clicks on the extension action, it will either run some code (like in this example) or display a popup.
3. Add to manifest.json

```json
{
  ...
  "action": {
    "default_icon": {
      "16": "images/icon-16.png",
      "32": "images/icon-32.png",
      "48": "images/icon-48.png",
      "128": "images/icon-128.png"
    }
  },
  ...
}
```

# activeTab Permission

1. grants the extension temporary ability to execute code on the currently active tab
2. allows users to purposefully choose to run the extension on the focused tab
3. does not trigger a permission warning while installing extension
4. This **permission is enabled when the user invokes the extension**.
5. In this case, the user invokes the extension by **clicking on the extension action**.
6. In this case extension action is the **icons**

```json
{
  ...
  "permissions": ["activeTab"],
  ...
}
```

# Adding Scripting Permission

1. Required to add css/javascript
2. The Scripting API does not trigger a permission warning
```json
{
  ...
  "permissions": ["activeTab", "scripting"],
  ...
}
```


# Adding Shortcuts
1. The "_execute_action" key runs the same code as the action.onClicked() event, so no additional code is needed!
```json
{
  ...
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+B",
        "mac": "Command+B"
      }
    }
  }
}

```


# NOTE
1. You can directly manipulate DOM inside background.js
2. Instead use chrome.scripting.executeScript()