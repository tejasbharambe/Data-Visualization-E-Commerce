<template>
    <div class="container-fluid">
      <div class="row justify-content-md-center">
        <h1>Comparing number of orders M-o-M for 2017 and 2018</h1>
        <div class="row text-left">
            <ul>
                <li>
                    <p style="font-size: 20px">
                        This bar chart comparse the number of orders month on month. If we compare
                        the growth m-o-m between 2017 and 2018, we observe the narrowing gap which indicates
                        that the e-commerce industry, although with a healthy number of orders in 2018, found it difficult
                        to grow, whereas, in 2017 it showed a steady growth.
                    </p>
                </li>
            </ul>
        </div>
        <svg id="multi-bar-chart-orders" width="900" height="500"></svg>
        </div>
    </div>
  </template>
  <script>
  import * as d3 from "d3";

  export default {
    name: "MultipleBarChartOrders",
    methods: {
        multipleBarChartOrdersrender(d) {
        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 200, bottom: 80, left: 120},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg4 = d3.select("#multi-bar-chart-orders")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        var subgroups = d.columns.slice(1);
        var groups = d3.map(d, function(d) { return d.Month })

        var hover_data = {}

        // X axis
        var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])

        svg4.append("g")
            .attr("transform", "translate(0," + height + ")")
            .style("font-size", "15px")
            .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 8000])
            .range([ height, 0 ]);

        svg4.append("g")
        .style("font-size", "15px")
        .call(d3.axisLeft(y));

        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        var color = d3.scaleOrdinal()
            .domain(subgroups.concat(["2017_hover", "2018_hover"]))
            .range(['#e41a1c','#377eb8', '#FFCCCB', '#87CEEB'])

        // create tooltip element
        const tooltip = d3.select("body")
            .append("div")
            .attr("class","d3-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("padding", "15px")
            .style("background", "rgba(0,0,0,0.6)")
            .style("border-radius", "5px")
            .style("color", "#fff");


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
            .attr("text", function(d) { return d.value })
            .attr("fill", function(d) { return color(d.key); })
            .on("mouseover", function() {
                var elements = document.querySelectorAll(":hover");
                hover_data = elements[elements.length - 1].__data__;
                tooltip.html(`Year: ${hover_data.key}`+"<br>"+`Orders: ${hover_data.value}`).style("visibility", "visible")
                // tooltip.html(``).style("visibility", "visible")

                d3.select(this)
                .attr("fill", function() {
                    if(hover_data.key == "2017"){
                        return color("2017_hover")
                    }
                    else{
                        return color("2018_hover")
                    }
                })
        })
            .on("mousemove", function(selection){
                        tooltip
                        .style("top", (selection.pageY-10)+"px")
                        .style("left",(selection.pageX+10)+"px");
        })
            .on("mouseout", function() {
                        tooltip.html(``).style("visibility", "hidden");
                        d3.select(this).attr("fill", function() { return color(hover_data.key) });
        });

        svg4.append("circle")
            .attr("cx", width - 10)
            .attr("cy", 10)
            .attr("r", 7)
            .style("fill", "#e41a1c")

        svg4.append("text")
            .attr("x", width + 10)
            .attr("y", 13)
            .text("2017")
            .style("font-size", "18px")
            .attr("alignment-baseline","middle")

        svg4.append("circle")
            .attr("cx", width - 10)
            .attr("cy", 40)
            .attr("r", 7)
            .style("fill", "#377eb8")

        svg4.append("text")
            .attr("x", width + 10)
            .attr("y", 43)
            .text("2018")
            .style("font-size", "18px")
            .attr("alignment-baseline","middle")

        svg4.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width/2)
            .attr("y", height + 50)
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text("Month");

        svg4.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -100)
            .attr("x", -130)
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Number of Orders");

      },
    },
    mounted: function () {
      d3.csv("order_trends/MoM_comparison.csv").then((data) => {
        this.multipleBarChartOrdersrender(data);
      });
    },
  };
  </script>
  <style></style>
