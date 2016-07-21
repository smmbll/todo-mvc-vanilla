(function(window) {
  /**
   *
   * Model
   *
   * @constructor
   * @param {object} store Stores todos on the client
   */

  function Model(store) {
    this.store = store;
  }

  /**
   *
   * Find todo(s) by parameter
   *
   * @param {function} cb Callback
   *
   */

  Model.prototype.query = function(params,cb) {
    return this.store.find(params,cb);
  }

  /**
   *
   * Create new todo item
   *
   * @param {string} [text] The text of the todo.
   *
   */
  Model.prototype.create = function(text,cb) {
    text = text || '';

    var todo = {
      text: text.trim(),
      id: new Date().getTime(),
      isComplete: false
    };

    this.store.add(todo,cb);
  }

  /**
   *
   * Remove todo item
   *
   * @param {number} [id] The id of the todo to remove.
   * @param {function} cb Callback
   *
   */

  Model.prototype.remove = function(id,cb) {
    this.store.delete(id,cb);
  }

  /**
   *
   * Update todo item
   *
   * @param {number} [id] The id of the todo to remove.
   * @param {function} cb Callback
   *
   */

  Model.prototype.toggle = function(id,cb) {
    var todo = this.store.get(id);
    var isComplete = todo.isComplete;

    this.store.update(id,'isComplete',!isComplete,cb);
  }

  /**
   *
   * Clear all todos
   *
   * @param {function} cb Callback
   *
   */

  Model.prototype.clear = function(cb) {
    this.store.deleteAll(cb);
  }

  window.App = window.App || {};
  window.App.Model = Model;
})(window);
