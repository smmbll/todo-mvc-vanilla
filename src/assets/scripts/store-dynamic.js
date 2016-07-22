(function(window){
  /**
   * Store class
   *
   * @param {function} cb Callback
   */

   function Store() {
     fetch('todos', { method: 'get' })
      .then(function(res) {
        if(res.ok) console.log(res.body);
      });

     if(!this._db) {
       this._db = [];
     }

     this._filter = null;
     this._counter = 0;
   }

  /**
   *
   * Get method
   *
   * @param {number} id Id of todo to return
   *
   */

   Store.prototype.get = function(params) {
     return this._query(null,params);
   }

    /**
     *
     * Set method
     *
     * @param {object} todo Todo object
     *
     */

     Store.prototype.add = function(todo,cb) {
       this._db.push(todo);
       this._counter++;

       this._query(cb);
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
          var db = this._db;

          db.forEach(function(todo,i) {
            if(todo.id == id) {
              db.splice(i,1); // Id is a string so we can't check exact equivalence
            }
          });

          this._counter = this._counter > 0 ? --this._counter : 0;

          this._query(cb);
      }

      /**
       *
       * DeleteAll method
       *
       * @param {function} cb Callback
       *
       */

       Store.prototype.deleteAll = function(cb) {
         this._db = [];
         this._counter = 0;

         this._query(cb);
       }

      /**
       *
       * Update method
       *
       * @param {number} id Id of item to delete
       * @param {object} props Properties to update.
       * @param {function} cb Callback
       *
       */

       Store.prototype.update = function(id,props,cb) {
           var db = this._db;

           db.forEach(function(todo,i) {
             if(todo.id == id) {
               for(var key in props) {
                 todo[key] = props[key];
               }
             }
           });

           this._query(cb);
       }

       /**
        *
        * Filter method
        *
        * @param {object} Parameters to filter by
        * @param {function} cb Callback
        *
        */

        Store.prototype.filter = function(filter,cb) {
          if(this._filter !== filter) {
            this._filter = filter;
          }

          this._query(cb);
        }

       /**
        *
        * Query method
        *
        * All roads ultimately lead here
        *
        * @param {object} params Object containing key/value pairs to search for
        * @param {function} cb Callback
        *
        */

        Store.prototype._query = function(cb,params) {
          var db = this._db;
          var filter = params ? params : this._filter;
          var result = [];
          var counter = this._counter;

          if(filter && typeof filter === 'object') {
            for(var key in filter) {
              db.forEach(function(todo) {
                if(todo[key] == filter[key]) {
                  result.push(todo);
                }
              })
            }
          } else {
            result = db;
          }

          // Always return an up-to-date count of total
          // nodes
          var data = {
            items: result,
            counter: counter
          };

          if(cb) {
            cb(data);
          } else {
            return data
          }
        }

       window.App = window.App || {};
       window.App.Store = Store;
})(window);
