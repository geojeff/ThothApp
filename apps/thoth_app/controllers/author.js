// ==========================================================================
// Project:   ThothApp.authorController
// ==========================================================================
/*globals ThothApp */

/** @class

  @extends SC.Object
*/
ThothApp.authorController = SC.ObjectController.create(
/** @scope ThothApp.authorController.prototype */ {
	contentBinding: "ThothApp.authorsController.selection"
  //contentBindingDefault: SC.Binding.oneWay().single()
});
