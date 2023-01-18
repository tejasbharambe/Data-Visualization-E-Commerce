// npm install
// npm install d3
// npm install bootstrap


// ********************** //
//       Leaflet Map      //
// ********************** //

slippyMap = function(data){
    var colors = d3.schemeSpectral[5];
    var stateNames = [];
    var coords = [];
    var featureName = {};
    var layerName = {};
    
    var map = L.map('slippyDiv').setView([-14, -55], 4.2);

    d3.select('#resetSlippy').on('click', (e) => reset(map, e.target.id, data));

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
}


// ********************** //
//      SVG Plotting      //
// ********************** //

drawSVG = function(data, countList) {
    var svg = d3.select('#svgDiv'),
        width = +svg.attr('width'),
        height = +svg.attr('height');

    // ***** Button Controls ***** //
    d3.select('#resetSVG').on('click', (e) => reset(svg, e.target.id, data));

    // ***** Projecting Map ***** //
    var projection = d3.geoMercator()
        .fitSize([width, height], data);

    path = d3.geoPath()
        .projection(projection);

    svg.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .on('click', function (d) {
            svg.select('.selected1')
            .classed('selected1', false);
            d3.select(this)
            .classed('selected1', true);
            d3.select('#stateOne')
            .text(this.__data__.properties.NM_UF
                + ', ' + this.__data__.properties.SIGLA_UF);
            d3.select('#stateOne')
            .append('text')
            .text(countList[this.__data__.properties.SIGLA_UF][0] + ' cities');
            d3.select('#stateOne').append('text')
            .text(countList[this.__data__.properties.SIGLA_UF][1] + ' customers');
            d3.select('#stateOne').append('text')
            .text(countList[this.__data__.properties.SIGLA_UF][2] + ' sellers');

            svg.append('g')
            .attr('class', 'states2')
            .selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .on('click', function (d) {
                svg.select('.selected2')
                .classed('selected2', false);
                d3.select(this)
                .classed('selected2', true);
                d3.select('#stateTwo')
                .text(this.__data__.properties.NM_UF
                    + ', ' + this.__data__.properties.SIGLA_UF);
                d3.select('#stateTwo')
                .append('text')
                .text(countList[this.__data__.properties.SIGLA_UF][0] + ' cities');
                d3.select('#stateTwo').append('text')
                .text(countList[this.__data__.properties.SIGLA_UF][1] + ' customers');
                d3.select('#stateTwo').append('text')
                .text(countList[this.__data__.properties.SIGLA_UF][2] + ' sellers');
                });
    });
}


// ************** //
//    SVG Data    //
// ************** //

svgMap = function(data) {

    var promises = [];
    var files = ['../mapData/olist_geolocation_dataset.csv', '../mapData/olist_customers_dataset.csv', '../mapData/olist_sellers_dataset.csv'];
    files.forEach(url => promises.push(d3.csv(url)));
        
    Promise.all(promises).then(function (files) {
        var gData = files[0];
        var cData = files[1];
        var sData = files[2];

        var statesList = [];
        var countList = {};

        // ***** Get states list ***** //
        gData.reduce((counts, d) => statesList.includes(d.geolocation_state) ? statesList : statesList.push(d.geolocation_state),0);

        // ***** Count per State ***** //
        for(var k=0;k<statesList.length;k++){
            countList[statesList[k]] = [];
            countList[statesList[k]].push(gData.reduce((counts, d) => d.geolocation_state == statesList[k] ? counts+1 : counts, 0));
            countList[statesList[k]].push(cData.reduce((counts, d) => d.customer_state == statesList[k] ? counts+1 : counts, 0));
            countList[statesList[k]].push(sData.reduce((counts, d) => d.seller_state == statesList[k] ? counts+1 : counts, 0));
        }

        drawSVG(data, countList);
    });
}


// ********************** //
//      Reset Button      //
// ********************** //

reset = function(artifact, mode, data) {
    if (mode == 'resetSVG'){
        artifact.selectAll('g').remove();
        d3.select('#stateOne').text('');
        d3.select('#stateTwo').text('');
        svgMap(data);
    } else {
        artifact.off();
        artifact.remove();
        slippyMap(data);
    }
}


// ********************** //
//      Main Function     //
// ********************** //

d3.json('../mapData/brazil.geojson').then(brazilGeo => {
    slippyMap(brazilGeo);
    svgMap(brazilGeo);
});