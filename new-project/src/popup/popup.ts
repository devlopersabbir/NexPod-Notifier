import "./popup.css";

// dom Selection
const webHookUrl = document.getElementById("webhook-url");
const mobile: HTMLInputElement = document.getElementById(
  "mobile"
) as HTMLInputElement;
const typeSelection = document.getElementById("typeSelection");
const file = document.getElementById("file");
const content = document.getElementById("content");
const submitBtn = document.getElementById("submit");

// init functoin and set mobile
const initFunction = () => {
  chrome.runtime.onMessage.addListener((message) => {
    mobile.value = message;
  });
  console.log("mobile number", mobile)
  console.log("element: ",mobile)
};

window.document.addEventListener("DOMContentLoaded", initFunction);
