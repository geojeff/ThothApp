// ==========================================================================
// Project:   ThothApp.Author
// ==========================================================================
/*globals ThothApp */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
ThothApp.Author = SC.Record.extend(
/** @scope ThothApp.Author.prototype */ {
  primaryKey:  'key',
  bucket:      'author',
  id:          SC.Record.attr(String),
  idFixtures:  null,
  firstName:   SC.Record.attr(String),
  lastName:    SC.Record.attr(String),

  fullName: function(key, value) {
    if (value !== undefined) {
      var parts = value.split(' '); // parse full name
      if (parts.get('length') === 2) {
        this.set('firstName', parts[0]);
        this.set('lastName', parts[1]);
      } else {
        if (parts.get('length') === 1) {
          this.set('firstName', "");
          this.set('lastName', parts[0]);
        } else {
          this.set('firstName', parts[0]);
          this.set('lastName', parts.slice(1).join(' '));
        }
      }
    }

    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName').cacheable(),

  books: SC.Record.toMany("ThothApp.Book", { inverse: "author", isMaster: YES })

});
