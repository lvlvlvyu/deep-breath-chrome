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
    breathDiv.innerHTML = `<div class="watch-face-wrapper">
    <div class="watch-face">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
    </div>
    <button class="close-button">退出</button>
    <div class="container">
        <div class="progress" id="progress">
            <div class="bar"></div>
        </div>
    </div>
</div>`
    let style = document.createElement('style')
    style.innerText = `
         html, body {
             overflow: hidden !important;
         }
        
         breath .progress {
            --width: 300px;
            --height: 10px;
            --percent: 100%;
            width: var(--width);
            height: var(--height);
            background: #f1f2f7;
            border-radius: calc(var(--height) / 2);
            overflow: hidden;
        }

        breath .bar {
            width: var(--percent);
            height: var(--height);
            min-width: 1%;
            background: #4d76fd;
            border-radius: calc(var(--height) / 2);
        }

        breath .close-button{
            position: absolute;
            top: 20px;
            right: 20px;
            transform: translate(50%, -50%);
        }

        breath .watch-face-wrapper {
            background: black;
            position: fixed;
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000000;
        }

        breath .watch-face {
            height: 125px;
            width: 125px;
            animation: pulse 4s cubic-bezier(0.5, 0, 0.5, 1) alternate infinite;
        }

        breath .circle {
            height: 125px;
            width: 125px;
            border-radius: 50%;
            position: absolute;
            mix-blend-mode: screen;
            transform: translate(0, 0);
            animation: center 6s infinite;
        }

        breath .circle:nth-child(odd) {
            background: #61bea2;
        }

        breath .circle:nth-child(even) {
            background: #529ca0;
        }

        breath .circle:nth-child(1) {
            animation: circle-1 4s ease alternate infinite;
        }

        breath .circle:nth-child(2) {
            animation: circle-2 4s ease alternate infinite;
        }

        breath .circle:nth-child(3) {
            animation: circle-3 4s ease alternate infinite;
        }

        breath .circle:nth-child(4) {
            animation: circle-4 4s ease alternate infinite;
        }

        breath .circle:nth-child(5) {
            animation: circle-5 4s ease alternate infinite;
        }

        breath .circle:nth-child(6) {
            animation: circle-6 4s ease alternate infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(.15) rotate(180deg);
            }
            100% {
                transform: scale(1);
            }
        }

        @keyframes circle-1 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(-35px, -50px);
            }
        }

        @keyframes circle-2 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(35px, 50px);
            }
        }

        @keyframes circle-3 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(-60px, 0);
            }
        }

        @keyframes circle-4 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(60px, 0);
            }
        }

        @keyframes circle-5 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(-35px, 50px);
            }
        }

        @keyframes circle-6 {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(35px, -50px);
            }
        }`
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
