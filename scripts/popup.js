import { summaryHandling } from "./summary.js";
import { alignmentHandling } from "./alignment.js";
import { infoHandling } from "./info.js";
import {
  pullStorage,
  pushStorage,
  removeStorage,
  updateRules,
  getUserInfo,
  syncProfilesToDrive,
  fetchProfilesFromDrive,
  generateUUID
} from "./Utility.js";

const CLIENT_ID = chrome.runtime.getManifest().oauth2.client_id;
const API_KEY= chrome.runtime.getManifest().oauth2.key;
//const CLIENT_ID='741512590350-q9coj4mbvjei61ojgv4jq58i9k9rmdvi.apps.googleusercontent.com';
//=======================================================================================

/*
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      getUserInfo(token, function(userInfo) {
        console.log('User Info:', userInfo);
        // Handle user info locally
      });
    }
  });

  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      const profiles = { };
      syncProfilesToDrive(token, profiles, function(response) {
        console.log('Sync response:', response);
      });
    }
  });

  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      fetchProfilesFromDrive(token, function(profiles) {
        console.log('Profiles:', profiles);
        // Handle profiles locally
      });
    }
  });
*/
//=============================================================
document.addEventListener("DOMContentLoaded", function () {
  setTopBarButtonsListeners();
});

/*
  document.getElementById("popupSignInButton").addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        getUserInfo(token, async function (userInfo) {
           await pushStorage('tempp',userInfo);
          console.log("User Info:", userInfo);
          // Handle user info locally
        });
      }
    });
  });
});*/

async function authenticateAccount() {
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

async function handleAccounts() {
  const account = await pullStorage("account");
  if (account.length !== 0) {
    flipPopupToSignedIn(account[0]);
    let rightB = document.getElementById("redButtonAnch");
    rightB = removeAllEventListeners(rightB);
    rightB.addEventListener("click", async function (event) {
      event.preventDefault();
      await removeStorage("account");
      flipPopupToLoggedOff();
    });
  } 
    document
      .getElementById("popupSignInButton")
      .addEventListener("click", async function () {
        const token = await authenticateAccount();
        getUserInfo(token, async function (userInfo) {
          await pushStorage("account", userInfo);
          console.log("User Info:", userInfo);
          await downloadFromGoogle();
        });
      });
  
}

async function uploadToGoogle() {
  const token = await authenticateAccount();
  await updateProfile();
  const profiles = await pullStorage('profiles');
  syncProfilesToDrive(token,profiles, function(response) {
    console.log('Sync response:', response);
  });
}

async function downloadFromGoogle() {
  const token = await authenticateAccount();
  fetchProfilesFromDrive(token,API_KEY, async function (profiles) {
    if(!profiles){
        await updateProfile();
        const profiles = await pullStorage('profiles');
        syncProfilesToDrive(token,profiles, function(response) {
          console.log('Sync response:', response);
        });
        flipPopupToSignedIn((await pullStorage('account'))[0]);
    }else{
      console.log("Profiles: ", profiles);
        triggerConflictDialog(token,profiles);
    }
    //console.log("Profiles:", profiles);
    // Handle profiles locally
  });
}

function triggerConflictDialog(token,profiles) {
  document.getElementById("accountWarningPrompt").style.display = "flex";
  document.getElementById("accountNotSignedInContainer").style.display = "none";

  const cloudB=document.getElementById('keepCloudButton');
  const localB=document.getElementById('keepLocalButton');

  cloudB.addEventListener('click',async function(){
    await removeStorage('profiles');
    await pushStorage('profiles',profiles);
    flipPopupToSignedIn((await pullStorage('account'))[0]);
    document.getElementById('actualSessionContainer').replaceChildren();
    loadProfiles();
  });

  localB.addEventListener('click',async function(){
    await updateProfile();
    const profiles = await pullStorage('profiles');
    syncProfilesToDrive(token,profiles, function(response) {
      console.log('Sync response:', response);
    });
    flipPopupToSignedIn((await pullStorage('account'))[0]);
  });
}

function flipPopupToSignedIn(account) {
  document.getElementById("accountTripleContainer").style.display = "flex";
  document.getElementById("accountNotSignedInContainer").style.display = "none";
  document.getElementById("accountWarningPrompt").style.display = "none";
  document.getElementById("popupAccountImage").src = account.picture;
  document.getElementById("popupAccountName").textContent = account.name;
  document.getElementById("popupAccountEmail").textContent = account.email;
  document.getElementById("redButtonAnch").style.visibility = "visible";
  document.getElementById("redButton").style.backgroundColor = "#db3f42";
  document.getElementById("redButton").textContent = "Sign Out";

  let rightB = document.getElementById("redButtonAnch");
  rightB = removeAllEventListeners(rightB);
  rightB.addEventListener("click", async function (event) {
    event.preventDefault();
    await removeStorage("account");
    flipPopupToLoggedOff();
  });
}

function flipPopupToLoggedOff() {
  document.getElementById("accountTripleContainer").style.display = "none";
  document.getElementById("accountNotSignedInContainer").style.display = "block";
  document.getElementById("accountWarningPrompt").style.display = "none";
  document.getElementById("redButtonAnch").style.visibility = "hidden";
}

//===================================================================================

let listItems = document.getElementsByClassName("bottomBarButtonsATags");
let lastClicked;
let contentDiv = document.getElementById("popUpContentContainer");
let lastClicked2 = null;
//let contentTitle = document.getElementById('contentTitle');

for (let i = 0; i < listItems.length; i++) {
  listItems[i].addEventListener("click", function (event) {
    event.preventDefault();
    let contentFile = this.getAttribute("data-content");
    fetch(contentFile)
      .then((response) => response.text())
      .then(async (data) => {
        contentDiv.innerHTML = data;
        //contentTitle.textContent = this.textContent;
        if (contentFile === "popup/summary.html") {
          summaryHandling();
        } else if (contentFile === "popup/alignment.html") {
          alignmentHandling();
        } else if (contentFile === "popup/info.html") {
          infoHandling();
          const stuff = await pullStorage("tempp");
          console.log("hereee " + stuff);
        }
      });
    if (lastClicked) {
      lastClicked.classList.remove("clicked");
    }
    this.classList.add("clicked");
    lastClicked = this;
  });
}
listItems[0].click();

function setTopBarButtonsListeners() {
  let profileFlag = true;
  document
    .getElementById("xButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("profileContainer").style.display = "none";
    });

  document
    .getElementById("profileButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("profileContainer").style.display = "flex";

      if (profileFlag) {
        handleProfiles();
        profileFlag = false;
      }
    });
}

function handleProfiles() {
  defineProfileItems();
  handleAccounts();
  loadProfiles();
  //handleLockListeners();
}

async function loadProfiles() {
  try {
    let profs = await pullStorage("profiles");
    let active = await fillProfiles(profs);
    //profs = await pullStorage("profiles");
    await makeProfileSelected(active);
  } catch (error) {
    console.error(error);
  }
}

async function fillProfiles(profs) {
  try {
    if (!profs || profs.length === 0) {
      const defaultP = {
        id:generateUUID(),
        isActive: true,
        name: "Default Session",
        password: "",
        whitelist: [],
        preferences: [],
        customs: [],
      };
      console.log('the new profile default creaction-------------------',defaultP);
      await pushStorage("profiles", [defaultP]);
      profs = await pullStorage("profiles");
    }

    const sessionBox = document.getElementById("actualSessionContainer");
    let selector;
    let active = 0;
    for (let i = 0; i < profs.length; i++) {
      if (profs[i].isActive) {
        active = profs[i].id;
      }
      let item = document.createElement("profile-item");
      sessionBox.appendChild(item);

      selector = item.shadowRoot.childNodes[3].getElementsByClassName(
        "profileLeftContainer"
      )[0];
      selector.querySelector(".SessionName").textContent = profs[i].name;

      if (i === 0) {
        selector = item.shadowRoot.childNodes[3].getElementsByClassName(
          "profileRightContainer"
        )[0];
        selector.querySelector("#removeProfileBarButton").style.display =
          "none";
        await attatchListerners(item.shadowRoot.childNodes[3], 1, profs[i].id);
      } else {
        await attatchListerners(item.shadowRoot.childNodes[3], 2, profs[i].id);
      }
    }
    const addb = document.createElement("addprofile-item");
    sessionBox.appendChild(addb);
    await attatchListerners(addb.shadowRoot.childNodes[3], 0, -1);

    return active;
  } catch (error) {
    console.error(error);
  }
}

async function attatchListerners(item, degree, j) {
  return new Promise((resolve) => {
    if (degree === 0) {
      item.addEventListener("click", async function (eventt) {
        eventt.preventDefault();
        eventt.stopPropagation();
        handleProfileCreation();
      });
    }
    if (degree > 0) {
      console.log('brah-2');
      item.addEventListener("click", async function (eventt) {
        console.log('brah-1');
        eventt.preventDefault();
        eventt.stopPropagation();
  
        await updateProfile();
        await restoreProfile(j);
        console.log('brah');
        await makeProfileSelected(j);
      });
      const editB = item
        .getElementsByClassName("profileRightContainer")[0]
        .querySelector("#editProfileBarButton");
      editB.addEventListener("click", async function (eventt) {
        eventt.preventDefault();
        eventt.stopPropagation();
        handleProfileEditing(j);
      });
      //item.disabled = false;
      //b.style.cursor = 'pointer';
    }
    if (degree > 1) {
      const deleteB = item
        .getElementsByClassName("profileRightContainer")[0]
        .querySelector("#removeProfileBarButton");
      deleteB.addEventListener("click", async function (eventt) {
        eventt.preventDefault();
        eventt.stopPropagation();

        handleProfileDeletion(j);
      });
    }

    // Call resolve when done
    resolve();
  });
  //customElements.whenDefined(pref).then(() => {


  //});
}

function removeAllEventListeners(element) {
  // Clone the element, including its attributes but not its event listeners
  const newElement = element.cloneNode(true);

  // Replace the original element with the cloned element
  element.parentNode.replaceChild(newElement, element);
  return newElement;
}

function handleLockListeners() {
  document
    .getElementById("unlockButton")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      triggerOntopEvents();

      let backB = document.getElementById("goBackSessionArrow");
      let rightB = document.getElementById("redButtonAnch");

      document.getElementById("pageTitleProfile").textContent =
        "Authentication";

      const profiles = await pullStorage("profiles");
      let sessName = document.getElementById("sessionNameInput");
      let sessPass = document.getElementById("sessionPasswwordInput");
      sessName.value = profiles[lastClicked2].name;
      sessName.disabled = "true";
      rightB = removeAllEventListeners(rightB);
      rightB.addEventListener("click", async function (event) {
        event.preventDefault();
        if (sessPass.value === profiles[lastClicked2].password) {
          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: false,
            cancelable: true,
          });
          backB.dispatchEvent(clickEvent);
        }
      });
    });
}

function triggerOntopEvents() {
  document.getElementById("accountContainer").style.display = "none";
  document.getElementById("sessionContainer").style.display = "none";
  document.getElementById("sessionOntopEventsController").style.display =
    "flex";

  let rightB = document.getElementById("redButtonAnch");
  let rightdiv = rightB.querySelector("#redButton");
  let loginStatus = rightB.style.visibility;

  rightdiv.textContent = "save";
  rightB.style.visibility = "visible";
  rightB.href = "#";
  rightdiv.style.backgroundColor = "#3791E0";

  document.getElementById("xButton").style.display = "none";
  let backB = document.getElementById("goBackSessionArrow");
  backB.style.display = "block";

  backB.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("accountContainer").style.display = "flex";
    document.getElementById("sessionContainer").style.display = "flex";
    document.getElementById("sessionOntopEventsController").style.display =
      "none";
    document.getElementById("xButton").style.display = "block";
    document.getElementById("pageTitleProfile").textContent = "Profile";
    backB.style.display = "none";
    rightB.style.visibility = loginStatus;

    document.getElementById("eventTopReNewPasswordContainer").style.display =
      "none";
    document.getElementById("eventTopNewPasswordContainer").style.display =
      "none";
  });
}

function handleProfileCreation() {
  triggerOntopEvents();

  document.getElementById("eventTopReNewPasswordContainer").style.display =
    "flex";

  document.getElementById("pageTitleProfile").textContent = "Create Profile";
  let backB = document.getElementById("goBackSessionArrow");
  let rightB = document.getElementById("redButtonAnch");

  let sessName = document.getElementById("sessionNameInput");
  let sessPass = document.getElementById("sessionPasswwordInput");
  let sessReNewPass = document.getElementById("sessionReNewPasswwordInput");
  //sessName.value=profiles[lastClicked2].name;
  //sessName.disabled='true';
  rightB = removeAllEventListeners(rightB);
  rightB.addEventListener("click", async function (event) {
    event.preventDefault();
    console.log("majde it?");
    if (sessPass.value === sessReNewPass.value) {
      let id=generateUUID();
      const newp = {
        id:id,
        isActive: true,
        name: sessName.value,
        password: sessPass.value,
        whitelist: [],
        preferences: [],
        customs: [],
      };
      console.log('the new profile creation-------------------',newp);
      await pushStorage("profiles", newp);
      const sessionBox = document.getElementById("actualSessionContainer");
      sessionBox.removeChild(sessionBox.lastElementChild);

      let item = document.createElement("profile-item");
      sessionBox.appendChild(item);

      let selector = item.shadowRoot.childNodes[3].getElementsByClassName(
        "profileLeftContainer"
      )[0];
      selector.querySelector(".SessionName").textContent = sessName.value;
      console.log("majde it?x2");
      //requestAnimationFrame(() => {
        console.log('leng '+(sessionBox.children.length - 1));
        await attatchListerners(
          item.shadowRoot.childNodes[3],
          2,
          (id)
        );
      //});

      const addb = document.createElement("addprofile-item");
      sessionBox.appendChild(addb);
      await attatchListerners(addb.shadowRoot.childNodes[3], 0, -1);

      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: false,
        cancelable: true,
      });
      item.shadowRoot.childNodes[3].dispatchEvent(clickEvent);
      const acc= await pullStorage("account");
      console.log('nooooooooooooooooooooooooo')
      if (acc.length !== 0) {
        console.log('ineerrrrrrrrrrrrrrrrrr')
        await uploadToGoogle();
      }

      backB.dispatchEvent(clickEvent);

      const account = await pullStorage("account");
      if (account.length !== 0) {
        flipPopupToSignedIn(account[0]);
        //rightB = removeAllEventListeners(rightB);
        //rightB.addEventListener("click", async function (event) {
        //  event.preventDefault();
        //  await removeStorage("account");
        //  flipPopupToLoggedOff();
        //});
      }else{
        flipPopupToLoggedOff();
      } 
    }
  });
}

async function handleProfileEditing(j) {
  triggerOntopEvents();

  document.getElementById("eventTopNewPasswordContainer").style.display =
    "flex";
  document.getElementById("eventTopReNewPasswordContainer").style.display =
    "flex";

  document.getElementById("pageTitleProfile").textContent = "Edit Profile";
  let backB = document.getElementById("goBackSessionArrow");
  let rightB = document.getElementById("redButtonAnch");

  let sessName = document.getElementById("sessionNameInput");
  let sessPass = document.getElementById("sessionPasswwordInput");
  let sessNewPass = document.getElementById("sessionNewPasswwordInput");
  let sessReNewPass = document.getElementById("sessionReNewPasswwordInput");
  let profiles = await pullStorage("profiles");

  let selected=null;
  for(let i=0;i<profiles.length;i++){
    if(profiles[i].id === j){
      selected=i;
      break;
    }
  }
  //sessName.value=profiles[lastClicked2].name;
  //sessName.disabled='true';
  rightB = removeAllEventListeners(rightB);
  rightB.addEventListener("click", async function (event) {
    event.preventDefault();
    console.log("ppas " + profiles[selected].password + selected + profiles[selected]);
    if (
      profiles[selected].password === sessPass.value &&
      sessNewPass.value === sessReNewPass.value
    ) {
      profiles[selected].name = sessName.value;
      if (sessNewPass.value !== "") {
        profiles[selected].password = sessNewPass.value;
      }
      console.log('the profile editting-------------------',profiles);
      await removeStorage("profiles");
      await pushStorage("profiles", profiles);

      const sessionBox = document.getElementById("actualSessionContainer");
      sessionBox.children[selected].shadowRoot.childNodes[3]
        .getElementsByClassName("profileLeftContainer")[0]
        .querySelector(".SessionName").textContent = sessName.value;
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: false,
        cancelable: true,
      });
      const acc= await pullStorage("account");
      if (acc.length !== 0) {
        await uploadToGoogle();
      }
      backB.dispatchEvent(clickEvent);
    }
  });
}

async function handleProfileDeletion(j) {
  let deletionFlag=0;
  let backB = document.getElementById("goBackSessionArrow");
  let profiles = await pullStorage("profiles");

  let selected=null;
  for(let i=0;i<profiles.length;i++){
    if(profiles[i].id === j){
      selected=i;
      break;
    }
  }
  const sessionBox = document.getElementById("actualSessionContainer");
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: false,
    cancelable: true,
  });

  if (profiles[selected].isActive) {
    deletionFlag=1;

  }

  
  console.log('lenbefore ', profiles.length);
  //console.dir(j);
  //console.dir(profiles);
  //profiles = profiles.filter(item => item.id !== j);

  profiles.splice(selected, 1);
  console.log('lenbefore ', profiles.length);
  await removeStorage("profiles");
  console.log('backlog-------------------');
  await pushStorage("profiles", profiles);
  console.log('special ',await pullStorage("profiles"));
  sessionBox.removeChild(sessionBox.children[selected]);

  if (deletionFlag===1) {
    sessionBox.children[0].shadowRoot.childNodes[3].dispatchEvent(clickEvent);
  }


  const acc= await pullStorage("account");
  if (acc.length !== 0) {
    await uploadToGoogle();
  }
  backB.dispatchEvent(clickEvent);

}

async function updateProfile() {
  let profs = await pullStorage("profiles");
  let selected=null;
  for(let i=0;i<profs.length;i++){
    if(profs[i].id === lastClicked2){
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

async function restoreProfile(j) {
  let profs = await pullStorage("profiles");
  let selected=null;
  let old=null;
  for(let i=0;i<profs.length;i++){
    if(profs[i].id === j){
      selected=i;
    }
    if(profs[i].id === lastClicked2){
      old=i;
    }
    if(selected !== null && old !== null){
      break;
    }
  }
  if(selected!==null){
    await removeStorage("swhitelist");
    await removeStorage("whitelist");
    await removeStorage("preferences");
    await removeStorage("customs");
    await removeStorage("sitepolicy");
    await removeStorage("profiles");
  
    await pushStorage("whitelist", profs[selected].whitelist);
    await pushStorage("preferences", profs[selected].preferences);
    await pushStorage("customs", profs[selected].customs);
    //await pushStorage('whitelist', profs[j].whitelist);
  
    if(old !== null){
      profs[old].isActive = false;
    }else{
      profs[0].isActive = false;
    }

    profs[selected].isActive = true;
    console.log('the profile restoring-------------------',profs);
    await pushStorage("profiles", profs);
    await updateRules();
}

}

async function makeProfileSelected(j) {
  console.log('jj ',j);
  let profs = await pullStorage("profiles");
  console.log('jasdx ',profs);
  let selected=null;
  let old=null;
  
  for(let i=0;i<profs.length;i++){
    if(profs[i].id === j){
      selected=i;
    }
    if(profs[i].id === lastClicked2){
      old=i;
    }
    if(selected !== null && old !== null){
      break;
    }
  }

  console.log('backdoor '+selected);
  const profiles = document.getElementsByTagName("profile-item");
  const selectedProfile = profiles[selected].shadowRoot.childNodes[3];
  let oldItem;
  console.log("survived");
  if (old !== null && profiles[old]) {
    oldItem = profiles[old].shadowRoot.childNodes[3];
    oldItem.style.border = "1px solid #ffffff08";
    oldItem
      .getElementsByClassName("profileLeftContainer")[0]
      .querySelector("#checkProfileBar").style.visibility = "hidden";
    oldItem.style.cursor = "pointer";
    oldItem.pointerEvents = "auto";
  }

  selectedProfile.style.cursor = "default";
  selectedProfile.pointerEvents = "none";
  selectedProfile.style.border = "1px solid #3791E0";
  selectedProfile
    .getElementsByClassName("profileLeftContainer")[0]
    .querySelector("#checkProfileBar").style.visibility = "visible";

  lastClicked2 = j;
}
//==============================================================================

function defineProfileItems() {
  if (!customElements.get("profile-item")) {
    customElements.define("profile-item", profileItem);
    customElements.define("addprofile-item", addProfileItem);
  }
}

class profileItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
            <style>
.profileBarContainer{
    display: flex;
    justify-content: space-between;
    background-color: #232325;
    width: 16rem;
    height: 2.8rem;
    align-items: center;
    border-radius: 14px;
    border: 1px solid #ffffff08;
    box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.5);
    margin-bottom: 10px;

}
.profileLeftContainer{
    display: flex;
    color: white;
    font-size: 1.1rem;
    margin-left: 4%;
    align-items:flex-end;

}
.profileRightContainer{
    display: flex;
    margin-right: 10px;
}
            </style>
            <div class="profileBarContainer">
                        <div class="profileLeftContainer">
                            <svg id="checkProfileBar" style="width: 18px;height:18px; margin-bottom: 2px; visibility: hidden;" width="256" height="256" viewBox="0 0 256 256"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M256 128C256 198.692 198.692 256 128 256C57.3076 256 0 198.692 0 128C0 57.3076 57.3076 0 128 0C198.692 0 256 57.3076 256 128ZM58.5147 127.866C63.201 123.179 70.799 123.179 75.4853 127.866L102.751 155.131L181.368 76.5147C186.054 71.8284 193.652 71.8284 198.338 76.5147C203.024 81.201 203.024 88.799 198.338 93.4853L113.485 178.338C112.582 179.241 111.571 179.97 110.494 180.525C105.787 184.875 98.4424 184.764 93.8701 180.191L58.5147 144.836C53.8284 140.15 53.8284 132.552 58.5147 127.866Z"
                                    fill="#3EA6FF" />
                            </svg>

                            <div class="SessionName" style="margin-left: 10px;">
                            </div>
                        </div>
                        <div class="profileRightContainer">
                            <svg id="editProfileBarButton" style="width: 18px;height:18px; margin-right:10px" width="256" height="256" viewBox="0 0 256 256" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M194.069 29.6394L226.473 62.0035L65.7055 222.576C62.2618 226.015 56.6786 226.015 53.235 222.576L33.302 202.667C29.8583 199.227 29.8583 193.651 33.3019 190.211L194.069 29.6394Z"
                                    fill="white" />
                                <path
                                    d="M207.395 16.1821C216.343 7.24495 230.85 7.24496 239.798 16.1821V16.1821C248.746 25.1192 248.746 39.6091 239.798 48.5462L231.074 57.2596L198.671 24.8955L207.395 16.1821Z"
                                    fill="white" />
                                <path
                                    d="M25.5297 235.332C22.1686 236.295 19.0764 233.154 20.0971 229.814L31.1587 193.613C32.1299 190.435 36.1408 189.435 38.4933 191.785L64.1926 217.453C66.5682 219.826 65.5201 223.874 62.2907 224.8L25.5297 235.332Z"
                                    fill="white" />
                            </svg>
                            <svg id="removeProfileBarButton" style="width: 18px;height:18px;" width="222" height="256" viewBox="0 0 222 256" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M107.952 8H115.048C129.961 8 135.314 8.12426 139.765 9.80435C143.988 11.3985 147.762 13.9899 150.768 17.3577C153.935 20.9072 155.975 25.8583 161.334 39.7748L163.346 45H59.6536L61.6659 39.7748C67.0252 25.8583 69.0651 20.9072 72.2324 17.3577C75.2376 13.9899 79.0125 11.3985 83.2353 9.80435C87.686 8.12426 93.0394 8 107.952 8Z"
                                    stroke="#DB3F42" stroke-width="16" />
                                <path d="M8 45L214 45" stroke="#DB3F42" stroke-width="16" stroke-linecap="round" />
                                <mask id="path-3-inside-1_430_54" fill="white">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M17.0471 98.7797C15.4851 77.3115 14.7042 66.5775 18.4013 58.3075C21.65 51.0404 27.2158 45.055 34.228 41.2875C42.2079 37 52.9703 37 74.4952 37H148.642C170.167 37 180.93 37 188.91 41.2875C195.922 45.055 201.488 51.0404 204.736 58.3075C208.433 66.5775 207.652 77.3116 206.09 98.7797L198.538 202.58V202.58C197.169 221.406 196.484 230.82 192.38 237.953C188.767 244.233 183.343 249.277 176.817 252.425C169.405 256 159.967 256 141.09 256H124.508H96.366H68.2239C62.3649 256 59.4354 256 56.9338 255.647C41.9976 253.54 29.9585 242.345 26.7735 227.601C26.2401 225.132 26.0275 222.21 25.6023 216.367L17.0471 98.7797ZM144.575 191C140.156 191 136.575 187.418 136.575 183V110C136.575 105.582 140.156 102 144.575 102C148.993 102 152.575 105.582 152.575 110V183C152.575 187.418 148.993 191 144.575 191ZM70.5635 183C70.5635 187.418 74.1452 191 78.5635 191C82.9818 191 86.5635 187.418 86.5635 183V110C86.5635 105.582 82.9818 102 78.5635 102C74.1452 102 70.5635 105.582 70.5635 110V183Z" />
                                </mask>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M17.0471 98.7797C15.4851 77.3115 14.7042 66.5775 18.4013 58.3075C21.65 51.0404 27.2158 45.055 34.228 41.2875C42.2079 37 52.9703 37 74.4952 37H148.642C170.167 37 180.93 37 188.91 41.2875C195.922 45.055 201.488 51.0404 204.736 58.3075C208.433 66.5775 207.652 77.3116 206.09 98.7797L198.538 202.58V202.58C197.169 221.406 196.484 230.82 192.38 237.953C188.767 244.233 183.343 249.277 176.817 252.425C169.405 256 159.967 256 141.09 256H124.508H96.366H68.2239C62.3649 256 59.4354 256 56.9338 255.647C41.9976 253.54 29.9585 242.345 26.7735 227.601C26.2401 225.132 26.0275 222.21 25.6023 216.367L17.0471 98.7797ZM144.575 191C140.156 191 136.575 187.418 136.575 183V110C136.575 105.582 140.156 102 144.575 102C148.993 102 152.575 105.582 152.575 110V183C152.575 187.418 148.993 191 144.575 191ZM70.5635 183C70.5635 187.418 74.1452 191 78.5635 191C82.9818 191 86.5635 187.418 86.5635 183V110C86.5635 105.582 82.9818 102 78.5635 102C74.1452 102 70.5635 105.582 70.5635 110V183Z"
                                    fill="#DB3F42" />
                                <path
                                    d="M18.4013 58.3075L3.79444 51.7775L18.4013 58.3075ZM17.0471 98.7797L1.08926 99.9407L17.0471 98.7797ZM34.228 41.2875L41.8007 55.3819L41.8007 55.3819L34.228 41.2875ZM188.91 41.2875L181.337 55.3819L181.337 55.3819L188.91 41.2875ZM204.736 58.3075L190.129 64.8375L190.129 64.8375L204.736 58.3075ZM206.09 98.7797L222.048 99.9408L222.048 99.9408L206.09 98.7797ZM198.538 202.58L182.58 201.419L182.538 201.998V202.58H198.538ZM198.538 202.58L214.496 203.741L214.538 203.161V202.58H198.538ZM192.38 237.953L178.511 229.974L178.511 229.974L192.38 237.953ZM176.817 252.425L183.768 266.836L183.768 266.836L176.817 252.425ZM56.9338 255.647L54.6992 271.49L54.6992 271.49L56.9338 255.647ZM26.7735 227.601L42.4128 224.223L42.4128 224.223L26.7735 227.601ZM25.6023 216.367L9.64451 217.528L25.6023 216.367ZM3.79444 51.7775C0.669503 58.7676 -0.164093 66.0115 -0.24697 73.4152C-0.327894 80.6445 0.328139 89.4795 1.08926 99.9407L33.0049 97.6186C32.2041 86.6118 31.6887 79.3456 31.751 73.7734C31.8114 68.3755 32.4359 66.1174 33.0081 64.8375L3.79444 51.7775ZM26.6553 27.193C16.5265 32.635 8.4871 41.2806 3.79444 51.7775L33.0081 64.8375C34.8129 60.8002 37.905 57.475 41.8007 55.3819L26.6553 27.193ZM74.4952 21C64.0063 21 55.147 20.9868 47.9426 21.5921C40.5645 22.212 33.4002 23.5691 26.6553 27.193L41.8007 55.3819C43.0357 54.7184 45.2426 53.9317 50.6218 53.4798C56.1748 53.0132 63.4592 53 74.4952 53V21ZM148.642 21H74.4952V53H148.642V21ZM196.482 27.193C189.737 23.5691 182.573 22.212 175.195 21.5921C167.991 20.9868 159.131 21 148.642 21V53C159.678 53 166.963 53.0132 172.516 53.4798C177.895 53.9317 180.102 54.7184 181.337 55.3819L196.482 27.193ZM219.343 51.7775C214.65 41.2806 206.611 32.635 196.482 27.193L181.337 55.3819C185.233 57.475 188.325 60.8002 190.129 64.8375L219.343 51.7775ZM222.048 99.9408C222.809 89.4795 223.465 80.6445 223.385 73.4152C223.302 66.0115 222.468 58.7676 219.343 51.7775L190.129 64.8375C190.702 66.1174 191.326 68.3755 191.387 73.7734C191.449 79.3456 190.933 86.6118 190.133 97.6187L222.048 99.9408ZM214.496 203.741L222.048 99.9408L190.133 97.6187L182.58 201.419L214.496 203.741ZM214.538 202.58V202.58H182.538V202.58H214.538ZM206.249 245.932C209.689 239.951 211.298 233.631 212.301 227.068C213.274 220.699 213.83 212.901 214.496 203.741L182.58 201.419C181.877 211.085 181.406 217.407 180.668 222.235C179.96 226.868 179.174 228.822 178.511 229.974L206.249 245.932ZM183.768 266.836C193.195 262.289 201.029 255.003 206.249 245.931L178.511 229.974C176.504 233.463 173.491 236.265 169.865 238.014L183.768 266.836ZM141.09 272C150.274 272 158.092 272.012 164.515 271.503C171.134 270.979 177.553 269.834 183.768 266.836L169.865 238.014C168.668 238.591 166.663 239.233 161.99 239.603C157.122 239.988 150.782 240 141.09 240V272ZM124.508 272H141.09V240H124.508V272ZM96.366 272H124.508V240H96.366V272ZM68.2239 272H96.366V240H68.2239V272ZM54.6992 271.49C58.5901 272.039 62.8967 272 68.2239 272V240C61.8332 240 60.2807 239.961 59.1685 239.804L54.6992 271.49ZM11.1343 230.98C15.7348 252.277 33.1246 268.447 54.6992 271.49L59.1685 239.804C50.8706 238.634 44.1822 232.414 42.4128 224.223L11.1343 230.98ZM9.64451 217.528C10.0311 222.841 10.3045 227.139 11.1343 230.98L42.4128 224.223C42.1756 223.125 42.0239 221.58 41.5601 215.206L9.64451 217.528ZM1.08926 99.9407L9.64451 217.528L41.5601 215.206L33.0049 97.6186L1.08926 99.9407ZM120.575 183C120.575 196.255 131.32 207 144.575 207V175C148.993 175 152.575 178.582 152.575 183H120.575ZM120.575 110V183H152.575V110H120.575ZM144.575 86C131.32 86 120.575 96.7452 120.575 110H152.575C152.575 114.418 148.993 118 144.575 118V86ZM168.575 110C168.575 96.7452 157.829 86 144.575 86V118C140.156 118 136.575 114.418 136.575 110H168.575ZM168.575 183V110H136.575V183H168.575ZM144.575 207C157.829 207 168.575 196.255 168.575 183H136.575C136.575 178.582 140.156 175 144.575 175V207ZM78.5635 175C82.9818 175 86.5635 178.582 86.5635 183H54.5635C54.5635 196.255 65.3086 207 78.5635 207V175ZM70.5635 183C70.5635 178.582 74.1452 175 78.5635 175V207C91.8183 207 102.563 196.255 102.563 183H70.5635ZM70.5635 110V183H102.563V110H70.5635ZM78.5635 118C74.1452 118 70.5635 114.418 70.5635 110H102.563C102.563 96.7452 91.8183 86 78.5635 86V118ZM86.5635 110C86.5635 114.418 82.9817 118 78.5635 118V86C65.3086 86 54.5635 96.7452 54.5635 110H86.5635ZM86.5635 183V110H54.5635V183H86.5635Z"
                                    fill="#DB3F42" mask="url(#path-3-inside-1_430_54)" />
                            </svg>
                        </div>
                    </div>
        `;
  }
}

class addProfileItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
            <style>
.profileBarContainer{
    display: flex;
    justify-content: space-between;
    background-color: #232325;
    width: 16rem;
    height: 2.8rem;
    align-items: center;
    border-radius: 14px;
    border: 1px solid #ffffff08;
    box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.5);
    margin-bottom: 10px;

}
.profileLeftContainer{
    display: flex;
    color: white;
    font-size: 1.1rem;
    margin-left: 4%;
    align-items:flex-end;

}
.profileRightContainer{
    display: flex;
    margin-right: 10px;
}
            </style>
                    <div class="profileBarContainer" id="addSessionBar">
                        <div class="profileLeftContainer">
                            <svg style="width: 18px;height:18px; margin-bottom: 2px;" width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.5 6L3.5 1" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
                                <path d="M1 3.5H6" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
                                </svg>

                            <div class="SessionName" style="margin-left: 10px;">
                                Add Session
                            </div>
                        </div>
                    </div>
        `;
  }
}
