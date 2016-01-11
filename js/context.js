chrome.contextMenus.create({
  'title': 'Share with Helium',
  'contexts': [
    'all'
  ],
  'onclick': shareWithHelium
})

function shareWithHelium() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    chrome.tabs.update({
      url: 'helium://' + tabs[0].url
    })
  })
}
