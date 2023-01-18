// set the dimensions and margins of the graph
var margin = {top: 10, right: 400, bottom: 90, left: 150},
    width = 2000 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg4 = d3.select("#my_dataviz4")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("/data/MoM_comparison.csv").then(
  function(d) {

    // console.log("Data", d);
    var subgroups = d.columns.slice(1);
    // console.log("subgroups", subgroups);
    var groups = d3.map(d, function(d) { return d.Month })
    // console.log("groups", groups);

    // X axis
    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])

    svg4.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "20px")
        .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 8000])
        .range([ height, 0 ]);
  
    svg4.append("g")
    .style("font-size", "20px")
    .call(d3.axisLeft(y));

    var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8'])

    svg4.append("g")
        .selectAll("g")
        .data(d)
        .enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.Month) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return (y(d.value)); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("text", function(d) {return (d.value)})
        .attr("fill", function(d) { return color(d.key); })
        ;

    svg4.append("circle")
    .attr("cx", width - 100)
    .attr("cy", 10)
    .attr("r", 10)
    .style("fill", "#e41a1c")

    svg4.append("text")
    .attr("x", width - 80)
    .attr("y", 13)
    .text("2017")
    .style("font-size", "20px")
    .attr("alignment-baseline","middle")

    svg4.append("circle")
    .attr("cx", width - 100)
    .attr("cy", 40)
    .attr("r", 10)
    .style("fill", "#377eb8")

    svg4.append("text")
    .attr("x", width - 80)
    .attr("y", 43)
    .text("2018")
    .style("font-size", "20px")
    .attr("alignment-baseline","middle")

    svg4.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -120)
            .attr("x", -250)
            .style("font-size", "20px")
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Number of Orders");

})
