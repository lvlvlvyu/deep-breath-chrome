console.log('popup')
const threshold = document.querySelector('#threshold')
const breath_time = document.querySelector('#breath-time')
document.querySelector('button')
    .addEventListener('click', () => {
        save()
    })

load()

function save() {
    const th = threshold.value || '30'
    const bt = breath_time.value || '1'
    chrome.storage.sync.set({th, bt})
    chrome.runtime.sendMessage('config-change')
    load()
}

function load() {
    chrome.storage.sync.get(['th', 'bt'], res => {
        const {th, bt} = res
        threshold.value = th
        breath_time.value = bt
    })
}
