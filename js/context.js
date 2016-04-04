'use strict'

let title = 'Share with Helium'

chrome.contextMenus.create({
  'title': title,
  'contexts': [
    'page', 'frame'
  ],
  'onclick': (obj) => {
    sharePage(obj)
  }
})

chrome.contextMenus.create({
  'title': title,
  'contexts': [
    'link'
  ],
  'onclick': (obj) => {
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
  console.log(link)
  if (link.includes('twitch.tv')) {
    if (link.includes('/v/')) {
      // Videos
      let length = '/v/'.length
      let strIndex = link.indexOf('/v/')
      let username = link.substring(length + strIndex)

      return `https://player.twitch.tv/?video=v${username}`
    } else {
      // Streams
      let length = 'twitch.tv/'.length
      let strIndex = link.indexOf('twitch.tv/')
      let username = link.substring(length + strIndex)

      return `https://player.twitch.tv/?channel=${username}`
    }
  }
  else return link
}

function launchHelium(url) {
  chrome.tabs.update({
    url: `helium://${url}`
  })
}
