var dataSetEcoPoli = [];

var POLIMARGIN = {
    LEFT: 40,
    RIGHT: 0,
    TOP: 30,
};
var length = window.innerWidth * 0.95 - POLIMARGIN.LEFT - 15,
    Hlength = window.innerWidth * 0.4 - POLIMARGIN.LEFT - 15,
    celSize = window.innerWidth * 0.006,
    targetYear = 2017;
// datas---------------------------------------

d3.csv('data/ggi_2017.csv', function (err, rows) {
    poliData(rows);
});

var poliData = function (rows) {
    rows.forEach(function (row) {
        row['country'] = row['country'];
        row['score'] = +row['score'];
        row['year'] = +row['year'];
        row['type'] = row['type'];
        row['rank'] = +row['rank'];

    });

    rows = rows.filter(function (row) {
        return (
            row['year'] === targetYear &&
            !Number.isNaN(row['score'])
        );
    });
    var political = rows.filter(function (row) {
        return row['type'] === "political"
    });
    var economic =
        rows.filter(function (row) {
            return row['type'] === "economic"
        });

    var filterData = political.map(function (d, i) {
        return {
            country: d.country,
            countrynames: d.countrynames,
            year: d.year,
            economicScore: economic[i].score,
            politicalScore: political[i].score
        };
    });
    dataSetEcoPoli = filterData;
    poliRedraw();
}


//poli_drawing --------------------------------------

var ecoXscale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, length]);

var poliYscale = d3.scaleLinear()
    .domain([1, 0])
    .range([0, Hlength]);

var ecoXaxis = d3.axisBottom()
    .scale(ecoXscale)
    .tickSize(0)
    .tickPadding(15);

var poliYaxis = d3.axisRight()
    .scale(poliYscale)
    .tickSize(0)
    .tickValues([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])
    .tickPadding(10);

var poliRedraw = function () {
    var dataSet = dataSetEcoPoli;
    var poliSvg = d3.select('#poliecoChart')
        .attr('width', length + POLIMARGIN.LEFT + 10)
        .attr('height', Hlength + 100)
        .attr('transform', 'translate( ' + POLIMARGIN.LEFT + ',' + POLIMARGIN.TOP + ')');

    var poliChart = poliSvg
        .append('g')
        .attr('transform', 'translate( ' + POLIMARGIN.LEFT + ',' + POLIMARGIN.TOP + ')');
    //axis
    poliChart.append('g')
        .attr('class', 'poliaxis')
        .attr('transform', 'translate( 0 , ' + Hlength + ' )')
        .style('stroke-width', '1')
        .style('font-size', '1.3rem')
        .style('font-weight', '300')
        .style('text-anchor', 'start')
        .style('fill', '#f6ecdd')
        .call(ecoXaxis)
        .append('text')
        .text('경제 성 격차지수')
        .attr('class', 'axisName')
        .style('text-anchor', 'end')
        .style('font-size', '2rem')
        .style('font-weight', '600')
        .style('fill', '#000')
        .attr('dx', length)
        .attr('dy', -10);

    poliChart.append('g')
        .attr('class', 'poliaxis')
        .style('text-anchor', 'start')
        .style('stroke-width', '1')
        .style('font-size', '1.3rem')
        .style('font-weight', '300')
        .style('fill', '#f6ecdd')
        .style('alignment-baseline', 'text-after-edge')
        .call(poliYaxis)
        .append('text')
        .text('정치 성 격차지수')
        .attr('class', 'axisName')

        .style('fill', '#000')
        .style('font-size', '2rem')
        .style('font-weight', '600')
        .attr('dx', 50)
        .attr('dy', 10)
        .style('alignment-baseline', 'middle');

    //tooltip
    var valueText = poliChart.append('g')
        .attr('class', 'poliTG').selectAll('text').data(dataSet);
    var valueTextEnter = valueText.enter();
    valueTextEnter
        .append('text')
        .attr('fill', 'black')
        .text(function (d) {
            return d.countrynames;
        })
        .attr('class', function (d) {
            return d.country.replace(' ', '-') + "poliTip";
        })
        .attr('text-anchor', 'middle')
        .attr('x', function (d, i) {
            return ecoXscale(d.economicScore);
        })
        .attr('y', function (d, i) {
            return poliYscale(d.politicalScore) - 18;
        })
        .style('font-size', '1.3rem')
        .style('opacity', 0);
    //poliecoCircle
    var polecoCircle = poliChart.append('g')
        .attr('class', 'poliCG').selectAll('circle').data(dataSet);
    var polecoCircleEnter = polecoCircle.enter();
    polecoCircleEnter
        .append('circle')
        .attr('fill', '#000')
        .attr('class', function (d) {
            return d.country.replace(' ', '-') + "poliCircle";
        })
        .attr('r', celSize)
        .on('mouseover', function (d, i) {
            d3.select(this).transition().duration(300).attr('r', celSize * 1.7);
            d3.select(this.parentNode.parentNode.querySelector("." + d.country.replace(' ', '-') + "poliTip")).transition().duration(300).style('opacity', 1);
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition().duration(200).attr('r', celSize);
            d3.select(this.parentNode.parentNode.querySelector("." + d.country.replace(' ', '-') + "poliTip")).transition().duration(200).style('opacity', 0);
        })
        .attr('cy', function (d, i) {
            return poliYscale(0);
        })
        .transition()
        .duration(2000)
        .attr('cy', function (d, i) {
            return poliYscale(d.politicalScore);
        })
        .attr('cx', function (d, i) {
            return ecoXscale(0);
        })

        .transition()
        .duration(2000)
        .attr('cx', function (d, i) {
            return ecoXscale(d.economicScore);
        })
        .quadOut;

};
