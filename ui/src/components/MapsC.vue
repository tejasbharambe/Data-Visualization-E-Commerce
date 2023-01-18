<template>
    <div class="row">
        <div class="col-sm-5 col-12">
            <div class="row justify-content-center">
                <svg id="svgDiv" width="500" height="500"></svg>
            </div>
        </div>

        <div class="col-sm-2 col-12">
            <div class="alert alert-warning mt-4 row info" id="stateOne"></div>
            <div class="alert alert-info row info" id="stateTwo"></div>
            <div class="row" id="resetRow">
                <button id="resetSVG" class="col reset" >Reset SVG</button>
                <button id="resetSlippy" class="col reset">Reset Slippy</button>
            </div>
        </div>

        <div class="col-sm-5 col-12">
            <div class="m-auto" id="slippyDiv"></div>
        </div>
    </div>
</template>
<script>
    import * as d3 from "d3";
    import L from "leaflet";
    import 'leaflet-truesize';
    import 'leaflet/dist/leaflet.css';

    export default {
    name: "MapsC",
    methods: {
            drawSVG(data, countList) {
                console.log('test');
                var svg = d3.select('#svgDiv'),
                    width = +svg.attr('width'),
                    height = +svg.attr('height');

                // ***** Button Controls ***** //
                d3.select('#resetSVG').on('click', (e) => this.reset(svg, e.target.id, data));

                // ***** Projecting Map ***** //
                var projection = d3.geoMercator()
                    .fitSize([width, height], data);

                var path = d3.geoPath()
                    .projection(projection);

                svg.append('g')
                    .attr('class', 'states')
                    .selectAll('path')
                    .data(data.features)
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .on('click', function () {
                        svg.select('.selected1')
                        .classed('selected1', false);
                        d3.select(this)
                        .classed('selected1', true);
                        d3.select('#stateOne')
                        .text(this.__data__.properties.NM_UF
                            + ', ' + this.__data__.properties.SIGLA_UF);
                        d3.select('#stateOne')
                        .html(this.__data__.properties.NM_UF + ', ' + this.__data__.properties.SIGLA_UF + "<br>" + 
                            countList[this.__data__.properties.SIGLA_UF][0] + " cities<br>" + 
                            countList[this.__data__.properties.SIGLA_UF][1] + " customers<br>" +
                            countList[this.__data__.properties.SIGLA_UF][2] + " sellers<br>");

                        svg.append('g')
                        .attr('class', 'states2')
                        .selectAll('path')
                        .data(data.features)
                        .enter()
                        .append('path')
                        .attr('d', path)
                        .on('click', function () {
                            svg.select('.selected2')
                            .classed('selected2', false);
                            d3.select(this)
                            .classed('selected2', true);
                            d3.select('#stateTwo')
                            .text(this.__data__.properties.NM_UF
                                + ', ' + this.__data__.properties.SIGLA_UF);
                            d3.select('#stateTwo')
                            .html(this.__data__.properties.NM_UF + ', ' + this.__data__.properties.SIGLA_UF + "<br>" + 
                            countList[this.__data__.properties.SIGLA_UF][0] + " cities<br>" + 
                            countList[this.__data__.properties.SIGLA_UF][1] + " customers<br>" +
                            countList[this.__data__.properties.SIGLA_UF][2] + " sellers<br>");
                            });
                });
            },
            svgMap(data) {

                var countList = {};
                var promises = [];
                var files = ['maps/olist_geolocation_dataset.csv', 'maps/olist_customers_dataset.csv', 'maps/olist_sellers_dataset.csv'];
                files.forEach(url => promises.push(d3.csv(url)));
                    
                Promise.all(promises).then(function (files) {
                    var gData = files[0];
                    var cData = files[1];
                    var sData = files[2];

                    var statesList = [];

                    // ***** Get states list ***** //
                    gData.reduce((counts, d) => statesList.includes(d.geolocation_state) ? statesList : statesList.push(d.geolocation_state),0);

                    // ***** Count per State ***** //
                    for(var k=0;k<statesList.length;k++){
                        countList[statesList[k]] = [];
                        countList[statesList[k]].push(gData.reduce((counts, d) => d.geolocation_state == statesList[k] ? counts+1 : counts, 0));
                        countList[statesList[k]].push(cData.reduce((counts, d) => d.customer_state == statesList[k] ? counts+1 : counts, 0));
                        countList[statesList[k]].push(sData.reduce((counts, d) => d.seller_state == statesList[k] ? counts+1 : counts, 0));
                    }
                    // console.log(data);
                    // console.log(countList);
                });
                this.drawSVG(data, countList);
            },
            slippyMap(data){
                var colors = d3.schemeSpectral[5];
                var stateNames = [];
                var coords = [];
                var featureName = {};
                var layerName = {};
                
                var map = L.map('slippyDiv').setView([-14, -55], 4.2);

                d3.select('#resetSlippy').on('click', (e) => this.reset(map, e.target.id, data));

                L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
                    maxZoom: 6,
                    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                }).addTo(map);

                var setLength = data.features.length;

                for(var j=0; j<setLength;j++){

                    var tempMax = 0;
                    var tempM = 0;

                    var paneName = data.features[j].properties.SIGLA_UF;
                    stateNames.push(data.features[j].properties.SIGLA_UF);

                    map.createPane(paneName);
                    map.getPane(paneName).style.zIndex = 405+j;
                    map.getPane(paneName).style['mix-blend-mode'] = 'normal';

                    if (data.features[j].geometry.coordinates.length == 1){
                        coords = data.features[j].geometry.coordinates[0];
                    } else {
                        for(var m=0;m<data.features[j].geometry.coordinates.length;m++){
                            if(data.features[j].geometry.coordinates[m][0].length > tempMax){
                                tempMax = data.features[j].geometry.coordinates[m][0].length;
                                tempM = m;
                            }
                        }
                        coords = data.features[j].geometry.coordinates[tempM];
                    }

                    featureName[j] = {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Polygon',
                            coordinates: coords
                        }
                    };

                    layerName[stateNames[j]] = new L.trueSize(featureName[j], {
                        color: colors[j%5],
                        pane: paneName,
                        weight: 1,
                        opacity: 1,
                        dashArray: '7, 10'
                    }).addTo(map);
                }
            },
            reset(artifact, mode, data) {
                if (mode == 'resetSVG'){
                    artifact.selectAll('g').remove();
                    d3.select('#stateOne').text('');
                    d3.select('#stateTwo').text('');
                    this.svgMap(data);
                } else {
                    artifact.off();
                    artifact.remove();
                    this.slippyMap(data);
                }
            }
        },
        mounted: function () {
            d3.json('maps/brazil.geojson').then(brazilGeo => {
                this.slippyMap(brazilGeo);
                this.svgMap(brazilGeo);
            });
        }
    };
</script>
<style>
    #svgDiv { 
        width: 500px;
        height: 500px;
    }

    #slippyDiv { 
        width: 500px;
        height: 500px;
        text-align: left;
    }

    #stateOne {
        text-align: left;
    }

    #stateTwo {
        text-align: left;
    }

    .reset {
        border-radius: 3px;
        background-color: #ff000075;
        padding: 5px;
        margin: 2px;
        cursor: default;
        font-size: 0.85em;
        font-weight: bold;
        user-select: none;
    }

    .selected1 {
        fill: #ffc10750;
    }

    .selected2 {
        fill: #17a2b850;
    }

    .states {
        fill: whitesmoke;
        stroke: #666;
        stroke-width: 0.5px;
    }

    .states2 {
        fill: #ffffff00;
        stroke: #666;
        stroke-width: 0.5px;
    }

    .info{
        padding: 5px;
        margin: 2px;
    }
</style>