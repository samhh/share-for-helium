'use strict'

const title = 'Share with Helium'

const triggeredClassName = 'sfh--triggered'
const targetClass = 'addto-button'
const targetQuery = `.${targetClass}:not(.${triggeredClassName})`

const insertAfter = (newNode, refNode) => {
  refNode.parentNode.insertBefore(newNode, refNode.nextSibling)
}

const isWatchingVid = loc => (loc.pathname + loc.search).substring(0, 9) === '/watch?v='

const addPlayerBtn = () => {
  const isPrimaryVid = isWatchingVid(window.location)
  if (!isPrimaryVid) return

  const menuEl = document.querySelector('#action-panel-overflow-menu')
  if (!menuEl) return

  let newListItemEl = document.createElement('a')
  newListItemEl.className = 'yt-ui-menu-item'
  newListItemEl.href = `helium://${window.location.href}`
  newListItemEl.textContent = title

  menuEl.appendChild(newListItemEl)

  // Tag menu as having been found previously for future runs
  menuEl.classList.add(triggeredClassName)
}
// Run once on page load
addPlayerBtn()

// Add button to each of an array of nodes
const addThumbBtn = refNode => {
  // Don't run against the same node more than once
  if (refNode.classList.contains(triggeredClassName)) return

  const videoID = refNode.dataset.videoIds

  let newHoverBtnEl = document.createElement('a')
  newHoverBtnEl.className = 'sfh__youtube__share-in-thumbnail yt-uix-button yt-uix-button-size-small yt-uix-button-default'
  newHoverBtnEl.href = `helium://https://www.youtube.com/watch?v=${videoID}`
  newHoverBtnEl.textContent = title

  insertAfter(newHoverBtnEl, refNode)

  // Tag video thumbnail as having been found previously for future runs
  refNode.classList.add(triggeredClassName)
}

// Watch for any new dom elements that are loaded and add button to them too if appropriate
// This is important given how YouTube lazy loads and behaves as a SPA
let observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    // Only proceed if mutation is to tree of nodes
    if (mutation.type !== 'childList') continue

    for (const node of mutation.addedNodes) {
      // Only proceed if node is an element
      if (node.nodeType !== 1) continue

      // It's the player menu?
      const playerMenuEl = node.querySelector('#action-panel-overflow-menu')
      if (playerMenuEl && !playerMenuEl.classList.contains(triggeredClassName)) addPlayerBtn()

      // It's a thumbnail?
      const thumbEls = node.querySelectorAll(targetQuery)
      if (thumbEls.length) thumbEls.forEach(thumbEl => addThumbBtn(thumbEl))
      else if (node.classList.contains(targetClass)) addThumbBtn(node)
    }
  }
})

observer.observe(document, {
  childList: true,
  subtree: true
})
