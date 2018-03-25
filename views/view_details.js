/* jshint esversion: 6 */
module.exports = (assets, eventId, dateString, timeString, useragent, ip, geo, countries) => {
    returnString = "";
    returnString += `<head>
    <html lang="en">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" type="text/css" href="${assets.get('styles.min.css')}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>&tracked—Copy-Paste email tracking.</title>
</head>

<body class="details">
    <nav>
        <div class="logo">
            <svg class="at24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#fff" d="M24 16l-3 3v5h3v-8zM3 19l-3-3v8h3v-5zM12 24L0 12h4l8 8 8-8-8-8v5H9V0h9v3h-3l9 9-12 12z" />
            </svg>
            <svg class="at30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path fill="#fff" d="M30 19l-4 4v7h4V19zM4 23l-4-4v11h4v-7zM15 30L0 15h5l10 10 10-10L15 5v5h-3V0h10v3h-4l12 12-15 15z" />
            </svg>
        </div>
        <ul>
            <li><a href="/how-it-works">How it works</a></li>
            <li><a href="/upgrade">Upgrade</a></li>
        </ul>
    </nav>
    <main>
        <h1>Open #${eventId + 1}</h1>
        <div class="details-container">
            <section>
                <h2>Date</h2>
                <div class="detail-row">
                    <div class="detail-left">${dateString}</div>
                    <div class="detail-right">${timeString}</div>
                </div>
            </section>
            <section>
                <h2>Client</h2>`;
                if (typeof useragent.Comment === "string" && useragent.Comment !== "Default Browser") {
                    returnString += `<div class="detail-row">
                    <div class="detail-left">Browser:</div>
                    <div class="detail-right">${useragent.Comment}</div>
                </div>`;
                }
                if (typeof useragent.Platform_Description === "string" && useragent.Platform_Description !== "unknown" && useragent.Platform_Description !== "") {
                    returnString += `<div class="detail-row">
                    <div class="detail-left">OS:</div>
                    <div class="detail-right">${useragent.Platform_Description}</div>
                </div>`;
                }
                if (typeof useragent.Device_Pointing_Method === "string" && useragent.Device_Pointing_Method !== "unknown" && useragent.Device_Pointing_Method !== "") {
                    returnString += `<div class="detail-row">
                    <div class="detail-left">Pointer:</div>
                    <div class="detail-right">${useragent.Device_Pointing_Method}</div>
                </div>`;
                }
                returnString += `</section>
            <section>
                <h2>IP Adress</h2>
                <div class="detail-row">
                    <div class="detail-left">${ip}</div>
                </div>
            </section>
            <section>

                <h2>Location</h2>`;
                if (typeof geo === "object" && geo !== null) {
                    if (typeof geo.country === "string" && geo.country !== "") {
                        if (typeof countries.getName(geo.country) === "string") {
                            returnString += `<div class="detail-row">
                    <div class="detail-left">Country:</div>
                    <div class="detail-right">${countries.getName(geo.country)}</div>
                </div>`;
                        } else {
                             returnString += `<div class="detail-row">
                    <div class="detail-left">Country:</div>
                    <div class="detail-right">${geo.country}</div>
                </div>`;
                        }
                    } 

                    if (typeof geo.city === "string" && geo.city !== "") {
                        returnString += `<div class="detail-row">
                    <div class="detail-left">City:</div>
                    <div class="detail-right">${geo.city}</div>
                </div>`;
                    } 

                    if (typeof geo.zip === "number") {
                        returnString += `<div class="detail-row">
                    <div class="detail-left">ZIP-Code:</div>
                    <div class="detail-right">${geo.zip}</div>
                </div>`;
                    } 

                    if (typeof geo.ll === "object" && typeof geo.ll[0] === "number") {
                        returnString += `<div class="detail-row">
                    <div class="detail-left">Coordinates:</div>
                    <div class="detail-right">${geo.ll[0]}, ${geo.ll[1]}</div>
                </div>`;
                    } 
                }else {
                    returnString += `<div class="detail-row">
                    <div class="detail-left">unknown</div>
                </div>`;
                }
                
returnString += `            </section>
        </div>
    </main>
</body>`;

    return returnString;

};
