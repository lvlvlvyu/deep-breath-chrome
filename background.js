console.log("background")

let focusTime = 0
let threshold = 5 * 1000
// 是否有标签获得焦点
let someTabFocus = false
// let threshold = 30 * 60 * 1000

chrome.runtime.onMessage.addListener(message => {
    switch (message) {
        case 'some-tab-blur':
            someTabFocus = false
            stopTimer()
            break
        case 'some-tab-focus':
            someTabFocus = true
            startTimer()
            break
        case 'breath-exit':
            timerEnabled = true
            if (someTabFocus)
                startTimer()
            break
    }
})

let timerEnabled = true
let timerId = -1
const TIMER_ACC = 1000

function startTimer() {
    if (!timerEnabled || timerId !== -1) return
    console.log('startTimer')
    timerId = setInterval(() => {
        focusTime += TIMER_ACC
        console.log(`focusTime ${focusTime}`)
        checkTime()
    }, TIMER_ACC)
}

function stopTimer() {
    console.log('stopTimer')
    clearInterval(timerId)
    timerId = -1
}

function checkTime() {
    if (focusTime >= threshold) {
        stopTimer()
        focusTime = 0
        timerEnabled = false
        onTimeout()
    }
}

function onTimeout() {
    let notificationId = Math.random().toString()
    chrome.notifications.create(
        notificationId,
        {
            type: 'list',
            iconUrl: 'clock.jpg',
            appIconMaskUrl: 'clock.jpg',
            title: '是否准备休息',
            message: '是否准备休息',
            contextMessage: '点击通知即刻开始呼吸',
            buttons: [],
            items: [{title: '操作', message: '点击通知即刻开始呼吸'}],
        }, id => {
            setTimeout(() => {
                chrome.notifications.clear(id)
                onNotifyClose(id)
            }, 2000)
        }
    )
}

let clicked = false

function onNotifyClick(id) {
    clicked = true
    chrome.tabs.query(
        {active: true, currentWindow: true},
        tabs => {
            // TODO 判断当前页面是否是可以加载的
            chrome.tabs.sendMessage(tabs[0].id, 'active-breath')
        })
    chrome.notifications.clear(id)
}

function onNotifyClose(id) {
    if (clicked) {
        clicked = false
        return
    }
    console.log('onclose')
    chrome.notifications.clear(id)
    timerEnabled = true
    if (someTabFocus)
        startTimer()
    // TODO
    focusTime = 0
    clicked = false
}

chrome.notifications.onClicked.addListener(onNotifyClick)
chrome.notifications.onClosed.addListener(onNotifyClose)
