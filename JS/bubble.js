const marginBubble = {top: 50, right: 10, bottom: 60, left: 50},
    widthBubble = 800 - marginBubble.left - marginBubble.right,
    heightBubble = 700 - marginBubble.top - marginBubble.bottom;

const svgBubble = d3.select("#bubble")
  .append("svg")
    .attr("width", widthBubble + marginBubble.left + marginBubble.right)
    .attr("height", heightBubble + marginBubble.top + marginBubble.bottom)
    .style("background-color", "#000E19")
  .append("g")
    .attr("transform", `translate(${marginBubble.left},${marginBubble.top})`);

d3.csv("sustainable_energy.csv").then(function(data) {
  const nestedDataBubble = d3.groups(data, d => d.Year, d => d.Region)
    .map(([year, regions]) => ({
      year: +year,
      regions: regions.map(([region, values]) => ({
        Region: region,
        Density: d3.mean(values, d => +d["Density"]),
        RenewableCapacity: d3.mean(values, d => +d["Renewable-electricity-generating-capacity-per-capita"]),
        AccessToElectricity: d3.mean(values, d => +d["Access to electricity (% of population)"])
      }))
    }));

  const xBubble = d3.scaleLinear()
    .domain([0, d3.max(nestedDataBubble, d => d3.max(d.regions, r => r.RenewableCapacity)) * 1.1])
    .range([0, widthBubble]);
  svgBubble.append("g")
    .attr("transform", `translate(0, ${heightBubble})`)
    .call(d3.axisBottom(xBubble).ticks(5))
    .selectAll("text")
      .style("fill", "white");

  svgBubble.selectAll(".domain, .tick line")
    .attr("stroke", "white");

  svgBubble.append("text")
      .attr("text-anchor", "end")
      .attr("x", widthBubble / 1.2)
      .attr("y", heightBubble + 50)
      .style("fill", "white")
      .style("font-size", "20px")
      .text("Renewable Electricity Generating Capacity Per Capita");

  const yBubble = d3.scaleLinear()
    .domain([0, d3.max(nestedDataBubble, d => d3.max(d.regions, r => r.AccessToElectricity))])
    .range([heightBubble, 0]);
  svgBubble.append("g")
    .call(d3.axisLeft(yBubble).ticks(5))
    .selectAll("text")
      .style("fill", "white");

  svgBubble.selectAll(".domain, .tick line")
    .attr("stroke", "white");

  svgBubble.append("text")
      .attr("text-anchor", "end")
      .attr("x", -heightBubble / 2)
      .attr("y", -30)
      .attr("transform", "rotate(-90)")
      .style("fill", "white")
      .style("font-size", "20px")
      .text("Access to Electricity (% of Population)")
      .attr("text-anchor", "middle");

  const zBubble = d3.scaleSqrt()
    .domain([0, d3.max(data, d => +d["Density"])])
    .range([1, 200]);

  const myColorBubble = d3.scaleOrdinal()
    .domain(nestedDataBubble[0].regions.map(d => d.Region))
    .range(d3.schemeSet1);

  const tooltipBubble = d3.select("#bubble")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
    .style("position", "absolute")
    .style("font-size", "30px");

  const showTooltipBubble = function(event, d) {
    tooltipBubble
    .transition()
    .duration(200);
    tooltipBubble
    .style("opacity", 1)
    .html("Region: " + d.Region + "<br>" +
            "Density (P/Km2): " + d.Density.toFixed(2) + "<br>" +
            "Avg. Access to Electricity (%): " + d.AccessToElectricity.toFixed(2) + "<br>" +
            "Avg. Renewable Electricity Capacity Per Capita: " + d.RenewableCapacity.toFixed(2))
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 30) + "px");
    };

  const moveTooltipBubble = function(event, d) {
    tooltipBubble
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 30) + "px");
    };

  const hideTooltipBubble = function(event, d) {
    tooltipBubble
    .transition()
    .duration(200)
    .style("opacity", 0);
    };

  let yearIndexBubble = 0;

  function updateGraphBubble() {
    const currentYearDataBubble = nestedDataBubble[yearIndexBubble];
    yearLabelBubble.text(currentYearDataBubble.year);

    const bubbles = svgBubble.selectAll(".bubbles")
      .data(currentYearDataBubble.regions, d => d.Region);

    bubbles
      .transition()
      .duration(1000)
      .attr("cx", d => xBubble(d.RenewableCapacity))
      .attr("cy", d => yBubble(d.AccessToElectricity))
      .attr("r", d => zBubble(d.Density));

    bubbles.enter()
      .append("circle")
      .attr("class", d => "bubbles " + d.Region)
      .attr("cx", d => xBubble(d.RenewableCapacity))
      .attr("cy", d => yBubble(d.AccessToElectricity))
      .attr("r", d => zBubble(d.Density))
      .style("fill", d => myColorBubble(d.Region))
      .style("opacity", 0.7)
      .on("mouseover", showTooltipBubble)
      .on("mousemove", moveTooltipBubble)
      .on("mouseleave", hideTooltipBubble);

    bubbles.exit().remove();
  }

const playButtonBubble = svgBubble.append("text")
  .attr("x", widthBubble - 75)
  .attr("y", 250)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("fill", "white")
  .style("cursor", "pointer")
  .text("Play");

svgBubble.append("rect")
  .attr("x", widthBubble - 110)
  .attr("y", 230)
  .attr("width", 70)
  .attr("height", 30)
  .style("fill", "none")
  .style("stroke", "white")
  .style("stroke-width", 3);

const yearLabelBubble = svgBubble.append("text")
  .attr("x", widthBubble - 75)
  .attr("y", 220)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .style("fill", "white");

svgBubble.append("rect")
  .attr("x", widthBubble - 110)
  .attr("y", 200)
  .attr("width", 70)
  .attr("height", 30)
  .style("fill", "none")
  .style("stroke", "white")
  .style("stroke-width", 3);

function playBubble() {
  if (yearIndexBubble < nestedDataBubble.length - 1) {
    yearIndexBubble++;
  } else {
    yearIndexBubble = 0;
  }
  updateGraphBubble();
}

playButtonBubble.on("click", function() {
  d3.interval(playBubble, 500);
});

updateGraphBubble();

const sizeBubble = 15;
const allgroupsBubble = nestedDataBubble[0].regions.map(d => d.Region);

const legendBubble = svgBubble.append("g")
  .attr("transform", `translate(${widthBubble - 100}, 300)`);

legendBubble.selectAll("myrect")
  .data(allgroupsBubble)
  .join("circle")
    .attr("cx", -20)
    .attr("cy", (d,i) => 9 + i*(sizeBubble+5))
    .attr("r", 7)
    .style("fill", d => myColorBubble(d))
    .on("mouseover", function(event, d){
      d3.selectAll(".bubbles").style("opacity", .05);
      d3.selectAll("." + d).style("opacity", 1);
    })
    .on("mouseleave", function(event, d){
      d3.selectAll(".bubbles").style("opacity", 1);
    });

legendBubble.selectAll("mylabels")
  .data(allgroupsBubble)
  .enter()
  .append("text")
    .attr("x", 0.5)
    .attr("y", (d,i) => 10 + i*(sizeBubble + 5))
    .style("fill", d => myColorBubble(d))
    .style("font-size", "12px") 
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", function(event, d){
      d3.selectAll(".bubbles").style("opacity", .05);
      d3.selectAll("." + d).style("opacity", 1);
    })
    .on("mouseleave", function(event, d){
      d3.selectAll(".bubbles").style("opacity", 1);
    });

legendBubble.append("rect")
  .attr("x", -40)
  .attr("y", -5)
  .attr("width", 140)
  .attr("height", allgroupsBubble.length * (sizeBubble + 5) + 10)
  .style("fill", "none")
  .style("stroke", "white")
  .style("stroke-width", 3);

  // Title
svgBubble.append("text")
    .attr("x", (widthBubble / 2))             
    .attr("y", marginBubble.top / 50)
    .attr("text-anchor", "middle")  
    .style("font-size", "25px") 
    .style("fill", "white")
    .text("Renewable Energy Capacity vs Financial Flow of Regions");
});
