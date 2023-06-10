const userPlayslist = JSON.parse(localStorage.getItem('userPlaylists')) || []

let musicToAddPlaylist

const setMusicToAddPlayList = (card) => {
    const getMusicToAddDirectory = card.querySelector('[data-audio]').getAttribute('src')
    if(getMusicToAddDirectory && typeof getMusicToAddDirectory == "string"){
        musicToAddPlaylist = getMusicToAddDirectory
    }
}

const getUserPlayLists = () => {
    return userPlayslist
}

const savePlayList = (nameFromPlayList) => {
    const playLis = {
        'id': idGenerate(),
        'name': `${nameFromPlayList}`,
        'musics': []
    }
    userPlayslist.push(playLis)
    creatPlaylistInScreen(nameFromPlayList)
    saveInBrowser()
}

const saveInBrowser = () => {
    localStorage.setItem("userPlaylists", JSON.stringify(userPlayslist))
}

const idGenerate = () => {
    const id = userPlayslist[userPlayslist.length -1] ? userPlayslist[userPlayslist.length -1].id + 1 : 1
    return id
}

const deletePlayList = (id) => {
    const itemToRemove = userPlayslist.findIndex( element => element.id == id)
    userPlayslist.splice(itemToRemove, 1)
    saveInBrowser()
}

const addMusicToPlaylis = (playlistId) => {
    const playlist = userPlayslist.findIndex( element => element.id == playlistId)
    userPlayslist[playlist].musics.push(musicToAddPlaylist)
    saveInBrowser()
    clearFlooatingCard()
}

const removeMusicFromPlaylist = (musicCard) => {
    const getMusicId = parseInt(musicCard.querySelector('[data-audio]').id) 
    const playlistName = getPlayLisActive().innerText
    if(playlistName != undefined){
        const playlist = userPlayslist.findIndex( element => element.name == playlistName)
        userPlayslist[playlist].musics.splice(getMusicId, 1)
        musicCard.style.display = 'none'
        musciPause()
        saveInBrowser()
    }
    
    
}

const clearFlooatingCard = () => {
    const card = document.querySelector('[data-floating-card]')
    card.innerHTML = ''
}