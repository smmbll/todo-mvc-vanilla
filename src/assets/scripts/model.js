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
   * Filter todo(s) by parameter
   *
   * @param {function} cb Callback
   *
   */

  Model.prototype.setFilter = function(filter,cb) {
    console.log('filter is ',filter,cb);
    return this.store.filter(filter,cb);
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
   * Toggle completion status of todo item
   *
   * @param {number} [id] The id of the todo to remove.
   * @param {function} cb Callback
   *
   */

  Model.prototype.toggle = function(id,cb) {
    var todo = this.store.get({id:id});

    this.store.update(id,{ 'isComplete': !todo.items[0].isComplete },cb);
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

  /**
   *
   * Return todos based on certain parameters
   *
   * @param {function} cb Callback
   *
   */

  Model.prototype.find = function(params,cb) {
    this.store._query(cb,params);
  }

  window.App = window.App || {};
  window.App.Model = Model;
})(window);
