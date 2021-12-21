'use strict'

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'awkward'] }, { id: 2, url: 'img/2.jpg', keywords: ['funny', 'dog'] }, { id: 3, url: 'img/3.jpg', keywords: ['funny', 'awkward'] }, { id: 4, url: 'img/4.jpg', keywords: ['funny', 'cat'] }, { id: 5, url: 'img/5.jpg', keywords: ['funny', 'baby'] }, { id: 6, url: 'img/6.jpg', keywords: ['funny', 'happy'] }, { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby'] }, { id: 8, url: 'img/8.jpg', keywords: ['funny', 'awkward'] }, { id: 9, url: 'img/9.jpg', keywords: ['evil', 'baby'] }, { id: 10, url: 'img/10.jpg', keywords: ['funny', 'happy'] }];
var gMeme = [{
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
        txt: 'I cant tell you much but',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false
    }]
}, {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [{
        txt: 'Aint nobody got time for that',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}, {
    selectedImgId: 3,
    selectedLineIdx: 0,
    lines: [{
        txt: 'i dont get liquidated often',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}, {
    selectedImgId: 4,
    selectedLineIdx: 0,
    lines: [{
        txt: '',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}, {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{
        txt: '',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}, {
    selectedImgId: 6,
    selectedLineIdx: 0,
    lines: [{
        txt: '',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}, {
    selectedImgId: 7,
    selectedLineIdx: 0,
    lines: [{
        txt: '',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}, {
    selectedImgId: 8,
    selectedLineIdx: 0,
    lines: [{
        txt: '',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}, {
    selectedImgId: 9,
    selectedLineIdx: 0,
    lines: [{
        txt: '',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}, {
    selectedImgId: 10,
    selectedLineIdx: 0,
    lines: [{
        txt: '',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'impact',
        x: 230,
        y: 80,
        isDrag: false

    }]
}]

function addLine() {
    const line = document.querySelector("input.line-input").value
    const elLine = {
        txt: line,
        size: 30,
        align: 'center',
        color: '#ffffff',
        x: gCanvas.width / 2,
        y: gCanvas.height / 2,
    }
    gCurrMeme.lines.push(elLine)
    gCurrMeme.selectedLineIdx = gCurrMeme.lines.length - 1
    renderMeme(gCurrMeme.selectedImgId)
}

function deleteLine() {
    gCurrMeme.lines.splice(gCurrMeme.selectedLineIdx, 1);
    gCurrMeme.selectedLineIdx = gCurrMeme.lines.length - 1
    renderMeme(gCurrMeme.selectedImgId)
}

function createMeme() {
    return {
        selectedImgId: gImgs.length + 1,
        selectedLineIdx: 0,
        lines: [{
            txt: '',
            size: 30,
            align: 'left',
            color: '#ffffff',
            font: 'impact',
            x: 230,
            y: 80,
            isDrag: false
        }]
    }
}

function createImg(url, id) {
    return {
        id: id,
        url,
        keywords: []
    }
}