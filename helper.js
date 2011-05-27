(function() {

    function setLocale(lo) {
        var h = document.getElementsByTagName('html')[0];
        h.lang = lo;
    }

    function installSpeechInput() {
        var t = document.getElementsByClassName('text-area-editor twttr-editor')[0];
        if (typeof t !== 'undefined') {
            document.removeEventListener('DOMNodeInserted', installSpeechInput);

            var i = document.createElement('input');
            t.appendChild(i);

            i.id = 'twp-speech-input';
            i.setAttribute('x-Webkit-Speech');
            i.setAttribute('autocomplete', 'off');
            i.setAttribute('autocorrect', 'off');
            i.onwebkitspeechchange = speechChange;
            i.style.border = '0px';
            i.style.top = '2px';
            i.style.right = '-25px';
            i.style.position = 'absolute';
            i.style.color = 'rgba(0, 0, 255, 0)';
            i.style.background = 'rgba(0, 0, 255, 0)';
            i.style.outline = 'none';
            i.style.fontSize = '20px';
            i.style.width = '20px';
        }
    }

    function speechChange() {
        var t = document.getElementsByClassName('twitter-anywhere-tweet-box-editor')[0];
        t.value += document.getElementById("twp-speech-input").value;
    }

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

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if(request["action"] === "scrollToTop") {
            window.scrollTo(0, 0);
        }
        sendResponse();
    });

    document.addEventListener("DOMNodeInserted", DOMNodeInserted, false);
    document.addEventListener("DOMNodeInserted", installSpeechInput, false);

    setLocale('ja');
})();
// vim:set ts=4 sw=4 expandtab:
