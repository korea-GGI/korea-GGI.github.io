var UNPMARGIN = {
    LEFT: 0,
    RIGHT: 0,
    TOP: 30
};

var wageGapWorkWidth = window.innerWidth * 0.95 - UNPMARGIN.LEFT - UNPMARGIN.RIGHT - 15,
    wageGapWorkHeight = window.innerHeight - UNPMARGIN.TOP - 20,
    targetYear = 2014;

var countriesName = [];
var dataSet = [];
d3.csv('data/gender_wage_gap.csv', function (err, rows) {
    worldData(rows);
});

var worldData = function (rows) {
    rows.forEach(function (row) {
        row['Country'] = row['Country'];
        row['Value'] = row['Value'];
    });
    var datas = rows.filter(function (d) {
        return d.TIME == targetYear;
    }).map(function (d) {
        return {
            country: d.Country,
            value: (100 - d.Value) / 100,

        }
    });
    var rank = datas.sort(function (a, b) {
        return d3.ascending(a.value, b.value);
    });
    dataSet = datas;
    draw();
}

//indi_drawing --------------------------------------
var draw = function () {
    var wageGapXscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, wageGapWorkWidth]);
    var wageGapYscale = d3.scaleBand()
        .domain(d3.range(dataSet.length))
        .rangeRound([0, wageGapWorkHeight - 40])
        .padding(0.04);
    var wageGapXaxis = d3.axisTop()
        .scale(wageGapXscale)
        .tickFormat(function (d) {
            return d * 1;
        })
        .tickPadding(-20)
        .tickSize(0);
    var wageGapYaxis = d3.axisLeft()
        .scale(wageGapYscale)
        .tickFormat(function (d) {
            return d;
        })
        .tickPadding(0);
    var wageGapWorkSvg = d3.select('#wageGapChart')
        .attr('width', (wageGapWorkWidth) + 10)
        .attr('height', wageGapWorkHeight)
        .attr('transform', 'translate( ' + UNPMARGIN.LEFT + ',' + UNPMARGIN.TOP + ')');

    var wageGap = wageGapWorkSvg
        .append('g')
        .attr('transform', 'translate( ' + UNPMARGIN.LEFT + ',' + UNPMARGIN.TOP + ')');
    //apppend rect
    var markerSel = wageGap.selectAll('rect').data(dataSet);
    var markerEnter = markerSel.enter();
    markerEnter
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return wageGapYscale(i);
        })
        .attr('width', 0)
        .attr('height', wageGapYscale.bandwidth())
        .style('fill', '#111')
        .transition()
        .duration(5000)
        .attr('width', function (d, i) {
            return wageGapXscale(d.value);
        });
    //append text
    var textSel = wageGap.selectAll('text').data(dataSet);
    var textEnter = textSel.enter();
    textEnter.append('text')
        .text(function (d) {
            return d.country + ' ' + d.value.toFixed(2);
        })
        .attr('x', function (d, i) {
            return wageGapXscale(d.value) - 2;
        })
        .attr('y', function (d, i) {
            return wageGapYscale(i) + wageGapYscale.bandwidth();
        })
        .style('text-anchor', 'end')
        .style('alignment-baseline', 'text-after-edge')
        .style('font-size', '1.2rem')
        .style('font-weight', '300')
        .style('fill', '#f6ecdd');
};
