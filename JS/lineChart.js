const margin = {top: 40, right: 30, bottom: 40, left: 60},
    width = 630 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

const svg = d3.select("#lineChart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "#000E19")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("sustainable_energy.csv").then(function(data) {
  data.forEach(function(d) {
    d.year = d3.timeParse("%Y")(d.Year);
    d.renewableCapPerCapita = +d['Renewable-electricity-generating-capacity-per-capita'];
  });

  let averageData = Array.from(d3.group(data, d => d.year.getFullYear()), ([key, value]) => ({
    year: d3.timeParse("%Y")(key),
    avgRenewableCap: d3.mean(value, d => d.renewableCapPerCapita)
  }));

  const x = d3.scaleTime()
    .domain(d3.extent(averageData, d => d.year))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")))
    .selectAll("text")
      .style("fill", "white");

  svg.selectAll(".domain, .tick line")
    .attr("stroke", "white");

  svg.append("text")
    .attr("fill", "white")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Year");

  const y = d3.scaleLinear()
    .domain([0, d3.max(averageData, d => d.avgRenewableCap)])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(10))
    .selectAll("text")
      .style("fill", "white");

  svg.selectAll(".domain, .tick line")
    .attr("stroke", "white");

  svg.append("text")
    .attr("fill", "white")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Generating Capacity");

  svg.append("path")
    .datum(averageData)
    .attr("fill", "none")
    .attr("stroke", "#00CADC")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
      .x(d => x(d.year))
      .y(d => y(d.avgRenewableCap))
    );

  const tooltip = d3.select("#lineChart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
    .style("position", "absolute")
    .style("font-size", "30px");

  const showTooltip = function(event, d) {
    tooltip
    .transition()
    .duration(200);
    tooltip
    .style("opacity", 1)
    .html("Year: " + d.year.getFullYear() + "<br>" +
            "Total Renewable Capacity: " + d.avgRenewableCap.toFixed(2) + " Watts per Capita")
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 30) + "px");
  };

  const moveTooltip = function(event, d) {
    tooltip
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 30) + "px");
  };

  const hideTooltip = function(event, d) {
    tooltip
    .transition()
    .duration(200)
    .style("opacity", 0);
  };

  svg.selectAll("dot")
    .data(averageData)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y(d.avgRenewableCap))
    .attr("r", 4)
    .attr("fill", "#00CADC")
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  svg.append("text")
      .attr("x", width / 2)             
      .attr("y", -20)
      .attr("text-anchor", "middle")  
      .style("font-size", "20px") 
      .style("fill", "white")
      .text("Renewable Energy Generating Capacity Per Capita Over Time");
});
