import { preferencesHandling } from "./preferences.js";
import { generalHandling } from "./general.js";
import { pullStorage } from "./Utility.js";
import { controlHandling } from "./parentalControl.js";

let listItems = document.getElementsByTagName("a");
let lastClicked;
let contentDiv = document.getElementById("actualContentContainer");
let contentTitle = document.getElementById("contentTitle");

let lockStatus = true;

for (let i = 0; i < listItems.length; i++) {
  listItems[i].addEventListener("click", function (event) {
    event.preventDefault();

    if (!lockStatus) {
        let authFile = "settings/authenticate.html";
        fetch(authFile)
        .then((response) => response.text())
        .then(async (data) => {
          contentDiv.innerHTML = data;
          contentTitle.textContent = 'Authentication';
          let pass = await adjustNameInput();
          if(pass !== null){
            attachUnlockButtonListener(pass);
          }
        });
    } else {
      let contentFile = this.getAttribute("data-content");
      fetch(contentFile)
        .then((response) => response.text())
        .then((data) => {
          contentDiv.innerHTML = data;
          contentTitle.textContent = this.textContent;
          if (contentFile === "settings/preferences.html") {
            preferencesHandling();
          } else if (contentFile === "settings/general.html") {
            generalHandling();
          }
          else if (contentFile === "settings/control.html") {
            controlHandling();
          }
        });
      if (lastClicked) {
        lastClicked.classList.remove("clicked");
      }
      this.classList.add("clicked");
      lastClicked = this;
    }
  });
}
listItems[0].click();


async function adjustNameInput(){
    const profs= await pullStorage('profiles');
    let nInput = document.getElementById('settingsSessionNameInput');
    nInput.disabled = true;

    for (let index = 0; index < profs.length; index++) {
        if(profs[index].isActive){
            nInput.value = profs[index].name;
            return profs[index].password;
        }
    }
    return null;
}

function attachUnlockButtonListener(pass){
    let unlockButton = document.getElementById('settingsAuthButton');

    unlockButton.addEventListener('click', async function(){
        let enteredPass = document.getElementById('settingsSessionPasswordInput').value;
        if(pass === enteredPass){
            lockStatus = false;
            document.getElementById('settingsGeneralMenuItem').click();
        }
    });
}