// ==========================================================================                                                                                                                                                                                            
// ThothApp.booksController
// ==========================================================================
/*globals ThothApp*/

/** 

This controller manages book data.

   @extends SC.ArrayController
   @author Jeff Pittman
*/

sc_require('fixtures/book');

ThothApp.booksController = SC.ArrayController.create(
/** @scope ThothApp.booksController.prototype */ {

  contentBinding: "ThothApp.authorController.books",
  allowsEmptySelection: NO,
  canAddContent: YES,
  canReorderContent: NO,
  canRemoveContent: YES,
  isEditable: YES,

  isLoadedArray: [],
  loadedCount: 0,

  // deleting books is handled by booksController.

  // removing books from authors is handled by the authorController.

  initializeForLoading: function() {
    var arr = this.get('isLoadedArray');
    for (var i=0,len=ThothApp.Book.FIXTURES.get('length'); i<len; i++) {
      arr.pushObject(NO);
    }
  },

  recordWasLoaded: function(key) {
    this.get('isLoadedArray').replace(key-1, 1, [YES]);
    var count = this.get('loadedCount');
    this.set('loadedCount', count+1);
  },

  addNewVersion: function(version) {
    var sel = this.get("selection");
    if (!sel) return;
    version.set("book", sel.firstObject());
    sel.firstObject().get('versions').pushObject(version);
  }

});

