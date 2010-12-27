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
//
//  commented out section here will get only selected items
//
//  authorsBinding: 'ThothApp.authorsController.selection', // multiselection allowed
//  booksBinding: 'ThothApp.booksController', // all books for selected author(s)
//  versionsBinding: 'ThothApp.versionsController.content',
//  reviewsBinding: 'ThothApp.reviewsController.content',
//
//  content: function() {
//    var all = [],
//        authors = this.get('authors'),
//        books = this.get('books'),
//        versions = this.get('versions'),
//        reviews = this.get('reviews');
//
//    if (!SC.none(authors)) all.pushObjects(authors);
//    if (!SC.none(books)) all.pushObjects(books);
//    if (!SC.none(versions)) all.pushObjects(versions);
//    if (!SC.none(reviews)) all.pushObjects(reviews);
//
//    return all;
//  }.property('authors', 'books', 'versions', 'reviews')
//
//});

  authorsBinding: 'ThothApp.authorsController.selection', // multiselection allowed
  booksBinding: 'ThothApp.booksController', // all books for selected author(s)

  arrangedObjects: function() {
    var all = [], authors = this.get('authors'), books = this.get('books'), versions, reviews;

    if (!SC.none(authors) && authors.get('length') > 0) {
      all.pushObjects(authors);
      if (!SC.none(books) && books.get('length') > 0) {
        all.pushObjects(books);
        books.forEach(function(book) {
          versions = book.get('versions');
          if (!SC.none(versions) && versions.get('length') > 0) {
            all.pushObjects(versions);
            versions.forEach(function(version) {
              reviews = version.get('reviews');
              if (!SC.none(reviews) && reviews.get('length') > 0) {
                all.pushObjects(reviews);
              }
            });
          }
        });
      }
    }
    return all;
  }.property('authors', 'books').cacheable()
});
