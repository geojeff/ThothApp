// ==========================================================================                                                                                                                                                                                            
// ThothApp.Review
// ==========================================================================
/*globals ThothApp*/

/** 

   @author Jeff Pittman
*/

ThothApp.Review = SC.Record.extend(LinkIt.Node, {
/** @scope ThothApp.Review.prototype */
  primaryKey:  'key',
  bucket:      'review',
  id:          SC.Record.attr(String),
  idFixtures:  null,
  text:        SC.Record.attr(String),

  isReview:    YES,

  version: SC.Record.toOne("ThothApp.Version",  { inverse: 'review', isMaster: NO }),
  //version: SC.Record.toOne("ThothApp.Version",  { isMaster: NO }),

  name: function() {
    var text = this.get('text');

    return (text.length < 14) ? text : '%@...'.fmt(text.substr(0, 9));
  }.property(),

  //
  // LinkIt-specific Information
  //
  terminals: ['version'],
  position: SC.Record.attr(Object),

  links: function(){
    var links = [];
    // get version
    var version = this.get('version');
    var versionLink;
    if (version){
      versionLink = SC.Object.create(LinkIt.Link, {
        startNode: version,
        startTerminal: 'reviews',
        endNode: this,
        endTerminal: 'version'
      });
      links.push(versionLink);
    }

    return links;
  }.property('version').cacheable(),

  canLink: function(link) {
    if (!link) return NO;

    var sn = link.get('startNode'), st = link.get('startTerminal');
    var en = link.get('endNode'), et = link.get('endTerminal');

    // Make sure we don't connect to ourselves.
    if (sn === en) return NO;
    //console.log('\nCan Link: (%@).%@ => (%@).%@'.fmt(SC.guidFor(sn), st, SC.guidFor(en), et));

    // Make sure we don't already have this link.
    if (this._hasLink(link)) return NO;

    if ((st === 'version' && et === 'reviews') || (et === 'version' && st === 'reviews')) {
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
    //console.log('Review...didCreateLink: start:%@ end:%@'.fmt(st, et));
    if(en === this && et === 'version'){
      this.set('version', sn);
    }
  },

  willDeleteLink: function(link) {
    var sn = link.get('startNode'), st = link.get('startTerminal');
    var en = link.get('endNode'), et = link.get('endTerminal');
    if(en === this && et === 'version'){
      this.set('version', null);
    }
  }

});
