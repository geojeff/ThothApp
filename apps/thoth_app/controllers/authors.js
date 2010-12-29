// ==========================================================================
// Project:   ThothApp.authorsController
// ==========================================================================
/*globals ThothApp */

/** @class

  The controller for a list of authors.

  @extends SC.ArrayController
*/

sc_require('fixtures/author');

ThothApp.authorsController = SC.ArrayController.create(
/** @scope ThothApp.authorsController.prototype */ {
	allowsMultipleSelection: YES,
  allowsEmptySelection: NO,
  orderBy: 'lastName',

  isLoadedArray: [],
  loadedCount: 0,

  changedAuthor: function(){
    ThothApp.getPath('graphicsPane.canvas').displayDidChange();
  },

  initializeForLoading: function() {
    var arr = this.get('isLoadedArray');
    for (var i=0,len=ThothApp.Author.FIXTURES.get('length'); i<len; i++) {
      arr.pushObject(NO);
    }
  },

  recordWasLoaded: function(key) {
    this.get('isLoadedArray').replace(key-1, 1, [YES]);
    var count = this.get('loadedCount');
    this.set('loadedCount', count+1);
  },

  isSingleSelection: function(){
    var sel = this.get("selection");
    if (!sel) return NO;
    if (sel.get('length') > 1) return NO;
    return YES;
  },

	addBookToAuthor: function(book) {
	  var sel = this.get("selection");
	  if (!sel) return;
    if (sel.get('length') > 1) return; // although multiselect authors allowed, not for adding book
	  book.set("author", sel.firstObject());
    sel.firstObject().get('books').pushObject(book);
	}

}) ;
