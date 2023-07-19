/**
 * Name: NexPod Notifier
 * Version: 0.0.1
 * Manifest_version: 3
 * Supported: Google Chrome | null
 * Language: TypeScript
 * Author: fundviser
 * Creator: Sabbir Hossain Shuvo
 * Developer_Email: devlopersabbir@gmail.com
 * Developer_username: @devlopersabbir
 * Github_repo: https://github.com/devlopersabbir/NexPod-Notifier
 */

import { createFloatingButton } from "../utils/elements/flotingBtn";
import { createwWebPageModal } from "../utils/elements/newModal";
import axios from "axios";

// clear console
console.clear();

const createAButtonToOpenPopup = () => {
  createFloatingButton();
  createwWebPageModal();
  let webHookURL: string;
  let mobileNumbers: string;

  chrome.storage.sync
    .get(["selectedText", "webHookURL", "mobileNumber"])
    .then((res) => {
      webHookURL = res?.webHookURL;
      mobileNumbers = res?.mobileNumber;
    });

  // dom selection
  const myExtensionModal: HTMLDivElement = document.getElementById(
    "myExtensionModal"
  ) as HTMLDivElement;
  const floatingIconButton: HTMLImageElement = document.getElementById(
    "floatingIconButton"
  ) as HTMLImageElement;

  floatingIconButton.addEventListener("click", () => {
    chrome.storage.sync
      .get(["selectedText", "webHookURL", "mobileNumber"])
      .then((res) => {
        webHookURL = res?.webHookURL;
        mobileNumbers = res?.mobileNumber;
      });
    myExtensionModal.style.display = "block";

    // perform the modal task starting from the dom selection
    setTimeout(() => {
      //dom selection
      const modalCloseBtn = document.getElementById("modalCloseBtn");
      const webhookUrl: HTMLInputElement = document.getElementById(
        "webhookUrl"
      ) as HTMLInputElement;
      const mobileNumber: HTMLInputElement = document.getElementById(
        "mobileNumber"
      ) as HTMLInputElement;
      const sendType: HTMLInputElement = document.getElementById(
        "sendType"
      ) as HTMLInputElement;
      const mediaUrl = document.getElementById("mediaUrl");
      const messageContent: HTMLTextAreaElement = document.getElementById(
        "messageContent"
      ) as HTMLTextAreaElement;
      const submitBtn = document.getElementById("submitBtn");

      // predefine value
      webhookUrl.value = webHookURL ?? "";
      mobileNumber.value = mobileNumbers ?? "";

      submitBtn?.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!webhookUrl || !mobileNumber || !sendType || !messageContent) {
          return alert("fill the form!");
        }

        if (sendType.value.toLowerCase() === "text") {
          const data = {
            action: "send-message",
            type: "text",
            content: messageContent.value,
            phone: mobileNumber.value,
          };
          console.log(data);
          try {
            await axios.post(`${webhookUrl.value}`, data);
            chrome.storage.sync.set({ webHookURL: webhookUrl.value });
          } catch (error) {
            console.log("err", error);
          }
        } else if (sendType.value.toLowerCase() === "media") {
          const data = {
            action: "send-message",
            type: "media",
            content: messageContent.value,
            attachments: [`${mediaUrl}`],
            phone: mobileNumber.value,
          };

          try {
            await axios.post(`${webhookUrl.value}`, data);
            chrome.storage.sync.set({ webHookURL: webhookUrl.value });
          } catch (error) {
            alert("Error to send message")
          }
        } else {
          alert("Invalid type!");
        }
      });

      modalCloseBtn?.addEventListener("click", () => {
        myExtensionModal.style.display = "none";
      });
    }, 1000);
  });
};

const init = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    sendResponse("success!");
    if (request.message === "tabPathChanged") {
      setTimeout(() => {
        const numberElement = document.getElementById("subvalue_MOBILE");
        if (numberElement) {
          const mobileNumber = numberElement.innerText
            ?.trim()
            .replace(/[^0-9]/g, "")
            ?.trim();
          chrome.storage.sync.set({ mobileNumber });
        }
      }, 2000);
    }
  });
};

if (document.readyState === "complete") {
  init();
  createAButtonToOpenPopup();
}
