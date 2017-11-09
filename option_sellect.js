var width = 900,
    height = 100;

var dataSet = [];
var targetCoun = 'South Korea';
var markers = [

    {
        name: '상위 5개국',
        value: 0.834,
        rank: ' ',
        opacity: 0.4,
        y: 35,
        class: 'top5',
    },
];
var axisMarker = [{
    name: '평등한 분배',
    value: 1,
    anchor: 'end',
    y: -60,
    class: 'equal',
     }, {
    name: '불평등한 분배',
    value: 0,
    anchor: 'start',
    y: -60,
    class: 'unEqual',
     }, ];


d3.csv('data/gender_gap_index.csv', function (err, rows) {
    updateData(rows);
});

var updateData = function (rows) {
    rows.forEach(function (row) {
        row['country'] = row['country'];
        row['score'] = +row['score'];
        row['rank'] = +row['rank'];
        row['year'] = +row['year'];
        row['type'] = row['type'];
    });

    rows = rows.filter(function (row) {
        return (
            row['country'] === targetCoun &&
            row['type'] === 'overall' &&
            !Number.isNaN(row['score'])
        );
    });

    dataSet = rows;
    var years = d3.select('#years').selectAll('option').data(dataSet);
    years.enter()
        .append('option')
        .merge(years)
        .attr('value', function (d) {
            return d.year;
        })
        .text(function (d) {
            return d.year;
        });
    years.exit().remove();

    d3.select('#years').on('change', function () {
        selectedCircle(+this.value);
    });
    draw();
    d3.select('#years option[value="2016"]').attr('selected', 'selected');
    selectedCircle(2016);
}

var MARGIN = {
    LEFT: 50,
    RIGHT: 50,
    TOP: 100
};

var xScale = d3.scaleLinear()
    .domain([0, 1])
    .rangeRound([0, width]);

var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(1)
    .tickFormat(function (d) {
        return d * 1
    })
    .tickSize(0)
    .tickPadding(-75);

var svg = d3.select('#koreaChart')
    .attr('width', width + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', height + MARGIN.TOP);

var innerChart = svg
    .append('g')
    .attr('class', 'koreaChart')
    .attr('transform', 'translate( ' + MARGIN.LEFT + ', ' + MARGIN.TOP + ')');

var selectedChart = svg
    .append('g')
    .attr('class', 'selectedChart')
    .attr('transform', 'translate( ' + MARGIN.LEFT + ', ' + MARGIN.TOP + ')');

var draw = function () {

    innerChart.append('g')
        .attr('class', 'x axis')
        .style('stroke-width', '1')
        .style('font-size', '1rem')
        .style('opacity', 0.7)
        .call(xAxis);

    var faceSel = innerChart.selectAll('g.axisMarker').data(axisMarker);
    faceSel.enter()
        .append('g')
        .attr('class', 'axisMarker')
        .html('<text /><rect />')
        .merge(faceSel)
        .each(function (marker) {
            var worldAver = markers[1];
            d3.select(this).append("text")
                .attr('x', xScale(marker.value))
                .text(marker.name)
                .attr('y', -92)
                .style('text-anchor', marker.anchor);
        });

    var markerSel = innerChart.selectAll('g.marker').data(markers);
    markerSel.enter()
        .append('g')
        .attr('class', 'marker')
        .html('<text /><rect />')
        .merge(markerSel)
        .each(function (marker) {

            var worldAver = markers[1];
            d3.select(this).append("text")
                .attr('x', xScale(marker.value))
                .text(marker.name)
                .attr('y', -24)
                .style('text-anchor', 'middle');

            d3.select(this).append("text")
                .attr('x', xScale(marker.value))
                .text(marker.value)
                .attr('y', 39)
                .style('text-anchor', 'middle');

            d3.select(this).append("rect")
                .attr('x', xScale(marker.value))
                .attr('transform', 'translate( 0 , -12 )')
                .attr('width', 5)
                .attr('height', 25)
                .attr('fill', '#ffcd09');

        });
    markerSel.exit().remove();
}

var selectedCircle = function (year) {
    var circleUpdate = d3.select('.selectedChart').selectAll('circle.pickedYear').data(dataSet); //update
    var circleEnter = circleUpdate.enter();
    var circleMerged = circleEnter
        .append('circle')
        .attr('class', 'pickedYear')
        .attr('r', 12)
        .attr('cx', function (d) {
            return xScale(d.score);
        })
        .attr('z-index', '100')
        .style('fill', '#5a64ad')
        .attr('opacity', 1)
        .merge(circleUpdate);
    circleMerged
        .attr('opacity', function (d) {
            return d.year === year ? 1.0 : 0.0;
        });
    circleMerged.exit().remove();

};

//<!--
//<
//foreignobject class = 'formBoxs'
//width = '100'
//height = '100' >
//    <
//    form class = 'formBox' >
//    <
//    div class = 'options' >
//    <
//    select id = 'years'
//title = 'selectYear' >
//    <
//    /select> <
//    /div> <
//    /form> <
//    /foreignobject>
//-->
//
//<!--        <svg id="indiChart"></svg>-->