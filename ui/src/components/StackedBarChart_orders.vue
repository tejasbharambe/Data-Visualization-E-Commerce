<template>
    <div class="container-fluid">
        <div class="row justify-content-md-center">
      <h1>Distribution of time of transactions</h1>
      <div class="row text-left">
      <ul>
      <li><p style="font-size: 20px">
      With reference to the line chart, this chart focuses on the number of purchases made on
    each day of the week and further classifies them into the time of the day these purchases were made.</p>
</li>
<li>
    <p style="font-size: 20px">
        As we can see, majority orders were delivered in the early part of the week during the afternoon.
    </p>
    </li>
</ul>
</div>
    <div class="row justify-content-md-center">
      <div class=" ml-5 md-4 px-0">
        <button class="btn btn-dark" id="all2">All</button>
      </div>
      <div class="ml-5 md-4 px-0">
        <button class="btn btn-dark" id="d172">2017</button>
      </div>
      <div class=" ml-5 md-4 px-0">
        <button class="btn btn-dark" id="d182">2018</button>
      </div>
    </div>
      <svg id="stacked-bar-chart-orders" width="900" height="500"></svg>
      </div>
    </div>
  </template>
  <script>
import * as d3 from "d3";

  export default {
    name: "StackedBarChartOrders",
    methods: {
        stackedBarChartOrdersrender(d) {
        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 10, bottom: 80, left: 100},
        width = 1100 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg2 = d3.select("#stacked-bar-chart-orders")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var data16 = []
        var data17 = []
        var data18 = []

        d3.map(d, function(e) {
            if(e.Year == "2017"){
                data17.push(e)
            }
            else if(e.Year == "2018"){
                data18.push(e)
            }
            else{
                data16.push(e)
            }
        });
        var data_all = [...data16, ...data17, ...data18]

        // X axis
        var x = d3.scaleBand()
        .range([ 0, width - 300 ])
        .domain(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
        .padding(0.2);

        svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "15px")
        .call(d3.axisBottom(x))

        // Add Y axis
        var y = d3.scaleLinear()
        .range([ height, 0]);

        function update(d){
            d3.selectAll(".sub-g").remove();
            d3.select(".yaxis_g").remove();
            const grouped_data = d3.rollup(d, v => v.length, d => d.Day_of_week, t => t.Time_of_day)

            var data_mapped = d3.map(grouped_data, function(d){ return{
                                dow: d[0],
                                Dawn: d[1].get("Dawn"),
                                Morning: d[1].get("Morning"),
                                Afternoon: d[1].get("Afternoon"),
                                Night: d[1].get("Night")
                            }
            })

            const max_vals = d3.map(data_mapped, function(d){
                return d3.max([d["Dawn"]+d["Morning"]+d["Afternoon"]+d["Night"]])
            })

            const max_val = d3.max(max_vals);
            y.domain([0, max_val]);
            svg2.append("g")
                .attr("class", "yaxis_g")
                .transition()
                .duration(1000)
                .style("font-size", "15px")
                .call(d3.axisLeft(y).ticks(6));

            const ordered = []

            ordered.push(data_mapped[0])
            ordered.push(data_mapped[1])
            ordered.push(data_mapped[2])
            ordered.push(data_mapped[5])
            ordered.push(data_mapped[6])
            ordered.push(data_mapped[3])
            ordered.push(data_mapped[4])

            data_mapped = ordered

            var subgroups = ["Dawn", "Morning", "Afternoon", "Night"]
            var itr = 0
            var jtr = 0
            var ctr = 0
            var dtr = 0

            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#e5de44','#ffac00','#ff7900', '#053752'])

            var stackedData = d3.stack()
                                .keys(subgroups)(data_mapped)

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
            .attr("y", function() { return height + 500; })
            .attr("height", function(d) { return (height - y(d[1])); })
            .attr("width", x.bandwidth())

            sc.select("g")
            .data(stackedData)
            .enter()
            .selectAll(".sub-g")
            .data(function (e) {return e})
            .enter()
            .append("text")
            .attr("x", function(d) { return x(d.data.dow) + 19; })
            .attr("y", function(d) { return ((y(d[0]) + y(d[1])) / 2) + 5; })
            .text(d => {
                if(jtr == 7){
                    itr = itr + 1
                    jtr = 0}

                var selection = d.data[subgroups[itr%4]]
                jtr = jtr + 1
                return selection
            }
            )
            .attr("fill", function() {
                if(dtr == 7){
                    ctr = ctr + 1
                    dtr = 0
                }
                if(ctr == 14 || ctr == 15){
                    return "white"
                }
                dtr = dtr + 1
            })
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .style("opacity", 0);

            svg2.selectAll("rect")
            .transition()
            .duration(400)
            .attr("y", function(d) { return y(d[1])})
            .attr("height", function(d) { return (y(d[0]) - y(d[1]))})
            .delay(function(d, i) {return i*30})

            svg2.selectAll("text")
            .transition()
            .duration(500)
            .style("opacity", 1)
            .delay(function(d, i) {return i * 17})
        }

        // add legend
        svg2.append("circle")
        .attr("cx", width - 300)
        .attr("cy", 10)
        .attr("r", 7)
        .style("fill", "#053752")

        svg2.append("text")
        .attr("x", width - 280)
        .attr("y", 12)
        .text("Night")
        .style("font-size", "18px")
        .attr("alignment-baseline","middle")

        svg2.append("circle")
        .attr("cx", width - 300)
        .attr("cy", 35)
        .attr("r", 7)
        .style("fill", "#ff7900")

        svg2.append("text")
        .attr("x", width - 280)
        .attr("y", 37)
        .text("Afternoon")
        .style("font-size", "18px")
        .attr("alignment-baseline","middle")

        svg2.append("circle")
        .attr("cx", width - 300)
        .attr("cy", 60)
        .attr("r", 7)
        .style("fill", "#ffac00")

        svg2.append("text")
        .attr("x", width - 280)
        .attr("y", 62)
        .text("Morning")
        .style("font-size", "18px")
        .attr("alignment-baseline","middle")

        svg2.append("circle")
        .attr("cx", width - 300)
        .attr("cy", 85)
        .attr("r", 7)
        .style("fill", "#e5de44")

        svg2.append("text")
        .attr("x", width - 280)
        .attr("y", 87)
        .text("Dawn")
        .style("font-size", "18px")
        .attr("alignment-baseline","middle")

        svg2.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", width/2 - 120)
                .attr("y", height + 50)
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .text("Day of Week");

        svg2.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -100)
            .attr("x", -130)
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Number of Orders");
        
        d3.select("#all2")
            // .attr("class","btn btn-dark active")
            .on('click',()=>{
            console.log('all clicked');
            update(data_all)
        });
      d3.select("#d172")
            // .attr("class","btn btn-dark active")
            .on('click',()=>{
            console.log('2017 clicked');
            update(data17)
        });
      d3.select("#d182")
            // .attr("class","btn btn-dark active")
            .on('click',()=>{
            console.log('2018 clicked');
            update(data18)
        });
      update(data_all)
      },
    },
    mounted: function () {
      d3.csv("order_trends/orders_data.csv").then((data) => {
        this.stackedBarChartOrdersrender(data);
      });
    },
  };
  </script>
  <style></style>
