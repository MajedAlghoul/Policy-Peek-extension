function chkPrefs() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['preferences'], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

export async function pullPreferencesStorage() {
    try {
        let result = await chkPrefs();
        if (!result.preferences) {
            await pushPreferencesStorage([]);
            result = await chkPrefs();
        }
        return result.preferences;
    } catch (error) {
        console.error(error);
    }
}

export async function pushPreferencesStorage(bit) {
    try {
        let toPush;
        if (bit.length === 0) {
            toPush = bit;
        } else {
            let tmp = await pullPreferencesStorage();
            if (!tmp.includes(bit[0])) {
                toPush = tmp.concat(bit);
            } else {
                toPush = tmp;
            }
        }
        await chrome.storage.sync.set({ ['preferences']: toPush }, function () {
            console.log('Preferences Storage Has Been Pushed');
        });
    } catch (error) {
        console.error(error);
    }
}

export async function removePreferencesStorage() {
    try {
        await chrome.storage.sync.remove(['preferences'], function () {
            console.log('Preferences Has Been Deleted');
        });
    } catch (error) {
        console.error(error);
    }
}

export async function removeSpecificPreferencesStorage(item) {
    try {
        let toPush;
        if (item.length === 0) {
            toPush = item;
        } else {
            let tmp = await pullPreferencesStorage();
            if (tmp.includes(item)) {
                tmp = tmp.filter(e => e !== item)
                console.log('Item Founed And Will Be Removed From The Preferences Storage')
            }
            toPush = tmp;
        }
        await chrome.storage.sync.set({ ['preferences']: toPush }, function () {
            console.log('the item: ' + item + ' Has Been Removed From The Preferences Storage');
        });
    } catch (error) {
        console.error(error);
    }
}
//=======================================================================================
function chkCusts() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['customs'], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

export async function pullCustomStorage() {
    try {
        let result = await chkCusts();
        if (!result.customs) {
            await pushCustomStorage([]);
            result = await chkCusts();
        }
        return result.customs;
    } catch (error) {
        console.error(error);
    }
}

export async function pushCustomStorage(bit) {
    try {
        let toPush;
        if (bit.length === 0) {
            toPush = bit;
        } else {
            let tmp = await pullCustomStorage();
            if (!tmp.includes(bit[0])) {
                toPush = tmp.concat(bit);
            } else {
                toPush = tmp;
            }
        }
        await chrome.storage.sync.set({ ['customs']: toPush }, function () {
            console.log('Custom Storage Has Been Pushed');
        });
    } catch (error) {
        console.error(error);
    }
}

export async function removeCustomStorage() {
    try {
        await chrome.storage.sync.remove(['customs'], function () {
            console.log('Custom Storage Has Been Deleted');
        });
    } catch (error) {
        console.error(error);
    }
}

export async function removeSpecificCustomStorage(item) {
    try {
        let toPush;
        if (item.length === 0) {
            toPush = item;
        } else {
            let tmp = await pullCustomStorage();
            if (tmp.includes(item)) {
                tmp = tmp.filter(e => e !== item);
                console.log('Item Founed And Will Be Removed From The Custom Storage');
            }
            toPush = tmp;
        }
        await chrome.storage.sync.set({ ['customs']: toPush }, function () {
            console.log('the item: ' + item + ' Has Been Removed From The Custom Storage');
        });
    } catch (error) {
        console.error(error);
    }
}
//======================================================================================
function chkWht() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['whitelist'], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

export async function pullWhiteListStorage() {
    try {
        let result = await chkWht();
        if (!result.whitelist) {
            await pushWhiteListStorage([]);
            result = await chkWht();
        }
        return result.whitelist;
    } catch (error) {
        console.error(error);
    }
}

export async function pushWhiteListStorage(bit) {
    try {
        let toPush;
        if (bit.length === 0) {
            toPush = bit;
        } else {
            let tmp = await pullWhiteListStorage();
            if (!tmp.includes(bit[0])) {
                toPush = tmp.concat(bit);
            } else {
                toPush = tmp;
            }
        }
        await chrome.storage.sync.set({ ['whitelist']: toPush }, function () {
            console.log('WhiteList Storage Has Been Pushed');
        });
    } catch (error) {
        console.error(error);
    }
}

export async function removeWhiteListStorage() {
    try {
        await chrome.storage.sync.remove(['whitelist'], function () {
            console.log('WhiteList Storage Has Been Deleted');
        });
    } catch (error) {
        console.error(error);
    }
}

export async function removeSpecificWhiteListStorage(item) {
    try {
        let toPush;
        if (item.length === 0) {
            toPush = item;
        } else {
            let tmp = await pullWhiteListStorage();
            if (tmp.includes(item)) {
                tmp = tmp.filter(e => e !== item);
                console.log('Item Founed And Will Be Removed From The WhiteList Storage');
            }
            toPush = tmp;
        }
        await chrome.storage.sync.set({ ['whitelist']: toPush }, function () {
            console.log('the item: ' + item + ' Has Been Removed From The WhiteList Storage');
        });
    } catch (error) {
        console.error(error);
    }
}
//======================================================================================================
function chkSWht() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['swhitelist'], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

export async function pullSessionWhiteListStorage() {
    try {
        let result = await chkSWht();
        if (!result.swhitelist) {
            await pushSessionWhiteListStorage([]);
            result = await chkSWht();
        }
        return result.swhitelist;
    } catch (error) {
        console.error(error);
    }
}

export async function pushSessionWhiteListStorage(bit) {
    try {
        let toPush;
        if (bit.length === 0) {
            toPush = bit;
        } else {
            let tmp = await pullSessionWhiteListStorage();
            if (!tmp.includes(bit[0])) {
                toPush = tmp.concat(bit);
            } else {
                toPush = tmp;
            }
        }
        await chrome.storage.local.set({ ['swhitelist']: toPush }, function () {
            console.log('Session WhiteList Storage Has Been Pushed');
        });
    } catch (error) {
        console.error(error);
    }
}

export async function removeSessionWhiteListStorage() {
    try {
        await chrome.storage.local.remove(['swhitelist'], function () {
            console.log('Session WhiteList Storage Has Been Deleted');
        });
    } catch (error) {
        console.error(error);
    }
}

export async function removeSpecificSessionWhiteListStorage(item) {
    try {
        let toPush;
        if (item.length === 0) {
            toPush = item;
        } else {
            let tmp = await pullSessionWhiteListStorage();
            if (tmp.includes(item)) {
                tmp = tmp.filter(e => e !== item);
                console.log('Item Founed And Will Be Removed From The Session WhiteList Storage');
            }
            toPush = tmp;
        }
        await chrome.storage.local.set({ ['swhitelist']: toPush }, function () {
            console.log('the item: ' + item + ' Has Been Removed From The Session WhiteList Storage');
        });
    } catch (error) {
        console.error(error);
    }
}
//========================================================================================================
export async function removeSpecificRules(ids) {
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ids
    }).catch((error) => {
        console.error('Error Removing rules:', error);
    });
}


export async function addRules(rules) {
    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
    }).catch((error) => {
        console.error('Error adding rules:', error);
    });

}

export async function updateRules() {
    await removeAllRules();
    await removeRulesCounter();
    let wl = await pullWhiteListStorage();
    let swl = await pullSessionWhiteListStorage();
    let sWMix=[];
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
                resolve(rules.map(rule => rule.id));
            }
        });
    });
}

export async function removeAllRules() {
    let ids = await pullRuleIds();
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ids
    }).catch((error) => {
        console.error('Error Removing rules:', error);
    });
}

async function getPreLoadRules() {
    let id1 = await getRulesCounter();
    let id2 = await getRulesCounter();
    let temp = [];
    temp.push({
        "id": id1,
        "priority": 1,
        "action": {
            "type": "redirect",
            "redirect": { "url": `${chrome.runtime.getURL('pages/loading.html')}` }
        },
        "condition": {
            "urlFilter": "*",
            "resourceTypes": ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
        }
    });
    temp.push({
        "id": id2,
        "priority": 2,
        "action": {
            "type": "allow"
        },
        "condition": {
            "urlFilter": `*t3.gstatic.com/*`,
            "resourceTypes": ["main_frame", "sub_frame", "stylesheet", "script", "media", "font", "image", "ping", "csp_report", "websocket", "webbundle", "object", "xmlhttprequest", "other"]
        }
    });
    return temp;
}

async function convertSiteToRule(site) {
    let idd = await getRulesCounter();
    let rule = {
        "id": idd,
        "priority": 2,
        "action": {
            "type": "allow"
        },
        "condition": {
            "urlFilter": `*${site}/*`,
            "resourceTypes": ["main_frame", "sub_frame", "stylesheet", "script", "media", "font", "image", "ping", "csp_report", "websocket", "webbundle", "object", "xmlhttprequest", "other"]
        }
    };
    return rule;
}

async function creatAssociatedRules(site) {
    let idd = await getRulesCounter();
    let rule = {
        "id": idd,
        "priority": 2,
        "action": {
            "type": 'allow'
        },
        "condition": {
            "urlFilter": "*",
            "initiatorDomains": site,
            "resourceTypes": [
                'main_frame', 'sub_frame', 'stylesheet', 'script', 'image',
                'font', 'object', 'xmlhttprequest', 'ping', 'csp_report',
                'media', 'websocket', 'other'
            ]
        }
    };
    return rule;
}
//===================================================================================================
async function getCurrentCounter() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('rcounter', (result) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result.rcounter || 1);
        });
    });
}

async function updateCounter(newval) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ rcounter: newval }, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            console.log('counter Updated');
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
        await chrome.storage.sync.remove('rcounter', function () {
            console.log('counter has been removed');
        });
    } catch (error) {
        console.error(error);
    }
}
//========================================================================================================
export function trimUrl(currUrl) {
    let temp = currUrl;
    temp = temp.split('//')[1];
    if (temp.charAt(temp.length - 1) === '/') {
      temp = temp.slice(0, temp.length - 1);
    }
    let x = temp.split('.');
    if (x.length > 2) {
      temp = x[1] + '.' + x[2];
    }
    return temp;
  }