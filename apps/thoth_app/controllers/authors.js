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
  //
  // Selections possible:
  //
  //    single author
  //    multiple authors
  //
	allowMultipleSelection: YES,
  selection: null,

  // gatheredAll is used to hold all objects associated with the current selection of authors, including the authors
  // and the books, versions, and reviews associated with the selection of authors. This is needed for display
  // in the LinkIt graphicsPane.
  gatheredAll: null,

  // individual arrays for list views
  gatheredBooks: [],
  gatheredVersions: [],
  gatheredReviews: [],

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

//  contentDidChange: function() {
//    this.gather();
//  }.observes("[]"),
//
//	selectionDidChange: function() {
//	  this.gather();
//	}.observes("selection"),

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

	gather: function() {
	  var i, lenBookIds,
        j, lenVersionIds,
        k, lenReviewIds,
        book, version, review,
        bookIds, versionIds, reviewIds,
        authors = this.get("selection"); // multiselect allowed
        books = SC.Set.create(), versions = SC.Set.create(), reviews = SC.Set.create(), allAssociated = SC.Set.create();

    if (!SC.none(authors) && authors.get('length') > 0) {
      console.log('authors length ', authors.get('length'));
	    authors.forEach(function(author){
        allAssociated.add(author);

        bookIds = author.readAttribute("books");
        if (!SC.none(bookIds)) {
	        for (i=0, lenBookIds=bookIds.get('length'); i<lenBookIds; i++) {
            book = ThothApp.store.find(ThothApp.Book, bookIds[i]);
            if (!SC.none(book)) {
              books.add(book);
              allAssociated.add(book);
            }

            versionIds = book.readAttribute("versions");
            if (!SC.none(versionIds)) {
              for (j=0, lenVersionIds=versionIds.get('length'); j<lenVersionIds; j++) {
                version = ThothApp.store.find(ThothApp.Version, versionIds[j]);
                if (!SC.none(version)) {
                  versions.add(version);
                  allAssociated.add(version);
                }

                reviewIds = version.get("reviews");
                if (!SC.none(reviewIds)) {
                  for (k=0, lenReviewIds=reviewIds.get('length'); k<lenReviewIds; k++) {
                    review = ThothApp.store.find(ThothApp.Review, reviewIds[k]);
                    if (!SC.none(review)) {
                      reviews.add(review);
                      allAssociated.add(review);
                    }
                  }
                  //this.set("gatheredReviews", reviews.toArray());
                  ThothApp.reviewsController.set("content", reviews.toArray());
                }
              }
              //this.set("gatheredVersions", versions.toArray());
              ThothApp.versionsController.set("content", versions.toArray());
            }
          }
          console.log(books.toArray());
          //this.set("gatheredBooks", books.toArray());
          ThothApp.booksController.set("content", books.toArray());
          ThothApp.booksController.selectFirst();
        }
	    });

      this.set("gatheredAuthors", authors);

      console.log('gatheredAll ', allAssociated.get('length'));
      this.set("gatheredAll", allAssociated.toArray());
    }
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
