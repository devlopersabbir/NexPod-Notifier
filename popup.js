// global var
let isSubmitting = false;

async function main(){
const { webHookURL, mobileNumber, selectedText } = await chrome.storage.local.get([
  "webHookURL",
  "mobileNumber",
  "selectedText"
]);

const webhookUrl = document.getElementById("webhookUrl").value = webHookURL || "";
const mobileNumbers = document.getElementById("mobileNumber").value = mobileNumber || "";
const sendType = document.getElementById("sendType").value;
const messageContent = document.getElementById("messageContent").value;
const mediaUrl = document.getElementById("mediaUrl").value;
const formElement = document.querySelector("form");

formElement.addEventListener("submit", async function (event) {
  if (isSubmitting) return;
  document.getElementById("formSubmitBtn").disabled = true;

  if (!webhookUrl || !mobileNumber || !messageContent) {
    return alert("Fill the form.");
  }

  let data = {
    action: "send-message",
    type: sendType,
    content: messageContent,
    phone: mobileNumber,
  };

  if (sendType === "media" && !mediaUrl) {
    return alert("Attach media url");
  }

  if (sendType === "media" && mediaUrl) {
    data = { ...data, attachments: [`${mediaUrl}`] };
  }

  try {
    isSubmitting = true;

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    chrome.storage.sync.set({ webHookURL: webhookUrl });

    alert("Your message has been send!");
  } catch (error) {
    console.log("Submitting error", error);
    alert("Something went wrong");
  } finally {
    isSubmitting = false;
    document.getElementById("formSubmitBtn").disabled = false;
  }
});
}


window.document.addEventListener("DOMContentLoaded", () => {
  main();
});
