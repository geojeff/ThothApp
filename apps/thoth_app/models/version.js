// ==========================================================================                                                                                                                                                                                            
// ThothApp.Version
// ==========================================================================
/*globals ThothApp*/

/** 

   @author Jeff Pittman
*/

ThothApp.Version = SC.Record.extend(
/** @scope ThothApp.Version.prototype */ {
  primaryKey:      'key',
  bucket:          'version',
  id:              SC.Record.attr(String),
  idFixtures:      null,
  publisher:       SC.Record.attr(String),
  publicationDate: SC.Record.attr(SC.DateTime, { format: '%Y %m %d' }),
  format:          SC.Record.attr(String),
  pages:           SC.Record.attr(Number),
  language:        SC.Record.attr(String),
  rank:            SC.Record.attr(Number),
  height:          SC.Record.attr(Number),
  width:           SC.Record.attr(Number),
  depth:           SC.Record.attr(Number),
  isbn10:          SC.Record.attr(String),
  isbn13:          SC.Record.attr(String),

  // Relations
  book: SC.Record.toOne("ThothApp.Book",  { inverse: "version", isMaster: NO }),
  reviews: SC.Record.toMany("ThothApp.Review", { inverse: "version", isMaster: YES })
});
