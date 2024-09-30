const marginVertical = {top: 60, right: 30, bottom: 70, left: 70},
    widthVertical = 800 - marginVertical.left - marginVertical.right,
    heightVertical = 500 - marginVertical.top - marginVertical.bottom; 

const svgVertical = d3.select("#verticalBarChart")
  .append("svg")
    .attr("width", widthVertical + marginVertical.left + marginVertical.right)
    .attr("height", heightVertical + marginVertical.top + marginVertical.bottom)
    .style("background-color", "#000E19")
  .append("g")
    .attr("transform", "translate(" + marginVertical.left + "," + marginVertical.top + ")");

d3.csv("sustainable_energy.csv").then(function(data) {
  const aggregatedData = Array.from(d3.group(data, d => d.Year), ([year, values]) => ({
    Year: year,
    AvgEnergyConsumption: d3.mean(values, d => +d['Primary energy consumption per capita (kWh/person)'])
  }));

  const xVertical = d3.scaleBand()
    .range([0, widthVertical])
    .domain(aggregatedData.map(d => d.Year))
    .padding(0.2);
  svgVertical.append("g")
    .attr("transform", "translate(0," + heightVertical + ")")
    .call(d3.axisBottom(xVertical))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "white");

  svgVertical.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", widthVertical / 2 )
    .attr("y", heightVertical + marginVertical.bottom - 5 )
    .style("fill", "white")
    .style("font-size", "20px") 
    .text("Year");

  const yVertical = d3.scaleLinear()
    .domain([0, d3.max(aggregatedData, d => d.AvgEnergyConsumption)])
    .range([heightVertical, 0]);
  svgVertical.append("g")
    .call(d3.axisLeft(yVertical).tickFormat(d => d3.format(".2s")(d)).ticks(10))
    .selectAll("text")
      .style("fill", "white");

  svgVertical.selectAll(".domain, .tick line")
    .attr("stroke", "white");

  svgVertical.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -60)
    .attr("x", -heightVertical / 5)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("fill", "white")
    .style("font-size", "20px")
    .text("Energy Consumption Per Capita");

  const tooltipVertical = d3.select("#verticalBarChart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "10px")
    .style("padding", "10px")
    .style("color", "white")
    .style("position", "absolute")
    .style("font-size", "30px");

  const showTooltipVertical = function(event, d) {
    tooltipVertical
    .transition()
    .duration(200);
    tooltipVertical
    .style("opacity", 1)
    .html("Year: " + d.Year + "<br>" +
            "Total Energy Consumption: " + d.AvgEnergyConsumption.toFixed(2) + " kWh/person")
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 30) + "px");
    };

  const moveTooltipVertical = function(event, d) {
    tooltipVertical
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 30) + "px");
    };

  const hideTooltipVertical = function(event, d) {
    tooltipVertical
    .transition()
    .duration(200)
    .style("opacity", 0);
    };

  svgVertical.selectAll("mybar")
    .data(aggregatedData)
    .join("rect")
      .attr("x", d => xVertical(d.Year))
      .attr("y", d => yVertical(d.AvgEnergyConsumption))
      .attr("width", xVertical.bandwidth())
      .attr("height", d => heightVertical - yVertical(d.AvgEnergyConsumption))
      .attr("fill", "#00CADC")
      .on("mouseover", showTooltipVertical)
      .on("mousemove", moveTooltipVertical)
      .on("mouseleave", hideTooltipVertical);

  svgVertical.append("text")
      .attr("x", (widthVertical / 2))             
      .attr("y", -30)
      .attr("text-anchor", "middle")  
      .style("font-size", "25px") 
      .style("fill", "white")
      .text("Energy Consumption Per Capita Over Time");
});
