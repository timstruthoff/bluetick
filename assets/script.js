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

function OfflineNotification () {
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
        online: function () {
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
            xhttp.open("GET", "http://localhost/api/status", true);
            xhttp.send();
        }, 1000);

    });
}


function reloadEvents() {
    loadJson().then(function(result) {
        console.log(result);

        setTimeout(function() {
            reloadEvents();
        }, result.nextRequest);
    }).catch(function(err) {
        offline().then(function() {
            reloadEvents();
        });
    });
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
        xhttp.open("GET", "http://localhost/api/id-test123", true);
        xhttp.send();

    });

}
