// ==========================================================================
// Project:   ThothApp
// ==========================================================================
/*globals ThothApp */

ThothApp.main = function main() {

  // Create the data source if it doesn't exist already. (FORCE)
  var initDS = ThothApp.store._getDataSource();

  ThothApp.statechart.initStatechart();

};

function main() { ThothApp.main(); }
