/* By Zachary A. Miller */

const url_params = new URLSearchParams(window.location.search);
const anchor = url_params.get("a");

function jump(h) {
    var url = location.href;
    location.href = "#" + h;
    history.replaceState(null, null, url);
}

onLoadRegister["Competitions"] = function() {
    if(anchor) {
        setTimeout(() => {
            jump(anchor);
        }, 100);
    }
}