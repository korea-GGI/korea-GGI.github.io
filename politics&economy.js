var dataSetEcoPoli = [];

var POLIMARGIN = {
    LEFT: 40,
    RIGHT: 0,
    TOP: 30,
};
var length = window.innerWidth * 0.37 - POLIMARGIN.LEFT - 15,
    Wlength = window.innerWidth * 0.95 - POLIMARGIN.LEFT - 15
celSize = window.innerWidth * 0.008,
    targetYear = 2017;
// datas---------------------------------------

d3.csv('data/ggi_2017.csv', function (err, rows) {
    poliData(rows);
});

var poliData = function (rows) {
    rows.forEach(function (row) {
        row['country'] = row['country'];
        row['countrynames'] = row['countrynames'];
        row['score'] = +row['score'];
        row['year'] = +row['year'];
        row['type'] = row['type'];
        row['rank'] = +row['rank'];

    });
    rows.filter(function (d) {
        return d['year'] === targetYear;
    });
    var nestedData = d3.nest(rows)
        .key(function (d) {
            return d['country'];
        })
        .entries(rows)
        .map(function (d) {
            var newData = {
                country: d['key'],
                countryname: d['values'][0]['countrynames'],
                year: d['values'][0]['year']
            };
            for (var i = 0; i < d['values'].length; i++) {
                var type = d['values'][i]['type'];
                var score = d['values'][i]['score'];
                newData[type] = score;
            }
            return newData;
        });
    dataSet = nestedData;
    poliRedraw();
}


//poli_drawing --------------------------------------

var ecoYscale = d3.scaleLinear()
    .domain([0, 1])
    .range([length, 0]);

var poliXscale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, Wlength]);

var ecoYaxis = d3.axisRight()
    .scale(ecoYscale)
    .tickSize(0)
    .tickPadding(15)
    .tickValues([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);

var poliXaxis = d3.axisBottom()
    .scale(poliXscale)
    .tickSize(0)
    .tickPadding(10);

var poliRedraw = function () {
    var poliSvg = d3.select('#poliecoChart')
        .attr('width', Wlength + POLIMARGIN.LEFT + 35)
        .attr('height', length + 100)
        .attr('transform', 'translate( ' + POLIMARGIN.LEFT + ',' + POLIMARGIN.TOP + ')');

    var poliChart = poliSvg
        .append('g')
        .attr('class', 'poliG')
        .attr('transform', 'translate( ' + POLIMARGIN.LEFT + ',' + POLIMARGIN.TOP + ')');
    //axis
    poliChart.append('g')
        .attr('class', 'ecoaxis')
        .style('stroke-width', '1')
        .style('font-size', '1.3rem')
        .style('font-weight', '300')
        .style('text-anchor', 'start')
        .style('fill', '#f6ecdd')
        .call(ecoYaxis);

    poliChart
        .append('text')
        .text('경제 성 격차지수')
        .attr('class', 'axisName')
        .style('text-anchor', 'start')
        .style('font-size', '1.7rem')
        .style('font-weight', '600')
        .style('fill', '#000')
        .attr('dx', 60)
        .attr('dy', 12);

    poliChart.append('g')
        .attr('class', 'poliaxis')
        .style('text-anchor', 'start')
        .style('stroke-width', '1')
        .style('font-size', '1.3rem')
        .style('font-weight', '300')
        .style('fill', '#f6ecdd')
        .attr('transform', 'translate( 0 , ' + length + ' )')
        .style('alignment-baseline', 'text-after-edge')
        .call(poliXaxis)
        .selectAll('text')
        .attr('class', function (d, i) {
            return "a" + i;
        });
    poliChart
        .append('text')
        .text('정치 성 격차지수')
        .attr('class', 'axisName poliaxisName')
        .style('fill', '#000')
        .style('font-size', '1.7rem')
        .style('text-anchor', 'end')
        .style('font-weight', '600')
        .attr('dx', Wlength)
        .attr('dy', length - 10)
        .style('alignment-baseline', 'start');

    //tooltip
    var valueText = poliChart.append('g')
        .attr('class', 'poliTG').selectAll('text').data(dataSet);
    var valueTextEnter = valueText.enter();
    valueTextEnter
        .append('text')
        .attr('fill', 'black')
        .text(function (d) {
            return d.countryname;
        })
        .attr('class', function (d) {
            return d.country.replace(' ', '-') + "poliTip";
        })
        .attr('text-anchor', 'middle')
        .attr('y', function (d, i) {
            return ecoYscale(d.economic);
        })
        .attr('x', function (d, i) {
            return poliXscale(d.political) - 18;
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
            return d.country.replace(' ', '-') + "poliCircle pCircle";
        })
        .attr('r', celSize)
        .attr('cx', 0)
        .attr('cy', ecoYscale(0))
        .style('opacity', 0.5)
        .on('mouseover', function (d, i) {
            d3.select(this).transition().duration(300).attr('r', celSize * 1.7);
            d3.select(this.parentNode.parentNode.querySelector("." + d.country.replace(' ', '-') + "poliTip")).transition().duration(300).style('opacity', 1);
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition().duration(200).attr('r', celSize);
            d3.select(this.parentNode.parentNode.querySelector("." + d.country.replace(' ', '-') + "poliTip")).transition().duration(200).style('opacity', 0);
        })
        .transition()
        .delay(function (d, i) {
            return i * 20;
        })
        .duration(1000)
        .attr('cx', function (d, i) {
            return poliXscale(d.political);
        })
        .transition()
        .delay(function (d, i) {
            return 3000 - (i * 20);
        })
        .duration(2000)
        .attr('cy', function (d, i) {
            return ecoYscale(d.economic);
        })
        .quadOut;
    poliChart.append('text')
        .text('한국')
        .attr('class', 'koreaTip')
        .attr('y', function (d, i) {
            return ecoYscale(0.532596107098159) + 3;
        })
        .attr('x', function (d, i) {
            return poliXscale(0.134408682120772) - 5;
        });

};
