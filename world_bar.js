var CONMARGIN = {
    LEFT: 0,
    TOP: 20,
    RIGHT: 0,
};

var countriesWidth = window.innerWidth * 0.95 - CONMARGIN.LEFT - CONMARGIN.RIGHT - 15,
    countriesHeight = 40 * 144 - CONMARGIN.TOP,
    targetYear = 2017;

var dataSet = [];
var topAverage = [];
d3.csv('data/ggi_2017.csv', function (err, rows) {
    worldData(rows);
});

var worldData = function (rows) {
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
        return d3.descending(x.score, y.score);
    });

    dataSet = rows;
    countriesRedraw();

}

//indi_drawing --------------------------------------
var countriesRedraw = function () {

    var countriesXscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, countriesWidth]);

    var countries = dataSet.map(function (d) {
        return d.country;
    });

    var countriesYscale = d3.scaleBand()
        .domain(countries)
        .rangeRound([0, countriesHeight])
        .paddingOuter(0)
        .paddingInner(0.025);

    var countriesSvg = d3.select('#worldChart')
        .attr('width', countriesWidth + CONMARGIN.LEFT + CONMARGIN.RIGHT - 50)
        .attr('height', countriesHeight + CONMARGIN.TOP + 10);
    var countries = countriesSvg
        .append('g')
        .attr('width', countriesWidth)
        .attr('transform', 'translate(' + CONMARGIN.LEFT + ',' + CONMARGIN.TOP + ')');
    var conXaxis = d3.axisTop()
        .scale(countriesXscale)
        .tickFormat(function (d) {
            return d;
        })
        .tickSize(0)
        .tickPadding(-12);
    //mainMarekr Rect
    var markerSel = countries.append('g')
        .attr('class', 'rectSel').selectAll('rect').data(dataSet);
    var markerEnter = markerSel.enter();
    markerEnter.append('rect')
        .attr('class', function (d) {
            return d.country.replace(' ', '-') + 'rect';
        })
        .attr('fill', '#111')
        .attr('x', 0)
        .attr('y', function (d) {
            return countriesYscale(d.country);
        })
        .attr('height', countriesYscale.bandwidth() - 0.125)
        .attr('width', 0)
        .transition()
        .delay(function (d, i) {
            return i * 100;
        })
        .duration(2000)
        .attr('width', function (d) {
            return countriesXscale(d.score);
        });

    //korea
    var koreaCell = countries.append('g')
        .attr('class', 'koreaSel');
    koreaCell
        .append('rect')
        .attr('x', 0)
        .attr('y', function (d) {
            return countriesYscale('South Korea');
        })
        .attr('height', countriesYscale.bandwidth() - 0.125)
        .attr('width', 0)
        .style('fill', '#f6ecdd')

        .on('mouseover', function (d) {
            d3.select(this.parentNode.parentNode.querySelector('.한국exText'))
                .style('opacity', 1);
        })
        .on('mouseout', function () {
            d3.select(this.parentNode.parentNode.querySelector('.한국exText'))
                .style('opacity', 0);
        })
        .transition()
        .delay(4000)
        .duration(2200)
        .attr('width', function () {
            return countriesXscale(0.65);
        })
        .expOut;

    //text-tooltip
    var textArray = countries.append('g')
        .attr('class', 'contriesText').selectAll('text').data(dataSet);
    //tooltip-countries
    var textEnter = textArray.enter();
    textEnter.append('text')
        .text(function (d) {
            return +d.rank + '위 ' + d.countrynames;
        })
        .attr('class', function (d) {
            return d.country.replace(' ', '-') + 'text';
        })
        .attr('fill', '#f7ecdd')
        .attr('x', function (d) {
            return countriesXscale(d.score) - 4;
        })
        .attr('y', function (d) {
            return countriesYscale(d.country) + countriesYscale.bandwidth() * 0.5 + 9;
        })
        .style('opacity', 0)
        .style('font-size', '1.3rem')
        .style('alignmnet-baseline', 'text-after-edge')
        .style('text-anchor', 'end')
        .style('font-weight', '300')
        .transition()
        //        .delay(2000)
        .duration(500)
        .style('opacity', 1);

    //text-tooltip
    var textArray = countries.append('g')
        .attr('class', 'contriesText').selectAll('text').data(dataSet);
    //tooltip-countries
    var textEnter = textArray.enter();
    textEnter.append('text')
        .text(function (d) {
            return '여자와 남자는 ' +
                (1 - d.score).toFixed(2) + '만큼 차이가 나요.';
        })
        .attr('class', function (d) {
            return d.countrynames.replace(' ', '-') + 'exText';
        })
        .attr('fill', '#000')
        .attr('x', function (d) {
            return countriesXscale(d.score) + 4;
        })
        .attr('y', function (d) {
            return countriesYscale(d.country) + countriesYscale.bandwidth() - 10;
        })
        .style('opacity', 0)
        .style('font-size', '1.3rem')
        .style('alignmnet-baseline', 'centeral')
        .style('text-anchor', 'start')
        .style('font-weight', '400');

};
