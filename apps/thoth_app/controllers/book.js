// ==========================================================================
// Project:   ThothApp.bookController
// ==========================================================================
/*globals ThothApp */

/** @class

  The controller for a single book.

  @extends SC.Object
*/
ThothApp.bookController = SC.ObjectController.create(
/** @scope ThothApp.bookController.prototype */ {
	contentBinding: "ThothApp.booksController.selection",
	contentBindingDefault: SC.Binding.oneWay().single(),

	isEditing: NO,

	beginEditing: function() {
		this.set("isEditing", YES);
    // SC.FormView has a default setting for isEditing, which is YES
		//ThothApp.mainPage.getPath("mainPane.splitter.bottomRightView.bottomRightView.bookView.contentView.versionView").beginEditing();
	},

	endEditing: function() {
		this.set("isEditing", NO);
    // SC.FormView has a default setting for isEditing, which is YES
		//ThothApp.mainPage.getPath("mainPane.splitter.bottomRightView.bottomRightView.bookView.contentView.versionView").commitEditing();
		ThothApp.store.commitRecords();
	}

//  hasCharacterInTitleFunctionCreator: function(char){
//    var title = this.get('content').get('title');
//    return function(){
//      return (title.indexOf(char)!= -1);
//    }
//  },
//
//  hasBookTypeFunctionCreator: function(type){
//    var versions = this.get('content').get('versions');
//    return function(){
//      versions.forEach(function(version) {
//        if (version.get('format') === type) {
//          return YES;
//        }
//      });
//
//      return NO;
//    }
//  },
//
//  hasHardbackVersion: this.hasBookTypeFunctionCreator('hardback'),
//  hasPaperbackVersion: this.hasBookTypeFunctionCreator('paperback'),
//  hasMediaVersion: this.hasBookTypeFunctionCreator('media'),
//
//  hasColonInTitle: this.hasCharacterInTitleFunctionCreator(':'),
//  hasOpenParenthesisInTitle: this.hasCharacterInTitleFunctionCreator('(')
});

