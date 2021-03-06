var UNPMARGIN = {
    LEFT: 0,
    RIGHT: 0,
    TOP: 30
};

var wageGapWorkWidth = window.innerWidth * 0.95 - UNPMARGIN.LEFT - UNPMARGIN.RIGHT - 15,
    wageGapWorkHeight = 36 * 35 - UNPMARGIN.TOP - 20,
    targetYear = 2014;

var countriesName = [];
var dataSet = [];
d3.csv('data/gender_wage_gap.csv', function (err, rows) {
    worldData(rows);
});

var worldData = function (rows) {
    rows.forEach(function (row) {
        row['country'] = row['country'];
        row['value'] = row['value'];
    });
    console.log(rows);
    var datas = rows.filter(function (d) {
        return d.TIME == targetYear;
    }).map(function (d) {
        return {
            countryname: d.countryname,
            country: d.country,
            value: (100 - d.value) / 100,

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
        .style('fill', function (d, i) {
            console.log(i);
            return d['country'] === 'Korea' ? '#f6ecdd' : '#111';
        })
        .transition()
        .duration(3000)
        .attr('width', function (d, i) {
            return wageGapXscale(d.value);
        })
        .polyIn;
    //append text
    var textSel = wageGap.selectAll('text').data(dataSet);
    var textEnter = textSel.enter();
    textEnter.append('text')
        .text(function (d) {
            return d.countryname + ' ' + d.value.toFixed(2);
        })
        .attr('x', function (d, i) {
            return wageGapXscale(d.value) - 2;
        })
        .attr('y', function (d, i) {
            return wageGapYscale(i);
        })
        .style('text-anchor', 'end')
        .style('alignment-baseline', 'text-before-edge')
        .style('font-size', '1.3rem')
        .style('font-weight', function (d) {
            return d['country'] === 'Korea' ? '400' : '300';
        })
        .style('fill', function (d) {
            return d['country'] === 'Korea' ? '#000' : '#f6ecdd';
        });
};
