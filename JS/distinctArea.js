const marginBubble = {top: 50, right: 10, bottom: 50, left: 70},
    widthBubble = 900 - marginBubble.left - marginBubble.right,
    heightBubble = 650 - marginBubble.top - marginBubble.bottom;

d3.csv("sustainable_energy.csv").then(data => {
    const parsedData = data.map(d => ({
        Year: +d.Year,
        Country: d.Country,
        Renewable: +d['Renewable-electricity-generating-capacity-per-capita'],
        Primary: +d['Primary energy consumption per capita (kWh/person)']
    }));

    const countries = Array.from(new Set(parsedData.map(d => d.Country))).sort();

    window.updateLineChart = function(country) {
        const countryData = parsedData
            .filter(d => d.Country === country)
            .filter(d => !isNaN(d.Renewable) && !isNaN(d.Primary)); 

        countryData.sort((a, b) => a.Year - b.Year);

        const minRenewable = d3.min(countryData, d => d.Renewable);
        const maxRenewable = d3.max(countryData, d => d.Renewable);
        const minPrimary = d3.min(countryData, d => d.Primary);
        const maxPrimary = d3.max(countryData, d => d.Primary);

        const normalizedData = countryData.map(d => ({
            Year: d.Year,
            Renewable: (d.Renewable - minRenewable) / (maxRenewable - minRenewable),
            Primary: (d.Primary - minPrimary) / (maxPrimary - minPrimary),
            OriginalRenewable: d.Renewable,
            OriginalPrimary: d.Primary
        }));

        const years = normalizedData.map(d => d.Year);
        const renewable = normalizedData.map(d => d.Renewable);
        const primary = normalizedData.map(d => d.Primary);
        const originalRenewable = normalizedData.map(d => d.OriginalRenewable);
        const originalPrimary = normalizedData.map(d => d.OriginalPrimary);

        const trace1 = {
            x: years,
            y: renewable,
            name: 'Generation',
            type: 'scatter',
            mode: 'lines',
            fill: 'tozeroy',
            line: {color: 'lightgreen', width: 2},
            fillcolor: 'rgba(144,238,144,0.5)',
            hovertemplate: `
                <b>Year:</b> %{x}<br>
                <b>Generation:</b> %{text} kWh/person 
            `,
            text: originalRenewable.map(value => value.toFixed(2))
        };

        const trace2 = {
            x: years,
            y: primary,
            name: 'Consumption',
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            line: {color: 'steelblue', width: 2},
            fillcolor: 'rgba(70,130,180,0.5)', 
            hovertemplate: `
                <b>Year:</b> %{x}<br>
                <b>Consumption:</b> %{text} kWh/person 
            `,
            text: originalPrimary.map(value => value.toFixed(2))
        };

        const data = [trace1, trace2];

        const layout = {
            title: `Energy Generation vs Consumption Per Capita in ${country}`,
            xaxis: {title: 'Year'},
            yaxis: {title: 'Normalized Values'},
            plot_bgcolor: '#000E19',
            paper_bgcolor: '#000E19',
            font: {
                color: 'white',
                size: 18  
            },
            margin: {
                l: marginBubble.left,
                r: marginBubble.right,
                t: marginBubble.top,
                b: marginBubble.bottom
            },
            width: widthBubble,
            height: heightBubble,
            legend: {
                x: 0,
                y: 1,
                xanchor: 'left',
                yanchor: 'top',
                bgcolor: 'rgba(0,0,0,0)',
                font: {
                    color: 'white',
                    size: 20
                },
                bordercolor: 'white',  
                borderwidth: 2  
            },
            hoverlabel: {
                font: {
                    size: 30
                }
            }
        };

        Plotly.newPlot('linechart', data, layout);
    }
});
