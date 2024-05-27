import * as customPrefs from './preferencesClasses.js';
import * as utility from './Utility.js';

let lastClicked2 = null;
let lastClickedB = null;

export function preferencesHandling() {
    definePreferences();

    let listPrefB = document.getElementsByClassName('prefButton');
    let prefBoxes = document.getElementsByClassName('innerprefBoxes');

    //utility.removePreferencesStorage();
    //utility.removeCustomStorage();

    loadPreferences(prefBoxes, listPrefB);
    for (let j = 0; j < listPrefB.length; j++) {
        listPrefB[j].addEventListener('click', async function (eventt) {
            eventt.preventDefault();

            if (j === 3) {
                let temp = await utility.pullCustomStorage();
                if (!temp || temp.length === 0) {
                    await utility.pushCustomStorage((await utility.pullPreferencesStorage())[0]);
                }
                await utility.removePreferencesStorage();
                await utility.pushPreferencesStorage([3]);
            } else {
                await utility.removePreferencesStorage();
                await utility.pushPreferencesStorage(getPredefinedPreferences(j));
            }

            loadPreferences(prefBoxes, listPrefB);
        });
    }
}

async function loadPreferences(prefBoxes, listPrefB) {
    try {
        let prefs = await utility.pullPreferencesStorage();
        makeBarSelected(prefs, prefBoxes, listPrefB);
        fillPreferences(prefs);
    } catch (error) {
        console.error(error);
    }
}

async function fillPreferences(prefs) {
    try {
        if (!prefs || prefs.length === 0) {
            await utility.pushPreferencesStorage(getPredefinedPreferences(1));
            prefs = await utility.pullPreferencesStorage();
        }
        let pType = prefs[0];
        let pArr = prefs.slice(1);
        if (pType === 3) {
            await copyFromCustomToPreferences();

            let allPrefs = getPredefinedPreferences(3);
            let freeBox1 = getPredefinedFreeBoxes(3).freeBox1;
            let freeBox2 = getPredefinedFreeBoxes(3).freeBox2;

            await fillAllPreferences(allPrefs, freeBox1, freeBox2);

            if (freeBox1.getElementsByTagName('div').length === 0) {
                for (let i = 0; i < 3; i++) {
                    let breakElement = document.createElement('div');
                    breakElement.style.width = '100%';
                    breakElement.style.marginTop = '10px';
                    freeBox1.append(breakElement);
                }
            }

            prefs = await utility.pullPreferencesStorage();
            pArr = prefs.slice(1);
            pArr.forEach((custs) => {
                if (freeBox2.getElementsByTagName(custs)[0]) {
                    let theButton = freeBox2.getElementsByTagName(custs)[0].shadowRoot.childNodes[3].getElementsByClassName('pillB')[0];
                    theButton.click();
                }
            });

        } else {
            let freeBox = getPredefinedFreeBoxes(pType);
            if (!pArr || pArr.length === 0) {
                await utility.removePreferencesStorage();
                await utility.pushPreferencesStorage(getPredefinedPreferences(pType));
                prefs = await utility.pullPreferencesStorage();
                pArr = prefs.slice(1);
            }
            pArr.forEach((pref) => {
                if (freeBox.getElementsByTagName(pref).length === 0) {
                    freeBox.appendChild(document.createElement(pref));
                }
            });

            if (freeBox.getElementsByTagName('div').length === 0) {
                adjustLines(freeBox);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function fillAllPreferences(allPrefs, freeBox1, freeBox2) {
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

async function copyFromCustomToPreferences() {
    await utility.removePreferencesStorage();
    await utility.pushPreferencesStorage(await utility.pullCustomStorage());
}

async function copyFromPreferencesToCustom() {
    await utility.removeCustomStorage();
    await utility.pushCustomStorage(await utility.pullPreferencesStorage());
}

function attatchPrefListener(pref, temp, freeBox1, freeBox2) {
    customElements.whenDefined(pref).then(() => {
        let b = temp.shadowRoot.childNodes[3].getElementsByClassName('pillB')[0];
        temp.shadowRoot.childNodes[3].getElementsByClassName('pillB')[0].addEventListener('click', async function (eventt) {
            eventt.preventDefault();
            eventt.stopPropagation();
            let pss = await utility.pullPreferencesStorage();
            if (freeBox1.getElementsByTagName(pref).length === 0) {
                let children = Array.from(freeBox1.children);
                let shells = freeBox1.getElementsByTagName('div');
                freeBox2.removeChild(temp);
                if (temp.tagName[0] === 'D') {
                    freeBox1.prepend(temp);
                } else if (temp.tagName[0] === 'P') {
                    freeBox1.insertBefore(temp, children[children.indexOf(shells[0]) + 1]);
                } else {
                    freeBox1.insertBefore(temp, children[children.indexOf(shells[1]) + 1]);
                }


                attatchPrefListener(pref, temp, freeBox1, freeBox2);

                if (!pss.includes(3)) {
                    let temp = await utility.pullPreferencesStorage();
                    if (temp) {
                        await utility.removePreferencesStorage();
                        await utility.removeCustomStorage()
                    }
                    await utility.pushPreferencesStorage([3]);
                    await utility.pushCustomStorage([3]);
                }

                await utility.pushPreferencesStorage([temp.tagName.toLowerCase()]);
                await utility.pushCustomStorage([temp.tagName.toLowerCase()]);
            } else {
                let children = Array.from(freeBox2.children);
                let shells = freeBox2.getElementsByTagName('div');
                freeBox1.removeChild(temp);
                if (temp.tagName[0] === 'D') {
                    freeBox2.prepend(temp);
                } else if (temp.tagName[0] === 'P') {
                    freeBox2.insertBefore(temp, children[children.indexOf(shells[0]) + 1]);
                } else {
                    freeBox2.insertBefore(temp, children[children.indexOf(shells[1]) + 1]);
                }

                attatchPrefListener(pref, temp, freeBox1, freeBox2);

                await utility.removeSpecificPreferencesStorage(temp.tagName.toLowerCase());
                await utility.removeSpecificCustomStorage(temp.tagName.toLowerCase());

                pss = await utility.pullPreferencesStorage();

                if (pss.length === 1 && pss.includes(3)) {
                    await utility.removeSpecificPreferencesStorage(3);
                    await utility.removeSpecificCustomStorage(3);
                }
            }
        });
        b.disabled = false;
        b.style.cursor = 'pointer';
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

function getPredefinedPreferences(j) {
    if (j === 0) {
        return loadLevel0();
    } else if (j === 1) {
        return loadLevel1();
    } else if (j === 2) {
        return loadLevel2();
    } else if (j === 3) {
        return loadLevel3();
    } else {
        console.log('error, wrong preferences type' + j)
        return null;
    }
}

function loadLevel0() {
    return [0, 'dsd-element', 'dcoi-element', 'psp-element', 'rl-element'];
}
function loadLevel1() {
    return [1, 'dsd-element', 'dcoi-element', 'dup-element', 'dipd-element', 'doa-element', 'psp-element', 'pl-element', 'psi-element', 'rl-element', 'rp-element'];
}
function loadLevel2() {
    return [2, 'dsd-element', 'dcoi-element', 'dup-element', 'dipd-element', 'doa-element', 'dci-element', 'ddi-element', 'dpi-element', 'dpid-element', 'psp-element', 'pl-element', 'psi-element', 'pm-element', 'pr-element', 'rl-element', 'rp-element'];
}
function loadLevel3() {
    return ['dpid-element', 'dci-element', 'dhi-element', 'dli-element', 'dcoi-element', 'doa-element', 'dfi-element', 'dup-element', 'dipd-element', 'dct-element', 'dsd-element', 'dpi-element', 'ddi-element', 'doi-element', 'pad-element', 'pr-element', 'pl-element', 'pm-element', 'psp-element', 'psi-element', 'po-element', 'rl-element', 'ri-element', 'rp-element', 'ro-element'];
}

function getPredefinedFreeBoxes(j) {
    if (j === 0) {
        return loadLevel0B();
    } else if (j === 1) {
        return loadLevel1B();
    } else if (j === 2) {
        return loadLevel2B();
    } else if (j === 3) {
        return loadLevel3B();
    } else {
        console.log('error, wrong preferences type ' + j);
        return null;
    }
}

function loadLevel0B() {
    return document.getElementById('topSel1');
}
function loadLevel1B() {
    return document.getElementById('midSel1');
}
function loadLevel2B() {
    return document.getElementById('lowSel1');
}
function loadLevel3B() {
    return {
        freeBox1: document.getElementById('cusSel1'),
        freeBox2: document.getElementById('cusSel2')
    };
}


function makeBarSelected(j, prefBoxes, listPrefB) {
    if (!j || j.length === 0) {
        j = 1;
    } else {
        j = j[0];
    }
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