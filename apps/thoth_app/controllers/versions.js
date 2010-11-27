// ==========================================================================                                                                                                                                                                                            
// ThothApp.versionsController
// ==========================================================================
/*globals ThothApp*/

/** 

This controller manages the creation of version data.

   @extends SC.ArrayController
   @author Jeff Pittman
*/
ThothApp.versionsController = SC.ArrayController.create(
/** @scope ThothApp.versionsController.prototype */ {

  contentBinding: "ThothApp.booksController.gatheredVersions",
  gatheredReviews: null,
  selection: null,

  selectionDidChange: function() {
    this.gatherReviews();
  }.observes("selection"),

  gatherReviews: function() {
    var versions, reviews;

    versions = this.get("selection");
    if (!SC.none(versions)) {
      reviews = SC.Set.create();
      this.get("selection").forEach(function(version){
        version.get("reviews").forEach(function(review) {
          reviews.add(review);
        });
      });

      this.set("gatheredReviews", reviews.toArray());
    }
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
        
