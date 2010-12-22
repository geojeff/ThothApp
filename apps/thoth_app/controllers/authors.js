// ==========================================================================
// Project:   ThothApp.authorsController
// ==========================================================================
/*globals ThothApp */

/** @class

  The controller for a list of authors.

  @extends SC.ArrayController
*/

sc_require('fixtures/author');

ThothApp.authorsController = SC.ArrayController.create(SC.CollectionViewDelegate,
/** @scope ThothApp.authorsController.prototype */ {
	allowMultipleSelection: YES,

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

  selectFirst: function() {
    this.selectObject(this.firstSelectableObject());
  },

  generateSelectBookFunction: function(book) {
    var me = this;
    return function(val){
      if (val & SC.Record.READY_CLEAN){
        if (!ThothApp.booksController.hasSelection()) {
          ThothApp.booksController.selectObject(book);
        }
      }
    };
  },

	collectionViewDeleteContent: function(view, content, indexes) {
	  this._pendingOperation = { action: "deleteAuthors", indexes: indexes  };
	  SC.AlertPane.warn(
	    "Be Careful!",
	    "Are you sure you want to delete these " + indexes.get("length") + " authors?",
	    null,
	    "Keep Authors",
	    "Delete Authors",
	    null,
	    this
	  );
	},

	deleteAuthors: function(op) {
	  var indexes = op.indexes;
	  var records = indexes.map(function(idx) {
	    return this.objectAt(idx);
	  }, this);
	  records.invoke('destroy');

	  var selIndex = indexes.get('min') - 1;
	  if (selIndex < 0) selIndex = 0;
	  this.selectObject(this.objectAt(selIndex));

		ThothApp.store.commitRecords();
	},

	alertPaneDidDismiss: function(pane, status) {
	  if (!this._pendingOperation) return;
	  switch (status) {
	    case SC.BUTTON2_STATUS:
	      this[this._pendingOperation.action].call(this, this._pendingOperation);
	      this._pendingOperation = null;
	      break;
	    case SC.BUTTON1_STATUS:
	      break;
	  }
	},

	removeBooks: function(books) {
	  var sel = this.get("selection");
	  if (!sel) return;

	  sel.forEach(function(item) {
	    item.get("books").removeObjects(books);
	  });
	  ThothApp.store.commitRecords();
	},

  isSingleSelection: function(){
    var sel = this.get("selection");
    if (!sel) return NO;
    if (sel.get('length') > 1) return NO;
    return YES;
  },

	addNewBook: function(book) {
	  var sel = this.get("selection");
	  if (!sel) return;
    if (sel.get('length') > 1) return; // although multiselect authors allowed, not for adding book
	  book.set("author", sel.firstObject());
    sel.firstObject().get('books').pushObject(book);

    this.gatherBooks();
	},

  generateCheckAuthorFunction: function(authorRecord){
    var me = this;
    return function(val){
      if (val & SC.Record.READY_CLEAN){
        ThothApp.bumpAuthorCount();

        var bookRecords = ThothApp.store.find(ThothApp.Book);
        var fixturesKey = authorRecord.readAttribute('fixturesKey');

        var bookRecordsForAuthor = [];
        bookRecords.forEach(function(bookRecord) {
          if (ThothApp.Author.FIXTURES[fixturesKey-1].books.indexOf(bookRecord.readAttribute('fixturesKey')) !== -1) {
            bookRecordsForAuthor.pushObject(bookRecord);
          }
        });

        authorRecord.get('books').pushObjects(bookRecordsForAuthor);

        ThothApp.store.commitRecords();

        ThothApp.statechart.authorsLoaded();

        return YES;
      }
      else return NO;
    };
  },

  addAuthor: function(){
    var author;

    var authorKey = ThothApp.nextRecordKey();

    author = ThothApp.store.createRecord(ThothApp.Author, {
      //"key":         authorKey,
      "fixturesKey": authorKey,
      "firstName":   "First",
      "lastName":    "Last"
    });

    this.selectObject(author);
    this.invokeLater(function(){
      var contentIndex = this.indexOf(author);
      var list = ThothApp.mainPage.getPath("mainPane.splitter.topLeftView.authorList.contentView");
      var listItem = list.itemViewForContentIndex(contentIndex);
      listItem.beginEditing();
    });
  }

}) ;
