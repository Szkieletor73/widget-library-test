/**
 * Fetches an HTML resource and return it's contents as a string.
 * @param {string} path
 */
export async function xhrFetch (path) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200) return;
            resolve(this.responseText)
        }
        xhr.send()
    })
}