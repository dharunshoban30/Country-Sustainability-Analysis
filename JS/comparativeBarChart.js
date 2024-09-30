d3.csv("sustainable_energy.csv").then(function(data) {
    data.forEach(d => {
        d["Renewable energy share in the total final energy consumption (%)"] = +d["Renewable energy share in the total final energy consumption (%)"];
    });

    const countryData = d3.rollups(data, 
        v => d3.mean(v, d => d["Renewable energy share in the total final energy consumption (%)"]), 
        d => d.Country
    ).map(d => ({ Country: d[0], "Renewable energy share in the total final energy consumption (%)": d[1] }));

    const nonZeroData = countryData.filter(d => d["Renewable energy share in the total final energy consumption (%)"] > 0);
    const sortedData = nonZeroData.sort((a, b) => b["Renewable energy share in the total final energy consumption (%)"] - a["Renewable energy share in the total final energy consumption (%)"]);

    const top5Highest = sortedData.slice(0, 5);
    const top5Lowest = sortedData.slice(-5).reverse();

    const margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = 630 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    const svg = d3.select("#comparativeBarChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#000E19")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xHighest = d3.scaleLinear()
        .range([0, width / 2 - 10])
        .domain([0, d3.max(sortedData, d => d["Renewable energy share in the total final energy consumption (%)"])]);

    const xLowest = d3.scaleLinear()
        .range([0, width - 50])
        .domain([0, d3.max(top5Lowest, d => d["Renewable energy share in the total final energy consumption (%)"])]);

    const yHighest = d3.scaleBand()
        .range([0, height / 2 - 10])
        .domain(top5Highest.map(d => d.Country))
        .padding(0.1);

    const yLowest = d3.scaleBand()
        .range([height / 2 + 10, height])
        .domain(top5Lowest.map(d => d.Country))
        .padding(0.1);

    svg.selectAll(".bar.highest")
        .data(top5Highest)
        .enter()
        .append("rect")
        .attr("class", "bar highest")
        .attr("x", d => width / 2 - xHighest(d["Renewable energy share in the total final energy consumption (%)"]) * 0.9)
        .attr("y", d => yHighest(d.Country))
        .attr("width", d => xHighest(d["Renewable energy share in the total final energy consumption (%)"]) * 0.9)
        .attr("height", yHighest.bandwidth())
        .style("fill", "#06B460");

    svg.selectAll(".label.highest")
        .data(top5Highest)
        .enter()
        .append("text")
        .attr("class", "label highest")
        .attr("x", width / 2 + 15)
        .attr("y", d => yHighest(d.Country) + yHighest.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("font-size", "20px")
        .text(d => `${d.Country} (${d["Renewable energy share in the total final energy consumption (%)"].toFixed(2)}%)`)
        .style("fill", "white");

    svg.selectAll(".bar.lowest")
        .data(top5Lowest)
        .enter()
        .append("rect")
        .attr("class", "bar lowest")
        .attr("x", width / 2 + 10)
        .attr("y", d => yLowest(d.Country))
        .attr("width", (d, i) => i >= 3 ? xLowest(d["Renewable energy share in the total final energy consumption (%)"]) / 2 : xLowest(d["Renewable energy share in the total final energy consumption (%)"]))
        .attr("height", yLowest.bandwidth())
        .style("fill", "#BB0606");

    svg.selectAll(".label.lowest")
        .data(top5Lowest)
        .enter()
        .append("text")
        .attr("class", "label lowest")
        .attr("x", width / 2 - 15)
        .attr("y", d => yLowest(d.Country) + yLowest.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .style("font-size", "20px")
        .text(d => `${d.Country} (${d["Renewable energy share in the total final energy consumption (%)"].toFixed(2)}%)`)
        .style("fill", "white");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .style("fill", "white")
        .text("Top 5 Highest and Lowest Country Renewable Energy Rankings");
}).catch(error => {
    console.error('Error loading or parsing data:', error);
});
