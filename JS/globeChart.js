(async function() {
    const width = 600,
          height = 600;

    const canvas = d3.select("#map").append("canvas")
        .attr("width", width)
        .attr("height", height)
        .node();

    const context = canvas.getContext("2d");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    const select = d3.select("#country-select");

    const projection = d3.geoOrthographic()
        .scale(height / 2.5)
        .translate([width / 2, height / 2])
        .precision(0.1);

    const path = d3.geoPath(projection, context);

    const globe = {type: "Sphere"};

    try {
        const dataset = await d3.csv("sustainable_energy.csv");
        console.log("Dataset loaded", dataset);

        const countriesData = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
        console.log("Countries data loaded", countriesData);

        const countries = countriesData.features;
        console.log("Countries extracted", countries);

        const countryData = {};
        dataset.forEach(d => {
            const country = d.Country;
            if (!countryData[country]) {
                countryData[country] = {
                    count: 0,
                    totalRenewable: 0,
                    totalEnergy: 0,
                    totalGDP: 0,
                    totalElectricity: 0,
                    renewableShare: 0,
                    totalFossils: 0, 
                    totalNuclear: 0, 
                    totalRenewables: 0 
                };
            }
            countryData[country].count++;
            countryData[country].totalRenewable += +d['Renewable-electricity-generating-capacity-per-capita'] || 0;
            countryData[country].totalEnergy += +d['Primary energy consumption per capita (kWh/person)'] || 0;
            countryData[country].totalGDP += +d['gdp_per_capita'] || 0;
            countryData[country].totalElectricity += +d['Access to electricity (% of population)'] || 0;
            countryData[country].renewableShare += +d['Renewable energy share in the total final energy consumption (%)'] || 0;
            countryData[country].totalFossils += +d['Electricity from fossil fuels (TWh)'] || 0; 
            countryData[country].totalNuclear += +d['Electricity from nuclear (TWh)'] || 0; 
            countryData[country].totalRenewables += +d['Electricity from renewables (TWh)'] || 0; 
        });

        Object.keys(countryData).forEach(country => {
            const data = countryData[country];
            data.meanRenewable = data.totalRenewable / data.count;
            data.meanEnergy = data.totalEnergy / data.count;
            data.meanGDP = data.totalGDP / data.count;
            data.meanElectricity = data.totalElectricity / data.count;
            data.meanRenewableShare = data.renewableShare / data.count;
        });


        Object.keys(countryData).forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            select.node().appendChild(option);
        });

        let rotate = [0, 0];
        let velocity = 0.005;
        let lastTime = Date.now();
        let highlightedCountry = null;

        function render() {
            context.clearRect(0, 0, width, height);

            projection.rotate(rotate);

        
            context.beginPath();
            path(globe);
            context.fillStyle = "#000E19";
            context.fill();

    
            countries.forEach(function(d) {
                context.beginPath();
                path(d);
                if (highlightedCountry) {
                    context.fillStyle = d.properties.name === highlightedCountry ? "#00FF00" : "#666666";
                } else {
                    context.fillStyle = "#00FF00";
                }
                context.fill();
                context.lineWidth = 1.5;  
                context.strokeStyle = "#000";  
                context.stroke();
            });

            const now = Date.now();
            const deltaTime = now - lastTime;
            if (!highlightedCountry) {
                rotate[0] += velocity * deltaTime;
            }
            lastTime = now;

            requestAnimationFrame(render);
        }

        d3.select(canvas)
            .call(d3.drag()
                .on("start", dragStarted)
                .on("drag", dragged)
                .on("end", dragEnded))
            .on("mousemove", mouseMoved)
            .on("mouseout", mouseOut);

        function dragStarted(event) {
            velocity = 0;
        }

        function dragged(event) {
            const dx = event.dx;
            const dy = event.dy;
            rotate[0] += dx / 4;
            rotate[1] -= dy / 4;
            render();
        }

        function dragEnded(event) {
            velocity = highlightedCountry ? 0 : 0.01;
        }

        function mouseMoved(event) {
            const [x, y] = d3.pointer(event);
            const inverted = projection.invert([x, y]);

            const country = countries.find(d => {
                return d.geometry.coordinates.some(ring => {
                    return ring.some(([lng, lat]) => {
                        return d3.geoContains(d, inverted);
                    });
                });
            });

            if (country && countryData[country.properties.name]) {
                const data = countryData[country.properties.name];
                tooltip.style("opacity", 1)
                       .style("left", `${event.pageX + 10}px`)
                       .style("top", `${event.pageY + 10}px`)
                       .html(`
                           <strong>${country.properties.name}</strong><br/>
                           Renewable Electricity Generating Capacity per Capita: ${data.meanRenewable.toFixed(2)}<br/>
                           Primary Energy Consumption per Capita (kWh/person): ${data.meanEnergy.toFixed(2)}<br/>
                           GDP per Capita: ${data.meanGDP.toFixed(2)}
                       `);
            } else {
                tooltip.style("opacity", 0);
            }
        }

        function mouseOut(event) {
            tooltip.style("opacity", 0);
        }

        function flyToCountry(countryName) {
            const country = countries.find(d => d.properties.name === countryName);
            if (country) {
                const centroid = d3.geoCentroid(country);
                const targetRotate = [-centroid[0], -centroid[1]];
                const targetScale = height / 1.2;

                d3.transition()
                    .duration(2000)
                    .tween("rotate", () => {
                        const r = d3.interpolate(rotate, targetRotate);
                        const s = d3.interpolate(projection.scale(), targetScale);
                        return t => {
                            projection.rotate(r(t)).scale(s(t));
                            render();
                        };
                    })
                    .on("end", () => {
                        rotate = targetRotate;
                        projection.scale(targetScale);
                        highlightedCountry = countryName;
                        velocity = 0;  
                        showTooltip(countryName);
                        render();
                    });
            }
        }

        function showTooltip(countryName) {
            const country = countries.find(d => d.properties.name === countryName);
            const centroid = projection(d3.geoCentroid(country));
            const data = countryData[countryName];
            tooltip.style("opacity", 1)
                   .style("left", `${centroid[0] + width / 2}px`)
                   .style("top", `${centroid[1] + height / 2}px`)
                   .html(`
                       <strong>${countryName}</strong><br/>
                       Renewable Electricity Generating Capacity per Capita: ${data.meanRenewable.toFixed(2)}<br/>
                       Primary Energy Consumption per Capita (kWh/person): ${data.meanEnergy.toFixed(2)}<br/>
                       GDP per Capita: ${data.meanGDP.toFixed(2)}
                   `);
        }

        function updateStatistics(country) {
            const data = countryData[country];
        
            const total = data.totalFossils + data.totalNuclear + data.totalRenewables;
        
            const fossilsPercentage = (data.totalFossils / total * 100).toFixed(2);
            const nuclearPercentage = (data.totalNuclear / total * 100).toFixed(2);
            const renewablesPercentage = (data.totalRenewables / total * 100).toFixed(2);
        
            document.getElementById('fossils').textContent = isNaN(fossilsPercentage) ? '0.00%' : `${fossilsPercentage}%`;
            document.getElementById('nuclear').textContent = isNaN(nuclearPercentage) ? '0.00%' : `${nuclearPercentage}%`;
            document.getElementById('renewables').textContent = isNaN(renewablesPercentage) ? '0.00%' : `${renewablesPercentage}%`;
        
            document.getElementById('access-to-electricity').textContent = `${data.meanElectricity.toFixed(2)}%`;
            document.getElementById('renewable-energy-share').textContent = `${isNaN(data.meanRenewableShare) ? '0.00' : data.meanRenewableShare.toFixed(2)}%`;
            document.getElementById('energy-consumption-per-capita').textContent = `${data.meanEnergy.toFixed(2)} kWh`;
        }

        select.on("change", function() {
            const selectedCountry = select.property("value");
            if (selectedCountry) {
                flyToCountry(selectedCountry);
                updateAreaChart(selectedCountry);
                updateStatistics(selectedCountry);
                updateLineChart(selectedCountry);
                showTooltip(selectedCountry);  
            } else {
                highlightedCountry = null;
                projection.scale(height / 2.5);  
                velocity = 0.005; 
                tooltip.style("opacity", 0);
                render();
            }
        });

        render();
    } catch (error) {
        console.error("Error loading data: ", error);
    }
})();
