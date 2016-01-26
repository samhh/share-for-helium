'use strict'

let title = 'Share with Helium'

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
  let link = magicRedirect(obj.pageUrl)
  launchHelium(link)
}

function shareLink(obj) {
  let link = magicRedirect(obj.linkUrl)
  launchHelium(link)
}

function magicRedirect(link) {
  if (link.includes('twitch.tv')) {
    let length = 'twitch.tv/'.length
    let strIndex = link.indexOf('twitch.tv/')

    let username = link.substring(length + strIndex)

    return `http://player.twitch.tv/?channel=${username}`
  }
  else {
    return link
  }
}

function launchHelium(url) {
  chrome.tabs.update({
    url: `helium://${url}`
  })
}
