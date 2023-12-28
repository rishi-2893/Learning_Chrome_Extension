/**
 * content script declarations in manifest.json for scripts that should be
 * automatically run on a well known set of pages.
 * Summary: Content scripts run automatically on pages that match the patterns
 */


var a = document.createElement("h1");
a.innerText = 'Hello';
var parent = document.body;
parent.appendChild(a);
console.log('Done!');