//function getTicksUrl(artist) // can get users ip from postquest


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { // onUpdated should fire when the selected tab is changed or a link is clicked
	chrome.tabs.getSelected(null, function(tab) {
		if (tab.url.indexOf("https://www.youtube.com") !== -1) {
            //console.log("here");
            function doStuffWithDom(domContent) {
                //console.log(domContent);
                if (domContent[0].indexOf("Music") !== -1 && domContent[1].indexOf("-") !== -1) {
                    //console.log("foo");
                    var idx = domContent[1].indexOf("-");
                    var artist = domContent[1].slice(0,idx).trim();

                    //xhr with artist, returns tickets url and info
                    var xhr = new XMLHttpRequest();
                    var url = "https://neilbarduson.com/seatgeek?artist="+artist;
                    xhr.open("GET", url, true);
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

            chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
		}
	});
});


