chrome.storage.local.get('currentURL', function (result) {
  const currentURL = result.currentURL;
  if (currentURL) {
    modifyPage(currentURL);
  }
});

function modifyPage(currentURL) {
  let temp = currentURL;
  temp = temp.split('//')[1];
  if (temp.charAt(temp.length - 1) === '/') {
    temp = temp.slice(0, temp.length - 1);
  }
  let x = temp.split('.');
  if (x.length > 2) {
    temp = x[1] + '.' + x[2];
  }
  let selector = document.getElementById('bigTitle');
  selector.textContent = temp;
  selector = document.getElementById('littleTextSpan');
  selector.textContent = temp.split('.')[0];


  let count = 10;
  selector = document.getElementById('littleCounterSpan');
  selector.textContent = count;
  function decrementCounter() {
    count--;
    selector.textContent = count;
    if (count <= 0) {
      clearInterval(intervalId);
    }
  }
  const intervalId = setInterval(decrementCounter, 1000);

  const faviconImg = document.getElementById('favicon');
  faviconImg.src = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${currentURL}&size=256`;
}