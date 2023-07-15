document.addEventListener("DOMContentLoaded", function () {
  // Get the active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    var mobileInput = document.getElementById("mobile");
    mobileInput.value = activeTab.url;
  });

  // Send data to the webhook URL
  document.getElementById("submit").addEventListener("click", function () {
    var webhookURL = document.getElementById("webhook-url").value;
    var mobile = document.getElementById("mobile").value;
    var type = document.getElementById("type").value;
    var content = document.getElementById("content").value;
    

    var formData = new FormData();
    formData.append("action", 'send-message');
    formData.append("phone", mobile);
    formData.append("type", type);
    formData.append("content", content);
    
    fetch(webhookURL, {
      method: "POST",
      payload: formData,
    })
      .then(function (response) {
        if (response.ok) {
          alert("Data submitted successfully.");
        } else {
          alert("Failed to submit data.");
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  });
});



