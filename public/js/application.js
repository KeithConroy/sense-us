$(document).ready(function() {
  bindEvents();
  generateMap();
  prepareChart();
});

function bindEvents() {
  $('#toggle').on("click", toggleView);
  $('#get_results').on("click", apiProjectionsCall);
}

function toggleView() {
  $('#estimates').toggleClass('hidden');
  $('#projections').toggleClass('hidden');

  $(this).toggleClass('btn-success');
  $(this).text(function(i, text){
    return text === "Switch to Projections" ? "Switch to Estimates" : "Switch to Projections";
  })
}

// API calls

function key(){
  return 'ba3c17760fce3eadb5c8e2571e95501fe806697e';
}

function apiEstimatesCall(state) {
  var options = checkOptions();
  var date = checkDate();

  if (options.length <= 6 || date === '0'){
    $('#results').append('<h3 style="color: red;">Please make your selections above</h3>');
  }
  else{
    $.ajax({
      url: 'http://api.census.gov/data/2013/pep/natstprc?get='+options+'&for=state:'+state+'&DATE='+date+'&key='+key(),
      type: 'GET',
      success: function(stateInfo) {
        for (i = 0; i < (stateInfo[0].length - 2); i++) {
          if(stateInfo[0][i] === 'STNAME')
            $('#results').append('<h3>'+stateInfo[1][i]+'</h3>');
          else
            $('#results').append('<p>'+stateInfo[0][i]+' '+stateInfo[1][i]+'</p>');
        }
      }
    });
  }
}

function apiProjectionsCall() {
  var year = checkYear();
  var url = findApi();

  if(year === '0' || url === '0'){

  }
  else {
    $.ajax({
      url: url+year+'&key='+key(),
      type: 'GET',
      success: function(stateInfo){
        var headers = stateInfo.shift();
        var chartData = calculatePercentages(stateInfo);
        $('#chart').fadeIn();
        renderChart(checkParams(), year, chartData);
      }
    });
  }
};

// API Helpers

function findApi() {
  if (checkParams() === 'births')
    return 'http://api.census.gov/data/2012/popproj/deaths?get=TOTAL_DEATHS,RACE_HISP&SEX=0&YEAR=';
  else if (checkParams() === 'deaths')
    return 'http://api.census.gov/data/2012/popproj/pop?get=TOTAL_POP,RACE&SEX=0&YEAR=';
  else if (checkParams() === 'pop')
    return 'http://api.census.gov/data/2012/popproj/births?get=BIRTHS,RACE_HISP&SEX=0&YEAR=';
  else
    return '0';
};

function checkOptions() {
  var options = ["STNAME"]
  if ($('#population').prop('checked'))
    options.push("POP");
  if ($('#births').prop('checked'))
    options.push("BIRTHS");
  if ($('#deaths').prop('checked'))
    options.push("DEATHS");
  return options.join(',')
}

function checkDate() {
  return $("#date_selector").find(':selected').val();
}

function checkYear() {
  return $("#year_selector").find(':selected').val();
};

function checkParams() {
  return $("#params_selector").find(':selected').val();
};

// Display Helpers

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

// Nonsense

function getAwesome(){
  armLaser();

  $('#results').animate({left: '100%'}, 1000);
  $('#vmap').animate({left: '-100%'}, 1000);

  setTimeout(function(){ $('#toolbar').fadeOut(); }, 200);
  setTimeout(function(){ $('#toggle').fadeOut(); }, 200);

  $('#awesome').animate({left: '30%'}, 6000)
}

function armLaser(){
  $(document).on('keydown', function(event) {
    if(event.keyCode === 76) { //L
      var laser = new Audio("/sounds/laser.wav");
      laser.play();
      $('.laser').animate({left: '-30%'}, 100);
    }
  });
}