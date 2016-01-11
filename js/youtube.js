var title = 'Share with Helium'

var el = document.getElementsByClassName('addto-watch-later-button')

for (var i = 0; i < el.length; i++) {
  var videoID = el[i].getAttribute('data-video-ids')

  var insertedHTML = '<a href="helium://https://www.youtube.com/watch?v=' + videoID + '"><button class="sfh__youtube__share-in-thumbnail yt-uix-button yt-uix-button-size-small yt-uix-button-default">' + title + '</button></a>'

  el[i].insertAdjacentHTML('afterend', insertedHTML)
}
