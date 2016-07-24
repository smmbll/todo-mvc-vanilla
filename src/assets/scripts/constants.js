(function(window){
  'use strict';
  var constants = {};

  constants.renderOptions = {
    TOGGLE_ACTIVE: 'toggleActiveButton',
    UPDATE_COMPLETED: 'updateCompletedTodos'
  };

  constants.events = {
    ADD_TODO: 'addTodo',
    CLEAR_ALL: 'clearAll',
    REMOVE_TODO: 'removeTodo',
    TOGGLE_COMPLETE: 'toggleComplete',
    TOGGLE_FILTER: 'toggleFilter'
  };

  constants.filterTypes = {
    SHOW_ALL: 'btn-show-all',
    SHOW_COMPLETED: 'btn-show-completed',
    SHOW_UNCOMPLETED: 'btn-show-uncompleted'
  };

  constants.urls = {
    CREATE: 'todos/add',
    READ: 'todos',
    UPDATE: 'todos/update',
    DELETE: 'todos/del',
    DELETE_ALL: 'todos/del/all'
  };

  constants.updateOptions = {
    TOGGLE_COMPLETION: 'toggleCompletion'
  };

  window.App = window.App || {};
  window.App.constants = constants;
})(window);
