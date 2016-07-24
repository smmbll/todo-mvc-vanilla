(function(window) {
  'use strict';
  var constants = window.App.constants || {};
  /**
   *
   * Controller constructor
   *
   * @constructor
   * @param {object} model Model
   * @param {object} view View
   *
   */
   function Controller(view,model) {
     var self = this;
     self.view = view;
     self.model = model;

     // Set callbacks on the view so that events triggered
     // on the DOM link up with controller methods that
     // instruct the model on how to interact with our data

     self.view.eventHandler(constants.events.ADD_TODO,function(text) {
       self._newTodo(text);
     });

     self.view.eventHandler(constants.events.CLEAR_ALL,function(){
       self._clearAll();
     });

     self.view.eventHandler(constants.events.REMOVE_TODO,function(id){
       self._removeTodo(id);
     });

     self.view.eventHandler(constants.events.TOGGLE_COMPLETE,function(id){
       self._toggleComplete(id);
     });

     self.view.eventHandler(constants.events.TOGGLE_FILTER,function(toggleClass){
       var filter = {};

       // We only need to change the filter if we're toggling
       // completion status
       switch(toggleClass) {
         case constants.filterTypes.SHOW_COMPLETED:
            filter = { isComplete: true };
         break;
         case constants.filterTypes.SHOW_UNCOMPLETED:
            filter = { isComplete: false };
         break;
       }

       self._filterTodos(filter,toggleClass);
     });
   }

   /**
    *
    * Initialization function that loads from our DB
    *
    */

   Controller.prototype.initialize = function() {
     var self = this;

     self.model.getAll(function(data){
       self.view.render(data,constants.renderOptions.UPDATE_COMPLETED);
     });
   };

   /**
    *
    * Function to create a new todo item
    *
    * @param {string} text Text to attach to todo.
    */

   Controller.prototype._newTodo = function(text) {
     var self = this;

     self.model.create(text, function(data) {
       self.view.render(data);
     });
   };

   /**
    *
    * Function to remove a todo
    *
    * @param {string} id Hexadecimal id.
    */

   Controller.prototype._removeTodo = function(id) {
     var self = this;

     self.model.remove(id, function(data) {
        self.view.render(data,constants.renderOptions.UPDATE_COMPLETED);
     });
   };

   /**
    *
    * Function to toggle the completion status of a todo
    *
    * @param {string} id Hexadecimal id.
    */

   Controller.prototype._toggleComplete = function(id) {
     var self = this;

     self.model.toggle(id, function(data) {
         self.view.render(data,constants.renderOptions.UPDATE_COMPLETED);
     });
   };

   /**
    *
    * Function to remove all todos from DB
    *
    */

   Controller.prototype._clearAll = function() {
     var self = this;

     self.model.clear(function(data) {
       self.view.render(data,constants.renderOptions.UPDATE_COMPLETED);
     });
   };

   /**
    *
    * Function to set a filter that will change the
    * rendering decision made by the View
    *
    * @param {string} id Hexadecimal id.
    */

   Controller.prototype._filterTodos = function(filter,toggleClass) {
     var self = this;

     self.model.setFilter(filter, function(data) {
       self.view.render(data,constants.renderOptions.TOGGLE_ACTIVE,{ toggleClass: toggleClass });
     });
   };

   window.App = window.App || {};
   window.App.Controller = Controller;
})(window);
