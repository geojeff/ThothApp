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

  contentBinding: "ThothApp.bookController.versions",
  allowsEmptySelection: NO,

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

  addReviewToVersion: function(review) {
    var sel = this.get("selection");
    if (!sel) return;
    review.set("version", sel.firstObject());
    sel.firstObject().get('reviews').pushObject(review);
  }

});
        
