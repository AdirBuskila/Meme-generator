'use strict'

var gNextId
var memeKeys

function saveToStorage(key, val) {
    localStorage.setItem(key, val)
}

function saveToStorageJs(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}


function saveMeme() {
    gSaveMode = true
    renderMeme(gCurrMeme.selectedImgId)
    const data = gCanvas.toDataURL();
    if (memeKeys.length <= 0) {
        gNextId = 101
    }
    memeKeys.push(gNextId)
    saveToStorageJs('MemeKeys', memeKeys)
    saveToStorage(gNextId++, data)
    gSaveMode = false
    renderMeme(gCurrMeme.selectedImgId)
    showMsg()
}

function loadMeme() {
    hideExtras()
    hideGallery()
    hideAbout()
    const MemeKeys = loadFromStorage('MemeKeys')
    const MemeBar = document.querySelector('.meme-bar')
    const strHTMLs = MemeKeys.map(key => {
        return `<div class="meme"><img src="${localStorage.getItem(key)}"></img><button class="delete-meme" onclick="deleteMeme(${key})">Delete</button></div>`
    })
    MemeBar.innerHTML = strHTMLs.join('')
    document.querySelector('.meme-bar-container').style.display = 'block'
}

function deleteMeme(id) {
    const idx = memeKeys.indexOf(id)
    console.log('memeKeys :>> ', memeKeys);
    console.log('idx :>> ', idx);
    memeKeys.splice(idx, 1)
    saveToStorageJs('MemeKeys', memeKeys)
    loadMeme()
}