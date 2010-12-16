// ==========================================================================                                                                                                                                                                                            
// ThothApp.Book
// ==========================================================================
/*globals ThothApp*/

/**

 @author Jeff Pittman
 */

ThothApp.Book = SC.Record.extend(LinkIt.Node, {
/** @scope ThothApp.Book.prototype */
  primaryKey:  'key',
  bucket:      'book',
  id:          SC.Record.attr(String),
  idFixtures:  null,
  title:       SC.Record.attr(String),

  isBook:      YES,

  // relations:
  //author:   SC.Record.toOne("ThothApp.Author", { inverse: "book", isMaster: NO }),
  author:   SC.Record.toOne("ThothApp.Author", { isMaster: NO }),
  versions: SC.Record.toMany("ThothApp.Version", { inverse: "book", isMaster: YES }),

  name: function() {
    var title = this.get('title');

    return (title.length < 14) ? title : '%@...'.fmt(title.substr(0, 9));
  }.property(),

  //
  // LinkIt-specific Information
  //
  terminals: ['author', 'versions'],
  position: SC.Record.attr(Object),

  links: function(){
    var links = [];

    // get author
    var author = this.get('author');
    if (author){
      var authorLink = SC.Object.create( LinkIt.Link, {
        startNode: author,
        startTerminal: 'versions',
        endNode: this,
        endTerminal: 'author'
      });
      links.push(authorLink);
    }

    return links;
  }.property('author').cacheable(),

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
    var hasBook = (terminals.indexOf('author') > -1);

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
    if (et === 'author' && sn !== this){
      this.set('author', sn);
    }
  },

  willDeleteLink: function(link) {
    var sn = link.get('startNode'), st = link.get('startTerminal');
    var en = link.get('endNode'), et = link.get('endTerminal');
    if (et === 'author'){
      this.set('author', null);
    }
  }
});
