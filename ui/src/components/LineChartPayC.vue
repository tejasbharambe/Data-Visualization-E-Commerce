<template>
  <div class="container-fluid">
    <h2 class="heading">Analysing Total Payments over Time</h2>
    <ul class="ext">
      <li>
        Line Chart depicts the total payments in value per each day.
      </li>
      <li>
        As we can see, majority payments done during thanksgiving holiday week. or specifically on the day of thanksgiving.
      </li>
    </ul>
    <div class="container ">
    <div class="row mb-5 mt-3">
      <div class="col">
        <button class="btn btn_st" id="all">All</button>
      </div>
      <div class="col">
        <button class="btn btn_st" id="boleto">Boleto</button>
      </div>
      <div class="col">
        <button class="btn btn_st" id="credit_card">Credit Card</button>
      </div>
      <div class="col">
        <button class="btn btn_st" id="debit_card">Debit Card</button>
      </div>
      <div class="col">  
        <button class="btn btn_st" id="voucher">Voucher</button>
      </div>
    </div>
  </div>
    <!-- USE ref=, not id= -->
    <div id="linechart">
    <!-- <svg id="line-chart"></svg> -->
  </div>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  name: "LineChartPayC",
  methods: {
    lineChartrender(data) {
                    var margin = {
                      top: 50,
                      right: 20,
                      bottom: 70,
                      left: 120
                    };
                    const width = 1700 - margin.left - margin.right;
                    const height = 700 - margin.top - margin.bottom;

        function updateall(data,number){
                  if (number!='first'){
                    d3.select("#line-chart").remove();
                  }
                    var svg = d3.select("#linechart")
                        .append("svg")
                        .attr("id","line-chart")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom+50)
                              .append("g")
                        .attr("transform",
                              "translate(" + margin.left + "," + margin.top + ")");

                  var y = d3.scaleLinear()
                    .range([height, 0]);
                  var x = d3.scaleTime()
                    .range([0, width]);
                  

                  var xAxis=d3.axisBottom()
                                .scale(x);

                  var yAxis = d3.axisLeft().scale(y);
                  var line = d3.line()
                  .curve(d3.curveCardinal)
                    .x(function(d) {
                      return x(d.date);
                    })
                    .y(function(d) {
                      return y(d.value);
                    });

                    //var hover_data = {}
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

                  // var parseDate = d3.time.format("%Y%m%d").parse;
                  var color= d3.scaleOrdinal(d3.schemeTableau10).domain(Object.keys(data[0]).filter(function(key) {
                    return key !== "date";
                  }));

                  var currency = color.domain().map(function(name) {
                    return {
                      name: name,
                      values: data.map(function(d) {
                        return {
                          date: d.date,
                          value: +d[name]
                        };
                      })
                    };
                  });
                  x.domain(d3.extent(data, function(d) {
                    return d.date;
                  }));

                  y.domain([0,
                    d3.max(currency, function(c) {
                      return d3.max(c.values, function(v) {
                        return v.value;
                      });
                    })
                  ]);

                  var types=Object.keys(data[0]).slice(1,5)

                  var legend = svg.selectAll('g')
                    .data(types)
                    .enter()
                    .append('g')
                    .attr('class', 'legend');

                  legend.append('rect')
                    .attr('x', width - 100)
                    .attr('y', function(d, i) {
                      return i * 20+30;
                    })
                    .attr('width', 10)
                    .attr('height', 10)
                    .style('fill', function(d) {
                      return color(d);
                    });

                  legend.append('text')
                    .attr('x', width - 80)
                    .attr('y', function(d, i) {
                      return (i * 20)+30 + 9;
                    })
                    .text(function(d) {
                      return d;
                    });

                  svg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                  svg.append("g")
                    .attr("class", "yaxis")
                    .attr("transform", "translate(0, 0)")
                    .call(yAxis);

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
                      .attr("y", -80)
                      .attr("x", -130)
                      .style("font-size", "18px")
                      .style("font-weight", "bold")
                      .attr("dy", ".75em")
                      .attr("transform", "rotate(-90)")
                      .text("Total Payment Value per Day");


                  var ctype = svg.selectAll(".ctype")
                    .data(currency)
                    .enter()
                    .append("g")
                    .attr("class", "ctype");

                 ctype.append("path")
                    .attr("class", "line")
                    .attr("d", function(d) {
                      return line(d.values);
                    })
                    .style("stroke", function(d) {
                      return color(d.name);
                    })
                  // .attr("stroke-dashoffset", width)
                  //     .attr("stroke-dasharray", width)
                  //     .transition()
                  //     .ease(d3.easeSin)
                  //     .duration(1000)
                  //     .attr("stroke-dashoffset", 0);

                    // const path=svg.append("path")
                    //         .attr("class", "line")
                    //         .attr("fill", "none")
                    //         .attr("stroke-linejoin", "round")
                    //         .attr("stroke-linecap", "round")
                    //         .attr("stroke-width", 1.5)
                    //         .style("stroke", function() {
                    //             return color(d.key); })
                    //         .attr("d", paymentline(d.value));

                  var mouseG = svg.append("g")
                    .attr("class", "mouse-over-effects");

                  mouseG.append("path") // this is the black vertical line to follow mouse
                    .attr("class", "mouse-line")
                    .style("stroke", "black")
                    .style("stroke-width", "1px")
                    .style("opacity", "1");
                    
                  var lines = document.getElementsByClassName('line');

                  var mousePerLine = mouseG.selectAll('.mouse-per-line')
                    .data(currency)
                    .enter()
                    .append("g")
                    .attr("class", "mouse-per-line");

                    mousePerLine.append("circle")
                      .attr("r", 7)
                      .style("stroke", function(d) {
                        return color(d.name);
                      })
                      .style("fill", "none")
                      .style("stroke-width", "1px")
                      .style("opacity", "0");

                  mousePerLine.append("text")
                    .attr("transform", "translate(10,3)");

                  mouseG.append('rect') // append a rect to catch mouse movements on canvas
                    .attr('width', width) // can't catch mouse events on a g element
                    .attr('height', height)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all')
                    .on('mouseout', function() { // on mouse out hide line, circles and text
                      d3.select(".mouse-line")
                        .style("opacity", "0");
                      d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "0");
                      d3.selectAll(".mouse-per-line text")
                        .style("opacity", "0");
                      tooltip.html(``).style("visibility", "hidden");
                    })
                    .on('mouseover', function() { // on mouse in show line, circles and text
                      d3.select(".mouse-line")
                        .style("opacity", "1");
                      d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "1");
                      d3.selectAll(".mouse-per-line text")
                        .style("opacity", "1");
                    })
                    .on('mousemove', function(d) { // mouse moving over canvas
                      var mouse = d3.pointer(d);
                      d3.select(".mouse-line")
                        .attr("d", function() {
                          var d = "M" + mouse[0] + "," + height;
                          d += " " + mouse[0] + "," + 0;
                          return d;
                        });
                        var bisectDate = d3.bisector(function(d) { return d.date; }).left;
                        var x0 = x.invert(mouse[0]);
                        var i = bisectDate(data, x0, 1);
                        tooltip
                        .style("top", (d.pageY-50)+"px")
                        .style("left",(d.pageX+10)+"px");
                        tooltip.html(`Date: ${data[i].date.toDateString()}`
                        +"<br>"+`boleto: ${+data[i].boleto}`
                        +"<br>"+`Credit Card: ${+data[i].credit_card}`
                        +"<br>"+`Debit Card: ${+data[i].debit_card}`
                        +"<br>"+`voucher: ${+data[i].voucher}`).style("visibility", "visible")
                      

                      d3.selectAll(".mouse-per-line")
                        .attr("transform", function(d, i) {
                          // console.log(width/mouse[0])
                          //var xDate = x.invert(mouse[0]);
                        //var bisect = d3.bisector(function(d) { return d.date; }).right;
                          //var idx = bisect(d.values, xDate);
                          
                          var beginning = 0;
                          var end = lines[i].getTotalLength();
                          var target = null;
                          var counter=1;

                          while (counter!=0){
                            target = Math.floor((beginning + end) / 2);
                            var pos = lines[i].getPointAtLength(target);
                            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                break;
                            }
                            if (pos.x > mouse[0])      end = target;
                            else if (pos.x < mouse[0]) beginning = target;
                            else break; //position found
                          }

                          // d3.select(".line").style("filter","blur(0.5px)")
                          // d3.select(this)
                          // .select('text')
                          //   .text(y.invert(pos.y).toFixed(2))
                          //   .style("font-weight","bold")
                          //   ;
                            
                          return "translate(" + mouse[0] + "," + pos.y +300+")";
                        });
                    });
            }

            function updatetype(data,type_payment){
              d3.select("#line-chart").remove();
              var svg = d3.select("#linechart")
                        .append("svg")
                        .attr("id","line-chart")
                        .attr("width", width + margin.left + margin.right+300)
                        .attr("height", height + margin.top + margin.bottom+50)
                              .append("g")
                        .attr("transform",
                              "translate(" + margin.left + "," + margin.top + ")");

                  var y = d3.scaleLinear()
                    .range([height, 0]);

                    var x = d3.scaleTime()
                    .range([0, width]);

                  var xAxis=d3.axisBottom()
                                .scale(x);

                  var yAxis = d3.axisLeft().scale(y);
                  var line = d3.line()
                  .curve(d3.curveLinear)
                    .x(function(d) {
                      return x(d.date);
                    })
                    .y(function(d) {
                      return y(d.value);
                    });
                  var types=Object.keys(data[0]).slice(1,5)
                  var color= d3.scaleOrdinal(d3.schemeTableau10).domain(types);

                  var currency = color.domain().map(function(name) {
                    return {
                      name: name,
                      values: data.map(function(d) {
                        return {
                          date: d.date,
                          value: +d[name]
                        };
                      })
                    };
                  });
                  if(type_payment=='credit_card'){
                  currency=currency[1];}
                  else if (type_payment =="boleto"){
                  currency=currency[0];
                  }
                  else if (type_payment == 'voucher'){
                  currency=currency[2];
                  }
                  else{
                  currency=currency[3];
                  }
                  x.domain(d3.extent(data, function(d) {
                    return d.date;
                  }));

                  y.domain([0,
                   d3.max(currency.values, function(c) {
                        return c.value;
                      })
                    
                  ]);
                  svg.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                  svg.append("g")
                    .attr("class", "yaxis")
                    .attr("transform", "translate(0, 0)")
                    .call(yAxis);
                  
                  svg.append("text")
                      .attr("class", "x label")
                      .attr("text-anchor", "end")
                      .attr("x", width/2)
                      .attr("y", height + 50)
                      .style("font-size", "18px")
                      .style("font-weight", "bold")
                      .text("Date");

                  svg.append("text")
                      .attr("class", "x label")
                      .attr("text-anchor", "end")
                      .attr("x", width/2)
                      .attr("y",  50)
                      .style("font-size", "18px")
                      .style("font-weight", "bold")
                      .text(function(i){
                        console.log(i);
                        if (type_payment=="credit_card"){
                          return "Data regarding: Credit Card"
                        }
                        if (type_payment=="boleto"){
                          return "Data regarding: boleto"
                        }
                        if (type_payment=="debit_card"){
                          return "Data regarding: Debit Card"
                        }
                        if (type_payment=="voucher"){
                          return "Data regarding: Voucher"
                        }
                      });

                  svg.append("text")
                      .attr("class", "y label")
                      .attr("text-anchor", "end")
                      .attr("y", -80)
                      .attr("x", -130)
                      .style("font-size", "18px")
                      .style("font-weight", "bold")
                      .attr("dy", ".75em")
                      .attr("transform", "rotate(-90)")
                      .text("Total Payment Value per Day");


                  svg.append('g').append("path")
                    .attr("class", "line")
                    .attr("d", function() {
                  
                      return line(currency.values);
                      
                    })
                    .style("stroke", function() {
                      return color(type_payment);
                    });

                    var focus = svg.append("g") .style("display", "none");
                    var focusText = svg
                      .append('g')
                      .append('text')
                        .style("opacity", 0)
                        .attr("text-anchor", "left")
                        .attr("alignment-baseline", "middle")
                    var bisectDate = d3.bisector(function(d) { return d.date; }).left;
                    focus.append("circle")
                      .attr("class", "y")
                      .style("fill", "none")
                      .style("stroke", color(currency.name))
                      .attr("r", 4);
                    
                  // append the rectangle to capture mouse
                    svg.append("rect")
                        .attr("width", width)
                        .attr("height", height)
                        .style("fill", "none")
                        .style("pointer-events", "all")
                        .on("mouseover", function() { focus.style("display", null); })
                        .on("mouseout", function() { focus.style("display", "none"); })
                        .on("mousemove", mousemove);

                    function mousemove(event) {
                      var x0 = x.invert(d3.pointer(event)[0]),
                        i = bisectDate(data, x0, 1),

                        d = data[i];
                    


                    focus.select("circle.y")
                      .attr("transform",
                            "translate(" + x(d.date) + "," +
                                            y(d[type_payment]) +100+ ")");
                                            focusText.style("opacity",1)
                    focusText
                .html("Total Value:" + +d[type_payment])
                .style("font-weight","bold")
                .attr("x", x(d.date)+15)
                .attr("y", y(d[type_payment])-100)
                    }

            }


          var types=Object.keys(data[0]).slice(1,5)
          types.unshift("All")
          var color= d3.scaleOrdinal(d3.schemeTableau10).domain(Object.keys(data[0]).filter(function(key) {
                    return key !== "date";
                  }));
          d3.selectAll(".btn_st")
          .data(types)
          .style("background-color",d=>color(d))
          
            d3.select("#all")
            .attr("class","btn active")
            .on('click',()=>{
              console.log('all clicked');
              updateall(data,'second')});
            d3.select("#credit_card")
            .attr("class","btn active")
            .on('click',()=>{
              console.log('credit_card clicked');
              updatetype(data,'credit_card')});
            d3.select("#boleto")
            .attr("class","btn active")
            .on('click',()=>{
              console.log('boleto clicked');
              updatetype(data,'boleto')});
            d3.select("#voucher")
            .attr("class","btn active")
            .on('click',()=>{
              console.log('voucher clicked');
              updatetype(data,'voucher')});
            d3.select("#debit_card")
            .attr("class","btn active")
            .on('click',()=>{
              console.log('debit_card clicked');
              updatetype(data,'debit_card')});

            updateall(data,'first');
          
            
    },


  },



  mounted: function () {
    const parseTime = d3.timeParse("%m/%d/%Y");
    d3.csv("payments/data/pivoted_daily_payments.csv", (d) => {
      return {
        date: parseTime(d["date"]),
        boleto: 0.0+d["boleto"],
        credit_card: 0.0+d["credit_card"],
        debit_card: 0.0+d["debit_card"],
        voucher: 0.0+d["voucher"]
      };
    }).then((data) => {
      this.lineChartrender(data);
    });
  },
};
</script>
<style>
/* .overlay {
  fill: none;
  pointer-events: all;
}

.focus circle {
  fill: steelblue;
}

.focus text {
  font-size: 14px;
}

.tooltip {
  fill: white;
  stroke: #000;
}

.tooltip-date,
.tooltip-likes {
  font-weight: bold;
} */
.axis path,
    .axis line {
      fill: none;
      stroke: #000;
      shape-rendering: crispEdges;
    }
    
    
    .line {
      fill: none;
      stroke-width: 1.5px;
    }
    .btn_st{
      background-color: rgb(78, 121, 167);

    }

    .heading{
  text-transform: capitalize;
}
/* ul{
  list-style: none;
} */
</style>
