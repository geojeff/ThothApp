// ==========================================================================
// Project:   ThothApp.Author
// ==========================================================================
/*globals ThothApp */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
ThothApp.Author = SC.Record.extend(LinkIt.Node, {
/** @scope ThothApp.Author.prototype */
  primaryKey:  'key',
  bucket:      'author',
  id:          SC.Record.attr(String),
  idFixtures:  null,
  firstName:   SC.Record.attr(String),
  lastName:    SC.Record.attr(String),

  isAuthor:    YES,

  name: function() {
    var parts = this.get('fullName').w(); // first, last names, or just last name

    if (parts.get('length') === 2) {
      return '%@. %@'.fmt(parts[0].charAt[0], (parts[1].length < 14) ? parts[1] : '%@...'.fmt(parts[1].substr(0, 9)));
    } else if parts.get('length') === 1) {
      return parts[0];
    } else {
      return 'error';
    }
  }.property(),

  fullName: function(key, value) {
    if (value !== undefined) {
      var parts = value.w(); // parse full name
      var len = parts.get('length');
      if (len === 2) {
        this.set('firstName', parts[0]);
        this.set('lastName', parts[1]);
      } else if (len === 1) {
        this.set('firstName', "");
        this.set('lastName', parts[0]);
        return this.get('lastName');
      } else if (len > 2) {
        this.set('firstName', parts[0]);
        this.set('lastName', parts.slice(1).join(' '));
      } else {
        this.set('firstName', "");
        this.set('lastName', "");
      }
    }

    if (SC.none(this.get('firstName')) && SC.none(this.get('lastName'))) {
      return "";
    } else if (!SC.none(this.get('firstName'))) {
      return (this.get('firstName').length > 0) ?
              '%@ %@'.fmt(this.get('firstName'), this.get('lastName')) :
              this.get('lastName');
    } else {
      return this.get('lastName');
    }

  }.property('firstName', 'lastName').cacheable(),

  books: SC.Record.toMany("ThothApp.Book", { inverse: "author", isMaster: YES }),

  //
  // LinkIt-specific Information
  //
  terminals: ['books'],
  position: SC.Record.attr(Object),

  links: function(){
    return [];
  }.property(),

//  links: function(){
//    var links = [];
//
//    // get root
//    var root = this.get('root');
//    if (root){
//      var rootLink = SC.Object.create( LinkIt.Link, {
//        startNode: root,
//        startTerminal: 'versions',
//        endNode: this,
//        endTerminal: 'root'
//      });
//      links.push(rootLink);
//    }
//
//    return links;
//  }.property('root').cacheable(),

  canLink: function(link) {
    if (!link) return NO;

    var sn = link.get('startNode'), st = link.get('startTerminal');
    var en = link.get('endNode'), et = link.get('endTerminal');

    // Make sure we don't connect to ourselves.
    if (sn === en) return NO;
    //console.log('\nCan Link: (%@).%@ => (%@).%@'.fmt(SC.guidFor(sn), st, SC.guidFor(en), et));

    // Make sure we don't already have this link.
    if (this._hasLink(link)) return NO;

    var terminals = '%@ %@'.fmt(st, et);

    // Data Points
    var hasVersions = (terminals.indexOf('versions') > -1);
    var hasBook = (terminals.indexOf('book') > -1);

    if(hasVersions && hasBook) {
      //console.log('(%@,%@) Book link to Versions: %@'.fmt(SC.guidFor(sn), SC.guidFor(en), terminals ));
      return YES;
    }

    return NO;
  },

  _hasLink: function(link) {
    var links = this.get('links') || [];
    var len = links.get('length'), n;
    var linkID = LinkIt.genLinkID(link);
    for (var i = 0; i < len; i++) {
      n = links.objectAt(i);
      if (LinkIt.genLinkID(n) === linkID) {
        return YES;
      }
    }
  },

  didCreateLink: function(link) {
    var l = link[0]; // The link is comprised of an ARRAY of links with the Bi-directional links...often you only need the first object to complete the link
    var sn = l.get('startNode'), st = l.get('startTerminal');
    var en = l.get('endNode'), et = l.get('endTerminal');
    if (et === 'book' && sn !== this){
      this.set('book', sn);
    }
  },

  willDeleteLink: function(link) {
    var sn = link.get('startNode'), st = link.get('startTerminal');
    var en = link.get('endNode'), et = link.get('endTerminal');
    if (et === 'book'){
      this.set('book', null);
    }
  }

});
