chrome.tabs.onUpdated.addListener((activeTabId, activeInfo) => {
  const url = activeInfo.url;
  if (!url) {
    return;
  } else {
    processKeys(url.toString(), activeTabId);
  }
});

chrome.runtime.setUninstallURL(
  "https://docs.google.com/forms/d/e/1FAIpQLSdR1FwGwYqUt1qeA6mdTcIZVbhh8PgCt1sKUEwJbBZzI7KgGw/viewform?usp=pp_url",
  () => {
    return;
  }
);

const processKeys = (urlString, id) => {
  if (!urlString.endsWith("key-blocked.html")) {
    chrome.storage.sync.get(["blockedWords"], (result) => {
      if (result.blockedWords) {
        const blackListKeys = result.blockedWords;
        const filteredKeys = blackListKeys.filter((k) =>
          urlString.toLowerCase().includes(k?.toLowerCase())
        );
        if (filteredKeys.length > 0) {
          const blockedUrl = chrome.runtime.getURL("key-blocked.html");
          chrome.tabs.update(id, { url: blockedUrl }, () => {
            chrome.storage.local.set({
              blockedKeys: filteredKeys,
            });
          });
        }
      }
    });
  }
};
