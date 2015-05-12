$(document).ready(function() {
  bindEvents();
  // document.getElementById("map").addEventListener("click", function(){ alert("Hello World!"); });
  // document.getElementById("map").addEventListener("click", map);
  // map();
  jQuery('#vmap').vectorMap(
  {
    map: 'usa_en',
    backgroundColor: '#ffffff',
    borderColor: '#818181',
    borderOpacity: 0.25,
    borderWidth: 1,
    color: '#4C99D4',
    enableZoom: false,
    hoverColor: '#4C99D4',
    hoverOpacity: null,
    normalizeFunction: 'linear',
    scaleColors: ['#b6d6ff', '#005ace'],
    selectedColor: '#FCA128',
    selectedRegion: null,
    showTooltip: true,
    onRegionClick: function(element, code, region)
    {
        var message = 'You clicked "'
            + region
            + '" which has the code: '
            + code.toUpperCase();

        alert(message);
    }
});

});

// census key ba3c17760fce3eadb5c8e2571e95501fe806697e

// 2000 census
// http://api.census.gov/data/2010/sf1?key=[user key]&get=PCT012A015,PCT012A119&for=state:01
// http://api.census.gov/data/2010/sf1?key=ba3c17760fce3eadb5c8e2571e95501fe806697e&get=PCT012A015,PCT012A119&for=state:01

// pop estimates
// http://api.census.gov/data/2013/pep/stchar6

// projected births
// http://api.census.gov/data/2012/popproj/births

// projected deaths
// http://api.census.gov/data/2012/popproj/deaths

// projected population
// http://api.census.gov/data/2012/popproj/pop

function map() {
  console.log($('iframe'))
  if (window.addEventListener){
    window.addEventListener("message", function(event) {
      if(event.data.length >= 22) {
        if( event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT")
          location = event.data.substr(22);
      }
    }, false);
  }
  else if (window.attachEvent){
    window.attachEvent("message", function(event) {
      if( event.data.length >= 22) {
        if ( event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT")
          location = event.data.substr(22);
      }
    }, false);
  }
}

function bindEvents() {

  // $(document).on('mousedown', 'div.todo', dragShit);

  $("#state_selector").on("change", api_call);
  $("#api_selector").on("change", display_options);


}



function api_call() {
  var selectedVal = $(this).find(':selected').val();
  var key = 'ba3c17760fce3eadb5c8e2571e95501fe806697e';
  var options = check_options();
  var date = check_date();

  var ajaxRequest = $.ajax({
    url: 'http://api.census.gov/data/2013/pep/natstprc?get='+options+'&for=state:'+selectedVal+'&DATE='+date+'&key='+key,
    type: 'GET',
  });

  ajaxRequest.done(function(stateInfo){
    $('#results p').remove();
    for (i = 0; i < stateInfo[0].length; i++) {
      $('#results').append('<p>'+stateInfo[0][i]+' '+stateInfo[1][i]+'</p>');
    }
  });
}

function check_date() {
  return $("#date_selector").find(':selected').val()
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

function display_options() {
  switch($(this).find(':selected').val()) {
    case '01':
      $('#year_selector').hide();
      $('#checkbox').show();
      $('#date_selector').show();
      $('#state_selector').show();
      break;
    case '02':
      $('#checkbox').hide();
      $('#date_selector').hide();
      $('#year_selector').show();
      $('#state_selector').show();
      break;
    default:
      break;
  }
}

// function check_api() {
//   if ($('#api_selector').find(':selected').val()) ===
// }

