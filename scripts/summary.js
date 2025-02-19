import { findSitePolicyStorage,trimUrl,makeRequest, pullSitePolicyStorage, fillLists,setListEmpty } from "./Utility.js";
import { definePreferences } from "./preferences.js";
export function summaryHandling(){
    modifyPage();
}


async function modifyPage(){

    let currentURL ;
    await chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        const url = activeTab.url;

        console.log("Current URL:", url);

        // Check if the URL is restricted
        if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('file://')) {
            //console.warn('Content scripts cannot run on this page.');
            let resultDiv=document.getElementById('summaryContentResultContainer');
            let headDiv= document.getElementById('summaryContentDisplayContainerHeader');
            let bodyDiv= document.getElementById('summaryContentDisplayContainerBody');
            let emptyDiv= document.getElementById('summaryContentDisplayContainerEmpty');
            setListEmpty(headDiv,bodyDiv,emptyDiv);
            resultDiv.style.visibility='hidden';
            //return;
        }else{
            chrome.tabs.sendMessage(tabs[0].id, { action: 'get_current_url' }, async function(response) {
                if (response && response.url) {
                    currentURL = trimUrl(response.url);
                    console.log('Current URL:', response.url);
                    console.log('fuckyou'+currentURL);
                    const localInfo = await getInformation(currentURL);
                    console.log(localInfo);
                    console.log(await pullSitePolicyStorage());
                    console.log("where are we?")
                    let selector = document.getElementById('summaryHeadLeft');
                    selector.textContent = "Rank: "+localInfo.siteRank;
                
                    selector = document.getElementById('summaryHeadRightIcon');
                    selector.src = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.${currentURL}&size=256`;
                    console.log(selector.src);
                
                    selector = document.getElementById('summaryHeadRightText');
                    selector.textContent = currentURL;
                
                    const analysis=localInfo.policyAnalysis;
                    definePreferences();
                    fillLists(analysis,document.getElementById("summaryContentDisplayContainerBody"));
                }
            });
        }

    });


}

async function getInformation(currUrl){
    let localInfo = await findSitePolicyStorage(currUrl);

    if(Object.keys(localInfo).length === 0){
        try {
            localInfo = await makeRequest(currUrl);
        } catch (error) {

            console.error('There was a problem with the axios operation:', error);
        }
    }
    return localInfo;
}