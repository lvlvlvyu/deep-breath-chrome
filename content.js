let BREATH_TIME = 5 // seconds
let breathActive = false

chrome.runtime.onMessage.addListener(message => {
    switch (message) {
        case 'active-breath': {
            chrome.storage.sync.get('bt', ({bt}) => {
                BREATH_TIME = bt * 1
                active()
            })
            break
        }
    }
})

async function active() {
    let breathDiv = document.createElement('breath')
    breathDiv.innerHTML = await getResource("breath.html")

    let myAudio = new Audio(await getResourceURL("resources/sound.mp3"));
    myAudio.play();

    let style = document.createElement('style')
    style.innerText = await getResource("style.css")

    document.body.prepend(breathDiv)
    document.head.append(style)
    breathActive = true

    let progress = breathDiv.querySelector('.progress')
    let bar = breathDiv.querySelector('.bar')
    let closeBtn = breathDiv.querySelector('.close button')
    // let hint = breathDiv.querySelector('.hint')
    bar.style.cssText = `transition: width ${BREATH_TIME}s linear`
    bar.scrollTop // trigger reflow
    progress.style.cssText = `--percent: 0%`
    let timerId = setTimeout(exit, BREATH_TIME * 1000)
    // let hintTimerId = setTimeout(() => {
    //     hint.remove()
    // }, 2000)

    closeBtn.addEventListener('click', () => {
        clearInterval(timerId)
        // clearInterval(hintTimerId)
        exit()
    })


    function exit() {
        breathDiv.style.animation = '1s exit ease-out';
        setTimeout(() => {
            breathDiv.remove()
            style.remove()
            myAudio.pause()
            breath_exit()
        }, 1000)
    }
}

function tab_focus() {
    chrome.runtime.sendMessage('tab-focus')
}

function tab_blur() {
    chrome.runtime.sendMessage('tab-blur')
}

function breath_exit() {
    breathActive = false
    chrome.runtime.sendMessage('breath-exit')
}


window.addEventListener('focus', tab_focus)
window.addEventListener('blur', tab_blur)
window.addEventListener('unload', tab_blur)
window.addEventListener('unload', () => {
    if (breathActive) breath_exit()
})
if (document.hasFocus()) {
    tab_focus()
}
