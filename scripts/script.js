let currentBlackList = [];
let tabUrl = "";
let timer = 0;
const extensionId = chrome.runtime.id;
const bodyElem = document.getElementsByTagName("body")[0];
const addKeywordsBtn = document.getElementById("addKeywords");
const inputKeyWords = document.getElementById("keyWordInput");
const activeTabIconBtn = document.getElementById("activeTabIcon");
const tabImg = document.getElementById("tabIcon");
const blackListDescDiv = document.getElementById("blackListDesc");
const blackListContainer = document.getElementById("blackListContainer");

window.addEventListener("DOMContentLoaded", () => {
  fetchBlackList();
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab.title) {
      document.getElementsByClassName(
        "tab-icon-container"
      )[0].title = `Click to block ${tab.title}`;
      tabUrl = tab.url;
    }
    const strUrl = tab.url?.toString().trim();
    if (tab.favIconUrl) {
      tabImg.src = tab.favIconUrl;
    } else if (strUrl) {
      if (strUrl === `chrome-extension://${extensionId}/key-blocked.html`) {
        activeTabIconBtn.remove();
      } else {
        tabImg.src = "/assets/images/earth-globe.png";
      }
    } else {
      activeTabIconBtn.remove();
    }
  });
});

const fetchBlackList = () => {
  currentBlackList = [];
  blackListContainer.innerHTML = "";
  chrome.storage.sync.get(["blockedWords"], (result) => {
    if (result.blockedWords) {
      currentBlackList = result.blockedWords;
      if (currentBlackList.length === 0) {
        blackListDescDiv.style.display = "none";
        blackListContainer.innerHTML = `<span class="w-100 text-center">You are free to browse 🤓</span>`;
      } else {
        blackListDescDiv.style.display = "block";
        let index = 0;
        currentBlackList.forEach((word) => {
          let nodeDiv = document.createElement("div");
          nodeDiv.classList.add("word-badge");
          nodeDiv.title = word;
          let textSpan = document.createElement("span");
          textSpan.classList.add("word-holder");
          textSpan.innerHTML = word;
          let removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.id = `rmv-${index}`;
          removeBtn.innerHTML = '<span class="material-icons"> close </span>';
          removeBtn.onclick = ((val) => {
            return () => {
              const userConfirmation = prompt(
                'Please type "confirm" to remove the key'
              );
              if (
                userConfirmation &&
                userConfirmation.toString() === "confirm"
              ) {
                removeFromList(val);
              }
            };
          })(word);
          nodeDiv.appendChild(textSpan);
          nodeDiv.appendChild(removeBtn);
          blackListContainer.appendChild(nodeDiv);
          index++;
        });
      }
    }
    setScrollEffect(blackListContainer);
  });
};

const setScrollEffect = (elem) => {
  if (
    elem.scrollHeight > elem.clientHeight &&
    !blackListContainer.classList.contains("scrollable-bottom-grad")
  ) {
    blackListContainer.classList.add("scrollable-bottom-grad");
  } else if (blackListContainer.classList.contains("scrollable-bottom-grad")) {
    blackListContainer.classList.remove("scrollable-bottom-grad");
  }
};

const removeFromList = (key) => {
  chrome.storage.sync.set({
    blockedWords: currentBlackList.filter((w) => w !== key),
  });
  fetchBlackList();
};

const showToastMsg = (msg, type) => {
  if (timer === 0) {
    let toast = document.createElement("div");
    if (type.toString() === "success") {
      toast.classList.add("toast-msg-success");
    } else if (type === "error") {
      toast.classList.add("toast-msg-error");
    }
    toast.classList.add("slide-in-top");
    toast.innerHTML = `<span class="material-icons"> ${
      type.toString() === "success" ? "check_circle" : isError(type.toString())
    } </span> ${msg}`;
    bodyElem.appendChild(toast);
    timer = setTimeout(() => {
      toast.classList.add("slide-out-top");
      setTimeout(() => {
        toast.remove();
        clearTimeout(timer);
        timer = 0;
      }, 500);
    }, 1700);
  }
};

const isError = (t) => {
  return t === "error" ? "close" : "";
};

addKeywordsBtn.addEventListener("click", () => {
  const customKey = inputKeyWords.value.toString();
  if (customKey && !currentBlackList.includes(customKey)) {
    if (customKey === `chrome-extension://${extensionId}/key-blocked.html`) {
      showToastMsg("Invalid key", "error");
    } else {
      chrome.storage.sync.set({
        blockedWords: [...currentBlackList, customKey],
      });
      inputKeyWords.value = "";
      fetchBlackList();
    }
  } else if (customKey) {
    showToastMsg("Already added", "success");
  }
});

activeTabIconBtn.addEventListener("click", () => {
  if (tabUrl && !currentBlackList.includes(tabUrl)) {
    chrome.storage.sync.set({
      blockedWords: [...currentBlackList, tabUrl],
    });
    fetchBlackList();
  } else {
    showToastMsg("Already added", "success");
  }
});
