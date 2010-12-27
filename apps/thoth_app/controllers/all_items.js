// ==========================================================================
// Project:   ThothApp.allItemsController
// ==========================================================================
/*globals ThothApp */

/** @class

  The controller for a list of allItems.

  @extends SC.ArrayController
*/

ThothApp.allItemsController = SC.ArrayController.create(
/** @scope ThothApp.allItemsController.prototype */ {
  content: [],
  authorsBinding: 'ThothApp.authorsController.selection', // multiselection allowed
  booksBinding: 'ThothApp.booksController', // all books for selected author(s)
  versionsBinding: 'ThothApp.versionsController.content',
  reviewsBinding: 'ThothApp.reviewsController.content',

  content: function() {
    var all = [],
        authors = this.get('authors'),
        books = this.get('books'),
        versions = this.get('versions'),
        reviews = this.get('reviews');

    if (!SC.none(authors)) all.pushObjects(authors); else console.log('no authors');
    if (!SC.none(books)) all.pushObjects(books); else console.log('no books');
    if (!SC.none(versions)) all.pushObjects(versions); else console.log('no versions');
    if (!SC.none(reviews)) all.pushObjects(reviews); else console.log('no reviews');

    console.log('all length ', all.get('length'));
    return all;
  }.property('authors', 'books', 'versions', 'reviews')

});

//  versionsAndReviews: [],
//  _tmpRecordCount: 0,
//
//  allRecordsAreReady: function() {
//    var all = [];
//    all.pushObjects(this.get('authors'));
//    all.pushObjects(this.get('books'));
//    all.pushObjects(this.get('versionsAndReviews'));
//    console.log('all length ', all.get('length'));
//    this.set('content', all);
//  },
//
//  loadItems: function() {
//    var me = this, authors = this.get('authors'), books = this.get('books'), versions, reviews;
//
//    console.log('in loadItems');
//    if (!SC.none(authors) && authors.get('length') > 0) {
//      if (!SC.none(books) && books.get('length') > 0) {
//
//        books.forEach(function(book) {
//
//          versions = book.get('versions');
//          if (!SC.none(versions) && versions.get('length') > 0) {
//            versions.forEach(function(version) {
//              console.log(version);
//              me.incrementProperty('_tmpRecordCount');
//              console.log('yo');
//              version.addFiniteObserver('status', me, me.generateAddItemFunction(version), me);
//              console.log('yo yo');
//
//              reviews = version.get('reviews');
//              if (!SC.none(reviews) && reviews.get('length') > 0) {
//                reviews.forEach(function(review) {
//                  me.incrementProperty('_tmpRecordCount');
//                  review.addFiniteObserver('status', me, me.generateAddItemFunction(review), me);
//                })
//              }
//            });
//          }
//        });
//      }
//    }
//    console.log('out loadItems');
//  },
//
//  generateAddItemFunction: function(item) {
//    var me = this;
//    return function(val) {
//      if (val & SC.Record.READY_CLEAN) {
//        me.decrementProperty('_tmpRecordCount');
//        me.get('versionsAndReviews').pushObject(item);
//        console.log(item);
//        console.log('len _tmpRecordCount', me.get('_tmpRecordCount'));
//        if (me.get('_tmpRecordCount') === 0) {
//          me.allRecordsAreReady();
//        }
//        return YES;
//      }
//      else return NO;
//    };
//  }
//
//});
