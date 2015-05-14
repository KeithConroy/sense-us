$(document).ready(function() {
  bindEvents();
  map();
  populateChart();
});



function bindEvents() {
  $('#toggle').on("click", toggleView);
  // $('#toggle2').on("click", toggleView);
  $('#get_results').on("click", api_projections_call)
}



function toggleView() {
  $('#estimates').toggleClass('hidden');
  $('#projections').toggleClass('hidden');
  $(this).toggleClass('btn-success');
  $(this).text(function(i, text){
    return text === "Switch to Projections" ? "Switch to Estimates" : "Switch to Projections";
  })
}

function api_estimates_call(state) {
  var key = 'ba3c17760fce3eadb5c8e2571e95501fe806697e';
  var options = check_options();
  var date = check_date();

  $.ajax({
    url: 'http://api.census.gov/data/2013/pep/natstprc?get='+options+'&for=state:'+state+'&DATE='+date+'&key='+key,
    type: 'GET',
    success: function(stateInfo) {
      $('#results p').remove();
      for (i = 0; i < (stateInfo[0].length - 2); i++) {
        if(stateInfo[0][i] === 'STNAME')
          $('#results').append('<h3>'+stateInfo[1][i]+'</h3>');
        else
          $('#results').append('<p>'+stateInfo[0][i]+' '+stateInfo[1][i]+'</p>');
      }
    }
  });
}

function check_options() {
  var options = ["STNAME"]
  if ($('#population').prop('checked'))
    options.push("POP");
  if ($('#births').prop('checked'))
    options.push("BIRTHS");
  if ($('#deaths').prop('checked'))
    options.push("DEATHS");
  return options.join(',')
}

function check_date() {
  return $("#date_selector").find(':selected').val();
}


//////////////////

function find_api() {
  if (check_params() === 'births')
    return 'http://api.census.gov/data/2012/popproj/deaths?get=TOTAL_DEATHS,RACE_HISP&SEX=0&YEAR=';
  else if (check_params() === 'deaths')
    return 'http://api.census.gov/data/2012/popproj/pop?get=TOTAL_POP,RACE&SEX=0&YEAR=';
  else if (check_params() === 'pop')
    return 'http://api.census.gov/data/2012/popproj/births?get=BIRTHS,RACE_HISP&SEX=0&YEAR=';
};

function api_projections_call() {
  var key = 'ba3c17760fce3eadb5c8e2571e95501fe806697e';
  var year = check_year();
  var url = find_api();

  $.ajax({
    url: url+year+'&key='+key,
    type: 'GET',
    success: function(stateInfo){
      $('#projResults p').remove();
      var headers = stateInfo.shift();
      var chartData = calculatePercentages(stateInfo);
      renderChart(check_params(), year, chartData);
    }
  });
};

function check_year() {
  return $("#year_selector").find(':selected').val();
};

function check_params() {
  return $("#params_selector").find(':selected').val();
};

var codes = {
  "AL": "01",
  "AK": "02",
  "AZ": "04",
  "AR": "05",
  "CA": "06",
  "CO": "08",
  "CT": "09",
  "DE": "10",
  "DC": "11",
  "FL": "12",
  "GA": "13",
  "HI": "15",
  "ID": "16",
  "IL": "17",
  "IN": "18",
  "IA": "19",
  "KS": "20",
  "KY": "21",
  "LA": "22",
  "ME": "23",
  "MD": "24",
  "MA": "25",
  "MI": "26",
  "MN": "27",
  "MS": "28",
  "MO": "29",
  "MT": "30",
  "NE": "31",
  "NV": "32",
  "NH": "33",
  "NJ": "34",
  "NM": "35",
  "NY": "36",
  "NC": "37",
  "ND": "38",
  "OH": "39",
  "OK": "40",
  "OR": "41",
  "PA": "42",
  "RI": "44",
  "SC": "45",
  "SD": "46",
  "TN": "47",
  "TX": "48",
  "UT": "49",
  "VT": "50",
  "VA": "51",
  "WA": "53",
  "WV": "54",
  "WI": "55",
  "WY": "56",
}


function map() {
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
      if(abbrv === 'ia'){
        getAwesome();
      }
      else {
        var state_code = codes[abbrv.toUpperCase()];
        api_estimates_call(state_code);
      }
    }
  });
}

function calculatePercentages(data){
  var total = data[0][0];

  var whitePct = data[1][0] / total;
  var blackPct = data[2][0] / total;
  var aianPct = data[3][0] / total;
  var asianPct = data[4][0] / total;
  var nhpiPct = data[5][0] / total;

  return [
    ['White', whitePct],
    ['Black', blackPct],
    ['American Indian', aianPct],
    ['Asian', asianPct],
    ['Pacific Islander', nhpiPct],
  ]
}

function populateChart() {

    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });

    // Build the chart
    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Projected [params] by race, [year]'
            // text: 'Browser market shares at a specific website, 2014'
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
            data:
            [
                ['White',   20],
                ['Native American',       20],
                {
                    name: 'Black',
                    y: 20,
                    sliced: true,
                    selected: true
                },
                ['Asian',    20],
                ['Pacific Islander',     20],
            ]
        }]
    });

};

function renderChart(params, year, chartData) {


    // Build the chart
    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Projected '+params+' by race, '+year
            // text: 'Browser market shares at a specific website, 2014'
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


function getAwesome(){
  console.log('awesome')
  $('#results').animate({left: '100%'}, 1000);
  $('#vmap').animate({left: '-100%'}, 1000);
  setTimeout(function(){ $('#toolbar1').fadeOut(); }, 200);
  setTimeout(function(){ $('#toggle').fadeOut(); }, 200);
  $('#awesome').animate({left: '30%'}, 4000)
}