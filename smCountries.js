var SMCMARGIN = {
    LEFT: 0,
    RIGHT: 0,
    TOP: 0,
    BOTTOM: 0
};
var smWidth = window.innerWidth * 0.95 - SMCMARGIN.LEFT - SMCMARGIN.RIGHT - 15,
    smHeight = window.innerHeight * 1.8 - SMCMARGIN.TOP,
    targetYear = 2016;

var smDataSet = [];
var topAverage = [];
d3.csv('data/ggi_2017.csv', function (err, rows) {
    SCworldData(rows);
});

var SCworldData = function (rows) {
    rows.forEach(function (row) {
        row['country'] = row['country'];
        row['part'] = row['part'];
        row['score'] = +row['score'];
        row['year'] = +row['year'];
        row['rank'] = +row['rank'];
        row['type'] = row['type'];
    });

    rows = rows.filter(function (row) {
        return (
            row['year'] === targetYear &&
            row['type'] === 'overall' &&
            !Number.isNaN(row['score'])
        );
    });

    rows.sort(function (x, y) {
        return d3.descending(
            x.score + (x.country === 'South Korea' ? 100 : 0),
            y.score + (y.country === 'South Korea' ? 100 : 0)
        );
    });

    var myCountries = ['Iceland', 'Finland', 'Norway', 'Sweden',
                       'Rwanda', 'United States', 'Japan', 'China',
                       'South Korea', 'France', 'Germany',
                       'New Zealand', 'Switzerland', 'United Kingdom'
];
    var pickCountries = rows.filter(function (row) {
        for (var i = 0; i < myCountries.length; i++) {
            if (row['country'] === myCountries[i]) return true;
        }
        return false;
    });
    dataSet = pickCountries;
    var nest = d3.nest()
        .key(function (d) {
            return d.country;
        })
        .entries(pickCountries);

    smDataSet = nest;
    selectedCountryRedraw();
}
//indi_drawing --------------------------------------
var selectedCountryRedraw = function () {
    // SMC = small multiples countries
    var SMCMARGIN = {
        TOP: 0,
        LEFT: 0,
        RIGHT: 0,
        BOTTOM: 0,
    }
    var GRID = {
        W: 1,
        H: 15
    };
    var wBand = d3.scaleBand()
        .domain(d3.range(GRID.W))
        .range([0, smWidth])
        .round(true)
        .paddingOuter(0)
        .paddingInner(0);

    var hBand = d3.scaleBand()
        .domain(d3.range(GRID.H))
        .range([0, smHeight + SMCMARGIN.TOP + SMCMARGIN.BOTTOM])
        .round(true)
        .paddingInner(0.2)
        .paddingOuter(0);

    var cellSel = d3.select('#selectedCountryChart')
        .attr('width', smWidth + SMCMARGIN.LEFT + SMCMARGIN.RIGHT + 20)
        .attr('height', smHeight + SMCMARGIN.TOP + SMCMARGIN.BOTTOM - 50)
        .selectAll('g.cell').data(d3.range(GRID.W * GRID.H));
    //smCell
    cellSel.enter()
        .append('g')
        .attr('class', 'cell')
        .attr('transform', function (d, i) {
            var x = wBand(i % GRID.W);
            var y = hBand(Math.floor(i / GRID.W));
            return 'translate(' + SMCMARGIN.LEFT + ', ' + y + ')';
        })
        .each(function (i) {
            // Axis
            var smXscale = d3.scaleLinear()
                .domain([1, 0])
                .rangeRound([wBand.bandwidth(), 0]);
            var smYscale = d3.scaleLinear()
                .domain([0, 1])
                .rangeRound([0, hBand.bandwidth()]);
            var smXaxis = d3.axisBottom()
                .scale(smXscale)
                .tickValues([0.649])
                .tickFormat(function (d) {
                    return d;
                })
                .tickPadding(25);
            var smYaxis = d3.axisLeft()
                .scale(smYscale)
                .tickSize(0)
                .tickFormat(function (d) {
                    return +d;
                })
                .ticks(3)
                .tickPadding(80);
            d3.select(this)
                .append('g')
                .attr('class', function (d) {
                    return smDataSet[d].key + 'tick' + ' tips';
                })
                .attr('transform', 'translate(0, 15)')
                .style('font-size', '1.3rem')
                .style('stroke-width', '0')
                .style('fill', '0')
                .style('text-anchor', 'middle')
                .style('alignment-baseline', 'text-before-edge')
                .transition()
                .delay(2500)
                .call(smXaxis);
            //tooltip
            d3.select(this).append('text')
                .attr('class', function (d) {
                    return smDataSet[d].key + 'smText smtooltip';
                })
                .attr('x', function (d) {
                    return smXscale(smDataSet[d]['values'][0].score);
                })
                .attr('y', 61)
                .style('text-anchor', 'start')
                .style('font-size', '1.3rem')
                .style('font-weight', '400')
                .style('text-transform', 'uppercase')
                .style('fill', 'black')
                .style('opacity', '1')
                .text(function (d) {
                    return smDataSet[d]['values'][0].score;
                });
            //womanCell
            d3.select(this).append('rect')
                .attr('class', function (d) {
                    return smDataSet[d].key + "rect"
                })
                .attr('fill', '#111')
                .attr('x', 0)
                .attr('y', 0)
                .attr('opacity', 0.9)
                .attr('height', 30)
                .attr('width', 0)
                .transition()
                .delay(500)
                .duration(3000)
                .attr('width', function (d) {
                    return smXscale(smDataSet[d]['values'][0].score);
                });
            //manCell
            d3.select(this).append('rect')
                .attr('class', function (d) {
                    return smDataSet[d].key + "marginRect"
                })
                .attr('fill', '#000')
                .attr('opacity', 0.1)
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', 30)
                .on('mouseover', function (d, i) {
                    d3.select(this.parentNode.querySelector('.smtooltip'))
                        .style('opacity', 1);
                })
                .on('mouseout', function (d, i) {
                    d3.select(this.parentNode.querySelector('.smtooltip'))
                        .style('opacity', 1);
                })
                .attr('width', function (d) {
                    return smXscale(1);
                });
            //koreaMark
            var koreaMark = smXscale(0.649);
            d3.select(this).append('path')
                .transition()
                .delay(2500)
                .attr('d', 'M' + (koreaMark - 1.5) + ' 0 L ' + (koreaMark - 1.5) + ' ' + 30 + ' ')
                .style('stroke', '#f6ecdd').style('stroke-width', 2);
            // Title
            d3.select(this).append('text')
                .attr('x', 0)
                .attr('y', 60)
                .style('text-anchor', 'start')
                //                .style('alignment-baseline', 'text-before-edge')
                .style('font-size', '1.3rem')
                .style('font-weight', '600')
                .style('text-transform', 'uppercase')
                //                .style('fill', '#f6ecdd')
                .style('fill', '#000')
                .style('opacity', '1')
                .text(function (d) {
                    return smDataSet[d]['values'][0].countrynames + ' ' + smDataSet[d]['values'][0].rank + '위';
                });
        })
        .merge(cellSel)
        .each(function (i) {
            // Update
        });
    cellSel.exit()
        .remove();
};
