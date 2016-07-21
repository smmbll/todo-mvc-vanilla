(function(window){
  /**
   * Store class
   *
   * @param {function} cb Callback
   */

   function Store() {
     if(!this._todos) {
       this._todos = [];
     }
   }

  /**
   *
   * Get method
   *
   * @param {number} id Id of todo to return
   *
   */

   Store.prototype.get = function(id) {
     var todos = this._todos;
     var result;

     todos.forEach(function(todo) {
       if(todo.id == id) {
         result = todo;
       }
     });

     return result;
   }

   /**
    *
    * GetAll method
    *
    */

    Store.prototype.getAll = function() {
      return this._todos;
    }

    /**
     *
     * Set method
     *
     * @param {object} todo Todo object
     *
     */

     Store.prototype.add = function(todo,cb) {
       this._todos.push(todo);

       cb(this._todos); // Pass the new todo array back to the Controller to be given to the model
     }

     /**
      *
      * Delete method
      *
      * @param {number} id Id of item to delete
      * @param {function} cb Callback
      *
      */

      Store.prototype.delete = function(id,cb) {
          var todos = this._todos;

          todos.forEach(function(todo,i) {
            if(todo.id == id) {
              todos.splice(i,1); // Id is a string so we can't check exact equivalence
            }
          });

          cb(todos);
      }

      /**
       *
       * Update method
       *
       * @param {number} id Id of item to delete
       * @param {string} prop Property to update.
       * @param {anything} val Value to update it to.
       * @param {function} cb Callback
       *
       */

       Store.prototype.update = function(id,prop,val,cb) {
           var todos = this._todos;

           todos.forEach(function(todo,i) {
             if(todo.id == id) {
               todo[prop] = val;
             }
           });

           cb(todos);
       }

      /**
       *
       * DeleteAll method
       *
       * @param {function} cb Callback
       *
       */

       Store.prototype.deleteAll = function(cb) {
         this._todos = [];

         cb(this._todos);
       }

       /**
        *
        * Find method
        *
        * @param {object} params Object containing key/value pairs to search for
        * @param {function} cb Callback
        *
        */

        Store.prototype.find = function(params,cb) {
          var todos = this._todos;
          var result = [];

          for(var key in params) {
            todos.forEach(function(todo) {
              if(todo[key] == params[key]) {
                result.push(todo);
              }
            })
          }

          return result;
        }

       window.App = window.App || {};
       window.App.Store = Store;
})(window);
