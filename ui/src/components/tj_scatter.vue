<template lang="">
    <div id="my_dataviz2"></div>
</template>
<script>
import * as d3 from 'd3';
export default {
    name: 'Scatter_tj',
    methods: {
        scatterPlot(data) {
            const margin5 = { top: 70, right: 150, bottom: 60, left: 100 },
                width5 = 1250 - margin5.left - margin5.right,
                height5 = 500 - margin5.top - margin5.bottom;

            // append the svg object to the body of the page
            const svg3 = d3.select("#my_dataviz2")
                .append("svg")
                .attr("width", width5 + margin5.left + margin5.right)
                .attr("height", height5 + margin5.top + margin5.bottom)
                .append("g")
                .attr("transform", `translate(${margin5.left},${margin5.top})`);

            const x = d3.scaleLinear()
                .domain([100, 200])
                .range([0, width5]);
            svg3.append("g")
                .attr("transform", `translate(0, ${height5})`)
                .call(d3.axisBottom(x).ticks(10)).attr("font-size", 13);

            // Add X axis label:
            svg3.append("text")
                .attr("text-anchor", "end")
                .attr("x", width5 - 400)
                .attr("y", height5 + 50)
                .text("Avg. Price of Products Bought in BRL").attr("font-size", 18);

            svg3.append("text")
                .attr("text-anchor", "end")
                .attr("x", width5 - 90)
                .attr("y", height5 - 410)
                .text("Number of Products Bought vs Avg Price of Those Products in Various States Across Brazil.")
                .style("font-size", "20px");
            svg3.append("text")
                .attr("text-anchor", "end")
                .attr("x", width5 - 200)
                .attr("y", height5 - 520)
                .text("Size of the state is governed by number of cities from where the orders are placed.")
                .style("font-size", "16px");

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, 17000])
                .range([height5, 0]);
            svg3.append("g")
                .call(d3.axisLeft(y)).attr("font-size", 13);

            // Add Y axis label:
            svg3.append("text")
                .attr("text-anchor", "end")
                .attr("x", -290)
                .attr("y", -75)
                .attr("transform", "rotate(-90)")
                .text("No. of Products Bought")
                .attr("text-anchor", "start").attr("font-size", 18)

            // Add a scale for bubble size
            const z = d3.scaleSqrt()
                .domain([0, 800])
                .range([2, 30]);

            // Add a scale for bubble color
            const myColor = d3.scaleOrdinal()
                .domain(["Centro-Oeste", "Nordeste", "Norte", "Sudeste", "Sul"])
                .range(d3.schemeSet1);


            // ---------------------------//
            //      TOOLTIP               //
            // ---------------------------//

            // -1- Create a tooltip div that is hidden by default:
            const tooltip = d3.select("#my_dataviz2")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "black")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("color", "white")

            // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
            const showTooltip = function (event, d) {
                console.log(event.x, event.y)
                tooltip
                    .transition()
                    .duration(200)
                tooltip
                    .style("opacity", 1)
                    .html("State: " + d.state + "<br>" + " Region: " + d.region + "<br>" + " Number of Products Bought: " + d.no_products + "<br>" + " Avg. Price of the products bought: " + Math.round(d.avg_price, 3) + "<br>" + " No. of Citites in this state from where the orders are placed: " + d.no_cities)
                    // .style("left", 330 + "px")
                    // .style("top", "98px")
                    .style("left", (event.x) / 2 + "px")
                    .style("top", (event.y) / 2 + "px")
            }
            const moveTooltip = function (event, d) {
                console.log(d.state)
                tooltip
                    // .style("left", "330px")
                    // .style("top", "98px")
                    .style("left", (event.x) / 2 + "px")
                    .style("top", (event.y) / 2 + "px")
            }
            const hideTooltip = function () {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)

            }



            // ---------------------------//
            //       HIGHLIGHT GROUP      //
            // ---------------------------//

            // What to do when one group is hovered
            const highlight = function (event, d) {
                // reduce opacity of all groups
                d3.selectAll(".bubbles").style("opacity", .05)
                // expect the one that is hovered
                d3.selectAll("." + d).style("opacity", 1)
            }

            // And when it is not hovered anymore
            const noHighlight = function () {
                d3.selectAll(".bubbles").style("opacity", 1)
            }


            // ---------------------------//
            //       CIRCLES              //
            // ---------------------------//

            // Add dots
            svg3.append('g')
                .selectAll("dot")
                .data(data)
                .join("circle")
                .attr("class", function (d) { return "bubbles " + d.region })
                .attr("cx", d => x(d.avg_price))
                .attr("cy", d => y(d.no_products))
                .attr("r", d => z(d.no_cities))
                .style("fill", d => myColor(d.region))
                // -3- Trigger the functions for hover
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip)



            // ---------------------------//
            //       LEGEND              //
            // ---------------------------//

            // Add legend: circles
            const valuesToShow = [50, 250, 750]
            const xCircle = 1090
            const xLabel = 1000
            svg3
                .selectAll("legend")
                .data(valuesToShow)
                .join("circle")
                .attr("cx", xCircle)
                .attr("cy", d => height5 - 100 - z(d))
                .attr("r", d => z(d + 5))
                .style("fill", "none")
                .attr("stroke", "black")

            // Add legend: segments
            svg3
                .selectAll("legend")
                .data(valuesToShow)
                .join("line")
                .attr('x1', d => xCircle + z(d))
                .attr('x2', xLabel)
                .attr('y1', d => height5 - 100 - z(d))
                .attr('y2', d => height5 - 100 - z(d))
                .attr('stroke', 'black')
                .style('stroke-dasharray', ('2,2'))

            // Add legend: labels
            svg3
                .selectAll("legend")
                .data(valuesToShow)
                .join("text")
                .attr('x', xLabel)
                .attr('y', d => height5 - 101 - z(d))
                .text(d => d)
                .style("font-size", 10)
                .attr('alignment-baseline', 'top')

            // Legend title
            svg3.append("text")
                .attr('x', xCircle - 30)
                .attr("y", height5 - 200 + 30)
                .text("Number of Cities")
                .attr("text-anchor", "middle").attr("font-size", 16)

            svg3.append("text")
                .attr('x', xCircle - 50)
                .attr("y", height5 - 350)
                .text("Regions")
                .attr("text-anchor", "middle").attr("font-size", 16)

            // Add one dot in the legend for each name.
            const size = 20
            const allgroups = ["Centro-Oeste", "Nordeste", "Norte", "Sudeste", "Sul"]
            svg3.selectAll("myrect")
                .data(allgroups)
                .join("circle")
                .attr("cx", 990)
                .attr("cy", (d, i) => 40 + i * (size + 5)) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 6)
                .style("fill", d => myColor(d))
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)

            // Add labels beside legend dots
            svg3.selectAll("mylabels")
                .data(allgroups)
                .enter()
                .append("text")
                .attr("x", 990 + size * .8)
                .attr("y", (d, i) => 30 + i * (size + 5) + (size / 2)) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", d => myColor(d))
                .text(d => d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)

        },
    },
    mounted: function () {
        d3.csv("./data/_3_2/data_scatter.csv").then((data) => {
            this.scatterPlot(data);
        });

    },

};
</script>
<style lang="">
    
</style>