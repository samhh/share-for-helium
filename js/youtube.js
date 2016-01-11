'use strict'

let title = 'Share with Helium'

let el = document.getElementsByClassName('addto-watch-later-button')

for (let i = 0; i < el.length; i++) {
  let videoID = el[i].getAttribute('data-video-ids')

  let insertedHTML = `
    <a href="helium://https://www.youtube.com/watch?v=${videoID}">
      <button class="sfh__youtube__share-in-thumbnail yt-uix-button yt-uix-button-size-small yt-uix-button-default">${title}</button>
    </a>
  `

  el[i].insertAdjacentHTML('afterend', insertedHTML)
}
