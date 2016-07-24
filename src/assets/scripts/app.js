(function(window) {
  'use strict';
  /**
   *
   * Run the app!
   *
   */

  function RunApp() {
    this.store = new App.Store();
    this.model = new App.Model(this.store);
    this.view = new App.View();
    this.controller = new App.Controller(this.view,this.model);
  }

  var runningApp = new RunApp();

  // Initialize
  runningApp.controller.initialize();
})(window);
