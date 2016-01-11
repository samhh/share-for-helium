var title = 'Share with Helium'

chrome.contextMenus.create({
  'title': title,
  'contexts': [
    'page', 'frame'
  ],
  'onclick': function (obj) {
    sharePage(obj)
  }
})

chrome.contextMenus.create({
  'title': title,
  'contexts': [
    'link'
  ],
  'onclick': function (obj) {
    shareLink(obj)
  }
})

function sharePage(obj) {
  launchHelium(obj.pageUrl)
}

function shareLink(obj) {
  launchHelium(obj.linkUrl)
}

function launchHelium(url) {
  chrome.tabs.update({
    url: 'helium://' + url
  })
}
