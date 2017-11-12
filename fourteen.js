var MARGIN = {
    LEFT: 0,
    TOP: 0,
    RIGHT: 0
};

var fourteenWidth = window.innerWidth * 0.95 - MARGIN.LEFT -
    MARGIN.RIGHT - 15,
    fourteenHeight = window.innerHeight * 0.7 - MARGIN.TOP;
var fourteenSvg = d3.select('#indiChart')
    .attr('width', fourteenWidth + MARGIN.LEFT + MARGIN.RIGHT + 150)
    .attr('height', fourteenHeight + MARGIN.TOP + 150);

var fourteenG = fourteenSvg.select('.koreaFourteen')
    .attr('transform', 'translate(' + MARGIN.LEFT + ',' + MARGIN.TOP + ')');

d3.queue()
    .defer(d3.csv, 'data/iceland_score.csv')
    .defer(d3.csv, 'data/korea_ggi.csv')
    .awaitAll(function (err, data) {
        globalData(data[0]);
        koreaData(data[1]);
    });
var topScore = [];
var globalData = function (rows) {
    rows.forEach(function (row) {
        row['icelandScore'] = +row['icelandScore'];
        row['part'] = row['part'];
    });
    topScore = rows;
    tops();
}
var dataSetIndication = [];
var koreaData = function (rows) {
    rows.forEach(function (row) {
        row['country'] = row['country'];
        row['area'] = row['area'];
        row['part'] = row['part'];
        row['score'] = +row['score'];
        row['rank'] = +row['rank'];
        row['worldAver'] = row['worldAver'];
    });
    dataSetIndication = rows;
    fourteenRedraw();
}
var tops = function () {
    var partName = topScore.map(function (d) {
        return d.part;
    });

    var fourteenXscale = d3.scaleLinear()
        .domain([0, 1.1])
        .rangeRound([0, fourteenWidth * 1.1]);

    var fourteenYscale = d3.scaleBand()
        .domain(partName)
        .rangeRound([0, fourteenHeight])
        .paddingInner(0.15)
        .paddingOuter(0.26);

    //top margin
    fourteenG.selectAll('g.subindex').data(d3.range(4))
        .style('transform', function (d, i) {
            return 'translate( 0,' + (i * 20) + 'px)';
        });
    //top Marker
    var markerSel = fourteenG.selectAll('.topRect').data(topScore)
        .attr('fill', '#000')
        .attr('y', function (d) {
            return fourteenYscale(d.part);
        })
        .attr('x', function (d) {
            return fourteenXscale(d.icelandScore);
        })
        .attr('width', 4)
        .attr('height', fourteenYscale.bandwidth())
        .style('opacity', '0')
        .transition()
        .delay(3500)
        .duration(1000)
        .style('opacity', '1');
    //top Tooltip
    fourteenG
        .selectAll('.topTooltip').data(topScore)
        .text(function (d) {
            return "1위 국가 " + d.icelandScore.toFixed(2);
        })
        .attr('fill', '#000')
        .attr('y', function (d) {
            return fourteenYscale(d.part) + 4;
        })
        .style('opacity', 0)
        .style('alignment-baseline', 'text-before-edge')
        .style('font-size', '1.2rem')
        .style('text-anchor', function (d) {
            return d.score > 0.78 ? "end" : "start";
        })
        .attr('x', function (d) {
            return d.score > 0.78 ? fourteenXscale(d.icelandScore) - 7 : fourteenXscale(d.icelandScore) + 7;
        })
        .transition()
        .delay(4000)
        .duration(1500)
        .style('opacity', function (d) {
            return d.score > 0.78 ? "0" : "1";
        });

};
var fourteenRedraw = function () {
    var dataSet = dataSetIndication;

    var partName = dataSet.map(function (d) {
        return d.part;
    });
    var fourteenXscale = d3.scaleLinear()
        .domain([0, 1.1])
        .rangeRound([0, fourteenWidth * 1.1]);
    var fourteenYscale = d3.scaleBand()
        .domain(partName)
        .rangeRound([0, fourteenHeight])
        .paddingInner(0.15)
        .paddingOuter(0.26);
    //    fourteen margin
    fourteenG.selectAll('g.subindex').data(d3.range(4))
        .style('transform', function (d, i) {
            return 'translate( 0,' + (i * 30) + 'px)';
        });
    //fourteen Marker
    var markerSel = fourteenG.selectAll('.dataRect').data(dataSet)
        .classed('dataRect', true)
        .attr('fill', '#f6ecdd')
        .attr('y', function (d) {
            return fourteenYscale(d.part);
        })
        .attr('width', 0)
        .attr('height', fourteenYscale.bandwidth())
        .attr('x', 0)
        .style('opacity', '0.9')
        .transition()
        .duration(2500)
        .attr('width', function (d) {
            return fourteenXscale(d.score);
        })
        .expOut;
    //tooltip
    fourteenG
        .selectAll('.ftooltip').data(dataSet)
        .text(function (d) {
            return '한국 ' + d.part + ' ' + d.score.toFixed(2);
        })
        .attr('fill', '#000')
        .attr('y', function (d) {
            return fourteenYscale(d.part) + 4;
        })
        .style('opacity', 0)
        .style('alignment-baseline', 'text-before-edge')
        .style('font-weight', 600)
        .style('font-size', '1.2rem')
        .style('text-anchor', function (d) {
            return d.score > 0.78 ? "end" : "start";
        })
        .attr('x', function (d) {
            return d.score > 0.78 ? fourteenXscale(d.score) - 7 : fourteenXscale(d.score) + 7;
        })
        .transition()
        .delay(500)
        .duration(2000)
        .style('opacity', 0)
        .expOut;
    //fixedtooltip
    fourteenG
        .selectAll('.fixedtooltip').data(dataSet)
        .text(function (d) {
            return '한국 ' + d.part + ' ' + d.score.toFixed(2);
        })
        .attr('fill', '#000')
        .attr('y', function (d) {
            return fourteenYscale(d.part) + 4;
        })
        .style('opacity', 0)
        .style('alignment-baseline', 'text-before-edge')
        .style('font-weight', 600)
        .style('font-size', '1.2rem')
        .style('text-anchor', function (d) {
            return d.score > 0.78 ? "end" : "start";
        })
        .attr('x', function (d) {
            return d.score > 0.78 ? fourteenXscale(d.score) - 7 : fourteenXscale(d.score) + 7;
        })
        .transition()
        .delay(1500)
        .duration(2000)
        .style('opacity', function (d) {
            return d.score > 0.78 ? "0" : "1";
        })
        .expOut;
    //forhover Marker
    fourteenG.selectAll('.hoverRect').data(dataSet)
        .classed('hoverRect', true)
        .attr('y', function (d) {
            return fourteenYscale(d.part);
        })
        .attr('height', fourteenYscale.bandwidth())
        .attr('width', 0)
        .attr('x', 0)
        .style('fill', 'transparent')
        .on('mouseover', function () {
            d3.select(this.parentNode.querySelector('.ftooltip'))
                .transition()
                .duration(200)
                .style('opacity', 0.8);
        })
        .on('mouseout', function () {
            d3.select(this.parentNode.querySelector('.ftooltip'))
                .transition()
                .duration(100)
                .style('opacity', 0);
        })
        .transition()
        .delay(500)
        .duration(2500)
        .attr('width', function (d) {
            return fourteenXscale(d.score);
        });
};
