<template lang="">
    <div>
        Select a Region: <select class="dropdown" id="selectButton" style="width: 550px" ></select>
        <div id="my_dataviz"></div>

    </div>
</template>
<script>
import * as d3 from 'd3';
export default {
    name: 'Line_Chart_Sales_tj',
    methods: {
        lineChartSales_tj(data) {
            // set the dimensions and margins of the graph

            const margin = { top: 10, right: 30, bottom: 30, left: 60 },
                width = 560 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            const svg = d3.select("#my_dataviz")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            //Read the data

            var parseTime = d3.timeParse("%Y%m");

            data.forEach(function (d) {
                d.month = parseTime(d.month);
                d.order_amount = +d.order_amount;
            });

            // List of groups (here I have one group per column)
            const allGroup = new Set(data.map(d => d.region))

            // add the options to the button
            d3.select("#selectButton")
                .selectAll('option')
                .data(allGroup)
                .enter()
                .append('option')
                .text(function (d) { return d; }) // text showed in the menu
                .attr("value", function (d) { return d; }) // corresponding value returned by the button
                .attr("class", "dropdown-item")

            // A color scale: one color for each group
            const myColor = d3.scaleOrdinal()
                .domain(allGroup)
                .range(d3.schemeTableau10);

            // Add X axis --> it is a date format
            const x = d3.scaleTime()
                .domain(d3.extent(data, function (d) { return d.month; }))
                .range([0, width]);
            // const x = d3.scaleTime().range([0, width]);

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(7));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d.order_amount; })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Initialize line with first group of the list
            const line = svg
                .append('g')
                .append("path")
                .datum(data.filter(function (d) { return d.region == "Centro-Oeste" }))
                .attr("d", d3.line()
                    .x(function (d) { return x(d.month) })
                    .y(function (d) { return y(+d.order_amount) })
                )
                .attr("stroke", function () { return myColor("valueA") })
                .style("stroke-width", 4)
                .style("fill", "none")

            // A function that update the chart
            function update(selectedGroup) {

                // Create new data with the selection?
                const dataFilter = data.filter(function (d) { return d.region == selectedGroup })

                // Give these new data to update line
                line
                    .datum(dataFilter)
                    .transition()
                    .duration(1000)
                    .attr("d", d3.line()
                        .x(function (d) { return x(d.month) })
                        .y(function (d) { return y(+d.order_amount) })
                    )
                    .attr("stroke", function () { return myColor(selectedGroup) })
            }

            // When the button is changed, run the updateChart function
            d3.select("#selectButton").on("change", function () {
                // recover the option that has been chosen
                const selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
                update(selectedOption)
            })

        },
    },
    mounted: function () {
        d3.csv("./data/_3_2/tj_ecomm_regions.csv").then((data) => {
            this.lineChartSales_tj(data);
        });

    },

};
</script>
<style lang="">
    
</style>