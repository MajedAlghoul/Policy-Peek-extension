export async function removeSpecificRules(ids) {
  await chrome.declarativeNetRequest
    .updateDynamicRules({
      removeRuleIds: ids,
    })
    .catch((error) => {
      console.error("Error Removing rules:", error);
    });
}

export async function addRules(rules) {
  await chrome.declarativeNetRequest
    .updateDynamicRules({
      addRules: rules,
    })
    .catch((error) => {
      console.error("Error adding rules:", error);
    });
}

export async function updateRules() {
  await removeAllRules();
  await removeRulesCounter();
  let wl = await pullStorage('whitelist');
  let swl = await pullStorage('swhitelist');
  let sWMix = [];
  let rules = [];

  if (wl && wl.length !== 0) {
    sWMix.push(wl);
    for (const site of wl) {
      rules.push(await convertSiteToRule(site));
    }
  }

  if (swl && swl.length !== 0) {
    sWMix.push(swl);
    for (const site of swl) {
      rules.push(await convertSiteToRule(site));
    }
  }

  if (sWMix && sWMix.length !== 0) {
    for (const site of sWMix) {
      rules.push(await creatAssociatedRules(site));
    }
  }

  rules = rules.concat(await getPreLoadRules());

  if (rules.length > 0) {
    await addRules(rules);
  }
}

export async function pullRuleIds() {
  return new Promise((resolve, reject) => {
    chrome.declarativeNetRequest.getDynamicRules(function (rules) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(rules.map((rule) => rule.id));
      }
    });
  });
}

export async function removeAllRules() {
  let ids = await pullRuleIds();
  await chrome.declarativeNetRequest
    .updateDynamicRules({
      removeRuleIds: ids,
    })
    .catch((error) => {
      console.error("Error Removing rules:", error);
    });
}

async function getPreLoadRules() {
  let id1 = await getRulesCounter();
  let id2 = await getRulesCounter();
  let id3 = await getRulesCounter();
  let id4 = await getRulesCounter();
  let id5 = await getRulesCounter();
  let id6 = await getRulesCounter();
  let temp = [];
  temp.push({
    id: id1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: `${chrome.runtime.getURL("pages/loading.html")}` },
    },
    condition: {
      urlFilter: "*",
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "object",
        "xmlhttprequest",
        "other",
      ],
    },
  });
  temp.push({
    id: id2,
    priority: 2,
    action: {
      type: "allow",
    },
    condition: {
      urlFilter: `*t3.gstatic.com/*`,
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "media",
        "font",
        "image",
        "ping",
        "csp_report",
        "websocket",
        "webbundle",
        "object",
        "xmlhttprequest",
        "other",
      ],
    },
  });
  temp.push({
    id: id3,
    priority: 2,
    action: {
      type: "allow",
    },
    condition: {
      urlFilter: `file:///*`,
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "media",
        "font",
        "image",
        "ping",
        "csp_report",
        "websocket",
        "webbundle",
        "object",
        "xmlhttprequest",
        "other",
      ],
    },
  });
  temp.push({
    id: id4,
    priority: 2,
    action: {
      type: "allow",
    },
    condition: {
      urlFilter: `*accounts.google.com/*`,
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "media",
        "font",
        "image",
        "ping",
        "csp_report",
        "websocket",
        "webbundle",
        "object",
        "xmlhttprequest",
        "other",
      ],
    },
  });
  temp.push({
    id: id5,
    priority: 2,
    action: {
      type: "allow",
    },
    condition: {
      urlFilter: `*googleapis.com/*`,
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "media",
        "font",
        "image",
        "ping",
        "csp_report",
        "websocket",
        "webbundle",
        "object",
        "xmlhttprequest",
        "other",
      ],
    },
  });
  temp.push({
    id: id6,
    priority: 2,
    action: {
      type: "allow",
    },
    condition: {
      urlFilter: `*googleusercontent.com/*`,
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "media",
        "font",
        "image",
        "ping",
        "csp_report",
        "websocket",
        "webbundle",
        "object",
        "xmlhttprequest",
        "other",
      ],
    },
  });
  return temp;
}

async function convertSiteToRule(site) {
  let idd = await getRulesCounter();
  let rule = {
    id: idd,
    priority: 2,
    action: {
      type: "allow",
    },
    condition: {
      urlFilter: `*${site}/*`,
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "media",
        "font",
        "image",
        "ping",
        "csp_report",
        "websocket",
        "webbundle",
        "object",
        "xmlhttprequest",
        "other",
      ],
    },
  };
  return rule;
}

async function creatAssociatedRules(site) {
  let idd = await getRulesCounter();
  let rule = {
    id: idd,
    priority: 2,
    action: {
      type: "allow",
    },
    condition: {
      urlFilter: "*",
      initiatorDomains: site,
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "font",
        "object",
        "xmlhttprequest",
        "ping",
        "csp_report",
        "media",
        "websocket",
        "other",
      ],
    },
  };
  return rule;
}
//===================================================================================================
async function getCurrentCounter() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("rcounter", (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result.rcounter || 1);
    });
  });
}

async function updateCounter(newval) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ rcounter: newval }, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      console.log("counter Updated");
      resolve();
    });
  });
}

export async function getRulesCounter() {
  let rcounter = await getCurrentCounter();
  await updateCounter(rcounter + 1);
  return rcounter;
}

export async function removeRulesCounter() {
  try {
    await chrome.storage.local.remove("rcounter", function () {
      console.log("counter has been removed");
    });
  } catch (error) {
    console.error(error);
  }
}
//========================================================================================================
export function trimUrl(currUrl) {
  let temp = currUrl;
  temp = temp.split("//")[1];
  if (temp.includes("/")) {
    temp = temp.split("/")[0];
  }
  //if (temp.charAt(temp.length - 1) === '/') {
  //    temp = temp.slice(0, temp.length - 1);
  //}
  let x = temp.split(".");
  if (x.length > 2) {
    temp = x[1] + "." + x[2];
  }
  return temp;
}
//======================================================================================================
function chkSP() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["sitepolicy"], function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
}

export async function pullSitePolicyStorage() {
  try {
    let result = await chkSP();
    //console.log('chkk'+(result.sitepolicy)['reddit.com'].siteRank);
    if (!result.sitepolicy) {
      await pushSitePolicyStorage({});
      result = await chkSP();
    }
    return result.sitepolicy;
  } catch (error) {
    console.error(error);
  }
}

export async function findSitePolicyStorage(siteUrl) {
  try {
    let result = await chkSP();
    //console.log('finding'+Object.keys(result.sitepolicy).length);
    if (!result.sitepolicy) {
      await pushSitePolicyStorage({});
      result = {};
    } else {
      console.log("search" + siteUrl + Object.keys(result.sitepolicy)[0]);
      let x = result.sitepolicy[siteUrl];
      if (x) {
        console.log("slipped");
        result = x;
      } else {
        result = {};
      }
    }
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function pushSitePolicyStorage(bit) {
  try {
    //console.log('pushing'+bit['reddit.com'].siteRank+Object.keys(bit)[0]);
    let toPush;
    if (Object.keys(bit).length === 0) {
      toPush = bit;
    } else {
      let tmp = await pullSitePolicyStorage();
      let theKey = Object.keys(bit)[0];
      //console.log('answer'+ theKey in tmp);
      if (tmp && !(theKey in tmp)) {
        console.log("do we get in?");
        tmp[theKey] = bit[theKey];
      }
      toPush = tmp;
      //console.log(typeof tmp)
      //console.log('x2pushing'+tmp['reddit.com'].siteRank+Object.keys(bit)[0]);
    }
    await chrome.storage.local.set({ ["sitepolicy"]: toPush }, function () {
      console.log("Site Policy Storage Has Been Pushed");
    });
  } catch (error) {
    console.error(error);
  }
}

export async function removeSitePolicyStorage() {
  try {
    await chrome.storage.local.remove(["sitepolicy"], function () {
      console.log("Site Policy Storage Has Been Deleted");
    });
  } catch (error) {
    console.error(error);
  }
}

export async function removeSpecificSitePolicyStorage(item) {
  try {
    let toPush;
    if (!item || item.length === 0) {
      toPush = item;
    } else {
      let tmp = await pullSitePolicyStorage();
      if (item in tmp) {
        delete tmp[item];
        console.log(
          "Item Founed And Will Be Removed From The Site Policy Storage"
        );
      }
      toPush = tmp;
    }
    await chrome.storage.local.set({ ["sitepolicy"]: toPush }, function () {
      console.log(
        "the item: " + item + " Has Been Removed From The Site Policy Storage"
      );
    });
  } catch (error) {
    console.error(error);
  }
}
//===========================================================================================================
export async function makeRequest(wurl) {
  const url = "https://api.example.com/data";

  let prefs = await pullPreferencesStorage();

  const data = {
    url: wurl,
    preferences: prefs,
  };
  /*
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response.data);
        return response;
    } catch (error) {
        console.error('There was a problem with the axios operation:', error);
    }*/
  return null;
}
//===========================================================================================================
export function setListEmpty(h, b, e) {
  h.style.display = "none";
  b.style.display = "none";
  e.style.display = "flex";
}

export function fillLists(analysis, divv) {
  const childElements = divv.querySelectorAll(".summaryBoxInnerActual");

  const dBox = childElements[0];
  const pBox = childElements[1];
  const rBox = childElements[2];

  for (let i = 0; i < analysis.length; i++) {
    console.log(analysis[i] + " rotate");
    if (!Number.isInteger(analysis[i])) {
      console.log("confusedd");
      let temp = document.createElement(analysis[i]);
      if (analysis[i].charAt(0) === "d") {
        divv.querySelectorAll("#summaryDataBox")[0].style.display = "flex";
        dBox.append(temp);
        let tmp =
          temp.shadowRoot.childNodes[3].getElementsByClassName("pillText")[0];
        tmp.style.fontSize = "12px";
        tmp =
          temp.shadowRoot.childNodes[3].getElementsByClassName("pillIcon")[0];
        tmp.style.width = "16px";
        tmp.style.height = "16px";
      } else if (analysis[i].charAt(0) === "p") {
        divv.querySelectorAll("#summaryPurposeBox")[0].style.display = "flex";
        pBox.append(temp);
        let tmp =
          temp.shadowRoot.childNodes[3].getElementsByClassName("pillText")[0];
        tmp.style.fontSize = "12px";
        tmp =
          temp.shadowRoot.childNodes[3].getElementsByClassName("pillIcon")[0];
        tmp.style.width = "16px";
        tmp.style.height = "16px";
      } else if (analysis[i].charAt(0) === "r") {
        divv.querySelectorAll("#summaryRetentionBox")[0].style.display = "flex";
        rBox.append(temp);
        let tmp =
          temp.shadowRoot.childNodes[3].getElementsByClassName("pillText")[0];
        tmp.style.fontSize = "12px";
        tmp =
          temp.shadowRoot.childNodes[3].getElementsByClassName("pillIcon")[0];
        tmp.style.width = "16px";
        tmp.style.height = "16px";
      }
    }
  }
}

export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
//===============================================================================================

export async function authenticateAccount() {
  const CLIENT_ID = chrome.runtime.getManifest().oauth2.client_id;
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `https://accounts.google.com/o/oauth2/auth?client_id=${encodeURIComponent(
          CLIENT_ID
        )}&response_type=token&redirect_uri=https://${
          chrome.runtime.id
        }.chromiumapp.org&scope=${encodeURIComponent(
          "openid email profile https://www.googleapis.com/auth/drive.file"
        )}`,
        interactive: true,
      },
      function (redirect_url) {
        if (chrome.runtime.lastError || !redirect_url) {
          console.error(
            "Error during authentication:",
            chrome.runtime.lastError
          );
          reject(chrome.runtime.lastError);
        } else {
          console.log("Redirect URL:", redirect_url);
          // Extract the token from the redirect URL
          const urlParams = new URLSearchParams(
            new URL(redirect_url).hash.substring(1)
          );
          const token = urlParams.get("access_token");
          if (token) {
            console.log("Access Token granted");
            resolve(token);
          } else {
            reject(new Error("Access token not found in the response."));
          }
        }
      }
    );
  });
}

export function getUserInfo(token, callback) {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Error fetching user info:', data.error);
      } else {
        callback({
          name: data.name,
          email: data.email,
          picture: data.picture
        });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
    });
  }

  export async function syncProfilesToDrive(token, profiles, callback) {
    try {
        // Search for the file
        const searchResponse = await fetch(
            "https://www.googleapis.com/drive/v3/files?q=name='profiles.json' and trashed=false",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const searchData = await searchResponse.json();
        let fileId = null;

        if (searchData.files && searchData.files.length > 0) {
            // File exists, get the fileId
            fileId = searchData.files[0].id;
        }

        const metadata = {
            name: "profiles.json",
            mimeType: "application/json",
        };

        const boundary = 'foo_bar_baz';
        const metadataPart = `
--${boundary}
Content-Type: application/json; charset=UTF-8

${JSON.stringify(metadata)}
`;
        const profilesPart = `
--${boundary}
Content-Type: application/json; charset=UTF-8

${JSON.stringify(profiles)}
--${boundary}--
`;

        const multipartRequestBody = metadataPart + profilesPart;

        let response;
        if (fileId) {
            // Update the existing file
            console.log('patching');
            response = await fetch(
                `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": `multipart/related; boundary=${boundary}`,
                    },
                    body: multipartRequestBody.trim(),
                }
            );
        } else {
            // Create a new file
            console.log('uploading');
            response = await fetch(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": `multipart/related; boundary=${boundary}`,
                    },
                    body: multipartRequestBody.trim(),
                }
            );
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        callback(data);
    } catch (error) {
        console.error("Error syncing profiles:", error);
        callback(null, error);
    }
}

export async function fetchProfilesFromDrive(token, API_KEY, callback) {
    try {
      // Search for the file
      const searchResponse = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=name='profiles.json' and trashed=false",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const searchData = await searchResponse.json();
      let fileId = null;
  
      if (searchData.files && searchData.files.length > 0) {
        // File exists, get the fileId
        fileId = searchData.files[0].id;
      } else {
        throw new Error("profiles.json not found");
      }
  
      // Fetch the file content
      const fileResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!fileResponse.ok) {
        throw new Error(`HTTP error! status: ${fileResponse.status}`);
      }
  
      const fileContent = await fileResponse.json();
      callback(fileContent);
    } catch (error) {
      console.error("Error retrieving profiles:", error);
      callback(null, error);
    }
  }

//========================================================================================
  export async function uploadToGoogle() {
    const token = await authenticateAccount();
    const profiles = await pullStorage('profiles');
    syncProfilesToDrive(token,profiles, function(response) {
      console.log('Sync response:', response);
    });
  }
  
 export async function updateProfile() {
    let profs = await pullStorage("profiles");
    let selected=null;


  /*  for(let i=0;i<profs.length;i++){
      if(profs[i].id === lastClicked2){
        selected=i;
        break;
      }
    }*/

      for(let i=0;i<profs.length;i++){
        if(profs[i].isActive){
          selected=i;
          break;
        }
      }

    if(selected!==null){
      profs[selected].whitelist = await pullStorage("whitelist");
      profs[selected].preferences = await pullStorage("preferences");
      profs[selected].customs = await pullStorage("customs");
      console.log('the profile updating-------------------',profs);
      await removeStorage("profiles");
      await pushStorage("profiles", profs);
  }
    //profs[lastClicked2].isActive = false;
  
  
  }
  
//======================================================================================================
function chkStrg(item) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([item], function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
}

export async function pullStorage(item) {
  try {
    let result = await chkStrg(item);
    if (!result[item]) {
      await pushStorage(item, []);
      result = await chkStrg(item);
    }
    return result[item];
  } catch (error) {
    console.error(error);
  }
}

export async function pushStorage(item, bit) {
  try {
    let toPush;
    if (bit.length === 0) {
      toPush = bit;
    } else {
      let tmp = await pullStorage(item);
      if (!tmp) {
        toPush = bit;
      } else if (!tmp.includes(bit[0])) {
        toPush = tmp.concat(bit);
      } else {
        toPush = tmp;
      }
    }
    await chrome.storage.local.set({ [item]: toPush }, function () {
      console.log(item + " Has Been Pushed");
    });

    if(item === 'preferences'|| item === 'whitelist'){
      await updateProfile();
      const acc= await pullStorage("account");
      if (acc.length !== 0) {
        await uploadToGoogle(item);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function removeStorage(item) {
  try {
    await chrome.storage.local.remove([item], function () {
      console.log(item + " Has Been Deleted");
    });
  } catch (error) {
    console.error(error);
  }
}

export async function removeSpecificStorage(item1, item) {
  try {
    let toPush;
    if (item.length === 0) {
      toPush = item;
    } else {
      let tmp = await pullStorage(item1);
      if (tmp.includes(item)) {
        tmp = tmp.filter((e) => e !== item);
        console.log(
          "Item Founed And Will Be Removed From The " + item1 + " Storage"
        );
      }
      toPush = tmp;
    }
    await chrome.storage.local.set({ [item1]: toPush }, function () {
      console.log(
        "the item: " + item + " Has Been Removed From The " + item1 + " Storage"
      );
    });
  } catch (error) {
    console.error(error);
  }
}