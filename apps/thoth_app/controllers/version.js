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
	//contentBinding: "ThothApp.versionsController.selection",
  contentBinding: "ThothApp.versionsController*selection.firstObject",
	contentBindingDefault: SC.Binding.oneWay().single(),

  isEditing: NO,

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

