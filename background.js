console.log("background")

chrome.runtime.onMessage.addListener((message, sender) => {
    console.log('timeout')
    let notificationId;
    switch (message) {
        case 'timeout': {
            console.log(sender)

            //TODO 可能是一个列表，清空所有列表
            notificationId = Math.random() + ''
            chrome.notifications.create(
                notificationId,  // id48161605352198_.pic_thumb.jpg

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
                },

                (id) => {
                    console.log(id);
                }
            );

            chrome.notifications.onClicked.addListener(() => {

                console.log('点击面板内除按钮的其他地方!');
                chrome.notifications.clear(notificationId, function (wasCleared) {
                    wasCleared ? console.log('退出成功') : console.log('退出失败');

                })

                chrome.tabs.query(
                    {active: true, currentWindow: true},
                    tabs => {
                        // chrome.runtime.sendMessage('active-breath')
                        chrome.tabs.sendMessage(tabs[0].id, 'active-breath')
                    })

            });
            chrome.notifications.onClosed.addListener(function () {

                chrome.notifications.clear(notificationId, function (wasCleared) {
                    wasCleared ? console.log('退出成功') : console.log('退出失败');

                })
                console.log('点击了关闭按钮!');

            });
        }
    }
})
