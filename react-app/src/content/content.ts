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

import { createwWebPageModal } from "../utils/elements/newModal";

// clear console
console.clear();
let isLoading: boolean = false;

export const createFloatingButton = (container: HTMLDivElement) => {

  const createButton = document.createElement("img");
  createButton.src = "https://img.icons8.com/?size=512&id=108653&format=png";
  createButton.id = "floatingIconButton";
  createButton.alt = "icon button";
  createButton.style.cursor = "pointer";
  // createButton.style.position = "absolute";
  createButton.style.width = "50px";
  createButton.style.height = "50px";
  // createButton.style.top = "49px";
  // createButton.style.right = "30%";
  createButton.style.zIndex = "99999999999";

  // document.body.appendChild(createButton);
  container.appendChild(createButton)
};


const createAButtonToOpenPopup = (container: HTMLDivElement) => {
  createFloatingButton(container as HTMLDivElement);
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
      const mediaUrl: HTMLInputElement = document.getElementById("mediaUrl") as HTMLInputElement;
      const messageContent: HTMLTextAreaElement = document.getElementById(
        "messageContent"
      ) as HTMLTextAreaElement;
      const submitBtn: HTMLButtonElement = document.getElementById("submitBtn") as HTMLButtonElement;

      // predefine value
      webhookUrl.value = webHookURL ?? "";
      mobileNumber.value = mobileNumbers ?? "";



      submitBtn?.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!webhookUrl.value || !mobileNumber.value || !messageContent.value) {
          return alert("fill the required input form!");
        }


        if (sendType.value.toLowerCase() === "text") {
          isLoading = true;
          const data = {
            action: "send-message",
            type: "text",
            content: messageContent.value,
            phone: mobileNumber.value,
          };
          try {
            await fetch(`${webhookUrl.value}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data)
            });
            chrome.storage.sync.set({ webHookURL: webhookUrl.value });
            sendType.value = "";
            messageContent.value = "";
            mobileNumber.value = "";
            webhookUrl.value = "";
            isLoading = false;
            alert("Message Sended!")
            closeTheModal();
            return;
          } catch (error) {
            alert("Fail to send message")
            if (error) {
              isLoading = false;
            }
          }
        } else if (sendType.value.toLowerCase() === "media") {
          if (!mediaUrl.value) return alert("Please set media url!");
          isLoading = true;
          const data = {
            action: "send-message",
            type: "media",
            content: messageContent.value,
            attachments: [`${mediaUrl.value}`],
            phone: mobileNumber.value,
          };
          console.log('data: ', data)
          try {
            await fetch(`${webhookUrl.value}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data)
            });
            chrome.storage.sync.set({ webHookURL: webhookUrl.value });
            sendType.value = "";
            messageContent.value = "";
            mobileNumber.value = "";
            webhookUrl.value = "";
            isLoading = false;
            alert("Media sended!")
            closeTheModal();
            return;
          } catch (error) {
            alert("Error to send message")
            if (error) {
              isLoading = false;
            }
          }
        } else if (!sendType.value) {
          alert("Please enter the send type!")
        } else {
          alert("Invalid form!")
        }
      });


      const closeTheModal = () => {
        myExtensionModal.style.display = "none";
      }

      modalCloseBtn?.addEventListener("click", closeTheModal);
    }, 1000);
  });
};

const init = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    sendResponse("success!");
    if (request.message === "tabPathChanged") {
      setTimeout(() => {
        const numberElement = document.getElementById("subvalue_MOBILE");
        const containerForSetIcon: HTMLDivElement = document.querySelector(".lyteTableScroll") as HTMLDivElement;
        const containerForSetIconNumberPage: HTMLDivElement = document.querySelector(".dv_header_container") as HTMLDivElement;
        const ifAlreadyHaveFlotingIcon: HTMLImageElement = document.getElementById("floatingIconButton") as HTMLImageElement;

        if (containerForSetIcon) {
          containerForSetIcon.style.display = "flex";
          containerForSetIcon.style.alignItems = "center";
          ifAlreadyHaveFlotingIcon ? null : createAButtonToOpenPopup(containerForSetIcon);
        } else if (containerForSetIconNumberPage) {
          containerForSetIconNumberPage.style.display = "flex";
          containerForSetIconNumberPage.style.alignItems = "center";
          console.log("got this element==============================")
          ifAlreadyHaveFlotingIcon ? null : createAButtonToOpenPopup(containerForSetIconNumberPage);
          ifAlreadyHaveFlotingIcon ? console.log("====================================floating icon have") : console.log("floating icon don't have=================================")
        } else {
          console.log('second page: ', containerForSetIconNumberPage)
          console.log('fst page: ', containerForSetIcon)
          console.log('Dont have any element================')
        }
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

}



