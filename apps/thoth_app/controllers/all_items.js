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
  authorsBinding: 'ThothApp.authorsController.selection',
  booksBinding: 'ThothApp.booksController.content',
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
