// ==========================================================================
// ThothApp.bookshelfController
// ==========================================================================
/*globals ThothApp */

/**
  @extends SC.ArrayController
  @author Jeff Pittman

  This controller holds all the items associated with an author, for use
  with LinkIt.
*/
ThothApp.bookshelfController = SC.ObjectController.create(
  /* @scope */{

  isEditable: NO,

  contentBinding: 'ThothApp.authorController.gatheredAll',
  contentBindingDefault: SC.Binding.oneWay().single(),
  selection: null

});