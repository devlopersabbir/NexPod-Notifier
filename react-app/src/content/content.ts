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

// clear console
console.clear();

const init = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    sendResponse("success!")
    if (request.message === "tabPathChanged") {
      setTimeout(() => {
        const numberElement = document.getElementById("subvalue_MOBILE");
        if (numberElement) {
          const mobileNumber = numberElement.innerText?.trim().replace(/[^0-9]/g, "")?.trim();
          chrome.storage.sync.set({ mobileNumber })
        }
      }, 2000)
    }
  })
}

if (document.readyState === "complete") {
  init()
}
