chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'get_current_url') {
        sendResponse({ url: window.location.href });
    }
});