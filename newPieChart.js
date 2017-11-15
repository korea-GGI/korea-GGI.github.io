var data = [
    [
        {
            country: 'a',
            radius: 1.0,
            values: [
                {
                    ratio: 0.75,
                    opacity: 1.0,
                    country: 'a'
                },
                {
                    ratio: 0.25,
                    opacity: 1.0,
                    country: 'a'
                }
            ]
        },
        {
            country: 'b',
            radius: 0.5,
            values: [
                {
                    ratio: 0.5,
                    opacity: 1.0,
                    country: 'b'
                },
                {
                    ratio: 0.5,
                    opacity: 1.0,
                    country: 'b'
                }
            ]
        },
    ],
    [
        {
            country: 'a',
            radius: 1.0,
            values: [
                {
                    ratio: 0.25,
                    opacity: 1.0,
                    country: 'a'
                },
                {
                    ratio: 0.75,
                    opacity: 0.25,
                    country: 'a'
                }
            ]
        },
        {
            country: 'b',
            radius: 0.5,
            values: [
                {
                    ratio: 0.5,
                    opacity: 0.25,
                    country: 'b'
                },
                {
                    ratio: 0.5,
                    opacity: 1,
                    country: 'b'
                }
            ]
        },
    ],
    [
        {
            country: 'a',
            radius: 1.0,
            values: [
                {
                    ratio: 0.25,
                    opacity: 1.0,
                    country: 'a'
                },
                {
                    ratio: 0.75,
                    opacity: 0,
                    country: 'a'
                }
            ]
        },
        {
            country: 'b',
            radius: 0.5,
            values: [
                {
                    ratio: 0.5,
                    opacity: 0,
                    country: 'b'
                },
                {
                    ratio: 0.5,
                    opacity: 1.0,
                    country: 'b'
                }
            ]
        },
    ],
    [
        {
            country: 'a',
            radius: 0.7,
            values: [
                {
                    ratio: 0.75,
                    opacity: 0.25,
                    country: 'a'
                },
                {
                    ratio: 0.25,
                    opacity: 1,
                    country: 'a'
                }
            ]
        },
        {
            country: 'b',
            radius: 0.7,
            values: [
                {
                    ratio: 0.5,
                    opacity: 0.25,
                    country: 'b'
                },
                {
                    ratio: 0.5,
                    opacity: 1,
                    country: 'b'
                }
            ]
        }
    ]
];

var PIEMARGIN = {
    LEFT: 30,
    RIGHT: 0,
    TOP: 0,
}

var pieWidth = window.innerWidth * 0.9 - PIEMARGIN.LEFT - PIEMARGIN.RIGHT - 20,
    pieHeight = window.innerHeight * 0.6 - PIEMARGIN.TOP,
    radius = Math.min(pieWidth, pieHeight) / 4;

function updatePie(curData) {
    var svg = d3.select('#pie')
        .attr('width', pieWidth + PIEMARGIN.LEFT + 30)
        .attr('height', pieHeight * 0.8 + 30)
        .attr('transform', 'translate(0,0)');

    var countryGroups = svg.selectAll('g.country').data(curData);

    var colorScale = d3.scaleOrdinal()
        .domain(['a', 'b'])
        .range(['#000', '#000']);

    countryGroups = countryGroups.enter()
        .append('g')
        .attr('class', 'country')
        .attr('transform', function (d, i) {
            return 'translate(' + (pieWidth / 2 * i + pieWidth * 0.2) + ',' + pieHeight / 2 + ')';
        }).merge(countryGroups);

    countryGroups.each(function (d) {
        var pie = d3.pie()
            .value(function (d) {
                return d.ratio;
            })(d.values);
        var arcPath = d3.arc()
            .outerRadius(radius * d.radius * 1.2)
            .innerRadius(0);

        var arcs = d3.select(this).selectAll('.arc').data(pie);
        arcs.enter()
            .append('path')
            .attr('class', 'arc')
            .merge(arcs)
            .attr('d', arcPath)
            .style('opacity', function (d) {
                return d.data.opacity;
            })
            .style('fill', function (d) {
                return colorScale(d.data.country);
            });

    });
}
updatePie(data[3]);

d3.select('#a')
    .transition()
    .delay(200)
    .style('background-color', '#f6ecdd')
    .style('color', '#000')
    .transition()
    .delay(200)
    .style('background-color', null)
    .style('color', '#ff9140')
    .transition()
    .delay(200)
    .style('background-color', '#f6ecdd')
    .style('color', '#000')
    .transition()
    .delay(200)
    .style('background-color', null)
    .style('color', '#ff9140');
d3.select('#a')
    .on('click', function (d, i) {
        updatePie(data[0]);

    });
d3.select('#b')
    .on('click', function (d, i) {
        updatePie(data[1]);

    });

d3.select('#c')
    .on('click', function (d, i) {
        updatePie(data[2]);
    });
d3.select('#d')
    .on('click', function (d, i) {
        updatePie(data[3]);

    });
