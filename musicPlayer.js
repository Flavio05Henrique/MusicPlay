const cardContainer = document.querySelector('[data-music-cards-container]')
const musicList = []

let currentMusicList = musicList

const setCurrentMusicList = (list) => {
    currentMusicList = list
}

const getCurrentMusicList = () => {
    return currentMusicList
}

let bntPlay
let bntPause
let bntRepeat
let bntNext
let bntPrevious
const repeatOptions = ['noRepeat', 'repeat']

const getButtons = () => {
    getBntPlay()
    getBntPause()
    getBntRepeat()
}

const getButtonsCardFull = () => {
    getBntPlay()
    getBntPause()
    getBntRepeat()
    getBntNext()
    getBntPrevious()
}

const getBntPlay = () => {
    bntPlay = document.querySelectorAll('[data-play]')
}

const getBntPause = () => {
    bntPause = document.querySelectorAll('[data-pause]')
}

const getBntRepeat = () => {
    bntRepeat = document.querySelectorAll('[data-repeat]')
}

const getBntNext = () => {
    bntNext = document.querySelector('[data-next]')
}

const getBntPrevious = () => {
    bntPrevious = document.querySelector('[data-previous]')
}

const bntChangePlayer = document.querySelector('[data-change-music-player]')

let musicPlaying

const setMusicPlaying = music => {
    const tagName = music.tagName
    if(tagName == 'AUDIO'){
        musicPlaying = music
    } else {
        console.log('Não valido :', music)
    }
}

const getMusicPlaying = () => {
    return musicPlaying
}

let isMusicPaused = false

const setIsMusicPaused = trueOrFalse => {
    if(trueOrFalse == false || trueOrFalse == true){
        isMusicPaused = trueOrFalse
    }
}

const getIsMusicPaused = () => {
    return isMusicPaused
}

let fullMode = false

const setFullMode = trueOrFalse => {
    if(trueOrFalse == false || trueOrFalse == true){
        fullMode = trueOrFalse
    }
}

const getFullMode = () => {
    return fullMode
}

let indexOfTheFisrtMusicFromFullMode

const setIndexOfTheFisrtMusicFromFullMode = (value) => {
    indexOfTheFisrtMusicFromFullMode = value
}

const getIndexOfTheFisrtMusicFromFullMode = () => {
    return indexOfTheFisrtMusicFromFullMode
}

let defaultVolume = 50
let volume = defaultVolume

const setVolume = (volumeValue) => {
    if(volumeValue >= 0 && volumeValue <= 100){
        volume = volumeValue
    }
    volumeInjectInMusic()
}

const getVolume = () => {
    return volume
}

const fetchMusics = async () => {
    fetch("./db.json")
    .then(response => response.json())
    .then(e => {
        e.music.forEach(e => {
            const music = {
                'name': e.name,
                'directory': e.directory
            }
            musicList.push(music)
        })
    }).catch(
        error => console.log(error)
    )
}

const start = () => {
    createMusicCards(musicList)
    getButtons()
    initialDefaultMessage()
    activatebarControlFunctions()
}

cardContainer.addEventListener('click', event => {
    const clickedElement = event.target
    if(clickedElement.tagName == "BUTTON"){
        switch(clickedElement.value){
            case"play":
                play(clickedElement)
                break;
            case"pause":
                pause(clickedElement)
                break;
            case"repeat":
                repeat(clickedElement)
                break;
            case"previous":
                previousMusic()
                break;
            case"next":
                nextMusic()
                break;
            case"add":
                openAddPlayListCard()
                setMusicToAddPlayList(clickedElement.parentNode.parentNode)
                break;
            case"delete":
                removeMusicFromPlaylist(clickedElement.parentNode.parentNode)
                break;
            default: 
                console.log('ERRO botão invalido:',clickedElement.value);
        }
    }
})
 
bntChangePlayer.addEventListener('click', event => {
    if(getMusicPlaying()){
        bntChangePlayer.classList.toggle("bnt_slid")
        cardContainer.classList.toggle("music_card_conatiner_scroll_active")
        const currentMusicList = getCurrentMusicList()
        const currentMusicListId = getMusicPlaying().id
        const searchCurrentMusic = currentMusicList
        .findIndex(music => music.directory == getMusicPlaying().getAttribute('src')) 

        if(getFullMode() == false){
            setFullMode(true)
            resetCardContainer()
            createMusicCardsFull(currentMusicList[searchCurrentMusic], currentMusicListId)
            getButtonsCardFull()
            playAutomaticllyMusicCardFull()
            automaticllyNextMusic()
            activatebarControlFunctions()
        } else {
            setFullMode(false)
            resetCardContainer()
            createMusicCards(getCurrentMusicList())
            getButtons()
        }
    }
})

const play = (bnt) => {
    const getCurrentMusic = bnt.parentNode.parentNode.querySelector('[data-audio]')
    const getProgressBar = bnt.parentNode.parentNode.querySelector('[ data-control-bar-fill]')

    checkIfMusicChange(getCurrentMusic, bnt) ? resetMusic(getCurrentMusic) : 0
    setMusicPlaying(getCurrentMusic)
    playMusic()
    progressBarUpdateAutatic(getCurrentMusic, getProgressBar)
    // setMusicTime(0, getCurrentMusic)
    changeStyleBnt(bnt, bnt.parentNode)
    getFullMode() == true ? automaticllyNextMusic() : 0
    setIsMusicPaused(false)
    setVolume()
}

const pause = (bnt) => {
    if(getMusicPlaying() && getIsMusicPaused() == false){
        musciPause()
        changeStyleBnt(bnt, bnt.parentNode)
        setIsMusicPaused(true)
    }
}

const repeat = (bnt) => {
    const DoASongPlaying = getMusicPlaying()
    if(DoASongPlaying){
        const getCurrentMusic = getMusicPlaying()
        setMusicPlaying(getCurrentMusic)
        changeImageBntRepeat(bnt)
        setMusicRepeat(bnt)
        console.log(getMusicPlaying())
    }
}

const previousMusic = () => {
    const previousMusic = getPreviousMusic()
    createMusicCardsFull(previousMusic.music, previousMusic.id)
    getButtonsCardFull()
    playAutomaticllyMusicCardFull()
    automaticllyNextMusic()
    activatebarControlFunctions()
}

const nextMusic = () => {
    const nextMusic = getNextMusic()
    createMusicCardsFull(nextMusic.music, nextMusic.id)
    getButtonsCardFull()
    playAutomaticllyMusicCardFull()
    automaticllyNextMusic()
    activatebarControlFunctions()
}


const createMusicCards = (list) => {
    let id = 0
    list.forEach(music => {
        if(music != undefined){
            cardContainer.innerHTML += `
            <div class="music_card" data-music-card>
                <img src="img/music_foto.jpg" alt="imagem de um fone com seu cabo formando a palavra music" class="musica_image">
                <div class="music_card_information">
                    <h3 class="music_name">${music.name}</h3>
                    <div class="bar" >
                        <div class="bar_fill"  data-control-bar-fill>
                            <div class="point"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <button class="music_card_bnt play" value="play" data-play></button>
                    <button class="music_card_bnt pause" value="pause" data-pause></button>
                    <button class="music_card_bnt add" value="add"></button>
                </div>
                <audio src="${music.directory}" data-audio id="${id}"></audio>
            </div>
            `
            id++
        }
    })
}

const createMusicCardsModified = (list) => {
    let id = 0
    list.forEach(music => {
        if(music != undefined){
            cardContainer.innerHTML += `
            <div class="music_card" data-music-card>
                <img src="img/music_foto.jpg" alt="imagem de um fone com seu cabo formando a palavra music" class="musica_image">
                <div class="music_card_information">
                    <h3 class="music_name">${music.name}</h3>
                    <div class="bar" >
                        <div class="bar_fill"  data-control-bar-fill>
                            <div class="point"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <button class="music_card_bnt play" value="play" data-play></button>
                    <button class="music_card_bnt pause" value="pause" data-pause></button>
                    <button class="music_card_bnt delete" value="delete"></button>
                </div>
                <audio src="${music.directory}" data-audio id="${id}"></audio>
            </div>
            `
            id++
        }
    })
}

const clearMusicCardContainer = () => {
    cardContainer.innerHTML = ''
}

const createMusicCardsFull = (music, id) => {
    const identifier = id ? id : 0
    cardContainer.innerHTML = `
        <div class="music_card_full" data-music-card>
            <img src="img/music_foto.jpg" alt="imagem de um fone com seu cabo formando a palavra music" class="musica_image_full">
        <div class="music_card_information_full">
            <h3 class="music_name_full">${music.name}</h3>
        <div class="bar bar_full" data-control-bar-tipe="progress">
            <div class="progress_bar_mask" data-control-bar-mask></div>
            <div class="bar_fill_full" data-control-bar-fill>
                <div class="point_full"></div>
            </div>
        </div>
        </div>
        <div class="music_player_controus">
            <button class="music_card_bnt previous" value="previous" data-previous></button>
            <button class="music_card_bnt play" value="play" data-play></button>
            <button class="music_card_bnt pause" value="pause" data-pause></button>
            <button class="music_card_bnt noRepeat" value="repeat" data-repeat></button>
            <button class="music_card_bnt next" value="next" data-next></button>
        </div>
            <audio src="${music.directory}" data-audio id="${identifier}"></audio>
        </div>
        `
}

const checkIfMusicChange = (getCurrentMusic, bnt) => {
    return getMusicPlaying() !== getCurrentMusic ? true : false
}

const resetMusic = getCurrentMusic => {
    getMusicPlaying() != undefined ? getMusicPlaying().pause() : 0
    getCurrentMusic !== getMusicPlaying() ? getCurrentMusic.currentTime = 0 : 0
    resetStyleBnt()
}

const progressBarUpdateAutatic = (music, getProgressBar) => {
    music.addEventListener('timeupdate', () => {
        getProgressBar.style.width = Math
        .floor((getMusicPlaying().currentTime / getMusicPlaying().duration) * 100) + '%'
    })
}

const changeStyleBnt = (bnt, musicCard) => {
    if(musicCard){
        const getMusicButtons =  musicCard.querySelectorAll('.music_card_bnt')
    
        getMusicButtons.forEach( bnt => {
            bnt.classList.remove('opacity_bnt')
        })
    }
    
    bnt.classList.add('opacity_bnt')
}

const resetStyleBnt = () => {
    if(getMusicPlaying() != undefined){
        const musicCardBnts = getMusicPlaying().parentNode.querySelectorAll('.music_card_bnt')
    
        musicCardBnts.forEach(bnt => {
            bnt.classList.remove('opacity_bnt')
        })
    }
}

const changeImageBntRepeat = bnt => {
    const getCurrentRepeatOption = bnt.classList[1]
    const findIndexOption = repeatOptions.findIndex( option => option === getCurrentRepeatOption)

    const removeCurentClass = bnt.classList.remove(repeatOptions[findIndexOption])
    const addNewClass = findIndexOption < repeatOptions.length -1 
    ? bnt.classList.add(repeatOptions[findIndexOption + 1]) 
    : bnt.classList.add(repeatOptions[0])

    removeCurentClass
    addNewClass
}

const setMusicRepeat = bnt => {
    const getCurrentRepeatOption = bnt.classList[1]

    getCurrentRepeatOption == 'repeat' ?  getMusicPlaying().setAttribute('loop', '') : 0
    getCurrentRepeatOption == 'noRepeat' ? getMusicPlaying().removeAttribute('loop', '') : 0
}

const resetCardContainer = () => {
    cardContainer.innerHTML = ''
}

const automaticllyNextMusic = () => {
    if(getMusicPlaying() && getFullMode()){
        getMusicPlaying().addEventListener('timeupdate', () => {
            const checkIfTheCurrentMusicIsOver = getMusicPlaying().currentTime == getMusicPlaying().duration
            if(checkIfTheCurrentMusicIsOver){
                nextMusic()
            }
        })
    }
}

const getNextMusic = () => {
    const index = searchMusicInTheArray()
    const currentMusicList = getCurrentMusicList()
    const nextMusic = index != currentMusicList.length -1 ? index + 1 : 0
    const values = {
        'music': currentMusicList[nextMusic],
        'id': nextMusic
    }

    return values
}

const getPreviousMusic = () => {
    const index = searchMusicInTheArray()
    const currentMusicList = getCurrentMusicList()
    const previousMusic = index != 0 ? index - 1 : currentMusicList.length -1
    const values = {
        'music': currentMusicList[previousMusic],
        'id': previousMusic
    }
    
    return values
}

const searchMusicInTheArray = () => {
    const getCurrentMusicId = getMusicPlaying().id
    return parseInt(getCurrentMusicId)
}

const playMusic = () => {
    const currentMusic = getMusicPlaying()
    currentMusic.play()
}

const musciPause = () => {
    const currentMusic = getMusicPlaying()
    currentMusic.pause()
}

const setMusicTime = (timeFromZeroToOneHundred, getCurrentMusic) => {
    if(timeFromZeroToOneHundred > -1 && timeFromZeroToOneHundred < 101){
        getCurrentMusic.currentTime = timeFromZeroToOneHundred*(getCurrentMusic.duration / 100)
    }
}

const playAutomaticllyMusicCardFull = () => {
    const getCardMusic = cardContainer.querySelector('[data-music-card]')
    const getMusic = getCardMusic.querySelector('[data-audio]')
    const getProgressBar = getCardMusic.querySelector('[data-control-bar-fill]')
    const getBntPlay = cardContainer.querySelector('[data-play]')
    setMusicPlaying(getMusic)
    playMusic(getMusic)
    setVolume()
    progressBarUpdateAutatic(getMusicPlaying(), getProgressBar)
    changeStyleBnt(getBntPlay)
}

const initialDefaultMessage = () => {
    getMusicPlaying() == undefined ?  messageToTheClient(messageActiveFullMode()) : 0
}

const messageToTheClient = (mensagem) => {
    cardContainer.innerHTML +=`
        <div class="mensagem" data-message>${mensagem}</div>
    `
    setTimeout(removeMessageToClient, 4000)
}

const removeMessageToClient = () => {
    const message = cardContainer.querySelector('[data-message]')
    message ? message.remove() : 0
}

const messageActiveFullMode = () => {
    const mensage = '<p class="mensagem_texto">Escolha uma musica e use o modo cheio para ouvir suas músicas em sequência <button class="change_music_player"><div></div></button></p>'
    return mensage
}

let barControls
let barControlfill
const getControlBar = () => {
    barControls = document.querySelectorAll('[data-control-bar-mask]')
}

const setCurrentBarControlFill = (objClicked) => {
    barControlfill = objClicked.querySelector('[data-control-bar-fill]')
}

const getCurrentBarControlFill = () => {
    return barControlfill
}

const volumeControlFloating = document.querySelector('[data-volume-control-floating]')
const bntOpenVolumeControl = document.querySelector('[data-open-volume-control]')

const mouseDown = (barControl) => {
    barControl.addEventListener('mousedown', event => {
        const objClicked = event.target.parentNode
        setCurrentBarControlFill(objClicked)
        injectsMouseEvent(event)
        mouseMove(barControl)
    })
}

const mouseMove = (barControl) => {
    barControl.addEventListener('mousemove', injectsMouseEvent)
}

const mouseUp = (barControl) => {
    barControl.addEventListener('mouseup', event => {
        barControl.removeEventListener('mousemove', injectsMouseEvent)
    })
}

const mouseOut = (barControl) => {
    barControl.addEventListener('mouseout', event => {
        barControl.removeEventListener('mousemove', injectsMouseEvent)
    })
}

const dragStartPrevent = (barControl) => {
    barControl.addEventListener('dragstart', event => {
        event.preventDefault();
    })
}

const injectsMouseEvent = (event) => {
    setPercentagebarControl(event)
}

const calculatesPercentageOfbarControl = (event, widthOrHeight) => {
    const cardClicked = event.target.parentNode
    const bar = cardClicked.querySelector('[data-control-bar-mask]')
    let barNum 
    let value
    if(widthOrHeight == "height"){
        barNum = bar.getBoundingClientRect().height
        value = event.offsetY
    } 
    if(widthOrHeight == "width"){
        barNum = bar.getBoundingClientRect().width
        value = event.offsetX
    }
    const calc = parseInt((100 * value )/barNum)
    return calc
}

const setPercentagebarControl = (mouseClickEvent) => {
    let calc
    const cardClickedTypeValue = mouseClickEvent.target.parentNode.getAttribute("data-control-bar-tipe")
    switch(cardClickedTypeValue){
        case"volume":
            calc = calculatesPercentageOfbarControl(mouseClickEvent, "height")
            setPercentagebarControlVolume(calc)
            break
        case"progress":
            calc = calculatesPercentageOfbarControl(mouseClickEvent, "width")
            setPercentagebarControlProgress(calc)
            break
    }
}

const setPercentagebarControlVolume = (calc) => {
    getCurrentBarControlFill().style.height =  calc + '%'
    setVolume(calc)
}

const setPercentagebarControlProgress = (calc) => {
    const getCurrentMusic = getMusicPlaying()
    getCurrentBarControlFill().style.width =  calc + '%'
    setMusicTime(calc, getCurrentMusic)
}

bntOpenVolumeControl.addEventListener('click', event => {
    if(event.target.tagName == 'BUTTON') volumeControlFloating.classList.toggle('open_volume_control')
})

const activatebarControlFunctions = () => {
    getControlBar()
    barControls.forEach(bar => {
        mouseDown(bar)
        mouseUp(bar)
        mouseOut(bar)
        dragStartPrevent(bar)
    })
}

const volumeInjectInMusic = () => {
    const currentMusic = getMusicPlaying()
    if(currentMusic) currentMusic.volume = parseFloat(volume / 100) 
}



fetchMusics()
setTimeout(start, 100)