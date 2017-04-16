/* jshint esversion: 6 */
module.exports = (trackUrl, trackId, events) => {
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
            <h1>Want to know what happens after you click send?</h1>
            <p class="instructions">Copy the red square into your email.</p>
            <div class="track-container">
                <div class="track-input">
                    <div class="ghost">
                        <div class="id">ID: ${trackId}</div>
                    </div>
                    <div class="input" contenteditable="true">
                        <img src="" class="track-pixel"></img>
                    </div>
                </div>
                <div class="track-input-ghost" contenteditable="true">
                </div>
                <button class="track-copy">Copy</button>
            </div>
            <p class="workswell">Works well with Gmail and Inbox.</p>
            <a class="hover-1" href="/other-client">Other client?</a>
        </section>
        <section class="opens">
            <h1>Opens:</h1>
	`;

events.forEach((event) => {
	returnString += `
<div class="open">
                <div class="number">#${event.number}</div>
                <div class="text">
                    <div class="time-ago">${event.timeAgo}</div>
                    <div class="other">${event.text}</div>
                    <a class="details-link" href="${event.id}">Details</a>
                </div>
            </div>
	`;
});


returnString += `
        </section>
    </main>

<script>
	var trackingImage = document.querySelector(".track-pixel");

	document.cookie = "trackingPixelInactive=true";
	trackingImage.src = "${trackUrl}";

	trackingImage.onload = function() {
		console.log("loaded")
		//document.cookie = "trackingPixelInactive=false; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
		document.cookie = "trackingPixelInactive=false";
	};

	trackingImage.onerror = function() {
		console.log("error")
		//document.cookie = "trackingPixelInactive=false; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Delete the cookie
		document.cookie = "trackingPixelInactive=false";
	};

</script>
</body>`;

return returnString;

};