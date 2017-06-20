//chrome listener that checks if user is on a youtube page
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { // onUpdated should fire when the selected tab is changed or a link is clicked
	chrome.tabs.getSelected(null, function(tab) {
		if (tab.url.indexOf("https://www.youtube.com") !== -1) {
            //chrome.browserAction.setBadgeText({text: ""});
            function getTickets(domContent) {
                //console.log(domContent);

                try {
                    if (domContent[0].indexOf("Music") !== -1 && domContent[1].indexOf("-") !== -1) {
                        var idx = domContent[1].indexOf("-");
                        var artist = domContent[1].slice(0,idx).trim();

                        //xhr with artist, returns tickets url and info
                        var xhr = new XMLHttpRequest();
                        var url = "https://neilbarduson.com/seatgeek?artist="+artist;
                        xhr.open("GET", url, true);
                        xhr.onreadystatechange = function() {
                          if (xhr.readyState == 4) {
                            //do notificatin update
                            //console.log(xhr.responseText);

                            chrome.extension.onConnect.addListener(function(port) {
                                 //console.log("Connected .....");
                                 port.onMessage.addListener(function(msg) {
                                      port.postMessage(xhr.responseText);
                                 });
                            })
                            chrome.browserAction.setBadgeText({text: "!!"});
                          }
                        }

                        xhr.send();
                    }
                }

                catch(err) {
                    console.log(err)
                }
            }

            //send message to content script to access the dom and grab title and cateogory of video
            chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, getTickets);
		}
	});
});


