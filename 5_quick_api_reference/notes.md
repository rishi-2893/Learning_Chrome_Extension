# Register service worker

1. Extensions register their service worker in the manifest, which only takes a single JavaScript file

```json
{
    ...
  "background": {
    "service_worker": "service-worker.js",
  },
    ...
}
```

# Type = Module

1. For better maintainability, we will implement service worker in a separate module
2. First, we need to declare the service worker as an ES Module
3. This allows us to import modules in our service worker

```json
{
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  }
}
```


# Service worker terminated
1. Load an unpacked extension.
2. After 30 seconds you will see "service worker(inactive)" => terminated
3. Click on the "service worker(inactive)" hyperlink to inspect
4. Service worker will become active again
5. **NOTE**
  - service workers are short-lived execution environments
  - they get terminated repeatedly throughout a user's browser session


# Initialize the state
1. Chrome will shut down service workers if they are not needed.
2. We use the chrome.storage API to persist state across service worker sessions
```json
{
  ...
  "permissions": ["storage"],
}
```


# Content Scripts
1. Extensions use content scripts to read and modify the content of the page
