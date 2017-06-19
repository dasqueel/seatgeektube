var x = document.getElementsByClassName("content watch-info-tag-list")[0].textContent.trim();
var y = document.getElementsByClassName("watch-title")[0].textContent.trim();
var url = window.location.href;

console.log(x);
console.log(y);
console.log(url);

if (url.indexOf("https://www.youtube.com") !== -1) {
    if (x.indexOf("Music") !== -1 && y.indexOf("-") !== -1) {
        //console.log("foo");
        var idx = y.indexOf("-");
        var artist = y.slice(0,idx).trim();
        console.log(artist)
        //xhr with artist, returns tickets url and info
        var xhr = new XMLHttpRequest();
        var xhrUrl = "https://neilbarduson.com/seatgeek?artist="+artist;

        xhr.open("GET", xhrUrl, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            // innerText does not let the attacker inject HTML elements.
            //document.getElementById("resp").innerText = xhr.responseText;
            //do notificatin update
            console.log(xhr.responseText);
          }
        }
        xhr.send();
    }
}

/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log("hi");
});
*/