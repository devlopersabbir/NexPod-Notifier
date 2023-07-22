export const createwWebPageModal = () => {
    const modalContainer = document.createElement("div");
    modalContainer.id = "myExtensionModal";
    modalContainer.style.position = "fixed";
    modalContainer.style.top = "50%";
    modalContainer.style.left = "50%";
    modalContainer.style.transform = "translate(-50%, -50%)";
    modalContainer.style.backgroundColor = "#dadada";
    modalContainer.style.borderRadius = "5px";
    modalContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    modalContainer.style.zIndex = "9999999999";
    modalContainer.style.display = "none"
    

    modalContainer.innerHTML = htmlModal
    document.body.appendChild(modalContainer)
}


const htmlModal = `
<div style="position: relative; width: 380px">
      <button id="modalCloseBtn" style="position: absolute; top: 5px; right: 5px;">X</button>
      <div style="display: flex; flex-direction: column;  gap: 7px; padding: 20px">

        <h1 style="text-align: center; margin-bottom: 10px">Webhook Notifier</h1>
        <label for="webhookUrl">Webhook URL:</label>
        <input  style="padding: 3px 7px; font-size: 18px; font-weight: 600" type="text" id="webhookUrl" />

        <label for="mobileNumber">Mobile:</label>
        <input style="padding: 3px 7px; font-size: 18px; font-weight: 600" type="text" id="mobileNumber" />

        <label for="sendType">Type:</label>
        <!--
        <input style="padding: 3px 7px; font-size: 18px; font-weight: 600" type="text" id="sendType" placeholder="text OR media" />
-->
<select style="padding: 3px 7px; font-size: 18px; font-weight: 600" name="sendType" id="sendType">
  <option value="text">Text</option>
  <option value="media">Media</option>
</select>
        <label for="mediaUrl">Attachments url:</label>
        <input style="padding: 3px 7px; font-size: 18px; font-weight: 600" type="text" id="mediaUrl" />

        <label for="messageContent">Content:</label>
        <textarea style="padding: 3px 7px; font-size: 18px; font-weight: 600" id="messageContent" rows="7"></textarea>

        <button id="submitBtn" style="padding: 3px 7px; font-size: 18px; font-weight: 600">Submit</button>
    
      </div>
    </div>
`;
