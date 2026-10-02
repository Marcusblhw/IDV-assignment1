const API_URL = "https://api-open.data.gov.sg/v2/real-time/api/psi";

// NEA's official PSI bands. scaleThreshold maps a number to a band:
// 0-50 Good, 51-100 Moderate, 101-200 Unhealthy, 201-300 Very unhealthy, 301+ Hazardous
const BANDS = ["Good", "Moderate", "Unhealthy", "Very unhealthy", "Hazardous"];
const band = d3.scaleThreshold()
    .domain([51, 101, 201, 301])
    .range(BANDS);

// turns "Very unhealthy" into "band-very-unhealthy" so we can style it in CSS
const bandClass = name => "band-" + name.toLowerCase().replace(" ", "-");

// Only the PSI and the *_sub_index rows are on the PSI scale.
// The other rows are raw concentrations (ug/m3 or mg/m3), so the PSI bands don't apply to them
const isPsiScale = name => name === "psi_twenty_four_hourly" || name.endsWith("_sub_index");

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

    // the headline PSI row gets its own class so CSS can make it stand out
    tr.classed("psi-row", d => d.name === "psi_twenty_four_hourly");

    // 7. Inside each row, one <td> for the name, then one per region
    //    Each cell keeps a reference to its row name so we know whether to colour it
    tr.selectAll("td")
        .data(row => [
            { value: row.name, isName: true },
            ...regions.map(region => ({ value: row.values[region], psi: isPsiScale(row.name) }))
        ])
        .join("td")
        .attr("class", d => d.psi ? bandClass(band(d.value)) : null)
        .classed("raw", d => !d.isName && !d.psi)
        // title = tooltip on hover, so the band is not shown by colour alone
        .attr("title", d => d.psi ? band(d.value) : null)
        .text(d => d.value);

    // 7b. Summary line above the table, based on the 24-hr PSI across all regions
    const psiValues = regions.map(region => readings.psi_twenty_four_hourly[region]);
    const [low, high] = d3.extent(psiValues);
    const worst = band(high);
    const summary = d3.select("#summary").attr("class", bandClass(worst));
    summary.append("span").text("Air quality now: ");
    summary.append("strong").text(worst);
    summary.append("span").text(` (24-hr PSI ${low === high ? low : low + "–" + high} across regions)`);

    // 7c. Legend under the table, built from the same BANDS list so it always matches the colours
    const ranges = ["0–50", "51–100", "101–200", "201–300", "301+"];
    const legend = d3.select("#legend");
    legend.append("span").attr("class", "legend-title").text("PSI bands:");
    legend.selectAll("span.legend-item")
        .data(BANDS)
        .join("span")
        .attr("class", d => "legend-item " + bandClass(d))
        .text((d, i) => `${d} (${ranges[i]})`);

    // 8. Show when the data is from
    //    The API gives "2026-09-29T16:00:00+08:00", so turn it into a date, then format it
    //    %a = Tue, %-d = 29, %b = Sep, %Y = 2026, %-I:%M %p = 4:00 PM
    const formatTime = d3.timeFormat("%a, %-d %b %Y, %-I:%M %p");
    d3.select("#status").text("Last updated: " + formatTime(d3.isoParse(latest.timestamp)));
}

loadPsi().catch(err => {
    d3.select("#status").text("Failed to load: " + err);
});
