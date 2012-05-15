var google = new OAuth2('google', {
  client_id: '27650554343.apps.googleusercontent.com',
  client_secret: 'COOSpMjjUUb3xFpaA92nORDB',
  api_scope: 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'
});

google.authorize(function() {

  var TASK_CREATE_URL = 'https://www.googleapis.com/tasks/v1/lists/@default/tasks';

  var form = document.getElementById('form');
  var success = document.getElementById('success');

  // Hook up the form to create a new task with Google Tasks
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var input = document.getElementById('input');
    createTodo(input.value);
  });

  function createTodo(task) {
    // Make an XHR that creates the task
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
          // Great success: parse response with JSON
          var task = JSON.parse(xhr.responseText);
          document.getElementById('taskid').innerHTML = task.id;
          form.style.display = 'none';
          success.style.display = 'block';

        } else {
          // Request failure: something bad happened
        }
      }
    };

    var message = JSON.stringify({
      title: task
    });

    xhr.open('POST', TASK_CREATE_URL, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + google.getAccessToken());

    xhr.send(message);
  }

});
