var trackingImage = document.querySelector(".track-pixel");

document.cookie = "trackingPixelInactive=true";
trackingImage.src = passedVars.trackUrl;

trackingImage.onload = function() {
    console.log("loaded");
    //document.cookie = "trackingPixelInactive=false; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "trackingPixelInactive=false";
};

trackingImage.onerror = function() {
    console.log("error");
    //document.cookie = "trackingPixelInactive=false; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Delete the cookie
    document.cookie = "trackingPixelInactive=false";
};

document.querySelector("#button").addEventListener("click", function() {

    el = document.getElementById('input');

    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    try {
        // copy text
        document.execCommand('copy');
    } catch (err) {
        alert('Please press Ctrl/Cmd+C to copy');
    }
});

function OfflineNotification() {
    var containerEl = document.createElement("div");
    containerEl.classList = "offline-notification";

    var pointEl = document.createElement("div");
    pointEl.classList = "point";

    var textEl = document.createElement("div");
    textEl.classList = "text";
    textEl.innerHTML = "Offline";

    containerEl.appendChild(pointEl);
    containerEl.appendChild(textEl);

    document.body.appendChild(containerEl);

    return {
        online: function() {
            textEl.innerHTML = "Online";
            containerEl.classList = "offline-notification online";
            setTimeout(function() {
                document.body.removeChild(containerEl);
            }, 2400);
        }
    };

}



function offline() {
    return new Promise(function(resolve, reject) {
        var notification = new OfflineNotification();
        var connectionRestored = setInterval(function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    if (JSON.parse(xhttp.responseText) === true) {
                        clearInterval(connectionRestored);
                        notification.online();
                        resolve();
                    }

                }
            };
            xhttp.open("GET", "http://" + passedVars.hostname + "/api/status", true);
            xhttp.send();
        }, 1000);

    });
}

var firstrender = true;
function reloadEvents() {
    loadJson().then(function(result) {

        events = events.concat(result.events);
        if (firstrender) openContainer.innerHTML = "";
        for (var event in result.events) {
            renderEvent(result.events[event]);
        }
        if (firstrender) firstrender = false;
        setTimeout(function() {
            reloadEvents();
        }, result.nextRequest);
    }).catch(function(err) {
        console.log(err);
        offline().then(function() {
            reloadEvents();
        });
    });
}

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years";
    }
    if (interval === 1) {
        return "a year";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    if (interval === 1) {
        return "a month";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    if (interval === 1) {
        return "a day";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    if (interval === 1) {
        return "an hour";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    if (interval === 1) {
        return "a minute";
    }

    interval = Math.floor(seconds);
    if (interval > 1) {
        return interval + " seconds";
    }
    if (interval === 1) {
        return "a second";
    }

    return "a second";
}


function renderEvent(event) {
    console.log(event);

    var openEl = document.createElement("div");
    openEl.classList = "open";
    if (!firstrender) openEl.classList = "open animate";
    var numberEl = document.createElement("div");
    numberEl.classList = "number";
    numberEl.innerHTML = "#" + event.number;


    var textEl = document.createElement("div");
    textEl.classList = "text";

    var timeAgoEl = document.createElement("div");
    timeAgoEl.classList = "time-ago";
    
    var timeAgoDate = new Date(event.timeAgo);
    var timeAgo = timeSince(timeAgoDate);

    timeAgoEl.innerHTML = timeAgo + " ago";

    setInterval(function() {
        if (timeSince(timeAgoDate) !== timeAgo) {
            timeAgo = timeSince(timeAgoDate);
            timeAgoEl.innerHTML = timeAgo + " ago";
        }
    }, 1000);

    var otherEl = document.createElement("div");
    otherEl.classList = "other";
    otherEl.innerHTML = event.text;

    var detailsLinkEl = document.createElement("a");
    detailsLinkEl.classList = "details-link";
    detailsLinkEl.href = event.id;
    detailsLinkEl.innerHTML = "Details";

    textEl.appendChild(timeAgoEl);
    textEl.appendChild(otherEl);
    textEl.appendChild(detailsLinkEl);

    openEl.appendChild(numberEl);
    openEl.appendChild(textEl);

    openContainer.insertBefore(openEl, openContainer.firstChild);
}


function loadJson() {
    return new Promise(function(resolve, reject) {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var obj = JSON.parse(xhttp.responseText);
                resolve(obj);

            }
        };
        xhttp.onerror = function(err) {
            reject(err);
        };
        xhttp.open("GET", "http://" + passedVars.hostname + "/api/id-test123?offset=" + events.length, true);
        xhttp.send();

    });

}

var openContainer = document.getElementById("opens");
var events = [];
reloadEvents();
