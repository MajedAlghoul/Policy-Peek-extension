let blockRule = {
  "id": 5,
  "priority": 1,
  "action": {
    "type": "redirect",
    "redirect": { "url": `${chrome.runtime.getURL('pages/loading.html')}` }
  },
  "condition": {
    "urlFilter": "*",
    "resourceTypes": ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  }
};

let currentURL = '';

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    currentURL = details.url;
    console.log('Current URL:', currentURL);
  },
  { urls: ['<all_urls>'] }
);

chrome.storage.sync.set({ whitelist: ['apple.com', 'microsoft.com',"google.com"] }, function () {
  console.log('Whitelist saved');
});

chrome.storage.sync.get(['whitelist'], function (result) {
  if (result.whitelist) {
    let whitelist = result.whitelist;
    console.log('Whitelist loaded: ' + whitelist);

    let allowRules = whitelist.map((website, index) => {
      return {
        "id": index + 1,
        "priority": 2,
        "action": {
          "type": "allow"
        },
        "condition": {
          "urlFilter": `*${website}/*`,
          "resourceTypes": ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
        }
      };
    });

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [...allowRules.map(rule => rule.id), 5],
      addRules: [...allowRules, blockRule]
    }).catch((error) => {
      console.error('Error updating rules:', error);
    });
  } else {
    console.log('Whitelist not found');
  }
});

//chrome.storage.sync.remove('whitelist', function() {
//    console.log('Whitelist removed');
//  });