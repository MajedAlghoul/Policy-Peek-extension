let listItems = document.getElementsByTagName('a');
let lastClicked;
let contentDiv = document.getElementById('actualContentContainer');
for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener('click', function (event) {
        event.preventDefault();
        let contentFile = this.getAttribute('data-content');
        fetch(contentFile).then(response => response.text()).then(data => contentDiv.innerHTML = data);
        if (lastClicked) {
            lastClicked.classList.remove('clicked');
        }
        this.classList.add('clicked');
        lastClicked = this;
    });
}

