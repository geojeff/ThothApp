// ==========================================================================
// Project:   ThothApp
// ==========================================================================
/*globals ThothApp */

/** @authorspace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
ThothApp = SC.Application.create(
  /** @scope ThothApp.prototype */ {

  NAMESPACE: 'ThothApp',
  VERSION: '0.1.0',

  store: SC.Store.create().from('ThothApp.DataSource'),
  storeType: 'Thoth',
  //store: SC.Store.create().from(SC.Record.fixtures),
  //storeType: 'fixtures',

  nestedStore: null

}) ;
