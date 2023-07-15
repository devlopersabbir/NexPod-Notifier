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

import { getSelectedText } from "../utils/service";

// make clear console
console.clear();

const init = () => {
  document.addEventListener("mouseup", () => {
    const selectedText = getSelectedText();
    if (selectedText) {
      chrome.runtime.sendMessage(selectedText);
    }
  });
};

if (document.readyState === "complete") {
  init();
} else {
  init();
}
