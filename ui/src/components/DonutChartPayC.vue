<template>
    <div>
        <h2 class="heading"> Analysing Payment Types</h2>
        <ul class="ext">
      <li>
        Donut Chart to analyze the payment types.
      </li>
      <li>
        As we can see, majority payments are credit card based payments
      </li>
    </ul>
    <!-- USE ref=, not id= -->
    <svg id="donut-chart"></svg>
    </div>
  </template>
  <script>
  import * as d3 from "d3";
  export default {
      name: 'DonutChartPayC',
      methods: {
  
      donutChartrender(data){
            function DonutChart(data, {
                      name = ([x]) => x,  // given d in data, returns the (ordinal) label
                      value = ([, y]) => y, // given d in data, returns the (quantitative) value
                      title, // given d in data, returns the title text
                      width = 740, // outer width, in pixels
                      height = 600, // outer height, in pixels
                      innerRadius = Math.min(width, height) / 3, // inner radius of pie, in pixels (non-zero for donut)
                      outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
                      labelRadius = (innerRadius)+100, // center radius of labels
                      format = ",", // a format specifier for values (in the label)
                      names, // array of names (the domain of the color scale)
                      colors, // array of colors for names
                      stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
                      strokeWidth = 1, // width of stroke separating wedges
                      strokeLinejoin = "round", // line join of stroke separating wedges
                      padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
                      } = {})
                      {
                      // Compute values.
                      const N = d3.map(data, name);
                      const V = d3.map(data, value);
                      const I = d3.range(N.length).filter(i => !isNaN(V[i]));
  
                      // Unique the names.
                      if (names === undefined) names = N;
                      names = new d3.InternSet(names);
  
                      // Chose a default color scheme based on cardinality.
                      if (colors === undefined) colors = d3.schemeTableau10
  
                      // Construct scales.
                      const color = d3.scaleOrdinal(names, colors);
  
                      // Compute titles.
                      if (title === undefined) {
                          const formatValue = d3.format(format);
                          title = i => `${N[i]}\n${formatValue(V[i])}`;
                      } else {
                          const O = d3.map(data, d => d);
                          const T = title;
                          title = i => T(O[i], i, data);
                      }
  
                      // Construct arcs.
                      const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
                      const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
                      //const arc_init = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius-200);
                      //console.log(arc);
                      //const hoverarc=d3.arc().innerRadius(innerRadius).outerRadius(outerRadius+100);
                      const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
                      var div = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)
            .style("position", "absolute")
            .style("z-index", "10")
            .style("padding", "15px")
            .style("background", "rgba(0,0,0,0.6)")
            .style("border-radius", "5px")
            .style("color", "#fff")
            .text("a simple tooltip");
  
                      const svg = d3.select("#donut-chart")
                          .attr("width", width)
                          .attr("height", height)
                          .attr("viewBox", [-width / 1.5, -height / 1.5, width+150, height+100])
                          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
                      svg.append("g")
                          .attr("stroke", stroke)
                          .attr("stroke-width", strokeWidth)
                          .attr("stroke-linejoin", strokeLinejoin)
                          .selectAll("path")
                          .data(arcs)
                          .join("path")
                          .attr("fill", d => color(N[d.data]))
                          .on('mouseover', function (d) {
                                d3.select(this).transition()
                                    .duration(0)
                                    .attr('opacity', '.55')
                                div.transition()
                                    .duration(0)
                                    .style("opacity", '1');

                                div.html("Number of People:" + (d.srcElement.__data__.value)+ "<br/>"+ "Payment Type:" +(title(d.srcElement.__data__.data).split('\n')[0]))
                                    .style("left", (d.clientX) + "px")
                                    .style("top", (d.clientY-30 ) + "px")
                                    

                            })
                            .on('mouseout', function () {
                                d3.select(this).transition()
                                    .duration(1000)
                                    .attr('opacity', '1')
                                div.transition()
                                    .duration(1000)
                                    .style("opacity", '0');
                                })
                                .transition()
                                .duration(2000)
                                .attrTween('d', function(d) {
                                            var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                                            return function(t) {
                                                d.endAngle = i(t);
                                                return arc(d);
                                            }
                                            
                                            });


                            svg.append("text")
                                            .attr("class", "x label")
                                            .attr("text-anchor", "end")
                                            .attr("x", 100)
                                            .attr("y", 50)
                                            .style("font-size", "18px")
                                            .style("font-weight", "bold")
                                            .text("Types of payments");


                          
  
                      svg.append("g")
                          .attr("font-family", "sans-serif")
                          .attr("font-size", 10)
                          .attr("text-anchor", "middle")
                          .selectAll("text")
                          .data(arcs)
                          .join("text")
                          .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
                          .selectAll("tspan")
                          .data(d => {
                          const lines = `${title(d.data)}`.split(/\n/);
                          return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
                          })
                          .join("tspan")
                          .attr("x", 0)
                          .attr("y", (_, i) => `${i * 1.1}em`)
                          .attr("font-weight", (_, i) => i ? null : "bold")
                          .text((d,i)=>{if(i%2==0){ return d;
                        }})
  
                      return Object.assign(svg.node(), {scales: {color}});
                      }
  
                      DonutChart(data, {
                      name: d => d.name,
                      value: d => d.counts,
                      width: 600,
                      height: 600,
                      innerRadius: 160,
                  });
              },
  
      },
      mounted: function() {
          d3.json("payments/data/payment_types.json").then(data=>{
            this.donutChartrender(data);
          })
          
      }
  }
  </script>
  <style>
.heading{
  text-transform: capitalize;
}
.ext{
  list-style: none;
}
</style>
  