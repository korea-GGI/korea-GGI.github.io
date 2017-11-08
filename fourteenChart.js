var fourteenWidth = 900,
    fourteenHeight = 1200,
    targetYear = 2016;

var MARGIN = {
    LEFT: 50,
    RIGHT: 50,
};

var dataSet = [];
var topAverage = [];
d3.queue()
    .defer(d3.csv, 'data/korea_ggi.csv')
    .defer(d3.csv, 'data/top_five_average.csv')
    .awaitAll(function (err, data) {
        koreaData(data[0]);
        globalData(data[1]);
    });

var koreaData = function (rows) {
    rows.forEach(function (row) {
        row['country'] = row['country'];
        row['area'] = row['area'];
        row['part'] = row['part'];
        row['score'] = +row['score'];
        row['rank'] = +row['rank'];
        row['worldAver'] = row['worldAver'];
    });

    dataSet = rows;
    fourteenRedraw();
}
var globalData = function (rows) {
    rows.forEach(function (row) {
        row['average'] = +row['average'];
        row['part'] = row['part'];
    });

    topAverage = rows;
    tops();

}


//평균내기 너무 귀찮았다. 오또케?
//    rows = rows.filter(function (row) {
//        return (
//            row['part'] === '남성대비 여성 노동인구 비율'
//        );
//    });
//
//    var map = rows.map(function (d, i) {
//        return d.score;
//    })
//    console.log(map);
//    var mean = d3.mean(map);
//    console.log(mean);
//
//
//
//    console.log(mean);
//    var mean = d3.mean(rows.score);
//
//    console.log(mean);



var fourteenXscale = d3.scaleLinear()
    .domain([0, 1.1])
    .range([0, fourteenWidth * 1.1]);

var tops = function () {
    var partName = dataSet.map(function (d) {
        return d.part;
    });

    var fourteenYscale = d3.scaleBand()
        .domain(partName)
        .rangeRound([0, fourteenHeight]);

    var fourteenXaxis = d3.axisTop()
        .scale(fourteenXscale)
        .tickFormat(function (d) {
            return d * 1
        })
        .tickPadding(-25)
        .tickSize(0);

    var fourteenYaxis = d3.axisLeft()
        .scale(fourteenYscale)
        .tickSize(-990)
        .tickPadding(10);

    var fourteenSvg = d3.select('#fourteenChart')
        .attr('width', fourteenWidth + MARGIN.LEFT + MARGIN.RIGHT + 100)
        .attr('height', fourteenHeight + 130);

    var fourteen = fourteenSvg
        .append('g')
        .attr('class', 'topFourteen');

    fourteen.append('g')
        .attr('class', 'y axis')
        .style('stroke-width', '0')
        .style('font-size', '0.9rem')
        .style('text-anchor', 'start')
        .style('alignmnet-baseline', 'baseline')
        .style('font-weight', '500')
        .attr('transform', 'translate( 0 , ' + (-78) + ' )')
        .call(fourteenYaxis);

    fourteen.append('text')
        .attr('fill', 'black')
        .text('상위 5나라')
        .attr('x', 872.52)
        .attr('y', -24)
        .style('text-anchor', 'middle')
        .style('font-size', '0.9rem')
        .style('font-weight', '400');

    var topMarker = fourteen.selectAll('g.tops').data(topAverage);
    topMarker.enter()
        .append('g')
        .attr('class', 'tops')
        .html('<text /><html /><rect />')
        .attr('transform', 'translate( 0, ' + 5 + ')')
        .merge(topMarker)
        .each(function (t) {
            var valueText = d3.select(this).append('text');
            valueText
                .attr('fill', 'black')
                .text(t.average)
                .attr('class', 'topScore')
                .attr('text-anchor', 'middle')
                .attr('x', fourteenXscale(t.average) + 7)
                .attr('y', fourteenYscale(t.part) + 20)
                .style('font-size', '1rem')
                .style('opacity', 0);

            var selectRect = d3.select(this).append('text');
            selectRect
                .attr('fill', '#111')
                .attr("style", "font-family:FontAwesome;")
                .style('font-size', '1.4rem')
                .text(function (d) {
                    return '\uf182'
                })
                .attr('x', fourteenXscale(t.average))
                .attr('y', fourteenYscale(t.part))
                .style('opacity', 0.8)
                .on('mouseover', function () {
                    d3.selectAll('.topScore').style('opacity', 1);
                })
                .on('mouseout', function () {
                    d3.selectAll('.topScore').style('opacity', 0);
                });

        });

};
//indi_drawing --------------------------------------
var fourteenRedraw = function () {
    var partName = dataSet.map(function (d) {
        return d.part;
    });

    var fourteenYscale = d3.scaleBand()
        .domain(partName)
        .rangeRound([0, fourteenHeight]);

    var fourteenXaxis = d3.axisTop()
        .scale(fourteenXscale)
        .tickFormat(function (d) {
            return d * 1
        })
        .tickPadding(-25)
        .tickSize(0);

    var fourteenYaxis = d3.axisLeft()
        .scale(fourteenYscale)
        .tickSize(-990)
        .tickPadding(10);

    var fourteenSvg = d3.select('#fourteenChart')
        .attr('width', fourteenWidth + MARGIN.LEFT + MARGIN.RIGHT + 100)
        .attr('height', fourteenHeight + 80);

    var fourteen = fourteenSvg
        .append('g')
        .attr('class', 'koreaFourteen');

    fourteen.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate( 0 , ' + (fourteenHeight) + ' )')
        .style('stroke-width', '1')
        .style('font-size', '1rem')
        .style('font-weight', '300')
        .call(fourteenXaxis);

    fourteen.append('g')
        .attr('class', 'y axis')
        .style('stroke-width', '1')
        .style('font-size', '0')
        .style('text-anchor', 'start')
        .style('alignmnet-baseline', 'baseline')
        .attr('transform', 'translate( 0 , ' + (-45) + ' )')
        .call(fourteenYaxis);

    fourteen.append('text')
        .attr('fill', 'black')
        .text("한국")
        .attr('x', 667)
        .attr('y', -24)
        .style('text-anchor', 'middle')
        .style('font-size', '0.9rem')
        .style('font-weight', '400');

    var markerSel = fourteen.selectAll('g.datas').data(dataSet);
    markerSel.enter()
        .append('g')
        .attr('class', 'datas')
        .html('<text /><html /><circle />')
        //        .attr('transform', 'translate( 0, ' + 55 + ')')
        .merge(markerSel)
        .each(function (dd) {
            var kovalueText = d3.select(this).append('text');
            kovalueText
                .attr('fill', 'black')
                .text(dd.score)
                .attr('class', 'koreaScore')
                .attr('x', fourteenXscale(dd.score) + 10)
                .attr('y', fourteenYscale(dd.part) + 30)
                .style('font-size', '1rem')
                .style('text-anchor', 'middle')
                .style('opacity', 1);

            var selectCircle = d3.select(this).append('text');
            selectCircle
                .attr('fill', '#000')
                .attr("style", "font-family:FontAwesome;")
                .style('font-size', '1.4rem')
                .text(function (d) {
                    return '\uf183'
                })
                .attr('x', fourteenXscale(1) - 5)
                .attr('y', fourteenYscale(dd.part) + 5);

            var selectCircle = d3.select(this).append('text');
            selectCircle
                .attr('fill', '#4477ff')
                .attr("style", "font-family:FontAwesome;")
                .style('font-size', '1.4rem')
                .text(function (d) {
                    return '\uf182'
                })
                .attr('x', fourteenXscale(0))
                .attr('y', fourteenYscale(dd.part) + 5)
                .on('mouseover', function () {
                    d3.selectAll('.koreaScore').attr('opacity', 1);

                })
                .on('mouseout', function () {
                    d3.selectAll('.koreaScore').attr('opacity', 0);
                });

            selectCircle
                .transition()
                .duration(8000)
                .attr('x', fourteenXscale(dd.score));
        });
    markerSel.exit().remove();

};
