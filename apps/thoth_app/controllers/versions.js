// ==========================================================================                                                                                                                                                                                            
// ThothApp.versionsController
// ==========================================================================
/*globals ThothApp*/

/** 

This controller manages the creation of version data.

   @extends SC.ArrayController
   @author Jeff Pittman
*/
ThothApp.versionsController = SC.ArrayController.create(
/** @scope ThothApp.versionsController.prototype */ {

  contentBinding: "ThothApp.booksController.gatheredVersions",
  gatheredReviews: null,
  selection: null,

  selectionDidChange: function() {
    this.gatherReviews();
  }.observes("selection"),

  gatherReviews: function() {
    var versions, reviews;

    versions = this.get("selection");
    if (!SC.none(versions)) {
      reviews = SC.Set.create();
      this.get("selection").forEach(function(version){
        version.get("reviews").forEach(function(review) {
          reviews.add(review);
        });
      });

      this.set("gatheredReviews", reviews.toArray());
    }
  },

  deleteVersions: function(op) {
    var records = op.records, indexes = op.indexes;
    records.invoke('destroy');

    var selIndex = indexes.get('min') - 1;
    if (selIndex < 0) selIndex = 0;
    this.selectObject(this.objectAt(selIndex));

    ThothApp.store.commitRecords();
  },

  alertPaneDidDismiss: function(pane, status) {
    if (!this._pendingOperation) return;
    switch (status) {
      case SC.BUTTON2_STATUS:
        this[this._pendingOperation.action].call(this, this._pendingOperation);
        this._pendingOperation = null;
        break;
      case SC.BUTTON1_STATUS:
        break;
    }
  },

  addVersion: function() {
    var version;

    version = ThothApp.store.createRecord(ThothApp.Version, {
      "title":       'title'
    });

    ThothApp.store.commitRecords();

    // Once the book records come back READY_CLEAN, add book to current book.
    version.addFiniteObserver('status',this,this.generateCheckVersionFunction(version),this);
  },

  generateCheckVersionFunction: function(version) {
    var me = this;
    return function(val){
      if (val & SC.Record.READY_CLEAN){
        ThothApp.booksController.addNewVersion(version);

        me.selectObject(version);

        me.invokeLater(function(){
          ThothApp.versionController.beginEditing();
        });

        // this has already been done, eh?
        //version.commitRecord();
      }
    };
  },

  addNewReview: function(review) {
    var sel = this.get("selection");
    if (!sel) return;
    review.set("version", sel.firstObject());
    sel.firstObject().get('reviews').pushObject(review);

    this.gatherReviews();
  },

  // This is a closure, that will create an unnamed function, for checking
  // for completion of versions records. The generator function has version
  // as a passed-in argument, in scope for the generated function. The
  // 'var me = this;' line sets me so that there is also a reference to the
  // controller within the generated function.
  generateCheckVersionsFunction: function(version){
    var me = this;
    return function(val){
      if (val & SC.Record.READY_CLEAN){
        me._tmpRecordCount--;
        ThothApp.bumpVersionCount();
        if (me._tmpRecordCount === 0){
          delete me._tmpRecordCount;

          var versionRecords = ThothApp.store.find(ThothApp.Version);
          versionRecords.forEach(function(versionRecord) {
            var fixturesKey = versionRecord.readAttribute('fixturesKey');

            var reviewRecords = ThothApp.store.find(SC.Query.local(
              ThothApp.Review,
              { conditions: "fixturesKey ANY {id_fixtures_array}",
                parameters: { id_fixtures_array: ThothApp.Version.FIXTURES[fixturesKey-1].reviews }}
            ));
            versionRecord.get('reviews').pushObjects(reviewRecords);
          });

          ThothApp.store.commitRecords();

          ThothApp.statechart.sendEvent('versionsDidLoad');
        }
        return YES;
      }
      else return NO;
    };
  },
 
  loadVersions: function(){
    this._tmpRecordCount = ThothApp.Version.FIXTURES.get('length');

    for (var i=0,len=ThothApp.Version.FIXTURES.get('length'); i<len; i++){
      var fixturesKey = ThothApp.Version.FIXTURES[i].key;
      var version;
      version = ThothApp.store.createRecord(ThothApp.Version, {
        //"key":             fixturesKey,
        "fixturesKey":     fixturesKey,
        "publisher":       ThothApp.Version.FIXTURES[i].publisher,
        "publicationDate": ThothApp.Version.FIXTURES[i].publicationDate,
        "format":          ThothApp.Version.FIXTURES[i].format,
        "pages":           ThothApp.Version.FIXTURES[i].pages,
        "language":        ThothApp.Version.FIXTURES[i].language,
        "rank":            ThothApp.Version.FIXTURES[i].rank,
        "height":          ThothApp.Version.FIXTURES[i].height,
        "width":           ThothApp.Version.FIXTURES[i].width,
        "depth":           ThothApp.Version.FIXTURES[i].depth,
        "isbn10":          ThothApp.Version.FIXTURES[i].isbn10,
        "isbn13":          ThothApp.Version.FIXTURES[i].isbn13
      });

      // this.generateCheckVersionsFunction is provided to create the function that
      // checks for READY_CLEAN for all versions for a given book. When all such 
      // versions are READY_CLEAN, in turn, createBook(), the last step in 
      // the data creation scheme, is fired.
      version.addFiniteObserver('status',this,this.generateCheckVersionsFunction(version),this);
    }
    ThothApp.store.commitRecords();
  },

  _tmpRecordCount: 0

});
        
