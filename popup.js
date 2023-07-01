document.addEventListener("DOMContentLoaded", function() {
    var saveForm = document.getElementById("saveForm");
    var titleInput = document.getElementById("title");
    var urlInput = document.getElementById("url");
    var descriptionInput = document.getElementById("description");
    var tagsInput = document.getElementById("tags");

    // Get the current active tab's information
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        var activeTab = tabs[0];
        var title = activeTab.title || "";
        var url = activeTab.url || "";

        // Pre-populate the title and URL fields with the current page's values
        titleInput.value = title;
        urlInput.value = url;

        // Retrieve the HTML of the current page
        chrome.tabs.executeScript(
            activeTab.id, {
                code: 'document.querySelector("meta[name=\'description\']").content'
            },
            function(result) {
                if (result && result.length > 0) {
                    var description = result[0];
                    var prefixedDescription = "> " + description;
                    descriptionInput.value = prefixedDescription;
                } else {
                    console.log("No description found for the current page.");
                }
            }
        );
    });

    saveForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var title = titleInput.value;
        var url = urlInput.value;
        var tags = tagsInput.value || "";
        var description = descriptionInput.value || "";
        var archive = document.getElementById("archive").checked;

        // Retrieve the server URL from the extension's settings
        chrome.storage.local.get("serverURL", function(data) {
            var serverURL = data.serverURL;
            if (serverURL) {
                savePageInfo(serverURL, title, url, description, tags);
            } else {
                showError("SIFT Server URL is not defined.");
            }
        });
    });

    function savePageInfo(serverURL, title, url, description, tags) {
        // Create an HTTP request to send the data to the server
        var xhr = new XMLHttpRequest();
        xhr.open("POST", serverURL + "/save-bookmark", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Create a JavaScript object with the data
        var bookmarkData = {
            title: title,
            url: url,
            description: description,
            tags: tags,
            archive: archive
        };

        // Send the bookmarkData object as JSON data in the request body
        xhr.send(JSON.stringify(bookmarkData));

        // Handle the server's response
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    showMessage("Bookmark saved successfully.");
                } else {
                    showError("Failed to save bookmark. Check the SIFT Server URL.");
                }
            }
        };
    }

    function showMessage(message, messageType) {
        var messageElement = document.createElement("div");
        messageElement.className = "message" + (messageType === "error" ? " error" : "");
        messageElement.textContent = message;
        messageContainer.appendChild(messageElement);
    }

    function showError(message) {
        showMessage(message, "error");
    }

});
