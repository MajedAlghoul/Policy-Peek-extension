import {
  trimUrl,
  fillLists,
  updateRules,
  pushStorage,
  pushSitePolicyStorage,
  pullSitePolicyStorage,
  pullStorage,
} from "./Utility.js";
import { definePreferences } from "./preferences.js";
chrome.storage.local.get("tempsitepolicy", async function (result) {
  const sitePolicy = result.tempsitepolicy;
  if (sitePolicy) {
    console.log("fromblock" + sitePolicy.siteRank);
    await modifyPage(sitePolicy);
  }
});

async function modifyPage(sitePolicy) {
  chrome.storage.local.get("currentURL", async function (result) {
    const currentURL = result.currentURL;

    if (currentURL) {
      let temp = trimUrl(currentURL);
      console.log(temp);
      let selector = document.getElementById("blockTopText");
      selector.textContent =
        temp.split(".")[0] +
        "'s Privacy policy does not align with User preferences!";

      const faviconImg = document.getElementById("blockFavicon");
      faviconImg.src = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${currentURL}&size=256`;

      setListeners(temp, sitePolicy, currentURL);

      definePreferences();

      document.getElementById("blockConflictCounterSpan").innerText =
        sitePolicy.policyAlignment.length;

      fillLists(
        sitePolicy.policyAlignment,
        document.getElementsByClassName("theBodyOfBlockList1")[0]
      );
      let strg= await pullStorage('preferences');
      fillLists(strg,
        document.getElementsByClassName("theBodyOfBlockList2")[0]
      );
    }
  });
}

async function setListeners(temp, sitePolicy, currentURL) {
  const onceB = document.getElementById("allowOnceButton");
  const alwaysB = document.getElementById("allowAlwaysButton");

  onceB.onclick = async function () {
    await handleClickAuth(0,temp, sitePolicy, currentURL);
  };
  alwaysB.onclick = async function () {
    await handleClickAuth(1,temp, sitePolicy, currentURL);
  };
}

async function addTheTempSite(currUrl, sitePolicy) {
  await pushSitePolicyStorage({ [currUrl]: sitePolicy });
  console.log(await pullSitePolicyStorage());
}

async function handleClickAuth(type,temp, sitePolicy, currentURL) {
  const profiles = await pullStorage("profiles");
  let blockInput = document.getElementById("blockInput");
  let j = 0;
  for (let i = 0; i < profiles.length; i++) {
    if (profiles[i].isActive) {
      j = i;
      break;
    }
  }

  if (profiles[j].password === blockInput.value) {
    if (type === 0) {
      await pushStorage('swhitelist',[temp]);
    } else {
      await pushStorage('whitelist',[temp]);
    }
    await updateRules();
    await addTheTempSite(temp, sitePolicy);
    window.location.replace(currentURL);
  }
}
