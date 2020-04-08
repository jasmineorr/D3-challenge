// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var chart = d3.select("#scatter").append("div").classed("chart", true);

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("#scatter")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Retrieve data from the CSV file 
d3.csv("data.csv").then(function(healthData) {
    console.log(healthData);
      //Parse data
    healthData.forEach(function(data) {
      data.income = +data.income;
      data.obesity = +data.obesity;
    });
    //Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([35000, d3.max(healthData, d => d.income)])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(healthData, d => d.obesity)])
        .range([height, 0]);
    
    // Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // Add axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");
    
    // Append state abbreviations
    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(healthData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.income);
            })
            .attr("y", function(data) {
                return yLinearScale(data.obesity);
            })
            .text(function(data) {
                return data.abbr
            });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obese (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Household Income");
  });