// ==========================================================================                                                                                                                                                                                            
// ThothApp.Review
// ==========================================================================
/*globals ThothApp*/

/** 

   @author Jeff Pittman
*/

ThothApp.Review = SC.Record.extend(
/** @scope ThothApp.Review.prototype */ {
  primaryKey:  'key',
  bucket:      'review',
  id:          SC.Record.attr(String),
  idFixtures:  null,
  text:        SC.Record.attr(String),

  version: SC.Record.toOne("ThothApp.Version",  { inverse: "reviews", isMaster: NO })

});
