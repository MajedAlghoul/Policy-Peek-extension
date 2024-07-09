import { pullStorage, pushStorage, updateRules, removeSpecificStorage } from "./Utility.js";
let actionFlag = null;
let oldSName = "";
let oldSUrl = "";
let glass = document.getElementById('glassOnTop');
let ontop = document.getElementById('OnTopContainer');
export function generalHandling() {
    //removeStorage('whitelist');
    loadTheList();

    if (!customElements.get('wl-item')) {
        customElements.define('wl-item', whiteListItem);
    }


    activateAllSelection();
    activateCancelling();

    document.getElementById('saveB').addEventListener('click', async function (event) {
        event.preventDefault();
        let sName = document.getElementById('siteNameInput').value;
        let sUrl = document.getElementById('siteUrlInput').value;
        if (await checkInput(sUrl)) {
            let tempItm;
            if (!actionFlag) {
                let item = createItem();
                modifyCustomElement(item, sName, sUrl);
                tempItm = item.shadowRoot.childNodes[3].getElementsByClassName('itemSiteUrl')[0].innerHTML;

            } else {
                await removeSpecificStorage('whitelist',oldSUrl);
                modifyCustomElement(actionFlag, sName, sUrl);
                tempItm = actionFlag.shadowRoot.childNodes[3].getElementsByClassName('itemSiteUrl')[0].innerHTML;
                actionFlag = null;
            }
            glass.style.display = 'none';
            ontop.style.display = 'none';

            await pushStorage('whitelist',[tempItm]);
            await updateRules();
        }
    });
}

function addListenersToItems(item) {
    let whBody = document.getElementById('wlBody');
    console.log('sasd ' + item);
    let editB = item.shadowRoot.childNodes[3].getElementsByClassName('itemEditB')[0];
    let deleteB = item.shadowRoot.childNodes[3].getElementsByClassName('itemDeleteB')[0];
    let sName = item.shadowRoot.childNodes[3].getElementsByClassName('itemSiteName')[0].innerHTML;
    let sUrl = item.shadowRoot.childNodes[3].getElementsByClassName('itemSiteUrl')[0].innerHTML;

    editB.addEventListener('click', function () {
        glass.style.display = 'inline';
        ontop.style.display = 'inline';

        let inputss = document.getElementsByClassName('siteInput');
        inputss[0].value = sName;
        inputss[1].value = sUrl;
        actionFlag = item;
        oldSName = sName;
        oldSUrl = sUrl;
    });

    deleteB.addEventListener('click', async function () {
        await removeSpecificStorage('whitelist',sUrl);
        whBody.removeChild(item);
        await updateRules();
    });

}

async function checkInput(sUrl) {
    let whItms = await pullStorage('whitelist');
    if (whItms.includes(sUrl)) {
        return false;
    }
    return true;
}

function createItem() {
    let whBody = document.getElementById('wlBody');
    let newItem = document.createElement('wl-item');
    whBody.appendChild(newItem);
    return newItem;
}

async function loadTheList() {
    let items = await pullStorage('whitelist');
    console.log(items);
    items.forEach(element => {
        let itm = createItem();
        modifyCustomElement(itm, '', element);
    });
}

function activateCancelling() {
    let itemAddB = document.getElementById('itemAddButton');
    let itemsDeleteB = document.getElementById('itemsDeleteButton');

    document.getElementById('circXB').addEventListener('click', function (event) {
        event.preventDefault();

        glass.style.display = 'none';
        ontop.style.display = 'none';
        actionFlag = null;
    });
    document.getElementById('glassOnTop').addEventListener('click', function (event) {
        event.preventDefault();

        glass.style.display = 'none';
        ontop.style.display = 'none';
        actionFlag = null;
    });
    document.getElementById('cancelB').addEventListener('click', function (event) {
        event.preventDefault();

        glass.style.display = 'none';
        ontop.style.display = 'none';
        actionFlag = null;
    });
    itemAddB.addEventListener('click', function (event) {
        event.preventDefault();

        glass.style.display = 'inline';
        ontop.style.display = 'inline';

        let inputss = document.getElementsByClassName('siteInput');
        inputss[0].value = "";
        inputss[1].value = "";
    });

    itemsDeleteB.addEventListener('click', async function (event) {
        event.preventDefault();

        let items = Array.from(document.getElementsByTagName('wl-item'));
        let itemsToDelete = [];

        if (items && items.length !== 0) {
            for (const itm of items) {
                let thebx = itm.shadowRoot.childNodes[3].getElementsByClassName('itemCheckbox')[0];
                if (thebx.checked) {
                    itemsToDelete.push(itm);
                }
            }

            if (itemsToDelete.length > 0) {
                for (const itm of itemsToDelete) {
                    let whBody = document.getElementById('wlBody');
                    let sUrl = itm.shadowRoot.childNodes[3].getElementsByClassName('itemSiteUrl')[0].innerHTML;
                    await removeSpecificStorage('whitelist',sUrl);
                    whBody.removeChild(itm);
                }
                await updateRules();
            }
        }
    });
}

function modifyCustomElement(item, sName, sUrl) {
    let itemx = item.shadowRoot.childNodes[3];

    itemx.getElementsByClassName('itemSiteName')[0].innerHTML = sName;
    itemx.getElementsByClassName('itemSiteUrl')[0].innerHTML = sUrl;
    addListenersToItems(item);
}

function activateAllSelection() {
    document.getElementById('selectAll').addEventListener('change', function () {
        const isChecked = this.checked;
        let items = document.getElementsByTagName('wl-item');
        Array.from(items).forEach(item => {
            let x = item.shadowRoot.childNodes[3].getElementsByClassName('itemCheckbox')[0];
            x.checked = isChecked;
        });
    });
}

class whiteListItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
            .itemsSep{
                border: 1px solid #ffffff40;
                border-radius: 1px 0 0 1px;
                margin-bottom: 10px;
                margin-top: 10px;
                width: 96.6%;
                margin-left: 3%;
            }
            .innerItemContainer{
                display: flex;
                justify-content: space-between;
            }
            .itemCheckBox{
                margin-left: 14px;
            }
            .itemButtonBox{
                margin-right: 10px;
            }
            </style>
            <div class="wlItem">
            <div class="itemsSep"></div>
            <div class="innerItemContainer">
                <label class="itemCheckBox">
                    <input type="checkbox" class="itemCheckbox">
                </label>
                <div class="itemSiteName">
                    Site 1
                </div>
                <div class="itemSiteUrl">
                    www.site.com
                </div>
                <div class="itemButtonBox">
                    <button class="itemEditB" style="background: none; border:none; outline: none;">
                    <svg style="width: 2vw; height:2vw;" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="240" cy="240" r="240" fill="#FFBB0C" fill-opacity="0.23"/>
                    <path d="M120.371 364.914C116.451 366.185 112.762 362.437 114.097 358.538L122.687 333.443C123.886 329.943 128.338 328.911 130.954 331.527L147.796 348.37C150.437 351.01 149.356 355.509 145.804 356.661L120.371 364.914Z" fill="#FFBB0C"/>
                    <path d="M321.077 131.674L349.361 159.958L166.928 342.392C163.023 346.297 156.691 346.297 152.786 342.392L138.644 328.25C134.738 324.344 134.738 318.013 138.644 314.107L321.077 131.674Z" fill="#FFBB0C"/>
                    <path d="M347.512 105.071C351.417 101.166 357.749 101.166 361.654 105.071L375.796 119.213C379.701 123.118 379.701 129.45 375.796 133.355L354.583 154.569L326.299 126.284L347.512 105.071Z" fill="#FFBB0C"/>
                    </svg></button>
                    <button class="itemDeleteB" style="background: none; border:none; outline: none;">
                    <svg style="width: 2vw; height:2vw;" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="240" cy="240" r="240" fill="#770000" fill-opacity="0.23"/>
                    <path d="M327.112 210.199L319.559 313.999C318.865 323.539 318.373 330.23 317.576 335.443C316.794 340.559 315.803 343.604 314.446 345.963C311.635 350.848 307.417 354.771 302.341 357.219C299.89 358.402 296.781 359.17 291.621 359.578C286.365 359.994 279.655 360 270.09 360H253.508H225.366H197.224C191.099 360 188.858 359.98 187.051 359.726C175.434 358.087 166.07 349.38 163.593 337.912C163.208 336.129 163.026 333.895 162.581 327.786L154.026 210.199C153.235 199.329 152.685 191.67 152.752 185.684C152.818 179.785 153.494 176.28 154.705 173.573C157.232 167.92 161.56 163.265 167.014 160.335C169.627 158.931 173.073 158.002 178.952 157.508C184.918 157.007 192.596 157 203.495 157H277.642C288.542 157 296.22 157.007 302.186 157.508C308.065 158.002 311.511 158.931 314.123 160.335C319.577 163.265 323.906 167.92 326.433 173.573C327.643 176.28 328.32 179.785 328.386 185.684C328.453 191.67 327.902 199.329 327.112 210.199Z" stroke="#CA1417" stroke-width="16"/>
                    <path d="M236.952 120H244.048C258.961 120 264.314 120.124 268.765 121.804C272.988 123.398 276.762 125.99 279.768 129.358C282.935 132.907 284.975 137.858 290.334 151.775L292.346 157H188.654L190.666 151.775C196.025 137.858 198.065 132.907 201.232 129.358C204.238 125.99 208.012 123.398 212.235 121.804C216.686 120.124 222.039 120 236.952 120Z" stroke="#CA1417" stroke-width="16"/>
                    <path d="M137 157L343 157" stroke="#CA1417" stroke-width="16" stroke-linecap="round"/>
                    <path d="M273.575 295V222" stroke="#CA1417" stroke-width="16" stroke-linecap="round"/>
                    <path d="M207.563 295V222" stroke="#CA1417" stroke-width="16" stroke-linecap="round"/>
                    </svg></button>
                </div>
            </div>
        </div>
        `;
    }
}