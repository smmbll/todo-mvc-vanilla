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
     self.View = view;
     self.Model = model;

     self.View.eventHandler('addTodo',function(text) {
       self._newTodo(text);
     });

     self.View.eventHandler('clearAll',function(){
       self._clearAll();
     });

     self.View.eventHandler('removeTodo',function(id){
       self._removeTodo(id);
     });

     self.View.eventHandler('toggleComplete',function(id){
       self._toggleComplete(id);
     });
   }

   Controller.prototype._newTodo = function(text) {
     var self = this;

     self.Model.create(text, function(updatedList) {
       self.View.render(updatedList);
     });
   }

   Controller.prototype._removeTodo = function(id) {
     var self = this;

     self.Model.remove(id, function(updatedList) {
       var completedTodos = self.Model.query({isComplete: true});

       self.View.render(updatedList,'updateCompleted',{ completed: completedTodos.length });
     });
   }

   Controller.prototype._toggleComplete = function(id) {
     var self = this;

     self.Model.toggle(id, function(updatedList) {
       var completedTodos = self.Model.query({isComplete: true});

       self.View.render(updatedList,'updateCompleted',{ completed: completedTodos.length });
     });
   }

   Controller.prototype._updateTodo = function(id) {
     var self = this;

     self.Model.update(id, function(updatedList) {
       self.View.render(updatedList);
     });
   }

   Controller.prototype._clearAll = function() {
     var self = this;

     self.Model.clear(function(updatedList) {
       self.View.render(updatedList,'updateCompleted',{ completed: 0 });
     });
   }

   window.App = window.App || {};
   window.App.Controller = Controller;
})(window);
