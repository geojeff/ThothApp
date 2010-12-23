// ==========================================================================
// ThothApp.reviewsController
// ==========================================================================
/*globals ThothApp*/

/**

 This controller manages the creation of review data.

 @extends SC.ArrayController
 @author Jeff Pittman
 */

sc_require('fixtures/review');

ThothApp.reviewsController = SC.ArrayController.create(
  /** @scope ThothApp.reviewsController.prototype */ {

  contentBinding: "ThothApp.versionController.reviews",
  allowsEmptySelection: NO,
  isLoadedArray: [],
  loadedCount: 0,

  initializeForLoading: function() {
    var arr = this.get('isLoadedArray');
    for (var i=0,len=ThothApp.Review.FIXTURES.get('length'); i<len; i++) {
      arr.pushObject(NO);
    }
  },

  recordWasLoaded: function(key) {
    this.get('isLoadedArray').replace(key-1, 1, [YES]);
    var count = this.get('loadedCount');
    this.set('loadedCount', count+1);
  }

});
