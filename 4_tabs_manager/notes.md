# Action API

1. Use the chrome.action API to control the extension's icon in the Google Chrome toolbar
2. When the user clicks on the extension action, it will either run some code or open a popup
```json
{
  ...
  "action": {
    "default_popup": "popup.html"
  },
  ...
}
```

# PopUp
1. A popup is similar to a web page with one exception: it can't run inline JavaScript.


# Top Level Await
1. You can use top level await by adding type="module" to the script tag.
2. This allows to use "await" keyword outside async function
3. See popup.js



