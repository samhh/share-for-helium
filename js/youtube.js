'use strict'

let title = 'Share with Helium'

// Check for video thumbnails again when accessing new page, call once on load
// Done this way as YouTube works as a SPA and spfdone is called on page change
// Not checking for page name as needs to run again on "refresh" anyway
document.addEventListener('spfdone', function() {
  addButtons(document.getElementsByClassName('addto-button'))
})

// Run once on page load
addButtons(document.getElementsByClassName('addto-button'))

function addButtons(vids) {
  if (vids.length === 0) return

  for (let i = 0; i < vids.length; i++) {
    let triggeredClassName = 'sfh--triggered'

    // Exit loop if provided object isn't an element or if the element has already been accessed
    if (vids[i].nodeType !== 1 || vids[i].classList.contains(triggeredClassName)) return

    let videoID = vids[i].getAttribute('data-video-ids')

    let insertedHTML = `
      <a href="helium://https://www.youtube.com/watch?v=${videoID}" class="sfh__youtube__share-in-thumbnail-anchor">
        <button class="sfh__youtube__share-in-thumbnail yt-uix-button yt-uix-button-size-small yt-uix-button-default">${title}</button>
      </a>
    `

    vids[i].insertAdjacentHTML('afterend', insertedHTML)

    // Tag video thumbnail as having been found previously for future runs
    vids[i].classList.add(triggeredClassName)
  }
}
