var apiUrl = "https://api.coindesk.com/v1/bpi/historical/close.json?start=2016-12-31&end=2018-09-22";

document.addEventListener ("DOMContentLoaded", function (event) {
    fetch (apiUrl)
        .then (function (response) {
            return response.json ();
        })
        .then (function (data) {
            var parsedData = parseData (data);
            drawChart (parsedData);
        });
});

function parseData (data) {
    var parsedData = [];

    for (var i in data.bpi) {
        parsedData.push ({
            date: new Date (i),
            value: +data.bpi[i] //convert string to number
        }); 
    } 

    return parsedData;
}

function drawChart (data) {
    var margin = { 
        top: 20, 
        right: 20,
        bottom: 30,
        left: 50
    };
    
    var svgWidth = 600, 
    svgHeight = 400,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;
    
    var xScale = d3.scaleTime ().rangeRound ([0, width]),
        yScale = d3.scaleLinear ().rangeRound ([height, 0]);
 
    xScale.domain (d3.extent (data, function (d) {
        return d.date;
    }));
    yScale.domain (d3.extent (data, function (d) {
        return d.value;
    }))
        
    var svg = d3.select ("svg")
        .attr ("width", svgWidth)
        .attr ("height", svgHeight);
        
    var g = svg.append ("g")
        .attr ("transform",
            "translate(" + margin.left + "," + margin.top + ")"
        );

    g.append ("g")
        .attr ("transform", "translate(0," + height + ")")
        .call (d3.axisBottom (xScale));

    g.append ("g")
        .call (d3.axisLeft (yScale))
        .append ("text")
        .attr ("fill", "#000")
        .attr ("transform", "rotate(-90)")
        .attr ("y", 6)
        .attr ("dy", "0.71em")
        .attr ("text-anchor", "end")
        .text ("Price ($)");
    
    var line = d3.line ()
        .x (function (d) {
            return xScale (d.date);
        })
        .y (function (d) {
            return yScale (d.value);
        });       

    g.append ("path")
        .datum (data)
        .attr ("fill", "none")
        .attr ("stroke", "red")
        .attr ("stroke-linejoin", "round")
        .attr ("stroke-linecap", "round")
        .attr ("stroke-width", 1.5)
        .attr ("d", line);
}