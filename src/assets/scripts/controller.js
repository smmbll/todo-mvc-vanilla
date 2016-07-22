(function(window) {
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

     self.view.eventHandler('addTodo',function(text) {
       self._newTodo(text);
     });

     self.view.eventHandler('clearAll',function(){
       self._clearAll();
     });

     self.view.eventHandler('removeTodo',function(id){
       self._removeTodo(id);
     });

     self.view.eventHandler('toggleComplete',function(id){
       self._toggleComplete(id);
     });

     self.view.eventHandler('toggleControls',function(toggleType){
       var filter = null;
       var buttonClass = '';

       switch(toggleType) {
         case 'showAll':
            buttonClass = '.btn-show-all';
         break;
         case 'showCompleted':
            filter = { isComplete: true };
            buttonClass = '.btn-show-completed';
         break;
         case 'showUncompleted':
            filter = { isComplete: false };
            buttonClass = '.btn-show-uncompleted';
         break;
       }

       self._showTodos(filter,buttonClass);
     });
   }

   Controller.prototype._newTodo = function(text) {
     var self = this;

     self.model.create(text, function(data) {
       self.view.render(data);
     });
   }

   Controller.prototype._removeTodo = function(id) {
     var self = this;

     self.model.remove(id, function(data) {
       self.model.find({isComplete: true},function(result) {
         self.view.render(data,'updateCompleted',{ completed: result.items.length });
       });
     });
   }

   Controller.prototype._toggleComplete = function(id) {
     var self = this;

     self.model.toggle(id, function(data) {
       self.model.find({isComplete: true},function(result) {
         self.view.render(data,'updateCompleted',{ completed: result.items.length });
       });
     });
   }

   Controller.prototype._updateTodo = function(id) {
     var self = this;

     self.model.update(id, function() {
       self.view.render();
     });
   }

   Controller.prototype._clearAll = function() {
     var self = this;

     self.model.clear(function(data) {
       self.view.render(data,'updateCompleted',{ completed: 0 });
     });
   }

   Controller.prototype._showTodos = function(filter,buttonClass) {
     var self = this;

     self.model.setFilter(filter, function(data) {
       self.view.render(data,'toggleActive',{ buttonClass: buttonClass });
     });
   }

   window.App = window.App || {};
   window.App.Controller = Controller;
})(window);
