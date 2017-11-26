var UNPMARGIN = {
    LEFT: 0,
    RIGHT: 0,
    TOP: 30
};

var unPaidWorkWidth = window.innerWidth * 0.95 - UNPMARGIN.LEFT - UNPMARGIN.RIGHT - 15,
    unPaidWorkHeight = 27 * 28 - UNPMARGIN.TOP - 20,
    targetYear = 2016;

var countriesName = [];
var ratioData = [];
var dataSet = [];
var sortRank = [];
var topAverage = [];
d3.csv('data/oecd_unpaid_work.csv', function (err, rows) {
    worldData(rows);
});

var worldData = function (rows) {
    rows.forEach(function (row) {
        row['country'] = row['country'];
        row['countrynames'] = row['countrynames'];
        row['sex'] = row['sex'];
        row['age'] = row['age'];
        row['unit'] = row['unit'];
        row['value'] = +row['value'];
        row['indicator'] = row['indicator'];
    });

    var nest = d3.nest()
        .key(function (d) {
            return d.indicator;
        })
        .key(
            function (d) {
                return d.country;
            })
        .entries(rows);

    var unpaidData = nest.filter(function (d) {
        return (
            d.key == "Time spent in unpaid work, by sex"
        )
    });

    dataSet = unpaidData;
    var countries = dataSet[0].values;
    var unpaidData = countries.map(function (d) {
        var man = d.values.filter(function (d) {
            return d.sex === 'Men';
        })[0];
        var woman = d.values.filter(function (d) {
            return d.sex === 'Women';
        })[0];

        return {
            key: d.key,
            man: man,
            woman: woman,
            countryname: d.values[0].countrynames
        };
    });
    countriesName = unpaidData.map(
        function (d) {
            return d.key;
        });
    ratioData = unpaidData.map(function (d, i) {
        return {
            ratio: d.woman.value / d.man.value,
            country: d.key,
            countryname: d.countryname,
        }
    });
    dataSet = ratioData;

    draw();
    unpaidWorkdraw();
}
var draw = function () {
    var unPaidRulerWidth = window.innerWidth * 0.95 - 15;
    var rulerxScale = d3.scaleLinear()
        .domain([0, 5.2])
        .range([0, unPaidRulerWidth * 5.2]);
    var xAxis = d3.axisBottom()
        .scale(rulerxScale)
        .tickFormat(function (d) {
            return +d;
        })
        .ticks(60)
        .tickSize(3)
        .tickPadding(19);
    var svg = d3.select('#mainChart')
        .attr('width', unPaidRulerWidth * 5.2)
        .attr('height', 40);
    var mainChart = svg
        .append('g')
        .attr('class', 'rulerChart');
    //axis
    mainChart.append('g')
        .attr('class', 'x axis')
        .style('stroke-width', '0')
        .style('font-size', '1.3rem')
        .style('font-weight', '400')
        .style('text-anchor', 'start')
        .style('opacity', 1)
        .call(xAxis);
};
//indi_drawing --------------------------------------
var unpaidWorkdraw = function () {
    var maxRatio = d3.max(ratioData, function (d) {
        return d.ratio;
    });
    sortRank = dataSet.sort(function (a, b) {
        return b.ratio - a.ratio;
    });
    var rankData = sortRank.map(function (d, i) {
        return {
            ratio: d.ratio,
            country: d.country,
            countryname: d.countryname,
            rank: i
        }
    });
    var unpaidXscale = d3.scaleLinear()
        .domain([0, maxRatio])
        .range([0, unPaidWorkWidth * maxRatio]);
    var unpaidYscale = d3.scaleBand()
        .domain(d3.range(rankData.length))
        .rangeRound([0, unPaidWorkHeight - 40])
        .padding(0.04);
    var unpaidXaxis = d3.axisTop()
        .scale(unpaidXscale)
        .tickFormat(function (d) {
            return d * 1;
        })
        .tickPadding(-20)
        .tickSize(0);
    var unpaidYaxis = d3.axisLeft()
        .scale(unpaidYscale)
        .tickFormat(function (d) {
            return d;
        })
        .tickPadding(0);
    var unPaidWorkSvg = d3.select('#unpiadWorkChart')
        .attr('width', (unPaidWorkWidth * maxRatio) + 10)
        .attr('height', unPaidWorkHeight)
        .attr('transform', 'translate( ' + UNPMARGIN.LEFT + ',' + UNPMARGIN.TOP + ')');

    var unpaid = unPaidWorkSvg
        .append('g')
        .attr('transform', 'translate( ' + UNPMARGIN.LEFT + ',' + UNPMARGIN.TOP + ')');
    //apppend rect
    var markerSel = unpaid.selectAll('rect').data(rankData);
    var markerEnter = markerSel.enter();
    markerEnter
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return unpaidYscale(d.rank);
        })
        .attr('width', 0)
        .attr('height', unpaidYscale.bandwidth())
        .style('fill', function (d) {
            return d['country'] === 'Korea' ? '#f6ecdd' : '#000';
        })
        .transition()
        .duration(5000)
        .attr('width', function (d, i) {
            return unpaidXscale(d.ratio);
        });
    //append text
    var textSel = unpaid.selectAll('text').data(rankData);
    var textEnter = textSel.enter();
    textEnter.append('text')
        .text(function (d) {
            return d.countryname + ' ' + d.ratio.toFixed(2);
        })
        .attr('x', function (d, i) {
            return unpaidXscale(d.ratio) - 2;
        })
        .attr('y', function (d, i) {
            return unpaidYscale(d.rank) - unpaidYscale.bandwidth() / 2;
        })
        .style('text-anchor', 'end')
        .style('alignment-baseline', 'text-before-edge')
        .style('font-size', '1.2rem')
        .style('font-weight', '400')
        .style('fill', function (d) {
            return d['country'] === 'Korea' ? '#000' : '#f6ecdd';
        });
};
