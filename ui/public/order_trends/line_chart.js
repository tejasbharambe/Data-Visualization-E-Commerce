// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 90, left: 150},
    width = 2000 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


d3.csv('/data/orders_data.csv').then(
    function(d){
        const grouped_data = d3.rollup(d, v => v.length, d => d.Year_Month)
        var parseDate = d3.timeParse("%Y-%m");
        const formatTime = d3.timeFormat("%B, %Y")

        var data_mapped = d3.map(grouped_data, function(d){return{date: parseDate(d[0]), value: d[1]}})

        var data = data_mapped.slice().sort((a, b) => d3.ascending(a.date, b.date))

        var x = d3.scaleTime()
        .domain(d3.extent(data, function(d){ return d.date}))
        .range([0, width]);

        svg.append('g')
        .style("font-size", "20px")
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

        const max = d3.max(data, function(d){ return +d.value})

        var y = d3.scaleLinear()
        .domain([0, max])
        .range([height, 0])

        svg.append('g')
        .style("font-size", "20px")
        .call(d3.axisLeft(y))

        var bisect = d3.bisector(function(d) { return d.date; }).left;

        var focus = svg.append('g')
                    .append('circle')
                    .style("fill", "yellow")
                    .attr("stroke", "black")
                    .attr('r', 4.5)
                    .style("opacity", 10)

        var focusText = svg.append('g')
                            .append('text')
                            .style("opacity", 0)
                            .style("font-size", "25px")
                            .attr("text-anchor", "left")
                            .attr("alignment-baseline", "middle")

        // Set the gradient
        svg.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", y(0))
            .attr("x2", 0)
            .attr("y2", y(max))
            .selectAll("stop")
            .data([
                {offset: "0%", color: "blue"},
                {offset: "100%", color: "red"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });


        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "url(#line-gradient)" )
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width/2)
            .attr("y", height + 70)
            .style("font-size", "25px")
            .text("Date");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -120)
            .attr("x", -250)
            .style("font-size", "20px")
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Number of Orders");

        svg.append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

        function mouseover() {
            focus.style("opacity", 1)
            focusText.style("opacity",1)
            }
        
        function mousemove(e) {
            // recover coordinate we need
            var x0 = x.invert(d3.pointer(e, svg.node())[0]);
            var i = bisect(data, x0, 1);
            selectedData = data[i]
            focus
                .attr("cx", x(selectedData.date))
                .attr("cy", y(selectedData.value))
            focusText
                .html(formatTime(selectedData.date) + " => " + selectedData.value + " orders")
                .attr("x", x(selectedData.date)+15)
                .attr("y", y(selectedData.value))
            }
        
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
            }
    }
)
