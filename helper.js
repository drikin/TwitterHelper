(function() {
    function DOMNodeInserted() {
        installEvent();
        updateBadge();
    }

    function installEvent() {
        var target = document.getElementById('new-tweets-bar');
        if (target) {
            target.addEventListener('mousedown', markAsRead, false);
        }
    }

    function updateBadge() {
        var target = document.getElementById('new-tweets-bar');
        if (target) {
            var tc = target.textContent;
            var count = tc.match(/\d+/);
            chrome.extension.sendRequest({type:"updateBadge", text:count[0]});
        } else {
            chrome.extension.sendRequest({type:"updateBadge", text:''});
        }
    }

    function markAsRead() {
        var items = document.getElementsByClassName('stream-item');
        for (var i = 0, l = items.length; i < l; i++) {
            items[i].style.opacity = 0.5;
        }
    }

    document.addEventListener("DOMNodeInserted", DOMNodeInserted, false);
})();
// vim:set ts=4 sw=4 expandtab:
