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


var redSquareMethodCopyButton = document.querySelector(".red-square-method .track-copy");
var redSquareMethodTrackInput = document.querySelector(".red-square-method .track-input .input");
redSquareMethodCopyButton.addEventListener("click", function() {


    var range = document.createRange();
    range.selectNodeContents(redSquareMethodTrackInput);
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

var htmlMethodCopyButton = document.querySelector(".html-method .track-copy");
var htmlMethodTrackInput = document.querySelector(".html-method .input");
htmlMethodCopyButton.addEventListener("click", function() {


    htmlMethodTrackInput.select();

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
    detailsLinkEl.href = "/id-" + passedVars.trackId + "/" + (event.number-1);
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
        xhttp.open("GET", "http://" + passedVars.hostname + "/api/id-" + passedVars.trackId + "?offset=" + events.length, true);
        xhttp.send();

    });

}

var openContainer = document.getElementById("opens");
var events = [];
reloadEvents();




var helpOpen = false;
var helpContainerEl = document.querySelector(".instructions-long");
var helpAEl = document.querySelector(".instructions-long a");
var helpPEl = document.querySelector(".instructions-long p");


function openHelp() {
    helpOpen = true;
    helpContainerEl.classList = "instructions-long open";
    helpPEl.style.height = "auto";
    var height = helpPEl.clientHeight;
    helpPEl.style.height = 0;

    //console.log(redSquareMethodContainerEl.style.height);
    //redSquareMethodContainerEl.style.paddingBottom = height;

    // If the height is changed immidiately, there is no transition
    setTimeout(function() {
        helpPEl.style.height = height;

    }, 1);
}

function closeHelp() {
    helpOpen = false;
    localStorage.helpOnceClosed = true;
    helpContainerEl.classList = "instructions-long";
    helpPEl.style.height = 0;
}

helpContainerEl.addEventListener("click", function(event) {
    if (helpOpen) {
        closeHelp();
    } else {
        openHelp();
    }
    event.preventDefault();
});


// Opening the help if the user doesn't blur the tab after 5 seconds
var wasWindowBlurred = false;

window.addEventListener("blur", function() {
    wasWindowBlurred = true;
});

setTimeout(function() {
    if (!wasWindowBlurred && !helpOpen && !localStorage.helpOnceClosed) {
        openHelp();
    }
}, 5000);



// <

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

var otherClientLinkEl = document.querySelector(".other-client-link");
var redSquareMethodContainerEl = document.querySelector(".red-square-method");
var htmlMethodContainerEl = document.querySelector(".html-method");

var currentMethodOpen = "red-square";
if (hasClass(htmlMethodContainerEl, "active")) {
    currentMethodOpen = "html";
}

otherClientLinkEl.addEventListener("click", function(event) {
    if (currentMethodOpen === "red-square") {
        currentMethodOpen = "html";
        document.cookie = "method=1"; // Using numbers to transfer less data. 0 is "red-square"; 1 is "html".
        
        htmlMethodContainerEl.classList = "html-method active";


        // Transitioning open
        var height = htmlMethodContainerEl.clientHeight;
        htmlMethodContainerEl.style.height = 0;

        // If the height is changed immidiately, there is no transition
        setTimeout(function() {
            htmlMethodContainerEl.style.height = height;

        }, 1);


        // Transitioning red square method container to height = 0
        redSquareMethodContainerEl.style.height = redSquareMethodContainerEl.clientHeight;
        setTimeout(function() {
            redSquareMethodContainerEl.style.height = "";
            redSquareMethodContainerEl.classList = "red-square-method";

        }, 1);

        otherClientLinkEl.classList = "other-client-link open";
    } else {
        currentMethodOpen = "red-square";
        document.cookie = "method=0"; // Using numbers to transfer less data. 0 is "red-square"; 1 is "html".
        
        redSquareMethodContainerEl.classList = "red-square-method active";


        // Transitioning open
        var height = redSquareMethodContainerEl.clientHeight;
        redSquareMethodContainerEl.style.height = 0;

        // If the height is changed immidiately, there is no transition
        setTimeout(function() {
            redSquareMethodContainerEl.style.height = height;

        }, 1);


        // Transitioning red square method container to height = 0
        htmlMethodContainerEl.style.height = htmlMethodContainerEl.clientHeight;
        setTimeout(function() {
            htmlMethodContainerEl.style.height = "";
            htmlMethodContainerEl.classList = "html-method";
            setTimeout(function() {
                redSquareMethodContainerEl.style.height = "";
            }, 400);
            
        }, 1);

        otherClientLinkEl.classList = "other-client-link";
    }
    event.preventDefault();

});
