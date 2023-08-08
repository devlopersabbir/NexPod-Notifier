/**
 * Name: NexPod Notifier
 * Version: 0.0.3
 * Manifest_version: 3
 * Supported: Google Chrome | null
 * Language: Javascript
 * Author: fundviser
 * Creator: Sabbir Hossain Shuvo | Mohammad Sobuj
 * Developer_Email: devlopersabbir@gmail.com
 * Developer_username: @devlopersabbir
 * Github_repo: https://github.com/coderboysobuj/whatsapp-notify-extension
 */

// global
const targetClassName = "lyteTableScroll";
const secondTargetClassName = "dv_header_container dF";
const logo = "https://img.icons8.com/?size=512&id=108653&format=png";
const iconId = "whats-app-floting-icon-v3";
const formId = "whats-app-model-form-v3";
const formCloseId = "whats-app-model-form-close-v3";
const formSubmitBtn = "whats-app-model-form-submit-btn-v3";
const toastId = "whats-app-toast-notify-v3";
let isSubmitting = false;
const INITAL_LOADING_TIME = 3000;

function createButton() {
  const img = document.createElement("img");
  img.style.position = "fixed";
  img.style.right = "234px";
  img.style.bottom = "-6px";
  img.style.width = "40px";
  img.style.height = "40px";
  img.id = iconId;
  img.src = logo;
  img.alt = "Logo";
  img.style.cursor = "pointer";
  img.style.zIndex = 9999;
  return new Promise((resolve) => {
    resolve(img);
  });
}

function toast(message, type) {
  const div = document.createElement("div");
  div.id = toastId;
  div.style.zIndex = 99999999;
  div.style.position = "fixed";
  div.style.top = "10px";
  div.style.right = "10px";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.gap = "4px";
  div.style.borderRadius = "8px";
  div.style.backgroundColor = "#e2e8f0";
  div.style.padding = "0 6px";

  const icon = type === "success" ? "✔️" : "✗";
  const iconStyle =
    type === "success"
      ? "font-size: 30px; color: #0d9488;"
      : "font-size: 30px; color: #e11d48;";

  div.style.padding = "4px 8px";

  div.style.fontSize = "18px";
  div.innerHTML = `
    <span style="${iconStyle}">${icon}</span>
    <p style="color: #0f172a;">${message}</p>
  `;
  document.body.append(div);

  setTimeout(() => {
    document.getElementById(toastId).remove();
  }, 2000);
}

async function createForm() {
  const form = document.createElement("div");
  form.id = formId;
  form.style.zIndex = 99999;
  form.style.position = "fixed";
  form.style.top = "0";
  form.style.left = 0;
  form.style.width = "100%";
  form.style.height = "100vh";
  form.style.display = "flex";
  form.style.alignItems = "center";
  form.style.justifyContent = "center";
  form.style.backgroundColor = "rgb(0,0,0,0.5)";

  // get webhookUrl from local storage
  const { webHookURL, mobileNumber, selectedText } =
    await chrome.storage.local.get([
      "webHookURL",
      "mobileNumber",
      "selectedText",
    ]);
  console.log("got selected text: ", selectedText);

  const inputStyle =
    "resize: none; font-size: 16px; font-weight: 500; background: #475569; color: #e2e8f0; border-radius: 8px; padding: 8px 12px; outline: none; border: 1px solid #1e293b";

  const htmlContent = `
  <div style="position: relative; width: 380px; background: #0f172a; border-radius: 8px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);">
      <button id="${formCloseId}" type="button" style="position: absolute; top: 8px; right: 5px; cursor: pointer; z-index: 9999; padding: 2; border-radius: 4px;">X</button>
      <div style="display: flex; flex-direction: column;  gap: 7px; padding: 20px">
        <h1 style="text-align: center; margin-bottom: 10px; color: #f8fafc;">Webhook Notifier</h1>
        <label for="webhookUrl" style="color: #cbd5e1;">Webhook URL:</label>
        <input  name="webhookUrl" value="${
          webHookURL ?? ""
        }" style="${inputStyle}"  type="text" id="webhookUrl" />

        <label for="mobileNumber" style="color: #cbd5e1;">Mobile:</label>
        <input name="mobileNumber" value="${
          selectedText ? selectedText : mobileNumber ?? ""
        }" style="${inputStyle}" type="text" id="mobileNumber" />

        <label for="sendType" style="color: #cbd5e1;">Type:</label>
        <select style="${inputStyle}" name="sendType" id="sendType">
          <option value="text">Text</option>
          <option value="media">Media</option>
        </select>
        <label for="mediaUrl" style="color: #cbd5e1;">Attachments url:</label>
        <input name="mediaUrl" style="${inputStyle}" type="text" id="mediaUrl" />

        <label for="messageContent" style="color: #cbd5e1;">Content:</label>
        <textarea name="messageContent" style="${inputStyle}" id="messageContent" rows="6"></textarea>

        <button type="submit" id="${formSubmitBtn}" style="cursor: pointer; padding: 6px 8px; font-size: 18px; font-weight: 600; background: #f1f5f9; color: #0f172a; border-radius: 8px">Submit</button>
      </div>
    </div>
  `;

  form.innerHTML = htmlContent;

  document.body.append(form);
  return form;
}

async function closeModal() {
  const closeBtnElements = document.querySelectorAll(`#${formId}`);

  if (closeBtnElements) {
    closeBtnElements.forEach(async (item) => {
      await chrome.storage.local.remove(["selectedText", "mobileNumber"]);
      item.remove();
    });
  }
}

async function onSubmit() {
  if (isSubmitting) return;

  const webhookUrl = document.getElementById("webhookUrl").value;
  const mobileNumber = document.getElementById("mobileNumber").value;
  const sendType = document.getElementById("sendType").value;
  const messageContent = document.getElementById("messageContent").value;
  const mediaUrl = document.getElementById("mediaUrl").value;

  if (!webhookUrl || !mobileNumber || !messageContent) {
    return toast("fill the required input form!", "error");
  }

  let data = {
    action: "send-message",
    type: sendType,
    content: messageContent,
    phone: mobileNumber,
  };

  if (sendType === "media" && !mediaUrl) {
    return toast("Attach media url", "error");
  }

  if (sendType === "media" && mediaUrl) {
    data = { ...data, attachments: [`${mediaUrl}`] };
  }

  try {
    document.getElementById(formSubmitBtn).innerText = "Submitting...";
    isSubmitting = true;

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    chrome.storage.local.set({ webHookURL: webhookUrl });

    toast("Your message has been send!", "success");
    setTimeout(() => {
      closeModal();
    }, 1000);
  } catch (error) {
    toast("Something went wrong", "error");
  } finally {
    isSubmitting = false;
    document.getElementById(formSubmitBtn).innerText = "Submit";
  }
}

async function main() {
  closeModal();

  document.addEventListener("mouseup", async function (event) {
    if (getSelectedText()) {
      await chrome.storage.local
        .set({ selectedText: getSelectedText() })
        .then(() => console.log("success: ", getSelectedText()))
        .catch((err) => console.log(err));
    }
  });
  const numberElement = document.getElementById("subvalue_MOBILE");
  const iconButtonElements = document.querySelectorAll(`#${iconId}`);
  if (iconButtonElements.length) {
    iconButtonElements.forEach((item) => item.remove());
  }

  const iconButton = await createButton();

  if (numberElement) {
    const mobileNumber = numberElement.innerText
      ?.trim()
      .replace(/[^0-9]/g, "")
      ?.trim();
    chrome.storage.local.set({ mobileNumber });
  }

  document.body.append(iconButton);

  iconButton.addEventListener("click", async function () {
    closeModal();
    const form = document.getElementById(formId)
      ? document.getElementById(formId)
      : await createForm();

    if (form) {
      form
        .querySelector(`#${formCloseId}`)
        .addEventListener("click", closeModal);

      form
        .querySelector(`#${formSubmitBtn}`)
        .addEventListener("click", async () => {
          await onSubmit();
        });
    }
  });
}

function init() {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    sendResponse("success!");
    if (request.message === "tabPathChanged") {
      setTimeout(() => {
        main();
      }, INITAL_LOADING_TIME);
    }
  });
}

init();

function getSelectedText() {
  const selectedText = document
    .getSelection()
    ?.toString()
    ?.trim()
    ?.replace(/[^0-9]/g, "")
    ?.trim();
  return selectedText;
}
