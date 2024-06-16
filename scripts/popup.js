import { summaryHandling } from "./summary.js";
import { alignmentHandling } from "./alignment.js";
import { infoHandling } from "./info.js";
setTopBarButtonsListeners();
console.log("popup.js");
let listItems = document.getElementsByClassName('bottomBarButtonsATags');
let lastClicked;
let contentDiv = document.getElementById('popUpContentContainer');
//let contentTitle = document.getElementById('contentTitle');

for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener('click', function (event) {
        event.preventDefault();
        let contentFile = this.getAttribute('data-content');
        fetch(contentFile).then(response => response.text()).then(data => {
            contentDiv.innerHTML = data;
            //contentTitle.textContent = this.textContent;
            if (contentFile === "popup/summary.html") {
                summaryHandling();
            } else if (contentFile === "popup/alignment.html") {
                alignmentHandling();
            }else if (contentFile === "popup/info.html") {
                infoHandling();
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


function setTopBarButtonsListeners() {
    document.getElementById('xButton').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('profileContainer').style.display = 'none';
    });

    document.getElementById('profileButton').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('profileContainer').style.display = 'block';
    });
}