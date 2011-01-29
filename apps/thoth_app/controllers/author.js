// ==========================================================================
// Project:   ThothApp.authorController
// ==========================================================================
/*globals ThothApp */

/** @class

  @extends SC.Object
*/
ThothApp.authorController = SC.ObjectController.create(
/** @scope ThothApp.authorController.prototype */ {
	//contentBinding: "ThothApp.authorsController.selection",
  contentBinding: "ThothApp.authorsController*selection.firstObject",
  contentBindingDefault: SC.Binding.oneWay().single(),

  show: null,
  nowShowing: "welcome",

  standardIsShowing: YES,
  updateShowing: function() {
    switch (this.get('show')) {
      case 'welcome':
      case 'standard':
        this.set('standardIsShowing', YES);
        break;
      case 'graphic':
        this.set('standardIsShowing', NO);
        break;
      default:
        this.set('standardIsShowing', YES);
        break;
    }
  }.observes("show"),

  delayShow: function() {
    this.invokeLater(this.set, 50, "nowShowing", this.get("show") || "standard");
  }.observes("show")

});
