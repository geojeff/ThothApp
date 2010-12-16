// ==========================================================================
// Project:   ThothApp.authorController
// ==========================================================================
/*globals ThothApp */

/** @class

  The controller is bound to the booksController, because the authorsController allows
  multiselection and has the All item, which complicates the setting of its selection.
  This way an author is set here there has been a selection of an author directly, or
  when there is selection of a book.

  @extends SC.Object
*/
ThothApp.authorController = SC.ObjectController.create(
/** @scope ThothApp.authorController.prototype */ {
	contentBinding: "ThothApp.authorsController.selection",
  contentBindingDefault: SC.Binding.oneWay().single(),
  bookSelectionBinding: "ThothApp.booksController.selection",
  bookSelection: null,

  update: function() {
    var bookSelection, book, author;

    bookSelection = this.get('bookSelection');
    if (!SC.none(bookSelection)) {
      book = bookSelection.firstObject();
      if (!SC.none(book)) {
        author = book.readAttribute('author');
        if (!SC.none(author)) {
          this.set('content', book.readAttribute('author'));
        } else {
          console.log('author is NONE');
        }
      } else {
        console.log('book is NONE');
      }
    } else {
      console.log('bookSelection is NONE');
    }
  }.observes('bookSelection')

});
