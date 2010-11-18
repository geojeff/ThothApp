// ==========================================================================
// Project:   ThothApp.authorsController
// ==========================================================================
/*globals ThothApp */

/** @class

  The controller for a list of authors.

  @extends SC.ArrayController
*/
ThothApp.authorsController = SC.ArrayController.create(SC.CollectionViewDelegate,
/** @scope ThothApp.authorsController.prototype */ {
	allowMultipleSelection: YES,
	all: null,
	selection: null,
  gatheredBooks: null,

	allDidChange: function(){
	  if (!this.get("selection")) {
      this.set("gatheredBooks", this.get("all"));
      this.set("allIsSelected", YES);
    } else {
      this.gatherBooks();
    }
	}.observes("all", "[]"),

	selectAllAuthorsItem: function(){
	  this.set("selection", null);
	  this.set("gatheredBooks", this.get("all"));
	  this.set("allIsSelected", YES);
	},

	selectionDidChange: function() {
	  this.gatherBooks();
	}.observes("selection"),

	gatherBooks: function() {
    var authors, books;
    authors = this.get("selection"); // multiselect allowed
    //console.log('authors in gatherBooks ' + SC.inspect(authors));
	  if (!SC.none(authors)) {
	    books = SC.Set.create();
	    authors.forEach(function(author){
	      author.get("books").forEach(function(book) {
          books.add(book);
        });
	    });

      this.set("gatheredBooks", books.toArray());
	    this.set("allIsSelected", NO);
      var fo = books.firstObject();
      if (!SC.none(fo)) {
        fo.addFiniteObserver('status',this,this.generateSelectBookFunction(fo),this);
      }
    }
	},

	gatherVersions: function() {
	  var authors, versions;
    authors = this.get("selection"); // multiselect allowed
    if (!SC.none(authors)) {
	    versions = SC.Set.create();
	    authors.forEach(function(author){
	      author.get("books").forEach(function(book) {
          book.get("versions").forEach(function(version) {
            versions.add(version);
          });
        });
	    });

      this.set("gatheredVersions", versions.toArray());
    }
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

	deleteAuthors: function(op)
	{
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

  generateCheckAuthorsFunction: function(){
    var me = this;
    return function(val){
      if (val & SC.Record.READY_CLEAN){
        me._tmpRecordCount--;
        ThothApp.bumpAuthorCount();
        if (me._tmpRecordCount === 0){
          delete me._tmpRecordCount;

          var authorRecords = ThothApp.store.find(ThothApp.Author);
          authorRecords.forEach(function(authorRecord) {
            var fixturesKey = authorRecord.readAttribute('fixturesKey');

            var bookRecords = ThothApp.store.find(SC.Query.local(
              ThothApp.Book,
              { conditions: "fixturesKey ANY {id_fixtures_array}",
                parameters: {id_fixtures_array: ThothApp.Author.FIXTURES[fixturesKey-1].books }}
            ));

            authorRecord.get('books').pushObjects(bookRecords);
          });

          ThothApp.store.commitRecords();

          ThothApp.statechart.sendEvent('authorsDidLoad');
        }
        return YES;
      }
      else return NO;
    };
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
  },

  loadAuthors: function(){
    this._tmpRecordCount = ThothApp.Author.FIXTURES.get('length');
    for (var i=0,len=ThothApp.Author.FIXTURES.get('length'); i<len; i++){
      var author;
      author = ThothApp.store.createRecord(ThothApp.Author, {
        //"key":         ThothApp.Author.FIXTURES[i].key,
        "fixturesKey": ThothApp.Author.FIXTURES[i].key,
        "firstName":   ThothApp.Author.FIXTURES[i].firstName,
        "lastName":    ThothApp.Author.FIXTURES[i].lastName
      });
      author.addFiniteObserver('status',this,this.generateCheckAuthorsFunction(),this);
    }
    ThothApp.store.commitRecords();
  },

  _tmpRecordCount: 0

}) ;
