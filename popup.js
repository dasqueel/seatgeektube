//get chrome extensions background activity so you can access its variables and console log output
//var bkg = chrome.extension.getBackgroundPage();

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        var resp = [];
        var x = document.getElementsByClassName("content watch-info-tag-list")[0].textContent.trim();
        var y = document.getElementsByClassName("watch-title")[0].textContent.trim();
        var url = window.location.href;
        //var s = document.getElementById("watch-description-clip").lastChild.textContent);
        //console.log(x)
        sendResponse([x,y,url]);
    }
});

