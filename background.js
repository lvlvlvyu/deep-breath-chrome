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


// chrome.runtime.getPackageDirectoryEntry(function (root) {
//     root.getFile("style.css", {}, function (fileEntry) {
//         fileEntry.file(function (file) {
//             var reader = new FileReader();
//             reader.onloadend = function (e) {
//                 this.style = t
//             };
//             reader.readAsText(file);
//         }, errorHandler);
//     }, errorHandler);
// });

