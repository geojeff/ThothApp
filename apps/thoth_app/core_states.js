// ==========================================================================
// ThothApp.statechart
// ==========================================================================
/*globals ThothApp*/

/**
   @author Jeff Pittman
*/

ThothApp.statechart = SC.Statechart.create({
  rootState: SC.State.design({
    initialSubstate: "STARTING",
    //trace: YES,
    //substatesAreConcurrent: YES,

    // ----------------------------------------
    //    state: STARTING
    // ----------------------------------------
    STARTING: SC.State.design({

      enterState: function() {
        ThothApp.reviewsController.initializeForLoading();
        ThothApp.versionsController.initializeForLoading();
        ThothApp.booksController.initializeForLoading();
        ThothApp.authorsController.initializeForLoading();

        var panel = ThothApp.getPath('loginPanel');
        if (panel) {
          panel.append();
          panel.focus();
        }
      },

      exitState: function() {
        var panel = ThothApp.getPath('loginPanel');
        if (panel) {
          panel.remove();
        }
      },

      authenticate: function() {
        this.gotoState('AUTHENTICATING');
      }
    }),

    // ----------------------------------------
    //    state: AUTHENTICATING
    // ----------------------------------------
    AUTHENTICATING: SC.State.design({
      enterState: function() {
        // Call auth on the data source, which has callbacks to send events to the "authResult" functions here.
        return SC.Async.perform('logIn');
      },

      exitState: function() {
      },

      logIn: function() {
        var loginName = ThothApp.loginController.get('loginName');
        var password = ThothApp.loginController.get('password');

        ThothApp.store.dataSource.connect(ThothApp.store, function() {
          ThothApp.store.dataSource.authRequest(loginName, password);
        });
      },

      authFailure: function(errorMessage) {
        ThothApp.loginController.set('loginErrorMessage', errorMessage);
        this.resumeGotoState();
        this.gotoState('REJECTED');
      },

      authSuccess: function() {
        this.resumeGotoState();
        this.gotoState('AUTHENTICATED');
      }
    }),

    // ----------------------------------------
    //    state: REJECTED
    // ----------------------------------------
    REJECTED: SC.State.design({
      enterState: function() {
      },

      exitState: function() {
        this.gotoState('AUTHENTICATING');
      }
    }),

    // ----------------------------------------
    //    state: AUTHENTICATED
    // ----------------------------------------
    AUTHENTICATED: SC.State.design({
      enterState: function() {
        ThothApp.getPath('authenticatedPane').append();
      },

      exitState: function() {
        ThothApp.getPath('authenticatedPane').remove();
      },

      loadReviews: function() {
        this.gotoState('LOADING_REVIEWS');
      }
    }),

    // ----------------------------------------
    //    state: LOADING_REVIEWS
    // ----------------------------------------
    LOADING_REVIEWS: SC.State.design({
      _tmpRecordCount: 0,

      enterState: function() {
        return this.performAsync('loadReviews');
      },

      exitState: function() {
      },

      reviewsDidLoad: function() {
        this.resumeGotoState();
        this.gotoState('REVIEWS_LOADED');
      },

      generateCheckReviewsFunction: function(review) {
        var me = this;
        return function(val) {
          if (val & SC.Record.READY_CLEAN) {
            me._tmpRecordCount--;
            console.log(SC.inspect(val));
            ThothApp.reviewsController.recordWasLoaded(review.get('fixturesKey'));
            if (me._tmpRecordCount === 0) {
              delete me._tmpRecordCount;

              this.reviewsDidLoad();
            }
            return YES;
          }
          else return NO;
        };
      },

      loadReviews: function() {
        var len =  ThothApp.Review.FIXTURES.get('length');
        this._tmpRecordCount = len;

        for (var i=0; i<len; i++) {
          var review;
          review = ThothApp.store.createRecord(ThothApp.Review, {
            "fixturesKey":  ThothApp.Review.FIXTURES[i].key,
            "text":         ThothApp.Review.FIXTURES[i].text,
            "position":     ThothApp.Review.FIXTURES[i].position
          });

          review.addFiniteObserver('status', this, this.generateCheckReviewsFunction(review), this);
        }

        ThothApp.store.commitRecords();
      }

    }),

    // ----------------------------------------
    //    state: REVIEWS_LOADED
    // ----------------------------------------
    REVIEWS_LOADED: SC.State.design({
      enterState: function() {
        console.log('REVIEWS_LOADED');
        ThothApp.getPath('reviewsLoadedPane').append();
      },

      exitState: function() {
        ThothApp.getPath('reviewsLoadedPane').remove();
      },

      loadVersions: function() {
        this.gotoState('LOADING_VERSIONS');
      }
    }),

    // ----------------------------------------
    //    state: LOADING_VERSIONS
    // ----------------------------------------
    LOADING_VERSIONS: SC.State.design({
      _tmpRecordCount: 0,
      
      enterState: function() {
        return this.performAsync('loadVersions');
      },

      exitState: function() {
      },

      versionsDidLoad: function() {
        this.resumeGotoState();
        this.gotoState('VERSIONS_LOADED');
      },

      // This is a closure, that will create an unnamed function, for checking
      // for completion of versions records. The generator function has version
      // as a passed-in argument, in scope for the generated function. The
      // 'var me = this;' line sets me so that there is also a reference to the
      // controller within the generated function.
      generateCheckVersionsFunction: function(version) {
        var me = this;
        return function(val) {
          if (val & SC.Record.READY_CLEAN) {
            me._tmpRecordCount--;
            ThothApp.versionsController.recordWasLoaded(version.get('fixturesKey'));
            if (me._tmpRecordCount === 0) {
              delete me._tmpRecordCount;

              var versionRecords = ThothApp.store.find(ThothApp.Version);
              versionRecords.forEach(function(versionRecord) {
                //console.log(SC.inspect(versionRecord));
                var fixturesKey = versionRecord.readAttribute('fixturesKey');

                var reviewRecords = ThothApp.store.find(SC.Query.local(ThothApp.Review, {
                  conditions: "fixturesKey ANY {id_fixtures_array}",
                  parameters: { id_fixtures_array: ThothApp.Version.FIXTURES[fixturesKey - 1].reviews  }
                }));

                versionRecord.get('reviews').pushObjects(reviewRecords);
              });

              ThothApp.store.commitRecords();

              this.versionsDidLoad();
            }
            return YES;
          }
          else return NO;
        };
      },

      loadVersions: function() {
        this._tmpRecordCount = ThothApp.Version.FIXTURES.get('length');

        for (var i = 0,len = ThothApp.Version.FIXTURES.get('length'); i < len; i++) {
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
            "isbn13":          ThothApp.Version.FIXTURES[i].isbn13,
            "position":        ThothApp.Version.FIXTURES[i].position
          });

          // this.generateCheckVersionsFunction is provided to create the function that
          // checks for READY_CLEAN for all versions for a given book. When all such
          // versions are READY_CLEAN, in turn, createBook(), the last step in
          // the data creation scheme, is fired.
          version.addFiniteObserver('status', this, this.generateCheckVersionsFunction(version), this);
        }
        ThothApp.store.commitRecords();
      }

    }),

    // -------------------------------------------
    //    state: SHOWING_GRAPHIC
    // -------------------------------------------
    SHOWING_GRAPHIC: SC.State.design({
      enterState: function() {
        console.log('SHOWING_GRAPHIC');
        ThothApp.allItemsController.set();
        ThothApp.getPath('graphicPane').append();
      },

      exitState: function() {
        ThothApp.getPath('graphicPane').remove();
      },

      dismiss: function() {
        this.gotoState('APP_READY');
      }
    }),

    // ----------------------------------------
    //    state: VERSIONS_LOADED
    // ----------------------------------------
    VERSIONS_LOADED: SC.State.design({
      initialSubstate: "PRESENTING_REPORT",

      PRESENTING_REPORT: SC.State.design({
        enterState: function() {
          console.log('VERSIONS_LOADED');
          ThothApp.getPath('versionsLoadedPane').append();
        },

        exitState: function() {
          ThothApp.getPath('versionsLoadedPane').remove();
        },

        loadBooks: function() {
          this.gotoState('LOADING_BOOKS');
        }

      })
    }),

    // ----------------------------------------
    //    state: LOADING_BOOKS
    // ----------------------------------------
    LOADING_BOOKS: SC.State.design({
      _tmpRecordCount: 0,

      enterState: function() {
        return this.performAsync('loadBooks');
      },

      exitState: function() {
      },

      booksDidLoad: function() {
        this.resumeGotoState();
        this.gotoState('BOOKS_LOADED');
      },

      generateCheckBooksFunction: function(book){
        var me = this;
        return function(val){
          if (val & SC.Record.READY_CLEAN){
            me._tmpRecordCount--;
            ThothApp.booksController.recordWasLoaded(book.get('fixturesKey'));
            if (me._tmpRecordCount === 0){
              delete me._tmpRecordCount;

              var bookRecords = ThothApp.store.find(ThothApp.Book);
              bookRecords.forEach(function(bookRecord) {
                var fixturesKey = bookRecord.readAttribute('fixturesKey');

                var versionRecords = ThothApp.store.find(SC.Query.local(ThothApp.Version, {
                  conditions: "fixturesKey ANY {id_fixtures_array}",
                  parameters: {id_fixtures_array: ThothApp.Book.FIXTURES[fixturesKey-1].versions }}
                ));

                bookRecord.get('versions').pushObjects(versionRecords);
              });

              ThothApp.store.commitRecords();

              this.booksDidLoad();
            }
            return YES;
          }
          else return NO;
        };
      },

      loadBooks: function(){
        this._tmpRecordCount = ThothApp.Book.FIXTURES.get('length');

        for (var i=0,len=ThothApp.Book.FIXTURES.get('length'); i<len; i++){
          var book;
          book = ThothApp.store.createRecord(ThothApp.Book, {
            "fixturesKey": ThothApp.Book.FIXTURES[i].key,
            "title":       ThothApp.Book.FIXTURES[i].title,
            "position":    ThothApp.Book.FIXTURES[i].position
          });

          // The book record has been created, and its versions and the reviews of those versions.
          // Once the book records come back READY_CLEAN, create authors in the final step.
          book.addFiniteObserver('status',this,this.generateCheckBooksFunction(book),this);
        }
        ThothApp.store.commitRecords();
      }
    }),

    // ----------------------------------------
    //    state: BOOKS_LOADED
    // ----------------------------------------
    BOOKS_LOADED: SC.State.design({
      enterState: function() {
        console.log('BOOKS_LOADED');
        ThothApp.getPath('booksLoadedPane').append();
      },

      exitState: function() {
        ThothApp.getPath('booksLoadedPane').remove();
      },

      loadAuthors: function() {
        this.gotoState('LOADING_AUTHORS');
      }
    }),

    // ----------------------------------------
    //    state: LOADING_AUTHORS
    // ----------------------------------------
    LOADING_AUTHORS: SC.State.design({
      _tmpRecordCount: 0,

      enterState: function() {
        return this.performAsync('loadAuthors');
      },

      exitState: function() {
      },

      authorsDidLoad: function() {
        this.resumeGotoState();
        this.gotoState('AUTHORS_LOADED');
      },

      generateCheckAuthorsFunction: function(author){
        var me = this;
        return function(val){
          if (val & SC.Record.READY_CLEAN){
            me._tmpRecordCount--;
            ThothApp.authorsController.recordWasLoaded(author.get('fixturesKey'));
            if (me._tmpRecordCount === 0){
              delete me._tmpRecordCount;

              var authorRecords = ThothApp.store.find(ThothApp.Author);
              authorRecords.forEach(function(authorRecord) {
                var fixturesKey = authorRecord.readAttribute('fixturesKey');

                var bookRecords = ThothApp.store.find(SC.Query.local(ThothApp.Book, {
                  conditions: "fixturesKey ANY {id_fixtures_array}",
                  parameters: {id_fixtures_array: ThothApp.Author.FIXTURES[fixturesKey-1].books }}
                ));

                authorRecord.get('books').pushObjects(bookRecords);
              });

              ThothApp.store.commitRecords();

              this.authorsDidLoad();
            }
            return YES;
          }
          else return NO;
        };
      },

      loadAuthors: function(){
        this._tmpRecordCount = ThothApp.Author.FIXTURES.get('length');
        for (var i=0,len=ThothApp.Author.FIXTURES.get('length'); i<len; i++){
          var author;
          author = ThothApp.store.createRecord(ThothApp.Author, {
            //"key":         ThothApp.Author.FIXTURES[i].key,
            "fixturesKey": ThothApp.Author.FIXTURES[i].key,
            "firstName":   ThothApp.Author.FIXTURES[i].firstName,
            "lastName":    ThothApp.Author.FIXTURES[i].lastName,
            "position":    ThothApp.Author.FIXTURES[i].position
          });
          author.addFiniteObserver('status',this,this.generateCheckAuthorsFunction(author),this);
        }
        ThothApp.store.commitRecords();
      }

    }),

    // ----------------------------------------
    //    state: AUTHORS_LOADED (=== DATA_LOADED)
    // ----------------------------------------
    AUTHORS_LOADED: SC.State.design({
      enterState: function() {
        console.log('AUTHORS_LOADED');
        ThothApp.getPath('authorsLoadedPane').append();
      },

      exitState: function() {
        ThothApp.getPath('authorsLoadedPane').remove();
      },

      loadApp: function() {
        this.gotoState('LOADING_APP');
      }
    }),

    // ----------------------------------------
    //    state: LOADING_APP
    // ----------------------------------------
    LOADING_APP: SC.State.design({
      enterState: function() {
        console.log('LOADING_APP');
        var authors = ThothApp.store.find(SC.Query.local(ThothApp.Author));
        var i, lenBookIds,
            j, lenVersionIds,
            k, lenReviewIds,
            book, version, review,
            bookIds, versionIds, reviewIds,
            books = SC.Set.create(),
            versions = SC.Set.create(),
            reviews = SC.Set.create(),
            allAssociated = SC.Set.create();

        if (!SC.none(authors) && authors.get('length') > 0) {
          authors.forEach(function(author) {
            allAssociated.add(author);

            bookIds = author.readAttribute("books");
            if (!SC.none(bookIds)) {
              for (i = 0,lenBookIds = bookIds.get('length'); i < lenBookIds; i++) {
                book = ThothApp.store.find(ThothApp.Book, bookIds[i]);
                if (!SC.none(book)) {
                  books.add(book);
                  allAssociated.add(book);
                }

                versionIds = book.readAttribute("versions");
                if (!SC.none(versionIds)) {
                  for (j = 0,lenVersionIds = versionIds.get('length'); j < lenVersionIds; j++) {
                    version = ThothApp.store.find(ThothApp.Version, versionIds[j]);
                    if (!SC.none(version)) {
                      versions.add(version);
                      allAssociated.add(version);
                    }

                    reviewIds = version.get("reviews");
                    if (!SC.none(reviewIds)) {
                      for (k = 0,lenReviewIds = reviewIds.get('length'); k < lenReviewIds; k++) {
                        review = ThothApp.store.find(ThothApp.Review, reviewIds[k]);
                        if (!SC.none(review)) {
                          reviews.add(review);
                          allAssociated.add(review);
                        }
                      }
                    }
                  }
                }
              }
            }
          });
          ThothApp.authorsController.set('content', authors);
          ThothApp.authorsController.selectFirst();

          if (!SC.none(bookIds)) {
            ThothApp.booksController.set("content", books.toArray());
            ThothApp.booksController.selectFirst();

            if (!SC.none(versionIds)) {
              console.log('we have versions ... ', versions.get('length'));
              ThothApp.versionsController.set("content", versions.toArray());
              ThothApp.versionsController.selectFirst();

              if (!SC.none(reviewIds)) {
                ThothApp.reviewsController.set("content", reviews.toArray());
                ThothApp.reviewsController.selectFirst();
              }
            }
          }
        }

        //ThothApp.allController.set("content", allAssociated.toArray());


        //var books = ThothApp.store.find(SC.Query.local(ThothApp.Book));
        //var versions = ThothApp.store.find(SC.Query.local(ThothApp.Version));
        //var reviews = ThothApp.store.find(SC.Query.local(ThothApp.Review));
        //var versions = ThothApp.store.find(ThothApp.Version);
        //var reviews = ThothApp.store.find(ThothApp.Review);

        //ThothApp.booksController.set('content', books);
        //ThothApp.versionsController.set('content', versions);
        //ThothApp.reviewsController.set('content', reviews);

        ThothApp.getPath('mainPage.mainPanel').append();

        this.gotoState('APP_LOADED');
      },

      exitState: function() {
      }
    }),

    // ----------------------------------------
    //    state: APP_LOADED
    // ----------------------------------------
    APP_LOADED: SC.State.design({
      enterState: function() {
      },

      showGraphic: function() {
        this.gotoState('SHOWING_GRAPHIC');
      },

      exitState: function() {
      },

      dismiss: function() {
        this.gotoState('APP_READY');
      }
    }),

    // ----------------------------------------
    //    state: APP_READY
    // ----------------------------------------
    APP_READY: SC.State.design({
      enterState: function() {
      },

      exitState: function() {
      },

      showGraphic: function() {
        this.gotoState('SHOWING_GRAPHIC');
      },

      dismiss: function() {
        this.gotoState('APP_READY');
      }
    })
  })
});

