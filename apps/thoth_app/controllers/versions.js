// ==========================================================================                                                                                                                                                                                            
// ThothApp.versionsController
// ==========================================================================
/*globals ThothApp*/

/** 

This controller manages the creation of version data.

   @extends SC.ArrayController
   @author Jeff Pittman
*/

sc_require('fixtures/version');

ThothApp.versionsController = SC.ArrayController.create(
/** @scope ThothApp.versionsController.prototype */ {

  contentBinding: "ThothApp.booksController.gatheredVersions",
  gatheredReviews: null,
  selection: null,
  isLoadedArray: [],
  loadedCount: 0,

  initializeForLoading: function() {
    var arr = this.get('isLoadedArray');
    for (var i=0,len=ThothApp.Version.FIXTURES.get('length'); i<len; i++) {
      arr.pushObject(NO);
    }
  },

  recordWasLoaded: function(key) {
    this.get('isLoadedArray').replace(key-1, 1, [YES]);
    var count = this.get('loadedCount');
    this.set('loadedCount', count+1);
  },

  selectionDidChange: function() {
    this.gatherReviews();
  }.observes("selection"),

  gatherReviews: function() {
    var versions, reviews, versionReviews;

    versions = this.get("selection");
    if (!SC.none(versions)) {
      reviews = SC.Set.create();
      this.get("selection").forEach(function(version){
        versionReviews = version.get("reviews");
        if (!SC.none(versionReviews)) {
          versionReviews.forEach(function(review) {
            reviews.add(review);
          });
        }
      });

      this.set("gatheredReviews", reviews.toArray());

      var fo = reviews .firstObject();
      if (!SC.none(fo)) {
        fo.addFiniteObserver('status',this,this.generateSelectReviewFunction(fo),this);
      }
    }
  },

  generateSelectReviewFunction: function(review) {
    var me = this;
    return function(val){
      if (val & SC.Record.READY_CLEAN){
        if (!ThothApp.reviewsController.hasSelection()) {
          ThothApp.reviewsController.selectObject(review);
        }
      }
    };
  },

  deleteVersions: function(op) {
    var records = op.records, indexes = op.indexes;
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

  addVersion: function() {
    var version;

    version = ThothApp.store.createRecord(ThothApp.Version, {
      "title":       'title'
    });

    ThothApp.store.commitRecords();

    // Once the book records come back READY_CLEAN, add book to current book.
    version.addFiniteObserver('status',this,this.generateCheckVersionFunction(version),this);
  },

  generateCheckVersionFunction: function(version) {
    var me = this;
    return function(val){
      if (val & SC.Record.READY_CLEAN){
        ThothApp.booksController.addNewVersion(version);

        me.selectObject(version);

        me.invokeLater(function(){
          ThothApp.versionController.beginEditing();
        });

        // this has already been done, eh?
        //version.commitRecord();
      }
    };
  },

  addNewReview: function(review) {
    var sel = this.get("selection");
    if (!sel) return;
    review.set("version", sel.firstObject());
    sel.firstObject().get('reviews').pushObject(review);

    this.gatherReviews();
  }

});
        
