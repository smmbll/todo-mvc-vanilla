(function(window) {
  'use strict';
  var constants = window.App.constants || {};
  /**
   *
   * View class
   *
   * @constructor
   */
  function View() {
    var self = this;

    // Here we store a model of the DOM
    self.DOM = {
      $list: document.querySelector('.todo-list'),
      $counterGroup: document.querySelector('.todo-counter .todos-tally'),
      $counterTotal: document.querySelector('.todo-counter .todos-total'),
      $counterCompleted: document.querySelector('.todo-counter .todos-completed'),
      $input: document.querySelector('.todo-input input'),
      $add: document.querySelector('.todo-input .btn-add'),
      $complete: document.querySelector('.todo-list-item .btn-complete'),
      $remove: document.querySelector('.todo-list-item .btn-remove'),
      $controls: document.querySelector('.todo-controls .btn-group'),
      $filters: document.querySelectorAll('.todo-controls .btn-group button'),
      $clear: document.querySelector('.btn-clear-all')
    };

    // A template for a todo item
    // Some clever formatting makes this more legible
    self._todoTemplate = '<li class="todo-list-item row<%completeClass%><%hide%>" data-id="<%id%>">'
                            + '<div class="col-md-2 todo-number"><%number%></div>'
                            + '<div class="col-md-8 todo-text"><%text%></div>'
                            + '<div class="col-md-2">'
                              + '<button type="button" class="btn-remove close" aria-label="Close">'
                                + '<i class="fa fa-times-circle-o" aria-hidden="true"></i>'
                              + '</button>'
                              + '<button type="button" class="btn-complete close" aria-label="Complete">'
                                + '<i class="fa fa-<%circleClass%>" aria-hidden="true"></i>'
                              + '</button>'
                            + '</div>'
                        + '</li>';
  }

  /**
   *
   * Function to find a todo by id
   *
   * @param {string} id Hexadecimal id.
   */

  View.prototype._getTodoById = function(id) {
    return querySelector('[data-item-"' + id + '"');
  };

  /**
   *
   * Iterates over an array of todo items and creates
   * their DOM equivalent
   *
   * @param {array} items Array of todo items
   * @param {object} filter (Optional) A filter to hide or display certain items.
   */

  View.prototype._updateList = function(items,filter) {
    var self = this;
    var todoNodes = '';
    var todoTemplate;
    var filterTest = filter && typeof filter === 'object' && Object.keys(filter).length;

    if(items && typeof items === 'object' && items.forEach) {
      items.forEach(function(item,i) {
        todoTemplate = self._todoTemplate;
        todoTemplate = todoTemplate
                        .replace('<%id%>', item._id)
                        .replace('<%number%>', i + 1)
                        .replace('<%text%>',item.text)
                        .replace('<%completeClass%>',item.isComplete ? ' complete' : '')
                        .replace('<%circleClass%>',item.isComplete ? 'check-circle-o' : 'circle-o');

        // If there is a filter, check if meets filter params
        var passesTest = true;

        if(filterTest) {
          for(var key in filter) {
            if(!item.hasOwnProperty(key) || item[key] !== filter[key]) {
              passesTest = false;
            }
          }
        }

        todoTemplate = todoTemplate.replace('<%hide%>',passesTest ? '' : ' hidden');
        todoNodes = todoNodes + todoTemplate;
      });
    }

    return todoNodes;
  };

  /**
   *
   * Finds a specified tag amongst an element's parents
   *
   * @param {node} el DOM node
   * @param {string} tagName Name of tag to find
   */

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
  };

  /**
   *
   * Go through a given list of todo items and determine
   * which are completed
   *
   * @param {items} todos Array of todo items.
   */

  View.prototype._countCompletedTodos = function(items) {
    var completed = 0;

    if(items && typeof items === 'object' && items.forEach) {
      items.forEach(function(item) {
        if(item.isComplete === true) {
          ++completed;
        }
      });
    }

    return completed;
  };

  /**
   *
   * Render function
   * Creates the DOM and accepts options for additional
   * rendering decisions, such as toggling the controls
   * or updating our tallies of completed and uncompleted
   * todos.
   *
   * @param {data} object An object containing a list of
   * todos and the current filter
   * @param {option} string An optional additional rendering decision
   * @param {params} object An object containing optional parameters
   */

  View.prototype.render = function(data,option,params) {
    var self = this;
    var items = data.items || [];
    var filter = data.filter;
    var DOM = self.DOM;
    var $list = DOM.$list;
    var $listClasses = $list.classList;

    switch(option) {
      case constants.renderOptions.TOGGLE_ACTIVE:
        var $filters = DOM.$filters;
        Array.prototype.forEach.call($filters, function($filter) {
            $filter.classList.remove('active');
        });

        var $filterClasses = document.querySelector('.' + params.toggleClass).classList;

        if(!$filterClasses.contains('active')) {
          $filterClasses.add('active');
        }
      break;
      case constants.renderOptions.UPDATE_COMPLETED:
        var $counterGroup = DOM.$counterGroup;
        var $counterCompleted = DOM.$counterCompleted;
        var numCompletedTodos = self._countCompletedTodos(items);

        $counterCompleted.innerHTML = numCompletedTodos;

        if(numCompletedTodos > 0) {
          $counterGroup.classList.remove('hidden');
        } else {
          $counterGroup.classList.add('hidden');
        }
      default:
        // Update counter only for tasks that deliver an updated
        // list of nodes (i.e. adding or removing, but not toggling)
        DOM.$counterTotal.innerHTML =  items.length;
      break;
    }

    // Create node list from data and set it on the view
    var newList = self._updateList(items,filter);
    $list.innerHTML = newList;

    if(newList.length && $listClasses.contains('hidden')) { // If the list length is 0 we need to hide the list element.
      $listClasses.remove('hidden');
    } else if(!newList.length && !$listClasses.contains('hidden')) { // If list length is greater than 0, and the class isn't already there, we want to show the list element.
      $listClasses.add('hidden');
    }
  };

  /**
   *
   * The event handler function binds events to the DOM and
   * triggers callbacks specified by the controller
   *
   * @param {e} string Event Name
   * @param {function} cb Callback function to execute
   */

  View.prototype.eventHandler = function(e, cb) {
    var self = this;
    var DOM = self.DOM;
    var $input = DOM.$input;
    var $list = DOM.$list;

    switch(e) {
      case constants.events.ADD_TODO:
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
      case constants.events.REMOVE_TODO:
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
      case constants.events.TOGGLE_COMPLETE:
        $list.addEventListener('click', function(e) {
          if(e.target.parentElement.classList.contains('btn-complete')) {
            var todo = self._findParentNode(e.target,'li');
            var id = todo.getAttribute('data-id');

            cb(id);
          }
        });
      break;
      case constants.events.CLEAR_ALL:
        DOM.$clear.addEventListener('click', function() {
          cb();
        });
      break;
      case constants.events.TOGGLE_FILTER:
        DOM.$controls.addEventListener('click', function(e) {
          var targetClasses = e.target.classList;

          if(!targetClasses.contains('active')) {
            var filterType = '';

            if(targetClasses.contains(constants.filterTypes.SHOW_ALL)) {
              filterType = constants.filterTypes.SHOW_ALL;
            } else if(targetClasses.contains(constants.filterTypes.SHOW_COMPLETED)) {
              filterType = constants.filterTypes.SHOW_COMPLETED;
            } else if(targetClasses.contains(constants.filterTypes.SHOW_UNCOMPLETED)) {
              filterType = constants.filterTypes.SHOW_UNCOMPLETED;
            }
            cb(filterType);
          }
        });
      break;
    }
  };

  window.App = window.App || {};
  window.App.View = View;
})(window);
