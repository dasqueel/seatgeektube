function getUrl(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
		console.log(tabs[0].url);
	});
}
/*
function getArtistId(artist, callback){
    var xhr = new XMLHttpRequest();
    var url = "https://api.seatgeek.com/2/performers";
    var params = "?client_id=Nzg1OTMyOHwxNDk3NjE0NTEwLjQ4&client_secret=5b949500ee0f6d2249ddf966dc449b8f4682e0b6ddd29c2e79347f066eb2f671&q="+artist;
    xhr.open("GET", url+params, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var resp = JSON.parse(xhr.responseText);
        var performers = resp["performers"]
        //console.log(resp);
        for (i = 0; i < performers.length; i++) {
            obj = performers[i];

            if (obj["has_upcoming_events"]) {
                //console.log(obj["name"]);
                //console.log(obj["id"]);
                //return obj["id"];
                id = obj["id"]

            }
        }
      }
    }
    xhr.send();
}
*/
function getArtistId(artist, callback) {
  var xhr = new XMLHttpRequest();
  var url = "https://api.seatgeek.com/2/performers";
  var params = "?client_id=Nzg1OTMyOHwxNDk3NjE0NTEwLjQ4&client_secret=5b949500ee0f6d2249ddf966dc449b8f4682e0b6ddd29c2e79347f066eb2f671&q="+artist;
  xhr.open("GET", url+params, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // defensive check
      if (typeof callback == "function") {
        // apply() sets the meaning of "this" in the callback
        callback.apply(xhr);
      }
    }
  }
  // send the request *after* the event handler is defined
  xhr.send();
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { // onUpdated should fire when the selected tab is changed or a link is clicked
	chrome.tabs.getSelected(null, function(tab) {
		if (tab.url.indexOf("https://www.youtube.com") !== -1) {
            function doStuffWithDom(domContent) {
                //console.log(domContent);
                if (domContent[0].indexOf("Music") !== -1 && domContent[1].indexOf("-") !== -1) {
                    var idx = domContent[1].indexOf("-");
                    var artist = domContent[1].slice(0,idx).trim();
                    getArtistId(
                      artist,
                      // ...however, the callback function is invoked AFTER the response arrives
                      function() {
                        var id = null;
                        var resp = JSON.parse(this.responseText);
                        var performers = resp["performers"]
                        for (i = 0; i < performers.length; i++) {
                            obj = performers[i];

                            if (obj["has_upcoming_events"]) {
                                //console.log(obj["name"]);
                                //console.log(obj["id"]);
                                id = obj["id"]
                            }
                        }
                        //console.log(id);
                        //now check if artiest is performing in users area
                        getUserIP(function(ip){
                            //alert("Got IP! :" + ip);
                            //console.log(ip);
                            // A function to use as callback
                            var xhr = new XMLHttpRequest();
                            var url = "https://api.seatgeek.com/2/events";
                            var params = "?client_id=Nzg1OTMyOHwxNDk3NjE0NTEwLjQ4&client_secret=5b949500ee0f6d2249ddf966dc449b8f4682e0b6ddd29c2e79347f066eb2f671&geoip="+ip+"&range=20mi&per_page=5";
                            xhr.open("GET", url+params, true);
                            xhr.onreadystatechange = function() {
                              if (xhr.readyState == 4) {
                                // JSON.parse does not evaluate the attacker's scripts.
                                var resp = JSON.parse(xhr.responseText);
                                //console.log(resp);
                                //console.log(id);
                                var events = resp["events"]
                                for (i = 0; i < events.length; i++) {
                                    e = events[i];
                                    //console.log(obj);
                                    performers = e["performers"];

                                    for (j = 0; j < performers.length; i++) {
                                        p = performers[j];
                                        //console.log(p);
                                        console.log(p["name"]);
                                        console.log(p["id"]);
                                    }
                                }
                              }
                            }
                            xhr.send();

                        });

                    });

                }
            }

            chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
		}
	});
});

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}


