console.log("Popup.js")
// global var
let isSubmitting = false;

async function main() {

  const { webHookURL, mobileNumber, selectedText } = await chrome.storage.local.get([
    "webHookURL",
    "mobileNumber",
    "selectedText"
  ]);

  const formElement = document.querySelector("form");
  const submitBtn = document.querySelector('button');

  if (webHookURL) {
    formElement.elements.namedItem('webHookURL').value = webHookURL;
  }
  if (selectedText) {
    formElement.elements.namedItem('mobileNumber').value = selectedText;
  } else if (mobileNumber) {
    formElement.elements.namedItem('mobileNumber').value = mobileNumber;
  }

  formElement.addEventListener("submit", async function(event) {
    event.preventDefault();


    if (isSubmitting) return;

    const form = new FormData(event.target);


    const webHookURLInputValue = form.get('webHookURL');
    const sendTypeInputValue = form.get('sendType');
    const messageContentInputValue = form.get('messageContent');
    const mobileNumberInputValue = form.get('mobileNumber');
    const mediaUrlInputValue = form.get('mediaUrl');

    if (!webHookURLInputValue || !mobileNumberInputValue || !messageContentInputValue) {
      return alert("Fill the form.");
    }

    let data = {
      action: "send-message",
      type: sendTypeInputValue,
      content: messageContentInputValue,
      phone: mobileNumberInputValue,
    };

    if (sendTypeInputValue === "media" && !mediaUrlInputValue) {
      return alert("Attach media url");
    }

    if (sendTypeInputValue === "media" && mediaUrlInputValue) {
      data = { ...data, attachments: [mediaUrlInputValue] };
    }

    try {
      isSubmitting = true;
      submitBtn.innerText = "Submitting...";


      await fetch(webHookURLInputValue, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      chrome.storage.local.set({ webHookURL: webHookURLInputValue });
      alert("Your message has been send!");
      formElement.elements.namedItem('messageContent').value = "";

    } catch (error) {
      console.log("Submitting error", error);
      alert("Something went wrong");
    } finally {
      isSubmitting = false;
      submitBtn.innerText = "Submit";
    }
  });
}


window.document.addEventListener("DOMContentLoaded", () => {
  main();
});
