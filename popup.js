document.addEventListener("DOMContentLoaded", function () {
  // Get the active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    var mobileInput = document.getElementById("mobile");
    var mobileAttribute = activeTab.value_MOBILE;

    mobileInput.value = mobileAttribute;
  });

  // Send data to the webhook URL
  document.getElementById("submit").addEventListener("click", function () {
    var webhookURL = document.getElementById("webhook-url").value;
    var mobile = document.getElementById("mobile").value;
    var type = document.getElementById("type").value;
    var content = document.getElementById("content").value;
    // var attachment = document.getElementById("attachment").files[0];

    var formData = {
      "action": "send-message",
      "type": "text",
      "content": "this is a test message",
      "mobile": "919652007118",
    };
    //if (attachment) {
   //   formData.append("attachment", attachment);
   // }

    fetch('https://wa-toolbox.web.app/webhooks/XX1QKIIPM', {
      method: "post",
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
