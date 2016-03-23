'use strict'

let title = 'Share with Helium'

// Run once on page load
addButtons(document.querySelectorAll('.addto-button'))

// Watch for any new videos that are loaded and add button to them too
let observer = new MutationObserver(function(mutations) {
  let once = false

  mutations.forEach(function(mutation) {
    // Only continue if mutation is to tree of nodes
    if (mutation.type !== 'childList') return

    Array.from(mutation.addedNodes).forEach(function(node) {
      // Only continue if node is an element
      if (node.nodeType !== 1) return

      console.log(node)

      if (node.querySelectorAll('.addto-button')) addButtons(node.querySelectorAll('.addto-button'))
    })
  })
})

observer.observe(document, {
  childList: true,
  subtree: true
})

// Add button to each of an array of nodes
function addButtons(vids) {
  if (!vids) return

  Array.from(vids).forEach((vid) => {
    let triggeredClassName = 'sfh--triggered'

    // Exit loop if provided object isn't an element or if the element has already been accessed
    if (vid.nodeType !== 1 || vid.classList.contains(triggeredClassName)) return

    let videoID = vid.getAttribute('data-video-ids')

    let insertedHTML = `
      <a href="helium://https://www.youtube.com/watch?v=${videoID}" class="sfh__youtube__share-in-thumbnail-anchor">
        <button class="sfh__youtube__share-in-thumbnail yt-uix-button yt-uix-button-size-small yt-uix-button-default">${title}</button>
      </a>
    `

    vid.insertAdjacentHTML('afterend', insertedHTML)

    // Tag video thumbnail as having been found previously for future runs
    vid.classList.add(triggeredClassName)
  })
}
