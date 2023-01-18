<template>
  <div class="container-fluid">
    <h2 class="heading">Analysing Installment types of credit card</h2>
    <ul class="ext">
      <li>
        Bar Chart to analyze the installment_types of the entire payments of credit card.
      </li>
      <li>
        As we can see, majority payments were completed with one time payment
      </li>
    </ul>
    <svg id="bar-chart"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";

export default {
  name: "BarChartPayC",
  methods: {
    barChartrender(data) {
      // console.log(data);
      const margin = { top: 20, right: 30, bottom: 80, left: 90 },
        width = 1060 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

      const color=d3.schemeTableau10[0]

      var hover_data = {}
      const tooltip = d3.select("body")
            .append("div")
            .attr("class","d3-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("padding", "15px")
            .style("background", "rgba(0,0,0,0.6)")
            .style("border-radius", "5px")
            .style("color", "#fff")
            .text("a simple tooltip");
      // append the svg object to the body of the page
      const svg = d3
        .select("#bar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Add X axis
      const x = d3.scaleLinear().domain([0, 13000]).range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Y axis
      const y = d3
        .scaleBand()
        .range([0, height])
        .domain(data.map((d) => d.Payment_Installment_types))
        .padding(0.1);
      svg.append("g").call(d3.axisLeft(y));

      //Bars
      svg
        .selectAll("myRect")
        .data(data)
        .join("rect")
        .attr("x", x(0))
        .attr("y", (d) => y(d.Payment_Installment_types))
        .attr("width", 800)
        .attr("height", y.bandwidth())
        .attr("fill", color)
        .transition()
        .duration(2000)
        .attr("width", (d) => x(d.counts))

      svg.selectAll("rect")
        .on("mouseover", function() {
                var elements = document.querySelectorAll(":hover");
                hover_data = elements[elements.length - 1].__data__;
                //console.log(hover_data);
                tooltip.html(`Installment Type: ${hover_data.Payment_Installment_types}`+"<br>"+`Counts: ${hover_data.counts}`).style("visibility", "visible")
                // tooltip.html(``).style("visibility", "visible")
 
                d3.select(this)
                .attr("fill", "black")
        })
            .on("mousemove", function(selection){
                        tooltip
                        .style("top", (selection.pageY-10)+"px")
                        .style("left",(selection.pageX+10)+"px");
        })
            .on("mouseout", function() {
                        tooltip.html(``).style("visibility", "hidden");
                        d3.select(this).attr("fill", color)});


        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width/2)
            .attr("y", height + 50)
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text("Counts");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -80)
            .attr("x", -130)
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Types of Installments");
      // Animation
      // svg.selectAll("rect")
      //   .transition()
      //   .duration(1800)
      //   .attr("x", 0)
      //   .attr("width",d=>x(d.counts))
      //   .delay(function(d,i){ return(i*100)})
      //   .attr("y",d => y(d.Payment_Installment_types))
      //   .attr("width", function(d) { return  y(d.counts)-height; })
      //   .delay(function(d,i){console.log(i) ; return(i*100)})
    },
  },
  mounted: function () {
    d3.json("payments/data/installment_types.json").then((data) => {
      this.barChartrender(data);
    });
  },
};
</script>
<style>
.heading{
  text-transform: capitalize;
}

</style>
