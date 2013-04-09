// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Bootstrap Chrome OAuth for the
 * Save to Google Drive Chrome Extension.
 * @author jeffcon@google.com (Jeff Conrad)
 */


/**
 * Bootstraps the OAuth dance upon page load.
 */
window.addEventListener('load', function() {
  var element = document.getElementById('title');
  element.textContent = chrome.i18n.getMessage('OAUTH_TITLE');
  element = document.getElementById('redirecting');
  element.textContent = chrome.i18n.getMessage('REDIRECTING');
  ChromeExOAuth.initCallbackPage();
}, false);
