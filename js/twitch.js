'use strict'

// Chrome doesn't support NodeList.prototype[Symbol.iterator] natively yet - this is a dead easy fix for that to allow for..of loops on NodeLists
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

let title = 'Share with Helium'

let triggeredClassName = 'sfh--triggered'
let thumbClassName = 'sfh__thumb'
let targetQuery = `.streams .stream .content .thumb .cap:not(.${triggeredClassName}), .videos .video .content .thumb .cap:not(.${triggeredClassName})`

// Run once on page load
addButtons(document.querySelectorAll(targetQuery))

// Watch for any new videos that are loaded and add button to them too
let observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    // Only continue if mutation is to tree of nodes
    if (mutation.type !== 'childList') continue

    for (let node of mutation.addedNodes) {
      // Only continue if node is an element
      if (node.nodeType !== 1) continue

      let targetLookup = node.querySelectorAll(targetQuery)

      if (targetLookup) addButtons(targetLookup)
    }
  }
})

observer.observe(document, {
  childList: true,
  subtree: true
})

// Add button to each of an array of nodes
function addButtons (vids) {
  if (!vids) return

  for (let vid of vids) {
    // Only continue if node is an element
    if (vid.nodeType !== 1) continue

    let length = 'twitch.tv/'.length
    let strIndex = vid.href.indexOf('twitch.tv/')

    let username = vid.href.substring(length + strIndex)

    let magicLink = `https://player.twitch.tv/?channel=${username}`

    let insertedHTML = `
      <a href="helium://${magicLink}" class="${thumbClassName}">
        ${title}
      </a>
    `

    vid.insertAdjacentHTML('afterbegin', insertedHTML)

    let insertedEl = vid.querySelector(`.${thumbClassName}`)

    insertedEl.addEventListener('click', (e) => {
      // Prevent some other event handler on Twitch from taking us to the URL of the video below our button
      e.stopImmediatePropagation()
    })

    // Tag video thumbnail as having been found previously for future runs
    vid.classList.add(triggeredClassName)
  }
}
