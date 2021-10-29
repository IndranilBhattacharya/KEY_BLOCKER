window.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, () => {
    chrome.storage.local.get(["blockedKeys"], (result) => {
      const keywordContainer = document.getElementById("keywordContainer");
      keywordContainer.innerHTML = "";
      result.blockedKeys.forEach((k) => {
        let badge = document.createElement("div");
        badge.classList.add("key-badge");
        badge.title = k;
        let keySpan = document.createElement("span");
        keySpan.classList.add("key-holder");
        keySpan.innerHTML = k;
        badge.appendChild(keySpan);
        keywordContainer.appendChild(badge);
      });
    });
  });
});
