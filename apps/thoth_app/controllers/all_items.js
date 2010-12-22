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
  booksBinding: 'ThothApp.booksController.arrangedObjects',
  versionsBinding: 'ThothApp.versionsController.arrangedObjects',
  reviewsBinding: 'ThothApp.reviewsController.arrangedObjects',

  content: function() {
    var all = [],
        authors = this.get('authors'),
        books = this.get('authors'),
        versions = this.get('books'),
        reviews = this.get('versions');

    if (!SC.none(authors)) all.pushObjects(authors);
    if (!SC.none(books)) all.pushObjects(books);
    if (!SC.none(versions)) all.pushObjects(versions);
    if (!SC.none(reviews)) all.pushObjects(reviews);

    return all;
  }.property('authors', 'books', 'versions', 'reviews')

});
