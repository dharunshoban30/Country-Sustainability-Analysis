const marginArea = {top: 70, right: 0, bottom: 55, left: 80},
    widthArea = 650 - marginArea.left - marginArea.right,
    heightArea = 750 - marginArea.top - marginArea.bottom;

d3.csv("sustainable_energy.csv").then(data => {

    const parsedData = data.map(d => ({
        Year: +d.Year,
        Country: d.Country,
        Fossils: +d['Electricity from fossil fuels (TWh)'],
        Nuclear: +d['Electricity from nuclear (TWh)'],
        Renewables: +d['Electricity from renewables (TWh)']
    }));


    const countries = Array.from(new Set(parsedData.map(d => d.Country))).sort();

    window.updateAreaChart = function(country) {
        const countryData = parsedData
            .filter(d => d.Country === country)
            .filter(d => !isNaN(d.Fossils) && !isNaN(d.Nuclear) && !isNaN(d.Renewables));

        
        countryData.sort((a, b) => a.Year - b.Year);

      
        const minFossils = d3.min(countryData, d => d.Fossils);
        const maxFossils = d3.max(countryData, d => d.Fossils);
        const minNuclear = d3.min(countryData, d => d.Nuclear);
        const maxNuclear = d3.max(countryData, d => d.Nuclear);
        const minRenewables = d3.min(countryData, d => d.Renewables);
        const maxRenewables = d3.max(countryData, d => d.Renewables);

   
        const normalizedData = countryData.map(d => ({
            Year: d.Year,
            Fossils: (d.Fossils - minFossils) / (maxFossils - minFossils),
            Nuclear: (d.Nuclear - minNuclear) / (maxNuclear - minNuclear),
            Renewables: (d.Renewables - minRenewables) / (maxRenewables - minRenewables),
            OriginalFossils: d.Fossils,
            OriginalNuclear: d.Nuclear,
            OriginalRenewables: d.Renewables
        }));

        
        const years = normalizedData.map(d => d.Year);
        const fossils = normalizedData.map(d => d.Fossils);
        const nuclear = normalizedData.map(d => d.Nuclear);
        const renewables = normalizedData.map(d => d.Renewables);
        const originalFossils = normalizedData.map(d => d.OriginalFossils);
        const originalNuclear = normalizedData.map(d => d.OriginalNuclear);
        const originalRenewables = normalizedData.map(d => d.OriginalRenewables);

        const traceFossils = {
            x: years,
            y: fossils,
            name: 'Fossils',
            type: 'scatter',
            mode: 'lines',
            fill: 'tozeroy',
            line: {color: 'rgba(0, 100, 0, 0.5)', width: 2}, 
            fillcolor: 'rgba(0, 100, 0, 0.5)', 
            hovertemplate: `
                <b>Year:</b> %{x}<br>
                <b>Fossils:</b> %{text} kWh/person
            `,
            text: originalFossils.map(value => value.toFixed(2)),
        };

        const traceNuclear = {
            x: years,
            y: nuclear,
            name: 'Nuclear',
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            line: {color: 'rgba(46, 139, 87, 0.5)', width: 2}, 
            fillcolor: 'rgba(46, 139, 87, 0.5)', 
            hovertemplate: `
                <b>Year:</b> %{x}<br>
                <b>Nuclear:</b> %{text} kWh/person
            `,
            text: originalNuclear.map(value => value.toFixed(2)),
        };

        const traceRenewables = {
            x: years,
            y: renewables,
            name: 'Renewables',
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            line: {color: 'rgba(152, 251, 152, 0.5)', width: 2}, 
            fillcolor: 'rgba(152, 251, 152, 0.5)', 
            hovertemplate: `
                <b>Year:</b> %{x}<br>
                <b>Renewables:</b> %{text} kWh/person
            `,
            text: originalRenewables.map(value => value.toFixed(2)),
        };

        const data = [traceFossils, traceNuclear, traceRenewables];

        const layout = {
            title: `Energy Sources in ${country}`,
            xaxis: {
                title: {
                    text: 'Year',
                    standoff: 20 
                }
            },
            yaxis: {
                title: {
                    text: 'Normalized Values',
                    standoff: 20 
                }
            },
            plot_bgcolor: '#000E19',
            paper_bgcolor: '#000E19',
            font: {
                color: 'white',
                size: 18 
            },
            margin: {
                l: marginArea.left,
                r: marginArea.right,
                b: marginArea.bottom,
                t: marginArea.top,
                pad: 10
            },
            width: widthArea,
            height: heightArea,
            legend: {
                x: 0,  
                y: 1,
                xanchor: 'left',
                yanchor: 'top',
                orientation: 'v',
                traceorder: 'normal',
                font: {
                    family: 'sans-serif',
                    size: 15,
                    color: 'white'
                },
                bgcolor: '#000E19',
                bordercolor: 'rgba(255,255,255,0.5)',
                borderwidth: 2
            },
            hoverlabel: {
                font: {
                    size: 25
                }
            }
        };

        Plotly.newPlot('area', data, layout);
    }
});
