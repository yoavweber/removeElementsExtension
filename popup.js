activateButton = document.getElementById("activate");
deactivateButton = document.getElementById("deactivate");

// activateButton.addEventListener("click", () => {
//   console.log("from arrow function");
//   chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//     console.log(tabs, "what is tabs??");
//     chrome.tabs.sendMessage(tabs[0].id, true);
//   });
// });

activateButton.addEventListener("click", onActivate);

deactivateButton.addEventListener("click", onDeactivate);

function onActivate() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, true);
  });
}

function onDeactivate() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, false);
  });
}

/// old
// document.querySelector("button").addEventListener("click", onclick, false);
// function onclick() {
//   chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//     console.log(tabs, "what is tabs?");
//     chrome.tabs.sendMessage(tabs[0].id, "hi");
//   });
// }
