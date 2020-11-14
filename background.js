console.log("background")

let focusTime = 0
let threshold = 5 * 1000
// let threshold = 30 * 60 * 1000

chrome.runtime.onMessage.addListener(message => {
    switch (message) {
        case 'some-tab-blur': {
            stopTimer()
            break
        }
        case 'some-tab-focus': {
            startTimer()
            break
        }
        case 'breath-exit': {
            timerEnabled = true
            startTimer()
            break
        }
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
            requireInteraction: true
        }
    )
}

chrome.notifications.onClicked.addListener(id => {
    chrome.tabs.query(
        {active: true, currentWindow: true},
        tabs => {
            // TODO 判断当前页面是否是可以加载的
            chrome.tabs.sendMessage(tabs[0].id, 'active-breath')
        })
    chrome.notifications.clear(id)
})
chrome.notifications.onClosed.addListener(id => {
    chrome.notifications.clear(id)
})
