var RULERMARGIN = {
    LEFT: 0,
    RIGHT: 0,
    TOP: 40,
};
var rulerWidth = window.innerWidth * 0.95 - RULERMARGIN.LEFT - RULERMARGIN.RIGHT - 15,
    rulerHeight = window.innerHeight - RULERMARGIN.TOP;
var dataSet = [];
var targetCoun = 'South Korea';
var xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, rulerWidth]);
var xAxis = d3.axisTop()
    .scale(xScale)
    .tickFormat(function (d) {
        return +d;
    })
    .tickSize(0)
    .tickPadding(0);
var svg = d3.select('#mainChart')
    .attr('width', rulerWidth + RULERMARGIN.LEFT + RULERMARGIN.RIGHT + 15)
    .attr('height', 20 + RULERMARGIN.TOP)
//    .style('border', '1px solid red')
;
var innerChart = svg
    .append('g')
    .attr('class', 'rulerChart')
    .attr('transform', 'translate( ' + RULERMARGIN.LEFT + ', ' + RULERMARGIN.TOP + ')');
var draw = function () {
    //korea rect 0.649
//    innerChart.append('rect')
//        .attr('x', 0)
//        .attr('y', -30)
//        .attr('height', 43)
//        .attr('width', 0)
//        .style('fill', '#f6ecdd')
//        .transition()
//        .delay(500)
//        .duration(4000)
//        .attr('width', xScale(0.649));
//    innerChart.append('rect')
//        .attr('x', xScale(0.649) - 2)
//        .attr('y', -30)
//        .attr('height', 43)
//        .attr('width', 2)
//        .style('fill', '#f6ecdd')
//        .style('opacity', 0)
//        .transition()
//        .duration(400)
//        .style('opacity', 1);

    innerChart.append('g')
        .attr('class', 'x axis')
        .style('stroke-width', '0')
        .style('font-weight', '400')
        .style('text-anchor', 'start')
        .style('opacity', 0.9)
        .call(xAxis);
};
draw();
