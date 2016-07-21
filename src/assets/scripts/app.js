(function(window) {

  /**
   *
   * Run the app!
   *
   */

  function RunApp() {
    this.Store = new App.Store();
    this.Model = new App.Model(this.Store);
    this.View = new App.View();
    this.Controller = new App.Controller(this.View,this.Model);
  }

  var runningApp = new RunApp();
})(window);
