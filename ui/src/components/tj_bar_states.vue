<template lang="">
    <div>
         Filter by: 
        <!-- <div class="btn-group" role="group" aria-label="Basic example"> -->
  <button type="button" class="btn btn-outline-secondary mr-1" aria-pressed="true" id="b1">Difference in Estimated Delivery</button>
  <button type="button" class="btn btn-outline-secondary mr-1" aria-pressed="true" id="b2">Freight Value</button>
  <button type="button" class="btn btn-outline-secondary mr-1" aria-pressed="true"  id="b3">Delivery Time</button>

<div>
        Select a Region: <select class="dropdown" id="selectButton1" style="width:450px" ></select>
        </div>
        <div id="my_dataviz1"></div>

    </div>
</template>
<script>
import * as d3 from 'd3';
export default {
    name: 'Bar_Chart_Tj',
    methods: {
        barStates(data) {
            // set the dimensions and margins of the graph

            d3.select("#b1")
                .on("click", function () { selectedVar = 'diff_estimated_delivery'; update(selectedGroup, selectedVar) })
            d3.select("#b2")
                .on("click", function () { selectedVar = 'freight_value'; update(selectedGroup, selectedVar) })
            d3.select("#b3")
                .on("click", function () { selectedVar = 'time_to_delivery'; update(selectedGroup, selectedVar) })

            const margin1 = { top: 30, right: 30, bottom: 70, left: 60 },
                width1 = 1160 - margin1.left - margin1.right,
                height1 = 550 - margin1.top - margin1.bottom;

            var allGroup = new Set(data.map(d => d.region));
            allGroup.add('All');
            // allGroup = Array.from(allGroup)
            // allGroup.unshift("all")
            const myColor = d3.scaleOrdinal()
                .domain(allGroup)
                .range(d3.schemeTableau10);

            // append the svg object to the body of the page
            const svg1 = d3.select("#my_dataviz1")
                .append("svg")
                .attr("width", width1 + margin1.left + margin1.right)
                .attr("height", height1 + margin1.top + margin1.bottom)
                .append("g")
                .attr("transform", `translate(${margin1.left},${margin1.top})`);

            d3.select("#selectButton1")
                .selectAll('option')
                .data(allGroup)
                .enter()
                .append('option')
                .text(function (d) { return d; }) // text showed in the menu
                .attr("value", function (d) { return d; }) // corresponding value returned by the button
                .attr("class", "dropdown-item")
            // Initialize the X axis
            const x = d3.scaleBand()
                .range([0, width1])
                .padding(0.2);
            const xAxis = svg1.append("g")
                .attr("transform", `translate(0,${height1})`);

            // Initialize the Y axis
            const y = d3.scaleLinear()
                .range([height1, 0]);
            const yAxis = svg1.append("g")
                .attr("class", "myYaxis");


            // A function that create / update the plot for a given variable:
            function update(selectedGroup, selectedVar) {
                console.log(selectedGroup, selectedVar);
                d3.select(".ylabel").remove();
                // Parse the Data
                var data1 = data;
                var hover_data = {}
                const tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "d3-tooltip")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .style("padding", "15px")
                    .style("background", "rgba(0,0,0,0.6)")
                    .style("border-radius", "5px")
                    .style("color", "#fff")
                    .text("a simple tooltip");

                if (selectedGroup != "All") {
                    data1 = data.filter(function (d) { return d.region == selectedGroup })
                }
                var name = ""
                if (selectedVar == "diff_estimated_delivery") { // make the current image element on top
                    name = "Difference in Estimated Delivery"
                    data1.sort(function (x, y) {
                        return d3.descending(parseFloat(x.diff_estimated_delivery), parseFloat(y.diff_estimated_delivery))
                    })
                }

                else if (selectedVar == "freight_value") { // make the current image element on top
                    name = "Freight Value in BRL"
                    data1.sort(function (x, y) {
                        return d3.descending(parseFloat(x.freight_value), parseFloat(y.freight_value))

                    })
                }

                else { // make the current image element on top
                    name = "Delivery Time in Days"
                    data1.sort(function (x, y) {
                        return d3.descending(parseFloat(x.time_to_delivery), parseFloat(y.time_to_delivery))

                    })
                }

                // X axis
                x.domain(data1.map(d => d.customer_state));
                xAxis.transition().duration(1000).call(d3.axisBottom(x));

                // Add Y axis
                y.domain([0, d3.max(data1, d => +d[selectedVar])]);
                yAxis.transition().duration(1000).call(d3.axisLeft(y));

                // variable u: map data1 to existing bars
                const u = svg1.selectAll("rect")
                    .data(data1)

                // update bars
                u.join("rect")
                    .transition()
                    .duration(1000)
                    .attr("x", d => x(d.customer_state))
                    .attr("y", d => y(d[selectedVar]))
                    .attr("width", x.bandwidth())
                    .attr("height", d => height1 - y(d[selectedVar]))
                    .attr("fill", d => myColor(d.region))





                // From here
                svg1.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width1 - 510)
                    .attr("y", height1 + 50)
                    .text("States").attr("font-size", 18);

                svg1.append("text")
                    .attr("class", "ylabel")
                    .attr("text-anchor", "end")
                    .attr("x", width1 - 1200)
                    .attr("y", height1 - 490)
                    .text(name).attr("font-size", 18)
                    .attr("transform", "rotate(-90)");

                // var size = 15
                // var marginTop = 40
                // svg1.selectAll("mydots")
                //     .data(data1.map(d => d.region))
                //     .enter()
                //     .append("rect")
                //     .attr("x", marginTop * 25)
                //     .attr("y", (d, i) => { return 4 * marginTop + i * (size + 5) }) //
                //     .attr("width", size)
                //     .attr("height", size)
                //     .style("fill", d => myColor(d.region))
                // svg1.append("text")
                //     .attr('x', width1 - 110)
                //     .attr("y", height1 - 350)
                //     .text("Regions")
                //     .attr("text-anchor", "middle").attr("font-size", 15)
                // // Add one dot in the legend for each name.
                // svg1.selectAll("mylabels")
                //     .data(data1.map(d => d.region))
                //     .enter()
                //     .append("text")
                //     .attr("x", marginTop * 25 + size * 1.4)
                //     .attr("y", (d, i) => { return 4 * marginTop + i * (size + 5) + (size / 2) })
                //     .style("fill", d => myColor(d.region))
                //     .text((d) => d)
                //     .attr("text-anchor", "left")
                //     .style("font-size", "12px")
                //     .style("alignment-baseline", "middle")
                // Till Here 





                svg1.on("mouseover", function () {
                    var elements = document.querySelectorAll(":hover");
                    hover_data = elements[elements.length - 1].__data__;
                    console.log(hover_data)
                    tooltip.html(`Region : ${hover_data.region}` + "<br>" + `Customer State: ${hover_data.customer_state}` + "<br>" + `${selectedVar}: ${Math.round(hover_data[selectedVar], 3)}`).style("visibility", "visible")
                    // tooltip.html(``).style("visibility", "visible")

                    d3.select(this)

                })
                    .on("mousemove", function (selection) {
                        tooltip
                            .style("top", (selection.pageY - 10) + "px")
                            .style("left", (selection.pageX + 10) + "px");
                    })
                    .on("mouseout", function () {
                        tooltip.html(``).style("visibility", "hidden");

                    })
            }
            // Initialize plot

            var selectedGroup = 'Norte';
            var selectedVar = 'diff_estimated_delivery'
            update(selectedGroup, selectedVar);
            d3.select("#selectButton1").on("change", function () {
                // recover the option that has been chosen
                const selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
                selectedGroup = selectedOption
                update(selectedGroup, selectedVar);
            })
        },
    },
    mounted: function () {
        d3.csv("./data/_3_2/tj_states_combined.csv").then((data) => {
            this.barStates(data);
        });

    },

};
</script>
<style lang="">
    
</style>