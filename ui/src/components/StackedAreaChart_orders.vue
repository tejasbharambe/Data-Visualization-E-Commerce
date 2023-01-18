<template>
    <div class="container-fluid">
      <div class="row justify-content-md-center">
        <h1>Comparing number of orders shipped, delivered and cancelled</h1>
        <div class="row text-left">
            <ul>
                <li>
                    <p style="font-size: 20px">
                        This area chart visualizes the number of orders delivered out of all the orders that were shipped,
                        which is important as it shows the efficieny of the delivery partners.
                    </p>
                </li>
                <li>
                    <p style="font-size: 20px">
                        A red area on the map also shows the number of orders that were cancelled after they were shipped.
                        A high ratio of this metric indicates the wastage of resources. The Brazilian e-commerce industry
                        shows promise with a very small ratio of number of orders cancelled after shipping.
                    </p>
                </li>
            </ul>
        </div>
        <svg id="stacked-area-chart-orders" width="900" height="500"></svg>
        </div>
    </div>

  </template>
  <script>
  import * as d3 from "d3";

  export default {
    name: "StackedAreaChartOrders",
    methods: {
        StackedAreaChartOrdersrender(data) {
        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 10, bottom: 80, left: 100},
        width = 1100 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var svg6 = d3.select("#stacked-area-chart-orders")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var parseDate = d3.timeParse("%y-%b");

        var sources = data.columns.slice(1).map(function(id) {
            return {
            id: id,
            values: data.map(function(d) {
                return {date: parseDate(d.year_month), vals: +d[id]};
            })
            };
        });

        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return parseDate(d.year_month); }))
            .range([0, width])

        var xAxis = svg6.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .style("font-size", "15px")
            .call(d3.axisBottom(x))
            .append("text")
                // .attr("transform", "rotate(-90)")
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .attr("y", 40)
                .attr("x", (width / 2) - 100)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Date");

        var y = d3.scaleLinear()
        .domain([0,
            d3.max(sources, function(c) { return d3.max(c.values, function(d) { return d.vals; }); })
            ])
            .range([height, 0])

        svg6.append("g")
                .attr("class", "axis axis--y")
                .style("font-size", "15px")
                .call(d3.axisLeft(y))
            .append("text")
                .attr("transform", "rotate(-90)")
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .attr("y", -100)
                .attr("x", -130)
                .attr("dy", "0.75em")
                .attr("fill", "#000")
                .text("Number of orders");

        var color = d3.scaleOrdinal()
            .domain(["shipped", "delivered", "cancelled"])
            .range(["rgba(249, 208, 87, 0.7)", "rgba(54, 174, 175, 0.5)", "rgba(254, 2, 4, 1)"]);

        var z = color;

        z.domain(sources.map(function(c) { return c.id; }));

        svg6.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width )
                .attr("height", height )
                .attr("x", 0)
                .attr("y", 0);

        var brush = d3.brushX()
                    .extent( [ [0,0], [width,height] ] )
                    .on("end", updateChart);

        var areaChart = svg6.append('g')
                .attr("clip-path", "url(#clip)");

        var area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x(d.date); })
        .y0(y(0))
        .y1(function(d) { return y(d.vals); });

        areaChart.selectAll("mylayers")
                .data(sources)
                .enter()
                .append("g")
                .attr("class", function(d) { return `area ${d.id}`; })
                .append('path')
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return z(d.id); });
        // .attr("d", area)

        areaChart
            .append("g")
            .attr("class", "brush")
            .call(brush);

        var idleTimeout
        function idled() { idleTimeout = null; }

        // A function that update the chart for given boundaries
        function updateChart({selection}) {

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!selection){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain(d3.extent(data, function(d) {return parseDate(d.year_month)}))

            }else{
            x.domain([ x.invert(selection[0]), x.invert(selection[1]) ])
            areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
            areaChart
            .selectAll("path")
            .transition().duration(1000)
            .attr("d", function(d) { return area(d.values); })
        }

        svg6.append("circle")
        .attr("cx", 20)
        .attr("cy", 10)
        .attr("r", 7)
        .style("fill", "rgba(249, 208, 87, 0.7)")

        svg6.append("text")
        .attr("x", 35)
        .attr("y", 12)
        .text("Shipped")
        .style("font-size", "18px")
        .attr("alignment-baseline","middle")

        svg6.append("circle")
        .attr("cx", 20)
        .attr("cy", 35)
        .attr("r", 7)
        .style("fill", "rgba(162, 198, 159, 10)")

        svg6.append("text")
        .attr("x", 35)
        .attr("y", 37)
        .text("Delivered")
        .style("font-size", "18px")
        .attr("alignment-baseline","middle")

        svg6.append("circle")
        .attr("cx", 20)
        .attr("cy", 60)
        .attr("r", 7)
        .style("fill", "rgba(254, 2, 4, 1)")

        svg6.append("text")
        .attr("x", 35)
        .attr("y", 62)
        .text("Cancelled")
        .style("font-size", "18px")
        .attr("alignment-baseline","middle")
      },
    },
    mounted: function () {
      d3.csv("order_trends/areachart_data.csv").then((data) => {
        this.StackedAreaChartOrdersrender(data);
      });
    },
  };
  </script>
  <style></style>
