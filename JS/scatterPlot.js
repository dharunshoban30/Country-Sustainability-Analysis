d3.csv("sustainable_energy.csv").then(data => {
    const groupedData = d3.group(data, d => d.Country);

    const countryMeans = [];

    groupedData.forEach((countryData, country) => {
        const meanGdpPerCapita = d3.mean(countryData, d => +d.gdp_per_capita || null);
        const meanPrimaryEnergyConsumption = d3.mean(countryData, d => +d['Primary energy consumption per capita (kWh/person)'] || null);

        if (meanGdpPerCapita && meanPrimaryEnergyConsumption && meanGdpPerCapita !== 0 && meanPrimaryEnergyConsumption !== 0) {
            countryMeans.push({
                country: country,
                meanGdpPerCapita: meanGdpPerCapita,
                meanPrimaryEnergyConsumption: meanPrimaryEnergyConsumption
            });
        }
    });

    const margin = { top: 50, right: 0, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;


    const svg = d3.select("#scatterPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#000E19")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLog()
        .domain([100, 90000])
        .range([0, width])
        .nice();

    const yScale = d3.scaleLog()
        .domain([100, 150000])
        .range([height, 0]);

    const customTicks = [100, 500, 1000, 5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000];

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickValues(customTicks).tickFormat(d3.format("~s")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-45)")
        .style("fill", "white");

    svg.selectAll(".domain, .tick line")
        .attr("stroke", "white");

    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(5, "~s"))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "-0.5em")
        .attr("transform", "rotate(-45)")
        .style("fill", "white");

    svg.selectAll(".domain, .tick line")
        .attr("stroke", "white");

    svg.selectAll(".dot")
        .data(countryMeans)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.meanGdpPerCapita))
        .attr("cy", d => yScale(d.meanPrimaryEnergyConsumption))
        .attr("r", 4)
        .attr("fill", "white")
        .attr("stroke", "#00CADC")
        .attr("stroke-width", 2)
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<strong>Country:</strong> ${d.country}<br>
                          <strong>Average GDP per capita:</strong> ${d.meanGdpPerCapita.toFixed(2)}<br>
                          <strong>Average Primary energy consumption:</strong> ${d.meanPrimaryEnergyConsumption.toFixed(2)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 5)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "20px")
        .text("Average GDP per capita");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left )
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "20px")
        .text("Average Primary Energy Consumption");

    const tooltip = d3.select("#scatterPlot")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "rgba(0, 0, 0, 0.7)")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("font-size", "30px");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "21px")
        .style("fill", "white")
        .text("GDP per Capita vs Access to Electricity (% of Population)");
});
