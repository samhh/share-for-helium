'use strict'

// Chrome doesn't support NodeList.prototype[Symbol.iterator] natively yet - this is a dead easy fix for that to allow for..of loops on NodeLists
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

let title = 'Share with Helium'

let triggeredClassName = 'sfh--triggered'
let targetQuery = `.addto-button:not(.${triggeredClassName})`

// Run once on page load
addButtons(document.querySelectorAll(targetQuery))

// Watch for any new videos that are loaded and add button to them too
let observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    // Only continue if mutation is to tree of nodes
    if (mutation.type !== 'childList') break

    for (let node of mutation.addedNodes) {
      // Only continue if node is an element
      if (node.nodeType !== 1) break

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
    if (vid.nodeType !== 1) break

    let videoID = vid.dataset.videoIds

    let insertedHTML = `
      <a href="helium://https://www.youtube.com/watch?v=${videoID}" class="sfh__youtube__share-in-thumbnail-anchor">
        <button class="sfh__youtube__share-in-thumbnail yt-uix-button yt-uix-button-size-small yt-uix-button-default">${title}</button>
      </a>
    `

    vid.insertAdjacentHTML('afterend', insertedHTML)

    // Tag video thumbnail as having been found previously for future runs
    vid.classList.add(triggeredClassName)
  }
}
