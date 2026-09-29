const API_URL = "https://api-open.data.gov.sg/v2/real-time/api/psi";

async function loadPsi() {
    // 1. Call the API. d3.json does the fetch + JSON parsing in one step. async is a function that contains steps that take time and you can use await inside to wait for this part to finish before moving to next step
    const json = await d3.json(API_URL);
    console.log(json); // look at this in the browser console (F12/cmd + option + J in chrome)

    // 2. Drill down to the data we need
    const latest = json.data.items[0];
    const readings = latest.readings;
    const regions = json.data.regionMetadata.map(r => r.name);

    // 3. Turn the readings object into an array of rows, e.g.
    //    { name: "psi_twenty_four_hourly", values: { west: 50, east: 52, ... } }
    //    D3 works with arrays, so this is the shape we bind to the table rows
    const rows = Object.entries(readings).map(([name, values]) => ({ name, values }));

    // 4. Create the table inside the container
    const table = d3.select("#table-container").append("table");

    // 5. Header row: "Reading | north | south | ..."
    //    .data(...).join("th") creates one <th> per item in the array
    table.append("thead")
        .append("tr")
        .selectAll("th")
        .data(["Reading", ...regions])
        .join("th")
        .text(d => d);

    // 6. Body: one <tr> per reading (12 rows)
    const tr = table.append("tbody")
        .selectAll("tr")
        .data(rows)
        .join("tr");

    // 7. Inside each row, one <td> for the name, then one per region
    tr.selectAll("td")
        .data(row => [row.name, ...regions.map(region => row.values[region])])
        .join("td")
        .text(d => d);

    // 8. Show when the data is from
    //    The API gives "2026-09-29T16:00:00+08:00", so turn it into a date, then format it
    //    %a = Tue, %-d = 29, %b = Sep, %Y = 2026, %-I:%M %p = 4:00 PM
    const formatTime = d3.timeFormat("%a, %-d %b %Y, %-I:%M %p");
    d3.select("#status").text("Last updated: " + formatTime(d3.isoParse(latest.timestamp)));
}

loadPsi().catch(err => {
    d3.select("#status").text("Failed to load: " + err);
});
