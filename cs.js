//content scripte that reads the youtube pages dom to scrape the video category and the title

//message listner from background to grab youtube data
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        //get the category and artist from title
        var isMusic = document.getElementsByClassName("content watch-info-tag-list")[0].textContent.trim();
        var artist = document.getElementsByClassName("watch-title")[0].textContent.trim();

        //send if youtube video is a music category, and the artist title
        sendResponse([isMusic,artist]);
    }
});

var port = chrome.extension.connect({
     name: "popup html"
});
port.postMessage("connect to background");
//listener to update popup html with the tickets url
port.onMessage.addListener(function(msg) {
     //console.log("message recieved" + msg);
     document.getElementById("urls").innerHTML = "<a href="+msg+" target='_blank'>Get Cho Tickets :D!</a>";
});

//whenever popup.html intiated, clear the notification
window.onload = function() {
    chrome.browserAction.setBadgeText({text: ""});
    //possibly figure out how to remove the get cho tickets text after user clicks on link?
};