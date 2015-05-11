$(document).ready(function() {
  bindEvents();
  document.getElementById("map").addEventListener("click", function(){ alert("Hello World!"); });
  map();
});

// census key ba3c17760fce3eadb5c8e2571e95501fe806697e

// 2000 census
// http://api.census.gov/data/2010/sf1?key=[user key]&get=PCT012A015,PCT012A119&for=state:01
// http://api.census.gov/data/2010/sf1?key=ba3c17760fce3eadb5c8e2571e95501fe806697e&get=PCT012A015,PCT012A119&for=state:01

// pop estimates
// http://api.census.gov/data/2013/pep/stchar6

function map() {
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

  $(document).on('mousedown', 'div.todo', dragShit);

  $('.add_todo_form').on('click', '.btn', function(event){
    event.preventDefault();
    debugger
    // var form = $(this);
    // var form = $(this).closest('.add_todo_form')
    // // var todo = form.find('input[name="todo"]').val();
    // var todo = form.find('input[name="todo"]').val();

    var ajaxRequest = $.ajax({
      // url: 'http://api.census.gov/data/2010/sf1?get=P0010001&for=state:*&key=ba3c17760fce3eadb5c8e2571e95501fe806697e',
      url: 'http://api.census.gov/data/2010/sf1?key=ba3c17760fce3eadb5c8e2571e95501fe806697e&get=P0010001&for=state:01',
      type: 'GET',
    });


    ajaxRequest.done(function(todoHash){
      debugger
      form.find('input[name="todo"]').val('');

      var id = todoHash['id'];

      var template = buildTodo(todo);
      template.attr('id', id);

      $( ".todo_list" ).append(template);
      template.show();
    });
  });

}

function buildTodo(todoName) {
  var todoTemplate = $.trim($('#todo_template').html());
  var $todo = $(todoTemplate);
  $todo.find('h3').text(todoName);
  return $todo;
}

//Create functions to add, remove and complete todos


var dragSrcEl = null;


function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDragEnd(e) {
  this.style.opacity = '';
}

function handleDragStart(e) {
  this.style.opacity = '0.4';
  console.log('drag')
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDrop(e) {
  console.log('drop')
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    // dragSrcEl.innerHTML = this.innerHTML; //replaces dragged place with dropzone
    // this.innerHTML = e.dataTransfer.getData('text/html'); //replaces dropzone with dragged
    this.parentElement.insertBefore(dragSrcEl, this);
  }

  return false;
}

function dragShit(){
  var todos = document.querySelectorAll('#todos .todo');
  [].forEach.call(todos, function(todo) {
    todo.addEventListener('dragstart', handleDragStart, false);
    todo.addEventListener('dragenter', handleDragEnter, false)
    todo.addEventListener('dragover', handleDragOver, false);
    todo.addEventListener('dragleave', handleDragLeave, false);
    todo.addEventListener('drop', handleDrop, false);
    todo.addEventListener('dragend', handleDragEnd, false);
  });
}
