import * as utility from './Utility.js';

loading();

async function loading() {
  //await utility.removeAllRules();
  //await utility.removeStorage('whitelist');
  //await utility.removeStorage('swhitelist');
  //await utility.removeSitePolicyStorage();
  //await utility.removeRulesCounter();
  chrome.runtime.onStartup.addListener(async () => {
    await utility.removeStorage('switelist');
    await utility.removeSitePolicyStorage();
    await utility.updateRules();
  });


  chrome.webRequest.onBeforeRequest.addListener(
    async function (details) {
      if (details.type === 'main_frame' && !(details.url).includes('chrome-extension')) {
        chrome.storage.local.set({ currentURL: details.url }, function () {
          console.log('URL sent to loading page');
        });
      }

    },
    { urls: ['<all_urls>'] }
  );
}

/*
let iop;
if (details.initiator) {
  iop = (details.initiator).split('.');
}

if (iop && iop.length >= 3) {
  try {
    let wl = await utility.pullStorage('whitelist');
    wl = wl.some(item => item.includes(iop[1] + '.' + iop[2]));

    let swl = await utility.pullStorage('switelist');
    swl = swl.some(item => item.includes(iop[1] + '.' + iop[2]));

    if (wl || swl) {
      //console.log('trace '+ details.url);
      await utility.pushStorage('switelist',details.url);
      await requestUpdate();
    }
  } catch (error) {
    console.error('Error processing whitelist checks:', error);
  }
} else {
  console.warn('Initiator format is not as expected:', details.initiator);
}
*/