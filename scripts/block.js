import { pullPreferencesStorage, pushSessionWhiteListStorage, updateRules,pushWhiteListStorage } from './Utility.js';
import { trimUrl } from './Utility.js';

chrome.storage.local.get('sitepolicy', async function (result) {
    const sitePolicy = result.sitepolicy;
    if (sitePolicy) {
        await modifyPage(sitePolicy);
    }
});

async function modifyPage(sitePolicy) {
    chrome.storage.local.get('currentURL', async function (result) {
        const currentURL = result.currentURL;
        if (currentURL) {
            let temp = trimUrl(currentURL);

            let selector = document.getElementById('blockTopText');
            selector.textContent = (temp.split('.')[0])+"'s Privacy policy does not align with User preferences!";
            
            const faviconImg = document.getElementById('blockFavicon');
            faviconImg.src = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${currentURL}&size=256`;

            const onceB=document.getElementById('allowOnceButton');
            const alwaysB=document.getElementById('allowAlwaysButton');
            onceB.onclick=async function() {
                  await pushSessionWhiteListStorage([temp]);
                  await updateRules();
                  window.location.replace(currentURL);
            }
            alwaysB.onclick=async function() {
                await pushWhiteListStorage([temp]);
                await updateRules();
                window.location.replace(currentURL);
            }
        }
      });


}