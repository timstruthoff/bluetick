/* jshint esversion: 6 */
module.exports = (assets, eventId, dateString, timeString, useragent, ip, geo, countries) => {
    returnString = "";
    returnString += `<head>
    <link rel="stylesheet" type="text/css" href="/assets/styles.css">
    <link rel="stylesheet" type="text/css" href="/assets/details.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body class="details">
    <nav>
        <div class="logo"></div>
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
