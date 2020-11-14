const btn = document.createElement('button')
btn.innerText = 'active'
btn.addEventListener('click', () => {
    chrome.runtime.sendMessage('timeout')
})
document.body.prepend(btn)

chrome.runtime.onMessage.addListener((message, sender) => {
    console.log(sender, message)
    switch (message) {
        case 'active-breath': {
            active()
        }
    }
})


async function active() {
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
</div>`
    let style = document.createElement('style')
    style.innerText = `
        .close-button{
            position: absolute;
            top: 20px;
            right: 20px;
            transform: translate(50%, -50%);
        }
        html, body {
            overflow: hidden !important;
        }

        .watch-face-wrapper {
            background: black;
            position: fixed;
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000000;
        }

        .watch-face {
            height: 125px;
            width: 125px;
            animation: pulse 4s cubic-bezier(0.5, 0, 0.5, 1) alternate infinite;
        }

        .circle {
            height: 125px;
            width: 125px;
            border-radius: 50%;
            position: absolute;
            mix-blend-mode: screen;
            transform: translate(0, 0);
            animation: center 6s infinite;
        }

        .circle:nth-child(odd) {
            background: #61bea2;
        }

        .circle:nth-child(even) {
            background: #529ca0;
        }

        .circle:nth-child(1) {
            animation: circle-1 4s ease alternate infinite;
        }

        .circle:nth-child(2) {
            animation: circle-2 4s ease alternate infinite;
        }

        .circle:nth-child(3) {
            animation: circle-3 4s ease alternate infinite;
        }

        .circle:nth-child(4) {
            animation: circle-4 4s ease alternate infinite;
        }

        .circle:nth-child(5) {
            animation: circle-5 4s ease alternate infinite;
        }

        .circle:nth-child(6) {
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

    let exit = breathDiv.querySelector('button')
    exit.addEventListener('click', () => {
        breathDiv.remove()
        style.remove()
    })
    setTimeout(() => {
        breathDiv.remove()
        style.remove()
    }, 2000);

    await breathDiv.requestFullscreen()
}
