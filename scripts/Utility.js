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

async function pulling2() {
    try {
        const result_1 = await chkPrefs();
        if (!result_1.customs) {
        }
        const result_2 = await chkPrefs();
        console.log('pushed??' + result_2.customs);
        return result_2.customs;
    } catch (error) {
        console.error(error);
    }
}

export async function pullPreferencesStorage() {
    try {
        const value = await pulling2();
        console.log(value);
        console.log('after')
        return value;
    } catch (error) {
        console.error(error);
    }
}

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

async function pulling() {
    try {
        const result_1 = await chkCusts();
        if (!result_1.customs) {
            pushCustomStorage([]);
        }
        const result_2 = await chkCusts();
        console.log('pushed??' + result_2.customs);
        return result_2.customs;
    } catch (error) {
        console.error(error);
    }
}

export async function pullCustomStorage() {
    try {
        const value = await pulling();
        console.log(value);
        console.log('after')
        return value;
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
                toPush = bit.concat(tmp);
            } else {
                toPush = tmp;
            }

        }
        console.log('hereee');
        chrome.storage.sync.set({ customs: toPush }, function () {
            console.log('new item pushed');
        });
    } catch (error) {
        console.error(error);
    }
}