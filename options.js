document.addEventListener("DOMContentLoaded", function () {
  var serverURLInput = document.getElementById("serverURL");
  var saveButton = document.getElementById("saveButton");

  // Retrieve the server URL from the extension's storage
  chrome.storage.local.get("serverURL", function (data) {
    var serverURL = data.serverURL;
    if (serverURL) {
      serverURLInput.value = serverURL;
    }
  });

  saveButton.addEventListener("click", function () {
    var serverURL = serverURLInput.value.trim();

    // Store the server URL in the extension's storage
    chrome.storage.local.set({ serverURL: serverURL }, function () {
      console.log("Server URL saved:", serverURL);
    });
  });
});
