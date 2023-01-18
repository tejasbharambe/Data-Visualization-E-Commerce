// set the dimensions and margins of the graph
var margin = {top: 10, right: 400, bottom: 90, left: 150},
    width = 2000 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#my_dataviz3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("/data/orders_data.csv").then(
  function(d) {

    const grouped_data = d3.rollup(d, v => v.length, d => d.Day_of_week, t => t.Time_of_day)
    const sorter = {
        "Monday": 0,
        "Tueday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday": 4,
        "Saturday": 5,
        "Sunday": 6
    }

    var data_mapped = d3.map(grouped_data, function(d){ return{
                dow: d[0],
                Dawn: d[1].get("Dawn"),
                Morning: d[1].get("Morning"),
                Afternoon: d[1].get("Afternoon"),
                Night: d[1].get("Night")
            }
        })
    const ordered = []

    ordered.push(data_mapped[0])
    ordered.push(data_mapped[1])
    ordered.push(data_mapped[2])
    ordered.push(data_mapped[5])
    ordered.push(data_mapped[6])
    ordered.push(data_mapped[3])
    ordered.push(data_mapped[4])

    var data_mapped = ordered

    var subgroups = ["Dawn", "Morning", "Afternoon", "Night"]
    var groups = d3.map(data_mapped, function(d){ return (d.group) }).keys()
    var itr = 0
    var jtr = 0
    var ctr = 0
    var dtr = 0

    // X axis
    var x = d3.scaleBand()
      .range([ 0, width - 300 ])
      .domain(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
      .padding(0.2);

    svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "20px")
      .call(d3.axisBottom(x))
      

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 16200])
      .range([ height, 0]);

    svg2.append("g")
    .style("font-size", "20px")
      .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e5de44','#ffac00','#ff7900', '#053752'])

    var stackedData = d3.stack()
                        .keys(subgroups)
                        (data_mapped)


    // Bars
    let sc = svg2.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("class", "sub-g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.data.dow); })
    .attr("y", function(d) { return height + 500; })
    .attr("height", function(d) { return (height - y(d[1])); })
    .attr("width", x.bandwidth())

    sc.select("g")
    .data(stackedData)
    .enter()
    .selectAll(".sub-g")
    .data(function (e) {return e})
    .enter()
    .append("text")
    .attr("x", function(d) { return x(d.data.dow) + 45; })
    .attr("y", function(d) { return (y(d[0]) + y(d[1])) / 2; })
    .text(d => {
        if(jtr == 7){
            itr = itr + 1
            jtr = 0}

        var selection = d.data[subgroups[itr%4]]
        jtr = jtr + 1
        return selection
    }
    )
    .attr("fill", d => {
        if(dtr == 7){
            ctr = ctr + 1
            dtr = 0
        }
        if(ctr == 14 || ctr == 15){
            return "white"
        }
        dtr = dtr + 1
    })
    .style("font-size", "16px")
    .style("opacity", 0);

    svg2.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(d[1])})
    .attr("height", function(d) { return (y(d[0]) - y(d[1]))})
    .delay(function(d, i) {return i*30})

    svg2.selectAll("text")
    .transition()
    .duration(900)
    .style("opacity", 1)
    .delay(function(d, i) {return i * 30})

    // add legend
    svg2.append("circle")
    .attr("cx", width - 200)
    .attr("cy", 100)
    .attr("r", 10)
    .style("fill", "#053752")

    svg2.append("text")
    .attr("x", width - 180)
    .attr("y", 100)
    .text("Night")
    .style("font-size", "20px")
    .attr("alignment-baseline","middle")

    svg2.append("circle")
    .attr("cx", width - 200)
    .attr("cy", 140)
    .attr("r", 10)
    .style("fill", "#ff7900")

    svg2.append("text")
    .attr("x", width - 180)
    .attr("y", 140)
    .text("Afternoon")
    .style("font-size", "20px")
    .attr("alignment-baseline","middle")

    svg2.append("circle")
    .attr("cx", width - 200)
    .attr("cy", 180)
    .attr("r", 10)
    .style("fill", "#ffac00")

    svg2.append("text")
    .attr("x", width - 180)
    .attr("y", 180)
    .text("Morning")
    .style("font-size", "20px")
    .attr("alignment-baseline","middle")

    svg2.append("circle")
    .attr("cx", width - 200)
    .attr("cy", 220)
    .attr("r", 10)
    .style("fill", "#e5de44")

    svg2.append("text")
    .attr("x", width - 180)
    .attr("y", 220)
    .text("Dawn")
    .style("font-size", "20px")
    .attr("alignment-baseline","middle")

    svg2.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width/2 - 120)
            .attr("y", height + 70)
            .style("font-size", "25px")
            .text("Day of Week");

    svg2.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -120)
        .attr("x", -250)
        .style("font-size", "20px")
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Number of Orders");

})



