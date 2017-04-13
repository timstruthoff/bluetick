/* jshint esversion: 6 */
module.exports = (trackId, document) => {
	return `
${document}<br><br>
<img src="http://localhost:4000/track/${trackId}">
	`;

};