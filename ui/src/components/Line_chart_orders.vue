<template>
  <div class="container-fluid">
    <div class="row justify-content-md-center">
    <h1>Order Trends (2016-2018)</h1>
    <div class="row text-left">
    <ul>
      <li>
        <p style="font-size: 20px">
      This chart shows the number of orders delivered from October 2016 to August 2018</p>
      </li>
      <li>
        <p style="font-size: 20px">
      Orders picked up from 2016 to the end of 2017 when the number plateaued and eventually dropped in 2018</p>
      </li>
    
    </ul>
  </div>
      <div class="row justify-content-md-center">
      <div class=" ml-5 md-4 px-0">
        <button class="btn btn-dark btn-block" id="all">All</button>
      </div>
      <div class="ml-5 md-4 px-0">
        <button class="btn btn-dark btn-block" id="d17">2017</button>
      </div>
      <div class=" ml-5 md-4 px-0">
        <button class="btn btn-dark btn-block" id="d18">2018</button>
      </div>
    </div>
    <svg id="line-chart-orders" width="900" height="600"></svg>
  </div>
  </div>
</template>
<script>
import * as d3 from "d3";

export default {
  name: "LineChartOrders",
  methods: {
    lineChartOrdersrender(d) {
      // set the dimensions and margins of the graph
      var margin = {top: 30, right: 150, bottom: 80, left: 120},
      width = 1100 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select("#line-chart-orders")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      const grouped_data = d3.rollup(d, v => v.length, d => d.Year_Month)

      var parseDate = d3.timeParse("%Y-%m");
      const formatTime = d3.timeFormat("%B, %Y")

      var data_mapped = d3.map(grouped_data, function(d){return{date: parseDate(d[0]), value: d[1]}})

      var data = data_mapped.slice().sort((a, b) => d3.ascending(a.date, b.date))

      var data16 = []
      var data17 = []
      var data18 = []

      d3.map(data, function(d) {
        if(d.date.getFullYear() == "2017"){
          data17.push({"date": d.date, "value":d.value})
        }
        else if(d.date.getFullYear() == "2018"){
          data18.push({"date": d.date, "value":d.value})
        }
        else{
          data16.push({"date": d.date, "value":d.value})
        }
      });

      var data_all = [...data16, ...data17, ...data18]
      
      var x = d3.scaleTime()
      .range([0, width]);

      var xAxis = d3.axisBottom().scale(x);
      svg.append('g')
      .style("font-size", "15px")
      .attr('transform', 'translate(0,' + height + ')')
      .attr("class", "myXaxis");

      var y = d3.scaleLinear()
      .range([height, 0])
      var yAxis = d3.axisLeft().scale(y);
      svg.append('g')
      .style("font-size", "15px")
      .attr("class", "myYaxis");

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
                          .style("font-size", "15px")
                          .attr("text-anchor", "left")
                          .attr("alignment-baseline", "middle")

      

      function update_line(data){
        d3.select(".linechart").remove();
        x.domain(d3.extent(data, function(d){ return d.date}));
        svg.selectAll(".myXaxis").transition()
        .duration(3000)
        .call(xAxis);

        const max = d3.max(data, function(d){ return +d.value});
        y.domain([0, max]);
        svg.selectAll(".myYaxis")
        .transition()
        .duration(3000)
        .call(yAxis);

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
        .attr('class', 'linechart')
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "url(#line-gradient)" )
          .attr("stroke-width", 2)
          .attr("d", d3.line()
              .x(function(d) { return x(d.date) })
              .y(function(d) { return y(d.value) })
              );
        
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
          var selectedData = data[i]
          focus
              .attr("cx", x(selectedData.date))
              .attr("cy", y(selectedData.value))
          focusText
              .html(formatTime(selectedData.date) + " => " + selectedData.value + " orders")
              .attr("x", x(selectedData.date)-30)
              .attr("y", y(selectedData.value)-20)
          }

      function mouseout() {
          focus.style("opacity", 0)
          focusText.style("opacity", 0)
          }
      }
      

      svg.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", width/2)
          .attr("y", height + 50)
          .style("font-size", "18px")
          .style("font-weight", "bold")
          .text("Date");

      svg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", -100)
          .attr("x", -130)
          .style("font-size", "18px")
          .style("font-weight", "bold")
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Number of Orders");

      d3.select("#all")
        // .attr("class","btn btn-dark active")
        .on('click',()=>{
          console.log('all clicked');
          update_line(data_all)
        });
      d3.select("#d17")
        // .attr("class","btn btn-dark active")
        .on('click',()=>{
          console.log('2017 clicked');
          update_line(data17)
        });
      d3.select("#d18")
        // .attr("class","btn btn-dark active")
        .on('click',()=>{
          console.log('2018 clicked');
          update_line(data18)
        });
      update_line(data_all)
    },
  },
  mounted: function () {
    d3.csv("order_trends/orders_data.csv").then((data) => {
      this.lineChartOrdersrender(data);
    });
  },
};
</script>
<style></style>
