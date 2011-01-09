// ==========================================================================                                                                                                                                                                                            
// ThothApp.Version
// ==========================================================================
/*globals ThothApp*/

/** 

   @author Jeff Pittman
*/

ThothApp.Version = SC.Record.extend(LinkIt.Node, {
/** @scope ThothApp.Version.prototype */
  primaryKey:      'key',
  bucket:          'version',
  //id:              SC.Record.attr(String),
  //idFixtures:     null,
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

  isVersion:       YES,

  name: function() {
    var format = this.get('format');

    if (SC.none(format)) return "";

    return format;
  }.property('format').cacheable(),

  // Relations
  book: SC.Record.toOne("ThothApp.Book",  { inverse: 'versions', isMaster: NO }),
  reviews: SC.Record.toMany("ThothApp.Review", { inverse: "version", isMaster: YES }),

  //
  // LinkIt-specific Information
  //
  terminals: ['book', 'reviews'],
  position: SC.Record.attr(Object),

  depthOfChildren: function() {
    return this.get('reviews').get('length');
  }.property().cacheable(),

  links: function(){
    var links = [];

    // get book
    var book = this.get('book');
    if (book){
      var bookLink = SC.Object.create(LinkIt.Link, {
        startNode: book,
        startTerminal: 'versions',
        endNode: this,
        endTerminal: 'book'
      });
      links.push(bookLink);
    }

    return links;
  }.property('book').cacheable(),

  isBookToVersions: function(t1, t2) {
    if (t1 === 'book' && t2 === 'versions') return YES;
    if (t2 === 'book' && t1 === 'versions') return YES;
    return NO;
  },

  isVersionToReviews: function(t1, t2) {
    if (t1 === 'version' && t2 === 'reviews') return YES;
    if (t2 === 'version' && t1 === 'reviews') return YES;
    return NO;
  },

  canLink: function(link) {
    if (!link) return NO;

    var sn = link.get('startNode'), st = link.get('startTerminal');
    var en = link.get('endNode'), et = link.get('endTerminal');

    // Make sure we don't connect to ourselves.
    if (sn === en) return NO;
    //console.log('\nCan Link: (%@).%@ => (%@).%@'.fmt(SC.guidFor(sn), st, SC.guidFor(en), et));

    // Make sure we don't already have this link.
    if (this._hasLink(link)) return NO;

    if(this.isBookToVersions(st, et) || this.isVersionToReviews(st, et)) {
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
