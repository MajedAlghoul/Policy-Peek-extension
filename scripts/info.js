import { findSitePolicyStorage,trimUrl,makeRequest, pullSitePolicyStorage, fillLists,setListEmpty } from "./Utility.js";
export function infoHandling(){
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
            let headDiv= document.getElementById('infoWebsiteContainer');
            let bodyDiv= document.getElementById('infoPolicyDetailsContainer');
            let resultDiv= document.getElementById('infoPolicyResultContainer');
            let emptyDiv= document.getElementById('summaryContentDisplayContainerEmpty');
            setListEmpty(headDiv,bodyDiv,emptyDiv);
            resultDiv.style.display="none";
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
                    let selector = document.getElementById('infoHeadRightIcon');
                    selector.src = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.${currentURL}&size=256`;
                    console.log(selector.src);
                
                    selector = document.getElementById('infoHeadRightText');
                    selector.textContent = currentURL;
                    
                    selector = document.getElementById('infoPolicyLink');
                    selector.textContent=localInfo.policyLink;
    
                    selector = document.getElementById('infoPolicyLinkContainer');
                    selector.href=localInfo.policyLink;
    
                    selector = document.getElementById('lastUpdatedDateSpan');
                    selector.textContent=localInfo.lastUpdated;
    
                    selector = document.getElementById('infoRankingRightText');
                    selector.textContent=localInfo.siteRank;
    
                    selector = document.getElementById('infoAlignmentRightText');
                    selector.textContent=localInfo.policyAlignment.length/(localInfo.policyAnalysis.length+ localInfo.policyAlignment.length)*100+"%";
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