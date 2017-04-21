/* jshint esversion: 6 */
module.exports = (config, assets, trackUrl, trackId, events, clientMethod) => {
    console.log("method:", clientMethod);
    returnString = "";
    returnString += `<head>
    <link rel="stylesheet" type="text/css" href="${assets.get('styles.css')}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <nav>
        <div class="logo"></div>
        <ul>
            <li><a href="/how-it-works">How it works</a></li>
            <li><a href="/upgrade">Upgrade</a></li>
        </ul>
    </nav>
    <main>
        <section class="header">
            <div class="fix-container">
                <div class="logo-big"></div>
                <h1>Want to know what happens after you click send?</h1>
                <div class="red-square-method${clientMethod !== 1 ? " active" : ""}">
                    <p class="instructions">Copy the red square into your email.</p>
                    <div class="track-container">
                        <div class="track-input">
                            <div class="ghost">
                                <div class="id">ID: ${trackId}</div>
                            </div>
                            <div class="input" contenteditable="true" id="input">
                                <img src="" class="track-pixel"></img>
                            </div>
                        </div>
                        <div class="track-input-ghost" contenteditable="true">
                        </div>
                        <button class="track-copy">Copy</button>
                    </div>
                    <p class="workswell">Works well with Gmail and Apple Mail.</p>
                    <div class="instructions-long">
                        <a href="#"><h1 >How?</h1></a>
                        <p>Copy the red square and paste it at the end of your email. After the recipient opens the email (they need to download images), you get a notification</p>
                    </div>
                </div>

                <a class="other-client-link${clientMethod === 1 ? " open" : ""}" href="/other-client">Other client?</a>
                <div class="html-method${clientMethod === 1 ? " active" : ""}">
                    <p>Copy the following code into your email signature.</p>
                    <div class="html-track-container">
                        <input class="input" id="input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value="<img src='http://localhost/track/id-${trackId}'>">
                        <button class="track-copy">Copy</button>
                    </div>
                </div>
            </div>
        </section>
        <section class="opens">
            <h1>Opens:</h1>
            <div id="opens">`;

    events.forEach((event) => {
        returnString += `
<div class="open">
                <div class="number">#${event.number}</div>
                <div class="text">
                    <div class="time-ago">${event.timeAgo}</div>
                    <div class="other">${event.text}</div>
                    <a class="details-link" href="/id-${trackId}/${event.number-1}">Details</a>
                </div>
            </div>
    `;
    });


    returnString += `</div>
        </section>
    </main>
    <script type="text/javascript">
    var passedVars = {
        hostname: "${config.hostname}",
        trackUrl: "${trackUrl}",
        trackId: "${trackId}"
   }
    </script>
    <script src="${assets.get('script.js')}"></script>
</body>`;
    return returnString;

};
