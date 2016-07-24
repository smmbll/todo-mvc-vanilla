(function(window){
  'use strict';
  /**
   * Store class
   *
   * @param {function} cb Callback
   */

   function Store() {
     if(!this._db) {
       this._db = [];
     }

     this._filter = null;
   }

    /**
     *
     * Add method
     *
     * @param {object} update Todo info
     * @param {function} cb Callback
     *
     */

     Store.prototype.add = function(update,cb) {
       update._id = new Date().getTime();
       this._db.push(update);

       this._query(cb);
     };

     /**
      *
      * Delete method
      *
      * @param {number} id Id of item to delete
      * @param {function} cb Callback
      *
      */

      Store.prototype.delete = function(filter,cb) {
          var db = this._db;

          db.forEach(function(item,i) {
            for(var key in filter) {
              if(item[key].toString() === filter[key]) {
                db.splice(i,1);
              }
            }
          });

          this._query(cb);
      };

      /**
       *
       * DeleteAll method
       *
       * @param {function} cb Callback
       *
       */

       Store.prototype.deleteAll = function(cb) {
         this._db = [];

         this._query(cb);
       };

      /**
       *
       * Update method
       *
       * @param {number} id Id of item to delete
       * @param {object} props Properties to update.
       * @param {function} cb Callback
       *
       */

       Store.prototype.update = function(filter,update,cb) {
           var db = this._db;

           db.forEach(function(item,i) {
             for(var key in filter) {
               if(item[key].toString() === filter[key]) {
                 for(var param in update) {
                   // Little bit of a fudge here since we don't
                   // have the server to interpret the toggleCompletion
                   // parameter
                   if(param === 'toggleCompletion') {
                     item.isComplete = !item.isComplete;
                   } else {
                     item[param] = update[param];
                   }
                 }
               }
             }
           });

           this._query(cb);
       };

       /**
        *
        * Filter method
        *
        * @param {object} Parameters to filter by
        * @param {function} cb Callback
        *
        */

        Store.prototype.filter = function(filter,cb) {
          this._filter = filter;

          this._query(cb);
        };

       /**
        *
        * Query method
        *
        * All roads ultimately lead here
        *
        * @param {function} cb Callback
        *
        */

        Store.prototype._query = function(cb) {
          var data = {
            items: this._db,
            filter: this._filter
          };

          return cb && typeof cb === 'function' ? cb(data) : data;
        };

       window.App = window.App || {};
       window.App.Store = Store;
})(window);
