chrome.runtime.onMessage.addListener(message => {
    switch (message) {
        case 'active-breath': {
            active()
        }
    }
})


let breathActive = false

function active() {
    let breathDiv = document.createElement('breath')
    breathDiv.innerHTML = await getResource("breath.html")


    let style = document.createElement('style')

    style.innerText = await getResource("style.css")

    document.body.prepend(breathDiv)
    document.head.append(style)
    breathActive = true

    const BREATH_TIME = 10 // seconds
    let progress = breathDiv.querySelector('.progress')
    let bar = breathDiv.querySelector('.bar')
    let closeBtn = breathDiv.querySelector('button')
    bar.style.cssText = `transition: width ${BREATH_TIME}s linear`
    bar.scrollTop // trigger reflow
    progress.style.cssText = `--percent: 0%`
    let timerId = setTimeout(() => {
        breathDiv.remove()
        style.remove()
        breath_exit()
        if (document.hasFocus())
            tab_focus()
    }, BREATH_TIME * 1000)

    closeBtn.addEventListener('click', () => {
        clearInterval(timerId)
        breathDiv.remove()
        style.remove()
        breath_exit()
        tab_focus()
    })
}

function tab_focus() {
    chrome.runtime.sendMessage('some-tab-focus')
}

function tab_blur() {
    chrome.runtime.sendMessage('some-tab-blur')
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
