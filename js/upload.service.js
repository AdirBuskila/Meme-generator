'use strict'

function onImgInput(ev) {
    loadImageFromInput(ev, renderUploadedMeme)
}

function loadImageFromInput(ev, onImageReady) {
    var reader = new FileReader()

    reader.onload = (event) => {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}


function renderUploadedMeme(img) {
    const elMeme = createMeme()
    const elImg = createImg(img.src, elMeme.selectedImgId)
    gMeme.push(elMeme)
    gImgs.push(elImg)
    renderMeme(elMeme.selectedImgId)

}