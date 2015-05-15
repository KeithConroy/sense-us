// Clickable US Map

function generateMap() {
  jQuery('#vmap').vectorMap(
  {
    map: 'usa_en',
    borderColor: '#818181',
    borderOpacity: 0.25,
    borderWidth: 1,
    color: '#BBFFA2',
    enableZoom: false,
    hoverColor: '#BBFFA2',
    hoverOpacity: null,
    normalizeFunction: 'linear',
    scaleColors: ['#b6d6ff', '#005ace'],
    selectedColor: '#FCA128',
    selectedRegion: null,
    showTooltip: true,
    onRegionClick: function(element, abbrv, region)
    {
      $('#results h3').remove();
      $('#results p').remove();
      if(abbrv === 'ia'){
        getAwesome();
      }
      else {
        var stateCode = codes[abbrv.toUpperCase()];
        apiEstimatesCall(stateCode);
      }
    }
  });
}

// Highcharts

function prepareChart() {
  Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
    return {
      radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
      stops: [
        [0, color],
        [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
      ]
    };
  });
};

function renderChart(params, year, chartData) {
  $('#container').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: 'Projected '+params+' by race, '+year
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [{
      type: 'pie',
      name: 'name',
      data: chartData
    }]
  });

};
