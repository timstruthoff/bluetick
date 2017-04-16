/* jshint esversion: 6 */
module.exports = (trackId, events) => {
	returnString = "";
	returnString += `

<head>
	<style>
		img {
			width: 50px;
    		height: 50px;
    		border: #000 solid;
    		display: inline;
		}

		.trackingSnippet {
			font-size: 40px;
		}
	</style>
</head>
<h1>Events</h1>
	`;

events.forEach((event) => {
	returnString += `
<div>Opened with ${event.useragent.Browser} on ${event.useragent.Platform_Description} ${event.date}.</div>
	`;
})


returnString += `
<div class="trackingSnippet" contentEditable="true"><img id="trackingImg" src=""></div>

<script>
	var trackingImage = document.getElementById("trackingImg")

	document.cookie = "trackingPixelInactive=true";
	trackingImage.src = "http://fe373ad8.ngrok.io/track/id-${trackId}";

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
	`;

return returnString;

};