import { pullPreferencesStorage, pushSessionWhiteListStorage, updateRules } from './Utility.js';
import { trimUrl } from './Utility.js';
chrome.storage.local.get('currentURL', async function (result) {
  const currentURL = result.currentURL;
  if (currentURL) {
    await modifyPage(currentURL);
    await sendPolicyRequest(currentURL);
  }
});

async function modifyPage(currentURL) {
  let temp = trimUrl(currentURL);

  let selector = document.getElementById('bigTitle');
  selector.textContent = temp;
  selector = document.getElementById('littleTextSpan');
  selector.textContent = temp.split('.')[0];


  let count = 10;
  selector = document.getElementById('littleCounterSpan');
  selector.textContent = count;
  function decrementCounter() {
    count--;
    selector.textContent = count;
    if (count <= 0) {
      clearInterval(intervalId);
    }
  }
  const intervalId = setInterval(decrementCounter, 1000);

  const faviconImg = document.getElementById('favicon');
  faviconImg.src = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${currentURL}&size=256`;
}



async function sendPolicyRequest(currUrl) {
  setTimeout(async function () {
    let resp = {
      match: false,
      policyAnalysis: ['dsd-element', 'dci-element']
    };
    if (resp.match) {
      await pushSessionWhiteListStorage([trimUrl(currUrl)]);
      console.log(trimUrl(currUrl));
      await updateRules();
      window.location.replace(currUrl);
    } else {
      chrome.storage.local.set({ sitepolicy: resp.policyAnalysis }, function () {
        console.log('Site Policy is saved in local storage');
      });
      window.location.replace('../pages/block.html');
    }
  }, 3000);

}

/*async function sendPolicyRequest(currUrl) {
  const url = 'https://api.example.com/data';
  
  let prefs=await pullPreferencesStorage();

  const data = {
      url: currUrl,
      preferences: prefs
  };
  
  try {
      const response = await axios.post(url, data, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      
      console.log(response.data);
  } catch (error) {
      console.error('There was a problem with the axios operation:', error);
  }
}*/
