// Rule to block all URLs
let blockRule = {
    "id": 5,
    "priority": 1,
    "action": {
        "type": "redirect",
        "redirect": {"extensionPath":  "/pages/loading.html"}
    },
    "condition": {
      "urlFilter": "*",
      "resourceTypes": ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    }
};

// Save whitelist to storage
//chrome.storage.sync.set({whitelist: ['apple.com', 'google.com', 'microsoft.com']}, function() {
//    console.log('Whitelist saved');
//});

// Load whitelist from storage
chrome.storage.sync.get(['whitelist'], function(result) {
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