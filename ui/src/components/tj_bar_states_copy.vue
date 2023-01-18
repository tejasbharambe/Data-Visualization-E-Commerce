<template lang="">
    <div>
        <div class="row">
            <div class="col ml-20">
        <button class="btn btn-dark" id="b1">diff_estimated_delivery</button>
    </div>
    <div class="col ml-20">
        <button class="btn btn-dark" id="b2">freight_value</button>
    </div>
    <div class="col ml-20">    
    <button class="btn btn-dark" id="b3">time_to_delivery</button>
    </div>        
    <div>
        Select a Region: <select class="dropdown" id="selectButton1" style="width: 550px" ></select>
        </div>

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
            allGroup.add('all');
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
                // Parse the Data
                var data1 = data;
                if (selectedGroup != "all") {
                    data1 = data.filter(function (d) { return d.region == selectedGroup })
                }

                if (selectedVar == "diff_estimated_delivery") { // make the current image element on top

                    data1.sort(function (x, y) {
                        return d3.descending(parseFloat(x.diff_estimated_delivery), parseFloat(y.diff_estimated_delivery))
                    })
                }

                else if (selectedVar == "freight_value") { // make the current image element on top

                    data1.sort(function (x, y) {
                        return d3.descending(parseFloat(x.freight_value), parseFloat(y.freight_value))

                    })
                }

                else { // make the current image element on top

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
            }
            // Initialize plot

            var selectedGroup = 'Norte';
            var selectedVar = 'diff_estimated_delivery'
            update(selectedGroup, selectedVar);
            d3.select("#selectButton1").on("change", function () {
                // recover the option that been chosen
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