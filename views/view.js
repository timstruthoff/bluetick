/* jshint esversion: 6 */
module.exports = (config, trackUrl, trackId, events) => {
    returnString = "";
    returnString += `

<head>
    <link rel="stylesheet" type="text/css" href="assets/styles.css">
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
            <p class="instructions">Copy the red square into your email.</p>
            <div class="track-container">
                <div class="track-input">
                    <div class="ghost">
                        <div class="id">ID: 9s8d54</div>
                    </div>
                    <div class="input" contenteditable="true" id="input">
                        <img src="" class="track-pixel"></img>
                    </div>
                </div>
                <div class="track-input-ghost" contenteditable="true">
                </div>
                <button class="track-copy" id="button">Copy</button>
            </div>
            <p class="workswell">Works well with Gmail and Inbox.</p>
            <a class="hover-1" href="/other-client">Other client?</a>
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
                    <a class="details-link" href="/id-${trackId}/${event.id}">Details</a>
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
    <script src="assets/script.js"></script>
</body>`;

    return returnString;

};
