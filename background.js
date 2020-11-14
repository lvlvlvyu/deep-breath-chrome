console.log("background")
let style = chrome.runtime.getURL("style.css");
console.log(style)
chrome.runtime.onMessage.addListener((message, sender) => {
    console.log('timeout')
    switch (message) {
        case 'timeout': {
            console.log(sender)
            chrome.tabs.query(
                {active: true, currentWindow: true},
                tabs => {
                    // chrome.runtime.sendMessage('active-breath')
                    chrome.tabs.sendMessage(tabs[0].id, 'active-breath')
                })
        }
    }
})
