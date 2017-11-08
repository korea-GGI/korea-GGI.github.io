var width = 900,
    height = 20,
    tick = 0;

var targetCoun = 'South Korea';
var markers = [
    {
        name: '한국',
        value: [0.649, 1],
        textValue: 0.649,
        rank: '116',
        textOpacity: [0, 1],
        y: 35,
        class: 'korea',
    },
];

var MARGIN = {
    LEFT: 50,
    RIGHT: 50,
    TOP: 65
};

var xScale = d3.scaleLinear()
    .domain([0, 1])
    .rangeRound([0, width]);

var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10) //[0, 0.649, 1]
    .tickFormat(function (d) {
        return d;
    })
    .tickSize(0)
    .tickPadding(2);

var svg = d3.select('#rulerChart')
    .attr('width', width + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', height + MARGIN.TOP + 44);

var innerChart = svg
    .append('g')
    .attr('class', 'rulerChart')
    .attr('transform', 'translate( ' + MARGIN.LEFT + ', ' + MARGIN.TOP + ')');

var draw = function () {

    innerChart.append('g')
        .attr('class', 'x axis')
        .style('stroke-width', '1')
        .attr('transform', 'translate( 0, ' + (-60) + ')')
        .style('font-size', '0.9rem')
        .style('font-weight', '300')
        .style('opacity', 1)
        .call(xAxis);

    var markerSel = innerChart.selectAll('g.datas').data(markers);

    markerSel.enter()
        .append('g')
        .attr('class', 'datas')
        .html('<text />')
        .merge(markerSel)
        .each(function (dd) {
            var koreaText = d3.select(this).append('text');
            koreaText
                .attr('fill', '#000')
                .text("한국 " + dd.rank + "위")
                .attr('class', 'koreaValue')
                .attr('x', xScale(dd.textValue))
                .attr('y', 18)
                .style('font-size', '0.9rem')
                .style('font-weight', '400')
                .style('text-anchor', 'middle')
                .attr('transform', 'translate( 10, 0)');

            var koreaIcon = d3.select(this).append('text');
            koreaIcon
                .attr('fill', '#4477ff')
                .attr("style", "font-family:FontAwesome;")
                .style('font-size', '1.4rem')
                .text(function (d) {
                    return '\uf182'
                })
                .attr('x', xScale(dd.textValue))
                .attr('transform', 'translate( 0, ' + (44) + ')');
        });
};
draw();
