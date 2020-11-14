// TODO configurable
// 时间阈值
const THRESHOLD = 5 * 1000
// 定时器精度
const TIMER_ACC = 1000
// 通知停留时间
const NOTIFICATION_DURATION = 4000

// 已获取焦点的时间
let focusTime = 0
// 当前是否有标签获得焦点
let someTabFocus = false
// 定时器是否启用
let timerEnabled = true
// 定时器id，-1表示未启动
let timerId = -1

chrome.runtime.onMessage.addListener(message => {
    switch (message) {
        case 'tab-blur':
            someTabFocus = false
            stopTimer()
            break
        case 'tab-focus':
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

function startTimer() {
    if (!timerEnabled || timerId !== -1)
        return
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
    if (focusTime >= THRESHOLD) {
        stopTimer()
        focusTime = 0
        timerEnabled = false
        notifyUser()
    }
}

function notifyUser() {
    let notificationId = Math.random().toString()
    chrome.notifications.create(
        notificationId,
        {
            type: 'list',
            iconUrl: 'clock.jpg',
            appIconMaskUrl: 'clock.jpg',
            title: '提示',
            message: '是否准备休息',
            contextMessage: '点击即刻开始呼吸',
            buttons: [],
            items: [{title: '操作', message: '点击即刻开始呼吸'}],
        }, id => {
            // 定时关闭通知
            setTimeout(() => {
                chrome.notifications.clear(id)
                onNotifyClose(id)
            }, NOTIFICATION_DURATION)
        }
    )
}

// 是否点击了通知
let notificationClicked = false

function onNotifyClick(id) {
    notificationClicked = true
    chrome.tabs.query({active: true, currentWindow: true},
        // TODO 判断当前页面是否是可以加载的
        tabs => chrome.tabs.sendMessage(tabs[0].id, 'active-breath'))
    chrome.notifications.clear(id)
}

function onNotifyClose(id) {
    // 由于点击通知而触发了关闭事件
    if (notificationClicked) {
        notificationClicked = false
        return
    }
    chrome.notifications.clear(id)
    // TODO 适当推迟
    focusTime = 0
    timerEnabled = true
    if (someTabFocus)
        startTimer()
    notificationClicked = false
}

chrome.notifications.onClicked.addListener(onNotifyClick)
chrome.notifications.onClosed.addListener(onNotifyClose)
