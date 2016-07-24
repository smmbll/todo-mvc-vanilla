(function(window) {
  'use strict';
  var constants = window.App.constants || {};
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
   * Todo generator
   *
   * @param {string} text Text to add.
   * @param {bool} isComplete Whether to add as complete or not.
   */

  Model.prototype._todo = function(text,isComplete) {
    text = text ? text : '';

    return {
      text: text.trim(),
      isComplete: isComplete || false
    };
  };

  /**
   *
   * Filter todo(s) by parameter
   *
   * @param {object} filter Key value pairs to filter by.
   * @param {function} cb Callback
   */

  Model.prototype.setFilter = function(filter,cb) {
    return this.store.filter(filter,cb);
  };

  /**
   *
   * Create new todo item
   *
   * @param {string} text The text of the todo.
   * @param {function} cb Callback
   */
  Model.prototype.create = function(text,cb) {
    this.store.add(this._todo(text),cb);
  };

  /**
   *
   * Remove todo item
   *
   * @param {number} id The id of the todo to remove.
   * @param {function} cb Callback
   */

  Model.prototype.remove = function(id,cb) {
    this.store.delete({_id:id},cb);
  };

  /**
   *
   * Toggle completion status of todo item
   *
   * @param {number} id The id of the todo to remove.
   * @param {function} cb Callback
   */

  Model.prototype.toggle = function(id,cb) {
    var update = {};

    update[constants.updateOptions.TOGGLE_COMPLETION] = true;

    this.store.update({_id: id},update,cb);
  };

  /**
   *
   * Clear all todos
   *
   * @param {function} cb Callback
   */

  Model.prototype.clear = function(cb) {
    this.store.deleteAll(cb);
  };

  /**
   *
   * Return all todos
   *
   * @param {function} cb Callback
   */

  Model.prototype.getAll = function(cb) {
    this.store._query(cb);
  };

  window.App = window.App || {};
  window.App.Model = Model;
})(window);
