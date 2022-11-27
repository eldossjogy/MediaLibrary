const isAttachable = async function (media) {
  isVideo = media => (/\.(mp4|3gp|ogg|wmv|webm|flv|avi*|wav|vob*)$/i).test(media)
  isImage = media => (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(media)
  extension = media => media.match(/\.[0-9a-z]+$/i)[0]

  if (isVideo(media) || isImage(media)) {
    return [true , extension(media)]
  }
  return [false, false]
}

module.exports = { isAttachable };