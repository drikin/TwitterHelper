(function() {
    // Settings
    var settings = {};

    function initSettings() {
        chrome.extension.sendRequest({action: "initSettings"}, function(value) {
            settings = value;
            setLocale();
        });
        chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
            if(request["action"] === "updateSetting") {
                settings[request["key"]] = request["value"];
            }
            if(request["key"] === 'languageForSpeechInput') {
                setLocale();
            }
            sendResponse();
        });
    }

    initSettings();



    function setLocale() {
        var h = document.getElementsByTagName('html')[0];
        h.lang = settings['languageForSpeechInput'];
    }

    function installSpeechInput() {
        var sq = document.getElementById('search-query');
        if (typeof sq !== 'undefined') {
            sq.setAttribute('x-Webkit-Speech');
        }

        var t = document.getElementsByClassName('text-area-editor twttr-editor');
        for (var i = 0, l = t.length; i < l; i++) {
            var tsp = document.getElementById('twp-speech-input' + i);
            if (!tsp) {
                if (typeof t[i] !== 'undefined') {
                    var ipt = createSpeechInput('twp-speech-input' + i);
                    ipt.onwebkitspeechchange = function() {
                        var t = document.getElementsByClassName('twitter-anywhere-tweet-box-editor');
                        var target = t[i - 1];
                        var txt = target.value;
                        var start = target.selectionStart;
                        var end = target.selectionEnd;
                        var insertTxt = document.getElementById('twp-speech-input' + (i - 1)).value;
                        target.value = txt.substring(0, start) + insertTxt + txt.substring(end, txt.length);
                        target.selectionStart = target.selectionEnd = start + insertTxt.length;
                    };
                    t[i].appendChild(ipt);
                }
            }
        }
    }

    function createSpeechInput(id) {
        var i = document.createElement('input');

        i.id = id;
        i.setAttribute('x-Webkit-Speech');
        i.setAttribute('autocomplete', 'off');
        i.setAttribute('autocorrect', 'off');
        i.style.border = '0px';
        i.style.top = '0px';
        i.style.right = '0px';
        i.style.position = 'absolute';
        i.style.color = 'rgba(0, 0, 255, 0)';
        i.style.background = 'rgba(0, 0, 255, 0)';
        i.style.outline = 'none';
        i.style.fontSize = '20px';
        i.style.width = '20px';

        return i;
    }

    function DOMNodeInserted() {
        installEventListener();
        installHashTagInput();
        updateBadge();
    }

    function installEventListener() {
        var target = document.getElementById('new-tweets-bar');
        if (target) {
            target.addEventListener('mousedown', markAsRead, false);
        }
    }

    function installHashTagInput() {
        var id = 'twp-hashtag-input';
        var ipt = document.getElementById(id);
        if (!ipt) {
            var t = document.getElementsByClassName('text-area-editor twttr-editor')[0];
            if (t && typeof t.appendChild === 'function') {
                var n = createHashTagInput(id);
                t.appendChild(n);
            }
        }
        var button = document.getElementsByClassName('tweet-button')[0];
        if (button) {
            button.addEventListener('mousedown', addHashTag, false);
        }
    }

    function createHashTagInput(id) {
        var i = document.createElement('input');
        i.id = id;
        i.value = settings['hashtag'];
        i.placeholder = 'Hashtag';
        i.style.padding = '2px 8px 2px 8px';
        i.style.border = '1px solid #CCC';
        i.style.borderRadius = '4px';
        i.style.color = 'rgb(34, 34, 34)';
        i.style.outline = 'none';
        i.style.boxShadow = '0 1px #fff';
        i.addEventListener('change', function(event) {
        	chrome.extension.sendRequest({action: "setSetting", key:'hashtag', value:event.target.value});
        });

        return i;
    }

    function addHashTag() {
        var i = document.getElementById('twp-hashtag-input');
        var t = document.getElementsByClassName('twitter-anywhere-tweet-box-editor')[0];
        t.value += ' ' + i.value;
        console.log(t.value);
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
    	if (JSON.parse(settings['markCurrentTweetsAsTransparent'])) {
            var items = document.getElementsByClassName('stream-item');
            for (var i = 0, l = items.length; i < l; i++) {
                items[i].style.opacity = 0.7;
            }
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
})();
// vim:set ts=4 sw=4 expandtab:
