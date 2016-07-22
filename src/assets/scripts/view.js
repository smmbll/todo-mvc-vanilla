(function(window) {
  /**
   *
   * View class
   *
   */
  function View() {
    var self = this;

    self.DOM = {
      $list: document.querySelector('.todo-list'),
      $counterTally: document.querySelector('.todo-counter .todos-tally'),
      $counterTotal: document.querySelector('.todo-counter .todos-total'),
      $counterCompleted: document.querySelector('.todo-counter .todos-completed'),
      $input: document.querySelector('.todo-input input'),
      $add: document.querySelector('.todo-input .btn-add'),
      $complete: document.querySelector('.todo-list-item .btn-complete'),
      $remove: document.querySelector('.todo-list-item .btn-remove'),
      $controls: document.querySelector('.todo-controls .btn-group'),
      $clear: document.querySelector('.btn-clear-all')
    };

    // Some clever formatting to make this more legible
    self._todoTemplate = '<li class="todo-list-item row%%completeClass%%" data-id="%%id%%">'
                            + '<div class="col-md-2 todo-number">%%number%%</div>'
                            + '<div class="col-md-8 todo-text">%%text%%</div>'
                            + '<div class="col-md-2">'
                              + '<button type="button" class="btn-remove close" aria-label="Close">'
                                + '<i class="fa fa-times-circle-o" aria-hidden="true"></i>'
                              + '</button>'
                              + '<button type="button" class="btn-complete close" aria-label="Complete">'
                                + '<i class="fa fa-%%circleClass%%" aria-hidden="true"></i>'
                              + '</button>'
                            + '</div>'
                        + '</li>';
  }

  View.prototype._getTodoById = function(id) {
    return querySelector('[data-item-"' + id + '"');
  }

  View.prototype._updateList = function(todos) {
    var self = this;
    var todoNodes = '';
    var todoTemplate;

    if(todos && typeof todos === 'object') {
      todos.forEach(function(todo,i) {
        todoTemplate = self._todoTemplate;
        todoTemplate = todoTemplate
                        .replace('%%id%%', todo.id)
                        .replace('%%number%%', i + 1)
                        .replace('%%text%%',todo.text)
                        .replace('%%completeClass%%',todo.isComplete ? ' complete' : '')
                        .replace('%%circleClass%%',todo.isComplete ? 'check-circle-o' : 'circle-o');

        todoNodes = todoNodes + todoTemplate;
      });
    }

    return todoNodes;
  }

  View.prototype._markCompleted = function(id) {
    var todo = this.getTodoById(id);

    if(!todo.classList.contains('complete')) { // Make sure we only add it once.
      todo.classList.add('complete');
    }
  }

  View.prototype._markUncompleted = function(id) {
    var todo = this.getTodoById(id);

    if(todo.classList.contains('complete')) { // Make sure we only add it once.
      todo.classList.remove('complete');
    }
  }

  // Thanks to kentcdodds for this very useful function
  View.prototype._findParentNode = function(el,tagName) {
    var self = this;

    if (!el.parentNode) {
			return;
		}
		if (el.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return el.parentNode;
		}
		return self._findParentNode(el.parentNode, tagName);
  }

  View.prototype.render = function(data,type,params) {
    var self = this;
    var items = data.items;
    var DOM = self.DOM;
    var $list = DOM.$list;
    var $listClasses = $list.classList;

    switch(type) {
      case 'toggleActive':
        console.log('toggle active firing');
        var $buttons = DOM.$controls.querySelectorAll('button');
        Array.prototype.forEach.call($buttons, function($button) {
            $button.classList.remove('active');
        });

        var $buttonClasses = document.querySelector(params.buttonClass).classList;

        if(!$buttonClasses.contains('active')) {
          $buttonClasses.add('active');
        }
      break;
      case 'updateCompleted':
        console.log('update completed firing');
        var $counterTally = DOM.$counterTally;
        var $counterCompleted = DOM.$counterCompleted;
        var completed = params.completed;

        $counterCompleted.innerHTML = completed;

        if(completed > 0) {
          $counterTally.classList.remove('hidden')
        } else {
          $counterTally.classList.add('hidden');
        }
      default:
        console.log('default case firing');
        // Update counter only for tasks that deliver an updated
        // list of nodes (i.e. adding or removing, but not toggling)
        DOM.$counterTotal.innerHTML = data.counter;
      break;
    }

    var newList = self._updateList(data.items);
    $list.innerHTML = newList;

    if(newList.length && $listClasses.contains('hidden')) { // If the list length is 0 we need to hide the list element.
      $listClasses.remove('hidden');
    } else if(!newList.length && !$listClasses.contains('hidden')) { // If list length is greater than 0, and the class isn't already there, we want to show the list element.
      $listClasses.add('hidden');
    }
  }

  View.prototype.eventHandler = function(e, cb) {
    var self = this;
    var cb = cb || function() {};
    var DOM = self.DOM;
    var $input = DOM.$input;
    var $list = DOM.$list;

    switch(e) {
      case 'addTodo':
        // User can add a todo by hitting enter after focusing input
        $input.addEventListener('focus',function() {
          document.addEventListener('keypress', function(e) {
            e.stopPropagation();

            if(e.keyCode === 13) { // Listen for the enter key
              cb($input.value);
              $input.value = ''; // Clear input
            }
          });
        });

        // User can also add a todo by pressing the add button
        DOM.$add.addEventListener('click', function(e) {
          cb($input.value);
          $input.value = ''; // Clear input
        });
      break;
      case 'removeTodo':
        // Because our list items don't exist when the View is registered,
        // we have to register the click event with the list itself, and then
        // check to see the source (the same is true for catching the complete)
        // event.
        $list.addEventListener('click', function(e) {
          if(e.target.parentElement.classList.contains('btn-remove')) {
            var todo = self._findParentNode(e.target,'li');
            var id = todo.getAttribute('data-id');

            cb(id);
          }
        });
      break;
      case 'toggleComplete':
        $list.addEventListener('click', function(e) {
          if(e.target.parentElement.classList.contains('btn-complete')) {
            var todo = self._findParentNode(e.target,'li');
            var id = todo.getAttribute('data-id');

            cb(id);
          }
        });
      break;
      case 'clearAll':
        DOM.$clear.addEventListener('click', function() {
          cb();
        });
      break;
      case 'toggleControls':
        DOM.$controls.addEventListener('click', function(e) {
          var targetClasses = e.target.classList;

          if(!targetClasses.contains('active')) {
            var buttonType = '';

            if(targetClasses.contains('btn-show-all')) {
              buttonType = 'showAll';
            } else if(targetClasses.contains('btn-show-completed')) {
              buttonType = 'showCompleted';
            } else if(targetClasses.contains('btn-show-uncompleted')) {
              buttonType = 'showUncompleted';
            }
            cb(buttonType);
          }
        });
      break;
    }
  }

  window.App = window.App || {};
  window.App.View = View;
})(window);
