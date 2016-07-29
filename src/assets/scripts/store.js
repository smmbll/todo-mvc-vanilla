(function(window){
  'use strict';
  var constants = window.App.constants || {};
  /**
   * Store class
   *
   * @constructor
   */

   function Store() {
     this._filter = {};
   }

  /**
   *
   * Query method returns todos from DB
   *
   * @param {function} cb (Optional) Callback to execute on response
   */

   Store.prototype._query = function(cb) {
     var self = this;

     return fetch(constants.urls.READ,{
       method: 'GET'
     })
      .then(function(res) {
        if(!res.ok) {
          console.log('Request denied with status code ' + res.status);
          return;
        }

        res.json().then(function(result) {
          var data = {
            items: result.items,
            filter: self._filter
          };

          return cb && typeof cb === 'function' ? cb(data) : data;
        });
      });
   };

    /**
     *
     * Add a todo to the DB
     *
     * @param {object} update New todo information
     * @param {function} cb Callback
     */

     Store.prototype.add = function(update,cb) {
       var self = this;

       fetch(constants.urls.CREATE,{
         method: 'POST',
         headers: new Headers({
           'Content-Type': 'application/json'
         }),
         body: JSON.stringify({update:update})
       })
        .then(function(res) {
          if(!res.ok) {
            console.log('Request denied with status code ' + res.status);
            return;
          }

          res.json().then(function(body) {
            self._query(cb);
          });
        });
     };

     /**
      *
      * Delete method
      *
      * @param {object} filter Filter containing identifying parameters
      * @param {function} cb Callback
      */

      Store.prototype.delete = function(filter,cb) {
        var self = this;

        fetch(constants.urls.DELETE,{
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({filter:filter})
        })
        .then(function(res) {
          if(!res.ok) {
            console.log('Request denied with status code ' + res.status);
            return;
          }

          self._query(cb);
        });
      };

      /**
       *
       * DeleteAll method
       *
       * @param {function} cb Callback
       */

       Store.prototype.deleteAll = function(cb) {
         var self = this;

         fetch(constants.urls.DELETE_ALL,{
           method: 'delete'
         })
         .then(function(res) {
           if(!res.ok) {
             console.log('Request denied with status code ' + res.status);
             return;
           }

           self._query(cb);
         });
       };

      /**
       *
       * Update method
       *
       * @param {object} filter Object containing identifying parameters
       * @param {object} update Object containing parameters to update
       * @param {function} cb Callback
       */

       Store.prototype.update = function(filter,update,cb) {
         var self = this;

         fetch(constants.urls.UPDATE,{
           method: 'put',
           headers: new Headers({
             'Content-Type': 'application/json'
           }),
           body: JSON.stringify({filter:filter,update:update})
         })
         .then(function(res) {
           if(!res.ok) {
             console.log('Request denied with status code ' + res.status);
             return;
           }

           self._query(cb);
         });
       };

       /**
        *
        * Filter method
        *
        * @param {object} filter Object containing filter parameters
        * @param {function} cb Callback
        */

        Store.prototype.filter = function(filter,cb) {
          this._filter = filter;

          this._query(cb);
        };

       window.App = window.App || {};
       window.App.Store = Store;
})(window);
