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
      
      const closeBtn = document.getElementById("closeTabBtn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length > 0) {
              chrome.tabs.remove(tabs[0].id);
            } else {
              window.close();
            }
          });
        });
      }
    });
  });
});
