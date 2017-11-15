var dataSetEcoPoli = [];

var POLIMARGIN = {
    LEFT: 40,
    RIGHT: 0,
    TOP: 30,
};
var Hlength = window.innerWidth * 0.35 - POLIMARGIN.LEFT - 15,
    celSize = window.innerWidth * 0.008,
    targetYear = 2017;
// datas---------------------------------------
function cleanseData(data) {
    var cleanData = data.map(function (d) {
        return {
            country: d['country'],
            type: d['type'],
            score: +d['score'],
            rank: +d['rank'],
            year: +d['year'],
            countryname: +d['countrynames'],
        };
    }).filter(function (d) {
        return d['year'] === targetYear;
    });
    var nestedData = d3.nest()
        .key(function (d) {
            return d['country'];
        })
        .entries(cleanData)
        .map(function (d) {
            var newData = {
                country: d['key'],
                year: d['values'][0]['year']
            };
            for (var i = 0; i < d['values'].length; i++) {
                var type = d['values'][i]['type'];
                var score = d['values'][i]['score'];
                newData[type] = score;
            }
            return newData;
        });
    return nestedData;
}

function render(data, Wlength) {
    d3.select('#curYear').text(Wlength);

    var ecoXscale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, Wlength]);

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

    var poliSvg = d3.select('#poliecoChart')
        .attr('width', Wlength + POLIMARGIN.LEFT + 10)
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
        .style('font-size', '1.7rem')
        .style('font-weight', '600')
        .style('fill', '#000')
        .attr('dx', Wlength)
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
        .attr('class', 'axisName poliaxisName')
        .style('fill', '#000')
        .style('font-size', '1.7rem')
        .style('font-weight', '600')
        .attr('dx', 50)
        .attr('dy', 5)
        .style('alignment-baseline', 'middle');

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
        .attr('x', function (d, i) {
            return ecoXscale(d.economic);
        })
        .attr('y', function (d, i) {
            return poliYscale(d.political) - 18;
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
        .attr('cy', function (d, i) {
            return poliYscale(0);
        })
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
        .duration(2000)
        .attr('cy', function (d, i) {
            return poliYscale(d.political);
        })
        .attr('cx', function (d, i) {
            return ecoXscale(0);
        })
        .transition()
        .duration(2000)
        .attr('cx', function (d, i) {
            return ecoXscale(d.economic);
        })
        .quadOut;
    poliChart.append('text')
        .text('한국')
        .attr('class', 'koreaTip')
        .attr('x', function (d, i) {
            return ecoXscale(0.532596107098159) + 3;
        })
        .attr('y', function (d, i) {
            return poliYscale(0.134408682120772) - 5;
        });
}

d3.csv('data/ggi_2017.csv', function (err, data) {
    d3.select('#width').on('change', function () {
        var Wlength = window.innerWidth * (this.value) - POLIMARGIN.LEFT - 15;
        render(cleanseData(data), Wlength);
    });

    render(cleanseData(data), 0.95);
});
