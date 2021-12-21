'use strict'
var gCurrMeme
var gCanvas;
var gCtx;
var gSaveMode = false
var elLineInput;
var elFontSize
var elFontColor
var elFonts
var elDataFilterInput
var gFilterBy = 'All'
var gStartPos
var gDragIsOn
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {
    memeKeys = loadFromStorage('MemeKeys')
    if (memeKeys) {
        gNextId = memeKeys[memeKeys.length - 1] + 1
    } else if (!memeKeys) {
        memeKeys = []
        gNextId = 101
    }
    elDataFilterInput = document.querySelector('.keywords')
    elFonts = document.querySelector('.fonts')
    elLineInput = document.querySelector('.line-input')
    elFontColor = document.querySelector('.font-color')
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
    hideMsg()
    hideAbout()
    hideExtras()
    resizeCanvas()
    renderGallery()
    addListeners()
}

// Add Listeners

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    elLineInput.addEventListener('input', updateLine)
    elFontColor.addEventListener('input', updateFontColor)
    elFonts.addEventListener('input', updateLineFont)
    elDataFilterInput.addEventListener('input', renderGallery)
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderMeme(gCurrMeme.selectedImgId)
    })

}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}


function onDown(ev) {
    const meme = getCurrMeme()
    const pos = getEvPos(ev)
    meme.lines[meme.selectedLineIdx].isDrag = true
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onUp() {
    const meme = getCurrMeme()
    document.body.style.cursor = 'grab'
    meme.lines[meme.selectedLineIdx].isDrag = false
}

function onMove(ev) {
    document.body.style.cursor = 'context-menu'
    const line = getSelectedLine()
    const lineSize = line.size
    const lineY = line.y
    const lineX = line.x
    const textMet = gCtx.measureText(line.txt);
    if (ev.offsetX >= lineX - textMet.actualBoundingBoxLeft - 10 && ev.offsetX <= lineX + (textMet.width / 2) + 10 && ev.offsetY >= lineY - textMet.actualBoundingBoxDescent - 15 && ev.offsetY <= lineY + lineSize) {
        document.body.style.cursor = 'grab'
        const meme = getCurrMeme()
        if (!meme.lines[meme.selectedLineIdx].isDrag) return
        document.body.style.cursor = 'grabbing'
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveLine(dx, dy)
        gStartPos = pos
        renderMeme(gCurrMeme.selectedImgId)
    } else if (ev.changedTouches[0].clientX >= lineX - textMet.actualBoundingBoxLeft && ev.changedTouches[0].clientX <= lineX + textMet.width - 10 && ev.changedTouches[0].clientY >= lineY + lineSize && ev.changedTouches[0].clientY <= textMet.width - lineSize) {
        const meme = getCurrMeme()
        if (!meme.lines[meme.selectedLineIdx].isDrag) return
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        moveLine(dx, dy)
        gStartPos = pos
        renderMeme(gCurrMeme.selectedImgId)
    } else {
        document.body.style.cursor = 'default'
    }
}

function moveLine(dx, dy) {
    const meme = getCurrMeme()
    meme.lines[meme.selectedLineIdx].x += dx
    meme.lines[meme.selectedLineIdx].y += dy
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function renderGallery() {
    const imgs = getImgs()
    const strHTMLs = imgs.map(img => {
        return `<img class="meme-gallery" onclick="renderMeme(${img.id})" src="img/${img.id}.jpg"></img>`
    })
    document.querySelector('.gallery').innerHTML = strHTMLs.join('')

}
/// RENDER MEME ////////////////////////////////////////////////////////////////////////////////////////////////////
function renderMeme(id) {
    showEditor()
    const IMG = getImgById(id)
    const MEME = getMemeById(id)
    gCurrMeme = MEME
    var img = new Image()
    img.src = `${IMG.url}`;
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    addLines(MEME)
    renderLine()
    renderFontColor()
    if (!gSaveMode) {
        highlightSelected()
    }
}

function addLines(meme) {
    const lines = meme.lines
    lines.forEach((line) => {
        gCtx.textBaseline = 'middle';
        gCtx.textAlign = line.align;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.fillStyle = line.color;
        gCtx.fillText(line.txt, line.x, line.y);
    });

}

function changeLineAlign(str) {
    const line = getSelectedLine()
    if (str === 'center') {
        line.align = 'center'
    } else if (str === 'right') {
        line.align = 'right'
    } else if (str === 'left') {
        line.align = 'left'
    }
    renderMeme(gCurrMeme.selectedImgId)
}

function highlightSelected() {
    const line = getSelectedLine()
    const x = line.x
    const y = line.y
    const size = line.size
    const textMet = gCtx.measureText(line.txt);
    console.log('textMet.width :>> ', textMet.width);
    gCtx.beginPath();
    gCtx.setLineDash([4, 2]);
    gCtx.rect(x - textMet.actualBoundingBoxLeft - 10, y - textMet.actualBoundingBoxDescent - 15, textMet.width + 20, size * 2);
    gCtx.strokeStyle = 'red';
    gCtx.stroke();
}

function renderFilteredGallery() {

}

function getFilteredImgs() {
    const filterBy = elDataFilterInput.value
    const filteredImg = gImgs.filter(img => {
        if (img.keywords[0] === filterBy) {
            return img
        }
        if (img.keywords[1] === filterBy) {
            return img
        }
    })
    return filteredImg
}

function showEditor() {
    document.querySelector('.gallery').style.display = 'none'
    document.querySelector('.dash-board').style.display = 'none'
    document.querySelector('.meme-editor').style.display = 'flex'
}

function hideExtras() {
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.meme-bar-container').style.display = 'none'
}

function showGallery() {
    hideAbout()
    hideExtras()
    document.querySelector('.gallery-container').style.display = 'block'
    document.querySelector('.dash-board').style.display = 'block'
}

function switchLine() {
    const numOfLines = gCurrMeme.lines.length
    gCurrMeme.selectedLineIdx += 1
    if (gCurrMeme.selectedLineIdx > numOfLines - 1) {
        gCurrMeme.selectedLineIdx = 0
    }
    renderLine()
    renderMeme(gCurrMeme.selectedImgId)
}

// UTILS 

function downloadImg() {
    gSaveMode = true
    renderMeme(gCurrMeme.selectedImgId)
    var imgContent = gCanvas.toDataURL('image/jpeg')
    const elLink = document.querySelector('a.btn')
    elLink.href = imgContent
    gSaveMode = false
}


function updateFontColor(e) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].color = e.target.value;
    renderMeme(gCurrMeme.selectedImgId)
}

function renderFontColor() {
    const form = document.getElementById("form-color");
    const selectedLine = gCurrMeme.selectedLineIdx
    form.elements[0].value = gCurrMeme.lines[selectedLine].color
}

function updateFontSize(e) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].size = e.target.value;
    renderMeme(gCurrMeme.selectedImgId)
}

function updateLine(e) {
    gCurrMeme.lines[gCurrMeme.selectedLineIdx].txt = e.target.value;
    renderMeme(gCurrMeme.selectedImgId)
}

function renderLine() {
    const form = document.getElementById("form-input");
    const selectedLine = gCurrMeme.selectedLineIdx
    form.elements[0].value = gCurrMeme.lines[selectedLine].txt
}

function getImgs() {
    const imgs = getFilteredImgs()
    if (imgs.length <= 0) {
        return gImgs
    } else if (imgs.length > 0) {
        return imgs
    }
}

function getImgById(id) {
    const img = gImgs.find(img => {
        return img.id === id
    })
    return img
}

function getMemeById(id) {
    const MEME = gMeme.find(meme => {
        return meme.selectedImgId === id
    })
    return MEME
}

function updateLineFont() {
    const meme = getCurrMeme()
    meme.lines[meme.selectedLineIdx].font = elFonts.value
    renderMeme(meme.selectedImgId)

}

function setFontSize() {
    const size = gCurrMeme.lines[gCurrMeme.selectedLineIdx].size
    document.getElementById("form-font-size").elements[0].value = size
}

function increaseFontSize() {
    const meme = getCurrMeme()
    meme.lines[meme.selectedLineIdx].size += 2
    renderMeme(meme.selectedImgId)
}

function decreaseFontSize() {
    const meme = getCurrMeme()
    meme.lines[meme.selectedLineIdx].size -= 2
    renderMeme(meme.selectedImgId)
}

function lineUp() {
    const line = getSelectedLine()
    line.y -= 5
    renderMeme(gCurrMeme.selectedImgId)
}

function lineDown() {
    const line = getSelectedLine()
    line.y += 5
    renderMeme(gCurrMeme.selectedImgId)
}

function hideGallery() {
    document.querySelector('.gallery-container').style.display = 'none'
    document.querySelector('.dash-board').style.display = 'none'
}


function getCurrMeme() {
    return gCurrMeme
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas')
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}

function showMsg() {
    document.querySelector('.dash-board').style.display = 'block'
    document.querySelector('.msg').classList.add('open')
    setTimeout(() => {
        document.querySelector('.msg').classList.remove('open')
        document.querySelector('.dash-board').style.display = 'none'

    }, 1300)
}

function showAbout() {
    hideGallery()
    hideExtras()
    document.querySelector('.about').style.display = 'grid'

}

function hideAbout() {
    document.querySelector('.about').style.display = 'none'

}

function getSelectedLine() {
    return gCurrMeme.lines[gCurrMeme.selectedLineIdx]
}

function hideMsg() {
    document.querySelector('.msg').style.display = 'none'
}