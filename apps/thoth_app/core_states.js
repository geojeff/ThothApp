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
        ThothApp.getPath('loadReviewsPane').append();
      },

      exitState: function() {
        ThothApp.getPath('loadReviewsPane').remove();
      },

      loadReviews: function() {
        this.gotoState('LOADING_REVIEWS');
      }
    }),

    // ----------------------------------------
    //    state: LOADING_REVIEWS
    // ----------------------------------------
    LOADING_REVIEWS: SC.State.design({
      enterState: function() {
        return this.performAsync('callLoadReviews');
      },

      exitState: function() {
      },

      callLoadReviews: function() {
        ThothApp.reviewsController.loadReviews();
      },

      reviewsDidLoad: function() {
        this.resumeGotoState();
        this.gotoState('REVIEWS_LOADED');
      }
    }),

    // ----------------------------------------
    //    state: REVIEWS_LOADED
    // ----------------------------------------
    REVIEWS_LOADED: SC.State.design({
      enterState: function() {
        console.log('REVIEWS_LOADED');
        ThothApp.getPath('loadVersionsPane').append();
      },

      exitState: function() {
        ThothApp.getPath('loadVersionsPane').remove();
      },

      loadVersions: function() {
        this.gotoState('LOADING_VERSIONS');
      }
    }),

    // ----------------------------------------
    //    state: LOADING_VERSIONS
    // ----------------------------------------
    LOADING_VERSIONS: SC.State.design({
      enterState: function() {
        return this.performAsync('callLoadVersions');
      },

      exitState: function() {
      },

      callLoadVersions: function() {
        ThothApp.versionsController.loadVersions();
      },

      versionsDidLoad: function() {

        this.resumeGotoState();
        this.gotoState('VERSIONS_LOADED');
      }
    }),

    // ----------------------------------------
    //    state: VERSIONS_LOADED
    // ----------------------------------------
    VERSIONS_LOADED: SC.State.design({
      enterState: function() {
        console.log('VERSIONS_LOADED');
        ThothApp.getPath('loadBooksPane').append();
      },

      exitState: function() {
        ThothApp.getPath('loadBooksPane').remove();
      },

      loadBooks: function() {
        this.gotoState('LOADING_BOOKS');
      }
    }),

    // ----------------------------------------
    //    state: LOADING_BOOKS
    // ----------------------------------------
    LOADING_BOOKS: SC.State.design({
      enterState: function() {
        return this.performAsync('callLoadBooks');
      },

      exitState: function() {
      },

      callLoadBooks: function() {
        ThothApp.booksController.loadBooks();
      },

      booksDidLoad: function() {
        this.resumeGotoState();
        this.gotoState('BOOKS_LOADED');
      }
    }),

    // ----------------------------------------
    //    state: BOOKS_LOADED
    // ----------------------------------------
    BOOKS_LOADED: SC.State.design({
      enterState: function() {
        console.log('BOOKS_LOADED');
        ThothApp.getPath('loadAuthorsPane').append();
      },

      exitState: function() {
        ThothApp.getPath('loadAuthorsPane').remove();
      },

      loadAuthors: function() {
        this.gotoState('LOADING_AUTHORS');
      }
    }),

    // ----------------------------------------
    //    state: LOADING_AUTHORS
    // ----------------------------------------
    LOADING_AUTHORS: SC.State.design({
      enterState: function() {
        return this.performAsync('callLoadAuthors');
      },

      exitState: function() {
      },

      callLoadAuthors: function() {
        ThothApp.authorsController.loadAuthors();
      },

      authorsDidLoad: function() {
        this.resumeGotoState();
        this.gotoState('AUTHORS_LOADED');
      }
    }),

    // ----------------------------------------
    //    state: AUTHORS_LOADED (=== DATA_LOADED)
    // ----------------------------------------
    AUTHORS_LOADED: SC.State.design({
      enterState: function() {
        console.log('AUTHORS_LOADED');
        var authors = ThothApp.store.find(SC.Query.local(ThothApp.Author));
        var books = ThothApp.store.find(SC.Query.local(ThothApp.Book));
        //var versions = ThothApp.store.find(ThothApp.Version);
        //var reviews = ThothApp.store.find(ThothApp.Review);

        ThothApp.authorsController.set('all', books);
        ThothApp.authorsController.set('content', authors);
        //ThothApp.booksController.set('content', books);
        //ThothApp.versionsController.set('content', versions);
        //ThothApp.reviewsController.set('content', reviews);

        ThothApp.getPath('mainPage.mainPanel').append();
      },

      exitState: function() {
      }
    })
  })
});

