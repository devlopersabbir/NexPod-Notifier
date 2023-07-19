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


chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, _: chrome.tabs.Tab) => {
    if (changeInfo.status === "complete") {
        chrome.tabs.sendMessage(tabId, { message: "tabPathChanged" })
    }
})

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request === "open_popup") {
        chrome.action.openPopup();
        sendResponse("Open successfully!")
    } else {
        console.log("request: ",request)
    }
 })