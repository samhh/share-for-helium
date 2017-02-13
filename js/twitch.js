'use strict'

const insertAfter = (newNode, refNode) => {
  refNode.parentNode.insertBefore(newNode, refNode.nextSibling)
}

const title = 'Share with Helium'

const triggeredClassName = 'sfh--triggered'
const streamThumbClassName = 'sfh__thumb--stream'
const vidThumbClassName = 'sfh__thumb--video'
const targetStreams = `.streams .stream .content .thumb .cap:not(.${triggeredClassName})`
const targetVids = `.videos .video .content .thumb .cap:not(.${triggeredClassName})`

// Add button to each of an array of nodes
const addButtons = (type, vids) => {
  if (!['streams', 'vids'].includes(type)) return console.error(`SFH bad type provided: ${type}`)

  if (!vids) return

  for (const vid of vids) {
    // Only proceed if node is an element
    if (vid.nodeType !== 1) continue

    const key = type === 'streams' ? 'twitch.tv/' : '/v/'
    const strIndex = vid.href.indexOf(key)
    const id = vid.href.substring(key.length + strIndex)

    const magicLink = (type === 'streams' ? 'https://player.twitch.tv/?channel=' : 'https://player.twitch.tv/?video=v') + id

    let newBtnEl = document.createElement('a')
    newBtnEl.className = type === 'streams' ? streamThumbClassName : vidThumbClassName
    newBtnEl.href = `helium://${magicLink}`
    newBtnEl.textContent = title

    console.log(vid)
    insertAfter(newBtnEl, vid)

    // Tag thumbnail as having been found previously for future runs
    vid.classList.add(triggeredClassName)
  }
}

// Run through each once on page load
addButtons('streams', document.querySelectorAll(targetStreams))
addButtons('vids', document.querySelectorAll(targetVids))

// Watch for any new videos that are loaded and add button to them too
let observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // Only proceed if mutation is to tree of nodes
    if (mutation.type !== 'childList') continue

    for (const node of mutation.addedNodes) {
      // Only proceed if node is an element
      if (node.nodeType !== 1) continue

      const targetStreamsLookup = node.querySelectorAll(targetStreams)
      if (targetStreamsLookup.length) addButtons('streams', targetStreamsLookup)

      const targetVidsLookup = node.querySelectorAll(targetVids)
      if (targetVidsLookup.length) addButtons('vids', targetVidsLookup)
    }
  }
})

observer.observe(document, {
  childList: true,
  subtree: true
})

// Static and featured videos
// let channelVid = document.querySelector('#subscribe_button')
// if (channelVid) {
//   let insertedHTML = `
//     <a href="helium://TODO" class="button primary">Share with Helium</a>
//   `
//
//   channelVid.insertAdjacentHTML('afterend', insertedHTML)
// }
