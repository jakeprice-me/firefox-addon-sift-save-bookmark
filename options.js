document.addEventListener("DOMContentLoaded", function () {
  var serverURLInput = document.getElementById("serverURL");
  var saveButton = document.getElementById("saveButton");
  var messageContainer = document.getElementById("messageContainer");

  // Retrieve the server URL from the extension's storage
  chrome.storage.local.get("serverURL", function (data) {
    var serverURL = data.serverURL;
    if (serverURL) {
      serverURLInput.value = serverURL;
    }
  });

  saveButton.addEventListener("click", function () {
    var serverURL = serverURLInput.value.trim();

    if (!isValidURL(serverURL)) {
      showMessage("Invalid URL. Please enter a valid URL starting with http:// or https://", "error");
      return;
    }

    // Store the server URL in the extension's storage
    chrome.storage.local.set({ serverURL: serverURL }, function () {
      console.log("Server URL saved:", serverURL);
      showMessage("URL saved successfully", "message");
    });
  });

  function isValidURL(url) {
    var pattern = /^(https?:\/\/)/i;
    return pattern.test(url);
  }

  function showMessage(message, className) {
    var messageElement = document.createElement("div");
    messageElement.className = className;
    messageElement.textContent = message;

    // Remove existing message elements
    while (messageContainer.firstChild) {
      messageContainer.firstChild.remove();
    }

    // Append the new message element
    messageContainer.appendChild(messageElement);
  }
});

