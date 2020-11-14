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
            var r = confirm("是否要进入呼吸模式")
            if (r === true) {
                active()
            }
        }
    }
})


async function active() {
    let breathDiv = document.createElement('breath')
    breathDiv.innerHTML = await getResource("breath.html")


    let style = document.createElement('style')
    style.innerText = await getResource("style.css")

    document.body.prepend(breathDiv)
    document.head.append(style)

    let exit = breathDiv.querySelector('button')
    exit.addEventListener('click', () => {
        breathDiv.remove()
        style.remove()
    })
    let progress = breathDiv.getElementsByClassName("progress")[0]
    let sumTime = 60
    let time = sumTime


    function timer() {
        if (time > 0) {
            time = time - 0.1
            progress.style.cssText = "--percent:" + time / sumTime * 100 + "%"
            setTimeout(timer, 100)
            console.log(time / sumTime * 100)
        } else {
            breathDiv.remove()
            style.remove()
        }
    }

    timer()


    // setTimeout(() => {
    //     breathDiv.remove()
    //     style.remove()
    // }, 2000);

    await breathDiv.requestFullscreen()
}
