// ==========================================================================
// ThothApp.reviewsController
// ==========================================================================
/*globals ThothApp*/

/**

 This controller manages the creation of review data.

 @extends SC.ArrayController
 @author Jeff Pittman
 */
ThothApp.reviewsController = SC.ArrayController.create(
  /** @scope ThothApp.reviewsController.prototype */ {

  contentBinding: "ThothApp.versionsController.gatheredReviews",
  selection: null,

  deleteReviews: function(op) {
    var records = op.records, indexes = op.indexes;
    records.invoke('destroy');

    var selIndex = indexes.get('min') - 1;
    if (selIndex < 0) selIndex = 0;
    this.selectObject(this.objectAt(selIndex));

    ThothApp.store.commitRecords();
  },

  addReview: function() {
    var version;

    review = ThothApp.store.createRecord(ThothApp.Review, {
      "text": "Say what you think."
    });

    ThothApp.store.commitRecords();

    // Once the book records come back READY_CLEAN, add review to current version.
    review.addFiniteObserver('status', this, this.generateCheckReviewFunction(review), this);
  },

  generateCheckReviewFunction: function(review) {
    var me = this;
    return function(val) {
      if (val & SC.Record.READY_CLEAN) {
        ThothApp.versionsController.addNewReview(review);

        me.selectObject(review);

        me.invokeLater(function() {
          ThothApp.versionController.beginEditing();
        });

        // this has already been done, eh?
        //version.commitRecord();
      }
    };
  }

});
