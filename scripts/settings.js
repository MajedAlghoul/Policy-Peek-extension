import * as customPrefs from './preferencesClasses.js';
import { pullPreferencesStorage } from './Utility.js';
import { pullCustomStorage } from './Utility.js';
import { pushCustomStorage } from './Utility.js';

let listItems = document.getElementsByTagName('a');
let lastClicked;
let contentDiv = document.getElementById('actualContentContainer');
let contentTitle = document.getElementById('contentTitle');

let listPrefB = document.getElementsByClassName('prefButton');
let prefBoxes = document.getElementsByClassName('innerprefBoxes');
let lastClicked2 = null;
let lastClickedB = null;

for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener('click', function (event) {
        event.preventDefault();
        let contentFile = this.getAttribute('data-content');
        fetch(contentFile).then(response => response.text()).then(data => {
            contentDiv.innerHTML = data;
            contentTitle.textContent = this.textContent;
            if (contentFile === "settings/preferences.html") {
                preferencesHandling();
            }
        });
        if (lastClicked) {
            lastClicked.classList.remove('clicked');
        }
        this.classList.add('clicked');
        lastClicked = this;
    });
}


function preferencesHandling() {
    definePreferences();

    listPrefB = document.getElementsByClassName('prefButton');
    prefBoxes = document.getElementsByClassName('innerprefBoxes');
    loadPrefs(prefBoxes, listPrefB);
    for (let j = 0; j < listPrefB.length; j++) {
        listPrefB[j].addEventListener('click', function (eventt) {
            eventt.preventDefault();
            setPrefs(j);
            console.log('how the fuck u here?');
            loadPrefs(prefBoxes, listPrefB);
        });
    }
}

function makeBarSelected(j, prefBoxes, listPrefB) {
    let temp = prefBoxes[j].getElementsByClassName('prefName')[0];
    let color = temp.style.color;
    let extraContent = prefBoxes[j].getElementsByClassName('extraContent')[0];

    if (lastClickedB !== null) {
        lastClickedB.style.cursor = 'pointer';
        lastClickedB.disabled = false;
    }

    if (lastClicked2 !== null) {
        lastClicked2.style.border = '';
        (lastClicked2.getElementsByClassName('prefOk')[0]).style.visibility = 'hidden';
        lastClicked2.getElementsByClassName('prefName')[0].style.textShadow = 'none';
        lastClicked2.getElementsByClassName('extraContent')[0].style.display = 'none';
    }

    listPrefB[j].style.cursor = 'default';
    listPrefB[j].disabled = true;
    prefBoxes[j].style.border = '4px solid #3791E0';
    (prefBoxes[j].getElementsByClassName('prefOk')[0]).style.visibility = 'visible';
    temp.style.textShadow = '0px 0px 30px ' + color;
    if (extraContent.style.display === "none") {
        extraContent.style.display = "block";
    } else {
        extraContent.style.display = "none";
    }

    lastClicked2 = prefBoxes[j];
    lastClickedB = listPrefB[j];
}

function setPrefs(j) {
    chrome.storage.sync.set({ preferences: [j].concat(getPreferencesSet(j).pArr) }, function () {
        console.log('High Profile Selected');
    });
}


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

function loadPrefs(prefBoxes, listPrefB) {
    chkPrefs().then(result => {
        if (!result.preferences) {
            setPrefs(1);
        }
        return chkPrefs();
    }).then(async result => {
        let preferences = result.preferences;
        console.log('Preferences loaded: ' + preferences);
        let pType = preferences[0];
        makeBarSelected(pType, prefBoxes, listPrefB);
        if (pType === 3) {
            //redB();
            console.log('how many??')
            addOtherPreferences();
            setCustomPreferences();
            console.log('actual prefs: '+await pullPreferencesStorage());
            console.log('actual custs: '+await pullCustomStorage());
        } else {
            let temp = getPreferencesSet(pType);
            let freeBox = temp.freeBox;
            let pArr = preferences.slice(1);

            pArr.forEach((pref, index) => {
                if (freeBox.getElementsByTagName(pref).length === 0) {
                    freeBox.appendChild(document.createElement(pref));
                }
            });
            if (freeBox.getElementsByTagName('div').length === 0) {
                adjustLines(freeBox);
            }
        }
    }).catch(error => {
        console.error(error);
    });
}

function adjustLines(freeBox) {
    let children = Array.from(freeBox.children);

    for (let i = 0; i < children.length - 1; i++) {
        if (children[i].tagName.charAt(0) !== children[i + 1].tagName.charAt(0)) {
            let breakElement = document.createElement('div');
            breakElement.style.width = '100%';
            breakElement.style.marginTop = '10px';
            freeBox.insertBefore(breakElement, children[i + 1]);
        }
    }
}

function attatchPrefListener(pref, temp, freeBox1, freeBox2) {
    customElements.whenDefined(pref).then(() => {
        let b = temp.shadowRoot.childNodes[3].getElementsByClassName('pillB')[0];
        temp.shadowRoot.childNodes[3].getElementsByClassName('pillB')[0].addEventListener('click', function (eventt) {
            eventt.preventDefault();
            eventt.stopPropagation();
            if (freeBox1.getElementsByTagName(pref).length === 0) {
                let children = Array.from(freeBox1.children);
                let shells = freeBox1.getElementsByTagName('div');
                freeBox2.removeChild(temp);
                console.log(temp.tagName);
                if (temp.tagName[0] === 'D') {
                    freeBox1.prepend(temp);
                } else if (temp.tagName[0] === 'P') {
                    freeBox1.insertBefore(temp, children[children.indexOf(shells[0]) + 1]);
                } else {
                    freeBox1.insertBefore(temp, children[children.indexOf(shells[1]) + 1]);
                }

                attatchPrefListener(pref, temp, freeBox1, freeBox2);
                pushCustomStorage([temp.tagName.toLowerCase()]);
            } else {
                let children = Array.from(freeBox2.children);
                let shells = freeBox2.getElementsByTagName('div');
                freeBox1.removeChild(temp);
                console.log(temp.tagName);
                if (temp.tagName[0] === 'D') {
                    freeBox2.prepend(temp);
                } else if (temp.tagName[0] === 'P') {
                    freeBox2.insertBefore(temp, children[children.indexOf(shells[0]) + 1]);
                } else {
                    freeBox2.insertBefore(temp, children[children.indexOf(shells[1]) + 1]);
                }

                attatchPrefListener(pref, temp, freeBox1, freeBox2);
                popCustomStorage(temp.tagName.toLowerCase());
            }
        });
        b.disabled = false;
        b.style.cursor = 'pointer';
    });
}

function addOtherPreferences() {
    let allPrefs = ['dpid-element', 'dci-element', 'dhi-element', 'dli-element', 'dcoi-element', 'doa-element', 'dfi-element', 'dup-element', 'dipd-element', 'dct-element', 'dsd-element', 'dpi-element', 'ddi-element', 'doi-element', 'pad-element', 'pr-element', 'pl-element', 'pm-element', 'psp-element', 'psi-element', 'po-element', 'rl-element', 'ri-element', 'rp-element', 'ro-element'];
    let freeBox1 = document.getElementById('cusSel1');
    let freeBox2 = document.getElementById('cusSel2');


    allPrefs.forEach((pref) => {
        if (freeBox1.getElementsByTagName(pref).length === 0 && freeBox2.getElementsByTagName(pref).length === 0) {
            let temp = document.createElement(pref);
            freeBox2.appendChild(temp);
            attatchPrefListener(pref, temp, freeBox1, freeBox2);
        }
    });

    if (freeBox2.getElementsByTagName('div').length === 0) {
        adjustLines(freeBox2);
    }
}

async function setCustomPreferences() {
    let freeBox1 = document.getElementById('cusSel1');
    if (freeBox1.getElementsByTagName('div').length === 0) {
        for (let i = 0; i < 3; i++) {
            let breakElement = document.createElement('div');
            breakElement.style.width = '100%';
            breakElement.style.marginTop = '10px';
            freeBox1.append(breakElement);
        }
    }
    try {
        let freeBox2 = document.getElementById('cusSel2');
        const customPs = await pullCustomStorage();
        console.log(customPs + "edge" + typeof customPs + customPs.length);
        customPs.forEach((custs) => {
            if (freeBox2.getElementsByTagName(custs)[0]) {
                let theButton = freeBox2.getElementsByTagName(custs)[0].shadowRoot.childNodes[3].getElementsByClassName('pillB')[0];
                theButton.click();
            }
        });
    } catch (error) {
        console.error(error);
    }


}

async function popCustomStorage(bit) {
    const toPush = (await pullCustomStorage()).filter(item => item !== bit);
    chrome.storage.sync.set({ customs: toPush }, function () {
        console.log('item removed');
    });
}

function redB() {
    chrome.storage.sync.remove('customs', function () {
        console.log('boom');
    });
}

function getPreferencesSet(j) {
    if (j === 0) {
        return loadLevel0();
    } else if (j === 1) {
        return loadLevel1();
    } else if (j === 2) {
        return loadLevel2();
    } else if (j === 3) {
        return loadLevel3();
    } else {
        console.log('error, wrong preferences type')
        return null;
    }
}

function loadLevel0() {
    return {
        freeBox: document.getElementById('topSel1'),
        pArr: ['dsd-element', 'dcoi-element', 'psp-element', 'rl-element']
    };
}
function loadLevel1() {
    return {
        freeBox: document.getElementById('midSel1'),
        pArr: ['dsd-element', 'dcoi-element', 'dup-element', 'dipd-element', 'doa-element', 'psp-element', 'pl-element', 'psi-element', 'rl-element', 'rp-element']
    };
}
function loadLevel2() {
    return {
        freeBox: document.getElementById('lowSel1'),
        pArr: ['dsd-element', 'dcoi-element', 'dup-element', 'dipd-element', 'doa-element', 'dci-element', 'ddi-element', 'dpi-element', 'dpid-element', 'psp-element', 'pl-element', 'psi-element', 'pm-element', 'pr-element', 'rl-element', 'rp-element']
    };
}
async function loadLevel3() {
    return {
        pArr: await pullCustomStorage()
    };
}

function definePreferences() {
    if (!customElements.get('dpid-element')) {
        customElements.define('dpid-element', customPrefs.PersonalIdentifier);
        customElements.define('dci-element', customPrefs.ContactInformation);
        customElements.define('dhi-element', customPrefs.HealthInformation);
        customElements.define('dli-element', customPrefs.LocationInformation);
        customElements.define('dcoi-element', customPrefs.ComputerInformation);
        customElements.define('doa-element', customPrefs.OnlineActivity);
        customElements.define('dfi-element', customPrefs.FinancialInformation);
        customElements.define('dup-element', customPrefs.UserProfile);
        customElements.define('dipd-element', customPrefs.IpAndId);
        customElements.define('dct-element', customPrefs.CookiesAndTracking);
        customElements.define('dsd-element', customPrefs.SurveyData);
        customElements.define('dpi-element', customPrefs.PersonalInformation);
        customElements.define('ddi-element', customPrefs.DemographicInformation);
        customElements.define('doi-element', customPrefs.OtherInformation);

        customElements.define('pad-element', customPrefs.AdvertisementPurposes);
        customElements.define('pr-element', customPrefs.ResearchPurposes);
        customElements.define('pl-element', customPrefs.LegalPurposes);
        customElements.define('pm-element', customPrefs.MarketingPurposes);
        customElements.define('psp-element', customPrefs.ServiceProvisionPurposes);
        customElements.define('psi-element', customPrefs.ServiceImprovementPurposes);
        customElements.define('po-element', customPrefs.OtherPurposes);

        customElements.define('rl-element', customPrefs.LimitedRetention);
        customElements.define('ri-element', customPrefs.IndefiniteRetention);
        customElements.define('rp-element', customPrefs.PeriodRetention);
        customElements.define('ro-element', customPrefs.OtherRetention);
    }
}