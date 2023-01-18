<template>
    <div>
        <h4> Number of Orders Received Across Regions in Brazil during Jan 2017 - Aug 2018</h4>
        <!-- USE ref=, not id= -->
        <svg id="part_2" width="1260" height="500"></svg>
    </div>
</template>
<script>
import * as d3 from "d3";
export default {
    name: 'tj_line_order_count_chart',
    methods: {

        LineChart_tj(data) {
            function LineChart(data, {
                x = ([x]) => x, // given d in data, returns the (temporal) x-value
                y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
                y2 = ([, y2]) => y2, // given d in data, returns the (quantitative) y2-value
                y3 = ([, y3]) => y3, // given d in data, returns the (quantitative) y2-value
                y4 = ([, y4]) => y4, // given d in data, returns the (quantitative) y2-value // *************
                y5 = ([, y5]) => y5,
                zDomain = ["Centro_Oeste", "Nordeste", "Norte", "Sudeste", 'Sul'], // *************
                defined, // for gaps in data
                curve = d3.curveLinear, // method of interpolation between points
                marginTop = 40, // top margin, in pixels
                marginRight = 190, // right margin, in pixels
                marginBottom = 70, // bottom margin, in pixels
                marginLeft = 90, // left margin, in pixels
                width = 1200, // outer width, in pixels
                height = 800, // outer height, in pixels
                xType = d3.scaleTime, // the x-scale type
                xDomain, // [xmin, xmax]
                xRange = [marginLeft, width - marginRight], // [left, right]
                xLabel,// a label for the x-axis
                yType = d3.scaleLinear, // the y-scale type
                yDomain = [0, 6000], // [ymin, ymax]
                yRange = [height - marginBottom, marginTop], // [bottom, top]
                yFormat, // a format specifier string for the y-axis
                yLabel, // a label for the y-axis
                // color = "currentColor", // stroke color of line
                strokeLinecap = "round", // stroke line cap of the line
                strokeLinejoin = "round", // stroke line join of the line
                strokeWidths = [2.5, 2, 1.5, 3, 2, 3],// stroke width of line, in pixels // *************
                strokeOpacities = [1, 1, 1, 0.6, 1, 1], // stroke opacity of line // *************
                colors = d3.schemeTableau10, // array of categorical colors
                //colors = ["#aaa", "green", "blue", "red","orange","yellow"], // color of the 6 lines
            } = {}) {
                // Compute values.
                const X = d3.map(data, x);
                const Y = d3.map(data, y);
                const Y2 = d3.map(data, y2);
                const Y3 = d3.map(data, y3);
                const Y4 = d3.map(data, y4);// *************
                const Y5 = d3.map(data, y5);
                const I = d3.range(X.length);
                if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
                const D = d3.map(data, defined);
                const Xs = d3.sort(I.filter(i => D[i]).map(i => X[i])); // for bisection

                // Compute default domains.
                if (xDomain === undefined) xDomain = d3.extent(X);
                // if (xDomain === undefined) xDomain = d3.extent(vals);
                if (yDomain === undefined) yDomain = [0, d3.max(Y, Y2)];

                // Construct scales and axes.
                const xScale = xType(xDomain, xRange).interpolate(d3.interpolateRound);
                const yScale = yType(yDomain, yRange);
                const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
                const yAxis = d3.axisLeft(yScale).ticks(null, yFormat);

                // Construct a line generator.
                const line = d3.line()
                    .defined((y, i) => !isNaN(X[i]) && !isNaN(y))
                    .curve(curve)
                    .x((y, i) => xScale(X[i]))
                    .y((y) => yScale(y));

                const svg = d3.create("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .style("background", "yellow") // background color of the chart
                    .on("touchstart", event => event.preventDefault()) // add event listener
                    .on("mousemove", pointermoved);// add event listener for touch start


                /* Add Legend */
                // Add one dot in the legend for each name.
                var size = 15
                svg.selectAll("mydots")
                    .data(zDomain)
                    .enter()
                    .append("rect")
                    .attr("x", marginTop * 27.5)
                    .attr("y", (d, i) => { return 4 * marginTop + i * (size + 5) }) //
                    .attr("width", size)
                    .attr("height", size)
                    .style("fill", (d, i) => colors[i])
                svg.append("text")
                    .attr('x', width - 110)
                    .attr("y", height - 350)
                    .text("Regions")
                    .attr("text-anchor", "middle").attr("font-size", 15)
                // Add one dot in the legend for each name.
                svg.selectAll("mylabels")
                    .data(zDomain)
                    .enter()
                    .append("text")
                    .attr("x", marginTop * 27.5 + size * 1.4)
                    .attr("y", (d, i) => { return 4 * marginTop + i * (size + 5) + (size / 2) })
                    .style("fill", (d, i) => colors[i])
                    .text((d) => d)
                    .attr("text-anchor", "left")
                    .style("font-size", "12px")
                    .style("alignment-baseline", "middle")


                /*Add Chart details*/
                svg.append("g")
                    .attr("transform", `translate(0,${height - marginBottom})`)
                    .call(xAxis)
                    .call(g => g.append("text")
                        .attr("x", width - marginRight)
                        .attr("y", 10)
                        .attr("fill", "currentColor")
                        .attr("text-anchor", "start")
                        .attr("font-size", 14)
                        .attr("font-weight", 700)
                        .text(xLabel)).style("font-size", "10.5px");

                svg.append("g")
                    .attr("transform", `translate(${marginLeft},0)`)
                    .call(yAxis)
                    //.call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick line").clone() // gridline
                        .attr("x2", width - marginLeft - marginRight)
                        .attr("stroke-opacity", 0.1))
                    .call(g => g.append("text")
                        .attr("x", -marginLeft)
                        .attr("y", 10)
                        .attr("fill", "currentColor")
                        .attr("text-anchor", "start")
                        .attr("font-size", 14)
                        .attr("font-weight", 700)
                        .text(yLabel)).style("font-size", "11px");

                svg.append("g")
                    .attr("fill", "none")
                    .attr("stroke-linejoin", strokeLinejoin)
                    .attr("stroke-linecap", strokeLinecap)
                    .selectAll()
                    .data([Y, Y2, Y3, Y4, Y5])// *************
                    .join("path")
                    .attr("stroke", (d, i) => colors[i])
                    .attr("stroke-width", (d, i) => strokeWidths[i])
                    .attr("stroke-opacity", (d, i) => strokeOpacities[i])
                    .attr("d", line);

                svg.append("text")
                    .attr('x', width - 650)
                    .attr("y", height - 20)
                    .text("Year-Month")
                    .attr("text-anchor", "middle").style("font-size", "20px")

                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", -300)
                    .attr("y", 22)
                    .attr("transform", "rotate(-90)")
                    .text("Number of Orders")
                    .attr("text-anchor", "start").style("font-size", "20px")
                /////////////////////////////////////////////////////
                /*Add cross over and moving mouse event*/
                const rule = svg.append("g");

                rule.append("line")
                    .attr("y1", marginTop)
                    .attr("y2", height - marginBottom)
                    .attr("stroke", "#aaa")
                    .attr("stroke-width", 2.5)
                    .attr("stroke-opacity", 0.75);

                const ruleLabel = rule.append("text")
                    .attr("y", height - marginBottom - 140)
                    .attr("x", 5)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .attr("dy", "1em").attr("font-size", 13);

                const serie = rule.append("text")
                    .attr("x", 80)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "middle")
                    .attr("dy", "0.9em").attr("font-size", 13);

                const serie2 = rule.append("text")
                    .attr("x", 80)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "middle")
                    .attr("dy", "2em").attr("font-size", 13);

                function dateConverter(str) {
                    var date = new Date(str),
                        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                        // day = ("0" + date.getDate()).slice(-2),
                        // hours = ("0" + date.getHours()).slice(-2),
                        // minutes = ("0" + date.getMinutes()).slice(-2),
                        // seconds = ("0" + date.getSeconds()).slice(-2),
                        year = date.getFullYear();
                    return `${mnth}/${year}`
                }

                function update(x) {
                    // var parseDate = d3.utcParse("%c")
                    // var formatDate = d3.timeFormat("%b-%Y")
                    x = Xs[d3.bisectCenter(Xs, x)];
                    rule.attr("transform", `translate(${xScale(x)},0)`);
                    console.log(x)
                    console.log(dateConverter(x))
                    ruleLabel.text(dateConverter(x));
                    var i = I[d3.bisector(i => X[i]).center(I, x)];
                    serie.text(zDomain[0] + ": " + Y[i] + ", " + zDomain[1] + ": " + Y2[i]);// *************
                    serie2.text(zDomain[2] + ": " + Y3[i] + ", " + zDomain[3] + ": " + Y4[i] + ", " + zDomain[4] + ": " + Y5[i]);// *************
                    svg.property("value", x).dispatch("input", { bubbles: true }); // for viewof
                }

                function pointermoved(event) { // touch start event
                    update(xScale.invert(d3.pointer(event)[0]));
                }

                update(xDomain[0]);

                //return svg.node();
                return Object.assign(svg.node(), { update });
            }

            var parseTime = d3.timeParse("%Y%m");

            var chart = LineChart(data, {
                x: d => parseTime(d.month),
                y: d => d.Centro_Oeste,
                y2: d => d.Nordeste,
                y3: d => d.Norte,
                y4: d => d.Sudeste, // *************
                y5: d => d.Sul,
                yLabel: "↑ Order Count",
                xLabel: "→ Year-Month",
                width: 1260,
                height: 500
            });
            document.getElementById('part_2').appendChild(chart);
        },

    },
    mounted: function () {
        d3.csv("./data/_3_2/tj_line_chart.csv").then(data => {
            this.LineChart_tj(data);
        })

    }
}
</script>
<style>

</style>
  