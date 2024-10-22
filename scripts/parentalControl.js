import {
  pushStorage,
  removeAllRules,
  removeStorage,
  updateRules,
} from "./Utility.js";

let switchh = false;

export function controlHandling() {
  attachSwitchListener();
  attachSelectListener();
}

function attachSwitchListener() {
  document
    .getElementById("toggleSwitch")
    .addEventListener("change", async function () {
      if (this.checked) {
        switchh = true;
      } else {
        switchh = false;
        await removeStorage("parentalyt");
        await updateRules();
      }
    });
}

function attachSelectListener() {
  document
    .getElementById("saveYtButton")
    .addEventListener("click", async function () {
      let ytUrl = document.getElementById("controlYtInput").value;
      let verf = checkIfUrlValid(ytUrl);
      if (verf && switchh) {
        await removeAllRules();
        await removeStorage("parentalyt");
        await pushStorage("parentalyt", ytUrl);
      }
    });
}

function checkIfUrlValid(url) {
  let structure = url.match(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  );
  let yt = url.startsWith("https://www.youtube.com/@");
  return structure && yt;
}
