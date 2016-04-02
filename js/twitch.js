'use strict'

// Chrome doesn't support NodeList.prototype[Symbol.iterator] natively yet - this is a dead easy fix for that to allow for..of loops on NodeLists
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

let title = 'Share with Helium'

let triggeredClassName = 'sfh--triggered'
let streamThumbClassName = 'sfh__thumb--stream'
let vidThumbClassName = 'sfh__thumb--video'
let targetStreams = `.streams .stream .content .thumb .cap:not(.${triggeredClassName})`
let targetVids = `.videos .video .content .thumb .cap:not(.${triggeredClassName})`

// Run through each once on page load
addButtons(document.querySelectorAll('streams', targetStreams))
addButtons(document.querySelectorAll('vids', targetVids))

// Watch for any new videos that are loaded and add button to them too
let observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    // Only continue if mutation is to tree of nodes
    if (mutation.type !== 'childList') continue

    for (let node of mutation.addedNodes) {
      // Only continue if node is an element
      if (node.nodeType !== 1) continue

      let targetStreamsLookup = node.querySelectorAll(targetStreams)
      if (targetStreamsLookup) addButtons('streams', targetStreamsLookup)

      let targetVidsLookup = node.querySelectorAll(targetVids)
      if (targetVidsLookup) addButtons('vids', targetVidsLookup)
    }
  }
})

observer.observe(document, {
  childList: true,
  subtree: true
})

// Add button to each of an array of nodes
function addButtons (type, vids) {
  if (type !== 'streams' && type !== 'vids') return console.error(`SFH bad type provided: ${type}`)

  if (!vids) return

  for (let vid of vids) {
    // Only continue if node is an element
    if (vid.nodeType !== 1) continue

    let thisThumb = type === 'streams' ? streamThumbClassName : vidThumbClassName

    let magicLink
    if (type === 'streams') {
      let length = 'twitch.tv/'.length
      let strIndex = vid.href.indexOf('twitch.tv/')
      let username = vid.href.substring(length + strIndex)

      magicLink = `https://player.twitch.tv/?channel=${username}`
    } else {
      let length = '/v/'.length
      let strIndex = vid.href.indexOf('/v/')
      let videoId = vid.href.substring(length + strIndex)

      magicLink = `https://player.twitch.tv/?video=v${videoId}`
    }

    let insertedHTML = `
      <a href="helium://${magicLink}" class="${thisThumb}">
        ${title}
      </a>
    `

    vid.insertAdjacentHTML('afterbegin', insertedHTML)

    let insertedEl = vid.querySelector(`.${thisThumb}`)

    insertedEl.addEventListener('click', (e) => {
      // Prevent some other event handler on Twitch from taking us to the URL of the video below our button
      e.stopImmediatePropagation()
    })

    // Tag video thumbnail as having been found previously for future runs
    vid.classList.add(triggeredClassName)
  }
}
