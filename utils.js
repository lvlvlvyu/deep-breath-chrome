async function getContent(url) {
    return new Promise((resolve, reject) => {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url, true);
        httpRequest.send();

        console.log(url)
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                resolve(httpRequest.responseText)
            }
        };
        httpRequest.onerror = function (ev) {
            reject(ev)
        }
    })
}


async function getResource(resource) {
    return await getContent(chrome.runtime.getURL(resource))
}