// ==========================================================================
// Project:   ThothApp.versionController
// ==========================================================================
/*globals ThothApp */

/** @class

  The controller for a single version.

  @extends SC.Object
*/
ThothApp.versionController = SC.ObjectController.create(
/** @scope ThothApp.versionController.prototype */ {
	contentBinding: "ThothApp.versionsController.selection",
	contentBindingDefault: SC.Binding.oneWay().single(),

  isEditing: NO,

	contentDidChange: function() {
	  if (this.get("content")) this.set("shouldDisplay", YES);
	  else this.set("shouldDisplay", NO);
	}.observes("content"),

	beginEditing: function() {
		this.set("isEditing", YES);
		//ThothApp.mainPage.getPath("mainPane.splitter.bottomRightView.bottomRightView.bookView.contentView.versionView").beginEditing();
	},

	endEditing: function() {
		this.set("isEditing", NO);
		//ThothApp.mainPage.getPath("mainPane.splitter.bottomRightView.bottomRightView.bookView.contentView.versionView").commitEditing();
		ThothApp.store.commitRecords();
	}

});

