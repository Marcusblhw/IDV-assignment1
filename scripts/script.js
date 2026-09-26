const API_URL = "https://api-open.data.gov.sg/v2/real-time/api/psi";

async function loadPsi() {
    // 1. Call the API and parse the JSON
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json); // look at this in the browser console (F12)

    // 2. Drill down to the data we need
    const latest = json.data.items[0];
    const readings = latest.readings;
    const regions = json.data.regionMetadata.map(r => r.name);

    // 3. Build the header row: "Reading | north | south | ..."
    let headHtml = "<tr><th>Reading</th>";
    for (const region of regions) {
        headHtml += `<th>${region}</th>`;
    }
    headHtml += "</tr>";
    document.getElementById("table-head").innerHTML = headHtml;

    // 4. Build one row per reading (12 rows)
    let bodyHtml = "";
    for (const [name, values] of Object.entries(readings)) {
        bodyHtml += `<tr><td>${name}</td>`;
        for (const region of regions) {
            bodyHtml += `<td>${values[region]}</td>`;
        }
        bodyHtml += "</tr>";
    }
    document.getElementById("table-body").innerHTML = bodyHtml;

    // 5. Show when the data is from
    document.getElementById("status").textContent =
        "Data timestamp: " + latest.timestamp;
}

loadPsi().catch(err => {
    document.getElementById("status").textContent = "Failed to load: " + err;
});
