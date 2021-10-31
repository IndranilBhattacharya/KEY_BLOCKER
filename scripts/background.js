chrome.tabs.onUpdated.addListener((activeTabId, activeInfo) => {
  const url = activeInfo.url;
  if (!url) {
    return;
  } else {
    processKeys(url.toString(), activeTabId);
  }
});

const processKeys = (urlString, id) => {
  if (!urlString.endsWith("key-blocked.html")) {
    chrome.storage.sync.get(["blockedWords"], (result) => {
      if (result.blockedWords) {
        const blackListKeys = result.blockedWords;
        const filteredKeys = blackListKeys.filter((k) =>
          urlString.toLowerCase().includes(k?.toLowerCase())
        );
        if (filteredKeys.length > 0) {
          const sinceTime = new Date().getTime() - 100;
          removeBlockedRecord(sinceTime);
          chrome.tabs.update(id, { url: "key-blocked.html" }, () => {
            chrome.storage.local.set({
              blockedKeys: filteredKeys,
            });
          });
        }
      }
    });
  }
};

const removeBlockedRecord = (time) => {
  chrome.browsingData.removeHistory(
    {
      since: time,
      originTypes: {
        protectedWeb: true,
      },
    },
    () => {
      return;
    }
  );
};
