$(document).ready(function() {
  bindEvents();
  // document.getElementById("map").addEventListener("click", function(){ alert("Hello World!"); });
  map();

});

// census key ba3c17760fce3eadb5c8e2571e95501fe806697e

// 2000 census
// http://api.census.gov/data/2010/sf1?key=[user key]&get=PCT012A015,PCT012A119&for=state:01
// http://api.census.gov/data/2010/sf1?key=ba3c17760fce3eadb5c8e2571e95501fe806697e&get=PCT012A015,PCT012A119&for=state:01

// pop estimates
// http://api.census.gov/data/2013/pep/stchar6

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

  $("#state_selector").on("change", function() {
      // jQuery
      var selectedVal = $(this).find(':selected').val();
      // var selectedText = $(this).find(':selected').text();
      var key = 'ba3c17760fce3eadb5c8e2571e95501fe806697e';
      var ajaxRequest = $.ajax({
        // url: 'http://api.census.gov/data/2010/sf1?get=P0010001&for=state:*&key=ba3c17760fce3eadb5c8e2571e95501fe806697e',
        // url: 'http://api.census.gov/data/2010/sf1?key=ba3c17760fce3eadb5c8e2571e95501fe806697e&get=P0010001&for=state:'+selectedVal,
        url: 'http://api.census.gov/data/2013/pep/natstprc?get=POP,BIRTHS,DEATHS,STNAME&for=state:'+selectedVal+'&DATE=6&key='+key,
        type: 'GET',
      });

      ajaxRequest.done(function(stateInfo){
        $('#results p').remove();
        for (i = 0; i < stateInfo[0].length; i++) {
          $('#results').append('<p>'+stateInfo[0][i]+' '+stateInfo[1][i]+'</p>');
        }
      });

  });

  $('.add_todo_form').on('click', '.btn', function(event){
    event.preventDefault();

  });

}

function buildTodo(todoName) {
  var todoTemplate = $.trim($('#todo_template').html());
  var $todo = $(todoTemplate);
  $todo.find('h3').text(todoName);
  return $todo;
}
