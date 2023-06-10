const playListSection = document.querySelector('[data-play-list-section]')
const playsListContainer = document.querySelector('[data-play-list-container]')
const openPlaylistCreatorCard = document.querySelector('[data-open-playlist-create]')
const floatingCard = document.querySelector('[data-floating-card]')

let playListActive

const setPlayListActive = (playList) => {
    playListActive = playList
}

const getPlayLisActive = () => {
    return playListActive
}

const addStylePlayListCard = (event) => {
    const objClicked = event.target
    objClicked.parentNode.classList.toggle('card_play_list_active')
    setPlayListActive(objClicked.parentNode)
}

const removeStylePlayListCard = () => {
    getPlayLisActive() ? getPlayLisActive().classList.remove('card_play_list_active') : 0
}

const loadUserPLayLists = () => {
    const array = getUserPlayLists()
    for(let i = 0; i < array.length; i++){
        creatPlaylistInScreen(array[i].name, array[i].id)
    }
    activateDeletePLayList()
}

const creatPlaylistInScreen = (name, id) => {
    playsListContainer.innerHTML += `
            <div class="card_play_list-item">
                <h3 class="card_play_list-titulo">
                    ${name}
                </h3>
                <button class="delet_play_list" value="${id}"></button>
            </div>
        `
}

const activateDeletePLayList = () => {
    playsListContainer.addEventListener('click', event => {
        const elementClickd = event.target
        const elementClickdTagName = elementClickd.tagName
        if(elementClickdTagName == 'BUTTON'){
            confirmDeletePlayList(elementClickd)
        }
    })
}

const confirmDeletePlayList = (elementClickd) => {
    openConfirmDeleteCard()
    closeBntConfirmDeleteCard()
    DeletePlayList(elementClickd)
}

const openConfirmDeleteCard = () => {
    const container = floatingCard
    container.innerHTML = `
        <div class="black_background" data-black-background>
            <div class="confirm">
                <h3 class="confirm-titulo">Confirme</h3>
                <div>
                    <button class="confirm-bnt confirm-bnt_yes" data="confirm-bnt_yes">SIM</button>
                    <button class="confirm-bnt confirm-bnt_no" data="confirm-bnt_no">NÃO</button>
                </div>
            </div>
        </div>
    `
} 

const closeBntConfirmDeleteCard = () => {
    const bntClose = document.querySelector('[data="confirm-bnt_no"]')
    bntClose.addEventListener('click', event =>  {
        closeConfirmDeleteCard()
    })
}

const closeConfirmDeleteCard = () => {
    floatingCard.firstChild.nextElementSibling.remove()
}

const DeletePlayList = (elementClickd) => {
    const bntDelete = document.querySelector('[data="confirm-bnt_yes"]')
    bntDelete.addEventListener('click', event => {
        const id = elementClickd.value
        deletePlayList(id)
        elementClickd.parentNode.remove()
        closeConfirmDeleteCard()
    })
}

loadUserPLayLists()
const playListActiveDefault = document.querySelector('[data-card-play-list-item-default]')
setPlayListActive(playListActiveDefault)

playListSection.addEventListener('click', event => {
    const objName = event.target.tagName
    if(objName == "H3") {
        getFullMode() ? bntChangePlayer.click() : 0
        removeStylePlayListCard()
        addStylePlayListCard(event)
        loadMusicsFromTheSelectedPlaylist(event)
    }
})

const loadMusicsFromTheSelectedPlaylist = (event) => {
    const searchElement = event.target.innerText
    const index = userPlayslist.findIndex(element => element.name == searchElement)
    if(index != -1){
        const list = userPlayslist[index].musics
        const listToLoad = []
        for(let i = 0; i < list.length; i++){
            const searchElement = list[i].replace('.mp3', '').replace('musics/', '')
            const musicIndex = musicList.findIndex(element =>  element.name == searchElement)
            listToLoad.push(musicList[musicIndex])
        }
        setCurrentMusicList(listToLoad)
        clearMusicCardContainer()
        createMusicCardsModified(listToLoad)
    } else {
        setCurrentMusicList(musicList)
        clearMusicCardContainer()
        createMusicCards(musicList)
    }
}

const openAddPlayListCard = () => {
    const container = floatingCard
    container.innerHTML += `
        <div class="black_background" data-black-background>
            <div class="card_add_to_play_list" data-add-to-play-list>
                <div class="card_add_to_play_list-title">
                    <h3>Suas playlists</h3>
                    <button class="card_add_to_play_list-close_bnt" data-card-add-to-play-list-close-bnt></button>
                </div>
                <div class="card_add_to_play_list-container" data-card-add-to-play-list-container>
                </div>
            </div>
        </div>
    `
    const playlistsContainer = document.querySelector('[data-card-add-to-play-list-container]')
    loadAllPlaylists(playlistsContainer)
    addToAPlaylist(playlistsContainer)
    closeAddPlayListCard()
}

const loadAllPlaylists = (playlistsContainer) => {
    const container = playlistsContainer    
    for(let i = 0; i <= userPlayslist.length -1; i++ ){
        container.innerHTML += `
            <div class="card_add_to_play_list-item"> 
                <h3 class="card_add_to_play_list-item_titulo">${userPlayslist[i].name}</h3>
                <button class="card_add_to_play_list-add_bnt" value="${userPlayslist[i].id}" title="ADD">+</button>
            </div>
        `
    }
}

const addToAPlaylist = (playlistsContainer) => {
    playlistsContainer.addEventListener('click', event => {
        const elementClickd = event.target
        const elementClickdName = elementClickd.tagName
        if(elementClickdName == 'BUTTON'){
            const buttonValue = elementClickd.value
            addMusicToPlaylis(buttonValue)
        }
    })
}

const closeAddPlayListCard = () => {
    const bntClose = document.querySelector('[data-card-add-to-play-list-close-bnt]')
    const cardToDelete = document.querySelector('[data-black-background]')
    const cardAnimated = document.querySelector('[data-add-to-play-list]')
    const timefromAnimation = 500
    bntClose.addEventListener('click', event => {
        cardAnimated.style.animation = `card_add_to_play_list-close ${timefromAnimation}ms`
        setTimeout(() => {
            cardToDelete.remove()
        }, timefromAnimation - 50);
    })
}

openPlaylistCreatorCard.addEventListener('click', event => {
    openCratePlayListCard()
})

const openCratePlayListCard = () => {
    const container = floatingCard
    container.innerHTML = `
        <div class="black_background" data-black-background>
            <form class="form_create_playlist" data-form-create-playlist>
                <label for="play_list_name">Escolha um nome</label>
                <input type="text" id="play_list_name" name="play_list_name" data="input">
                <div class="form_create_playlist-bnt_container">
                    <button type="submit" class="form_create_playlist-bnt form_create_playlist-bnt_submit" value="submit">
                        Pronto
                    </button>
                    <button type="button" class="form_create_playlist-bnt form_create_playlist-bnt_cancelar" value="cancelar">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    `
    getElementClickdInCratePlayListCard()
}

const closeCratePlayListCard = (card) => {
    card.parentNode.remove()
}

const getElementClickdInCratePlayListCard = () => {
    const card = document.querySelector('[data-form-create-playlist]')
    card.addEventListener('click', event => {
        const elementClickd = event.target
        const elementClickdName = elementClickd.tagName
        if(elementClickdName == 'BUTTON'){
            if(elementClickd.value == 'cancelar'){
                closeCratePlayListCard(card)
            }
            if(elementClickd.value == 'submit'){
                treatmentForm(card)
            }
        }
    })
}

const treatmentForm = (form) => {
    form.addEventListener('submit', event => {
        event.preventDefault()
        const formInputNameToPlayList = form.querySelector('[data="input"]').value
        savePlayList(formInputNameToPlayList)
        closeCratePlayListCard(form)
    })
}

