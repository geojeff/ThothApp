// ==========================================================================                                                                                                                                                                                            
// ThothApp.Book
// ==========================================================================
/*globals ThothApp*/

/**

 @author Jeff Pittman
 */

ThothApp.Book = SC.Record.extend(
/** @scope ThothApp.Book.prototype */ {
  primaryKey:  'key',
  bucket:      'book',
  id:          SC.Record.attr(String),
  idFixtures:  null,
  title:       SC.Record.attr(String),

  // relations:
  author:   SC.Record.toOne("ThothApp.Author", { inverse: "book", isMaster: NO }),
  versions: SC.Record.toMany("ThothApp.Version", { inverse: "book", isMaster: YES })

//	searchRelevance: 0, // a property that others may use
//	searchTitle: "", // has things like <strong>The</strong> Search Term.
//
//	/* Sync stuff */
//	destroy: function() {
//	  this.get("authors").forEach(function(author){
//	    author.get("books").removeObject(this);
//	    author.commitRecord();
//	  }, this);
//	  sc_super();
//	},
//
//	pendingAuthors: [],
//	storeDidChangeProperties: function() {
//	  sc_super();
//	  if (this.get("guid")) {
//	    if (this.get("pendingAuthors") && this.get("pendingAuthors").get("length") > 0) {
//	      this.get("pendingAuthors").forEach(function(item){
//	        item.get("books").pushObject(this);
//	      }, this);
//	      this.set("pendingAuthors", []);
//	      ThothApp.store.commitRecords();
//	    }
//	  }
//	}
});
