import { preferencesHandling } from "./preferences.js";
import { generalHandling } from "./general.js";

let listItems = document.getElementsByTagName('a');
let lastClicked;
let contentDiv = document.getElementById('actualContentContainer');
let contentTitle = document.getElementById('contentTitle');

for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener('click', function (event) {
        event.preventDefault();
        let contentFile = this.getAttribute('data-content');
        fetch(contentFile).then(response => response.text()).then(data => {
            contentDiv.innerHTML = data;
            contentTitle.textContent = this.textContent;
            if (contentFile === "settings/preferences.html") {
                preferencesHandling();
            }else if(contentFile ==="settings/general.html"){
                generalHandling();
            }
        });
        if (lastClicked) {
            lastClicked.classList.remove('clicked');
        }
        this.classList.add('clicked');
        lastClicked = this;
    });
}
listItems[0].click();