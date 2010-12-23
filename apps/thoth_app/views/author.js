// ==========================================================================
// Project:   ThothApp.AuthorView
// ==========================================================================
/*globals ThothApp Forms */

/** @class

        (Document Your View Here)

 @extends SC.View
 */

//SC.Animatable.defaultTimingFunction = SC.Animatable.TRANSITION_EASE_IN_OUT;

ThothApp.AuthorView = SC.View.extend(SC.Animatable,
  /** @scope ThothApp.AuthorView.prototype */ {
  layout: {left:0, right:0},
  classNames: ["author-view"],
  childViews: "booksView versionsView authorForm bookTitleForm versionView reviewsView".w(),
  backgroundColor: "white",
  contentBindingDefault: SC.Binding.single(),

  transitions: {
    opacity: {
      duration: 0.25,
      timing: SC.Animatable.TRANSITION_EASE_IN_OUT,
      action: function(){
        if (this.style.opacity === 0) this._call_when_done();
      }
    }
  },

  layoutDidChangeFor: function(what) {
    sc_super();
    if (this.get("versionView") && !this.get("versionView").isClass) {
      this.adjust("minHeight", this.getPath("versionView.layout").minHeight + 40);
    }
  },

  booksView: SC.View.design({
    layout: { left: 0, top: 0, width: 400, height: 200 },
    classNames: ["books-view"],
    childViews: "bookList toolbar".w(),

    bookList: SC.ScrollView.design({
      classNames: ["books-list"],
      layout: { left:0, right:0, top:0, bottom:32},
      borderStyle: SC.BORDER_NONE,

      contentView: SC.ListView.design({
        contentBinding: "ThothApp.booksController.arrangedObjects",
        selectionBinding: "ThothApp.booksController.selection",
        contentValueKey: "title",

        delegate: ThothApp.bookController,
        canReorderContent: YES,
        canDeleteContent: YES,
        rowHeight: 22,

        exampleView: SC.View.design({
          childViews: "label".w(),
          classNames: ["book-item"],

          label: SC.LabelView.design({
            escapeHTML: NO,
            layout: {left:5, right:5, height:18,centerY:0},
            contentBinding: ".parentView.content",
            contentValueKey: "title",
            inlineEditorDidEndEditing: function(){
              sc_super();
              ThothApp.store.commitRecords();
            }
          }),

          isSelected: NO,
          isSelectedDidChange: function() {
            this.displayDidChange();
          }.observes("isSelected"),

          render: function(context) {
            sc_super();

            // even/odd
            if (this.contentIndex % 2 === 0) {
              context.addClass("even");
            } else {
              context.addClass("odd");
            }

            // is selected
            if (this.get("isSelected")) {
              context.addClass("list-selection").addClass("hback").addClass("selected");
            }
          }
        })
      })
    }), // bookList

    toolbar: SC.ToolbarView.design({
      classNames: "hback toolbar-in-view".w(),
      layout: { left: 0, bottom: 0, right: 0, height: 32 },
      childViews: "add del".w(),

      add: SC.ButtonView.design({
        layout: { left: 0, top: 0, bottom: 0, width:32 },
        target: "ThothApp.statechart",
        action: "addBook",
        icon: "icons plus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons plus-active button-icon" : "icons plus button-icon"));
        }.observes("isActive")
      }),

      del: SC.ButtonView.design({
        layout: { left: 32, top: 0, bottom: 0, width:32 },
        target: "ThothApp.statechart",
        action: "deleteBook",
        icon: "icons minus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons minus-active button-icon" : "icons minus button-icon"));
        }.observes("isActive")
      })
    }) // toolbar

  }), // booksView

  versionsView: SC.View.design({
    layout: { left: 401, top: 0, width: 100, height: 200 }, // 1 pixel over for a vertical divider
    classNames: ["versions-view"],
    childViews: "versionList toolbar".w(),

    versionList: SC.ScrollView.design({
      classNames: ["versions-list"],
      layout: { left:0, right:0, top:0, bottom:32},
      borderStyle: SC.BORDER_NONE,

      contentView: SC.ListView.design({
        contentBinding: 'ThothApp.versionsController.arrangedObjects',
        selectionBinding: 'ThothApp.versionsController.selection',
        contentValueKey: "format",

        delegate: ThothApp.versionController,
        canReorderContent: YES,
        canDeleteContent: YES,
        rowHeight: 22,

        exampleView: SC.View.design({
          childViews: "label".w(),
          classNames: ["version-item"],

          label: SC.LabelView.design({
            escapeHTML: NO,
            layout: {left:5, right:5, height:18,centerY:0},
            contentBinding: ".parentView.content",
            contentValueKey: "format",
            inlineEditorDidEndEditing: function(){
              sc_super();
              ThothApp.store.commitRecords();
            }
          }),

          isSelected: NO,
          isSelectedDidChange: function() {
            this.displayDidChange();
          }.observes("isSelected"),

          render: function(context) {
            sc_super();

            // even/odd
            if (this.contentIndex % 2 === 0) {
              context.addClass("even");
            } else {
              context.addClass("odd");
            }

            // is selected
            if (this.get("isSelected")) {
              context.addClass("list-selection").addClass("hback").addClass("selected");
            }
          }
        })
      })
    }), // versionList

    toolbar: SC.ToolbarView.design({
      classNames: "hback toolbar-in-view".w(),
      layout: { left: 0, bottom: 0, right: 0, height: 32 },
      childViews: "add del".w(),

      add: SC.ButtonView.design({
        layout: { left: 0, top: 0, bottom: 0, width:32 },
        target: "ThothApp.statechart",
        action: "addVersion",
        icon: "icons plus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons plus-active button-icon" : "icons plus button-icon"));
        }.observes("isActive")
      }),

      del: SC.ButtonView.design({
        layout: { left: 0, top: 0, bottom: 0, width:32 },
        target: "ThothApp.statechart",
        action: "deleteVersion",
        icon: "icons minus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons minus-active button-icon" : "icons minus button-icon"));
        }.observes("isActive")
      })
    }) // toolbar

  }), // versionsView

  authorForm:  SC.FormView.design({
    layout: { left: 0, top: 210, width: 500, height: 30 },
    contentBinding: "ThothApp.authorController",
    childViews: 'fullName'.w(),

    fullName: SC.FormView.row("Author", SC.TextFieldView.design({
      layout: { left: 0, width: 250, height: 21, centerY: 0 },
      hint: 'First Last'
      //value: "Last Name"
      //isSpacer: YES,
      //autoHide: YES
    }))
  }),

  bookTitleForm: SC.FormView.design({
    layout: { left: 0, top: 240, width: 500, height: 30 },
    contentBinding: "ThothApp.bookController",
    childViews: 'title'.w(),

    title: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 250, height: 21, centerY: 0 },
      hint: 'Title of Book'
      //value: "Title"
      //isSpacer: YES,
      //autoHide: YES
    }))
  }),

  versionView: SC.FormView.design({
    layout: { left: 0, top: 270, width: 500 },
    formFlowSpacing: { left: 2, top: 2, bottom: 2, right: 2 },
    contentBinding: ".parentView.content",
    childViews: "publisher publicationDate format language rank height width depth isbn10 isbn13".w(),

//    publisherHeader: SC.LabelView.design({
//      layout: { width: 200, height: 21 },
//      value: "Publisher"
//    }),

    publisher: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "Bantam, etc."
      //value: "Publisher"
      //isSpacer: YES,
      //autoHide: YES
    })),

    publicationDate: SC.FormView.row(SC.DateFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      formatDate: '%Y %m %d',
      hint: "yyyy m d"
      //value: "Date"
      //isSpacer: YES,
      //autoHide: YES
    })),

//    detailsHeader: SC.LabelView.design({
//      layout: { width: 200, height: 21 },
//      //classNames: "header".w(),
//      value: "Details for this version"
//    }),

    format: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "Paperback, DVD, etc."
      //value: "Format"
      //isSpacer: YES,
      //autoHide: YES
    })),

    pages: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "Integer value"
      //value: "Pages"
      //isSpacer: YES,
      //autoHide: YES
    })),

    language: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "For book text"
      //value: "Language"
      //isSpacer: YES,
      //autoHide: YES
    })),

//    spacer1: SC.View.design({
//      layout: { left: 0, width: 150, height: 14, centerY: 0},
//      value: "",
//      flowSize: { widthPercentage: 1 }
//    }),

    rank: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "Integer value"
      //value: "Rank"
      //isSpacer: YES,
      //autoHide: YES
    })),

    height: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "In inches"
      //value: "Height"
      //isSpacer: YES,
      //autoHide: YES
    })),

    width: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "In inches"
      //value: "Width"
      //isSpacer: YES,
      //autoHide: YES
    })),

    depth: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "In inches"
      //value: "Depth"
      //isSpacer: YES,
      //autoHide: YES
    })),

//    spacer2: SC.View.design({
//      layout: { left: 0, width: 150, height: 14, centerY: 0},
//      value: "",
//      flowSize: { widthPercentage: 1 }
//    }),

    isbn10: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "10 character ISBN"
      //value: "ISBN (10)"
      //isSpacer: YES,
      //autoHide: YES
    })),

    isbn13: SC.FormView.row(SC.TextFieldView.design({
      layout: { left: 0, width: 150, height: 21, centerY: 0},
      hint: "13 character ISBN"
      //value: "ISBN (13)"
      //isSpacer: YES,
      //autoHide: YES
    }))

  }),

  reviewsView: SC.View.design({
    layout: { left: 0, bottom: 0, width: 500, height: 140 },
    classNames: ["reviews-view"],
    childViews: "reviewList toolbar".w(),

    reviewList: SC.ScrollView.design({
      classNames: ["reviews-list"],
      layout: { left:0, right:0, top:0, bottom:32},
      borderStyle: SC.BORDER_NONE,

      contentView: SC.ListView.design({
        contentBinding: "ThothApp.reviewsController.arrangedObjects",
        selectionBinding: "ThothApp.reviewsController.selection",
        contentValueKey: "text",

        delegate: ThothApp.reviewController,
        canReorderContent: YES,
        canDeleteContent: YES,
        rowHeight: 22,

        exampleView: SC.View.design({
          childViews: "label".w(),
          classNames: ["review-item"],

          label: SC.LabelView.design({
            escapeHTML: NO,
            layout: {left:5, right:5, height:18,centerY:0},
            contentBinding: ".parentView.content",
            contentValueKey: "text",
            inlineEditorDidEndEditing: function(){
              sc_super();
              ThothApp.store.commitRecords();
            }
          }),

          isSelected: NO,
          isSelectedDidChange: function() {
            this.displayDidChange();
          }.observes("isSelected"),

          render: function(context) {
            sc_super();

            // even/odd
            if (this.contentIndex % 2 === 0) {
              context.addClass("even");
            } else {
              context.addClass("odd");
            }

            // is selected
            if (this.get("isSelected")) {
              context.addClass("list-selection").addClass("hback").addClass("selected");
            }
          }
        })
      })
    }), // reviewList

    toolbar: SC.ToolbarView.design({
      classNames: "hback toolbar-in-view".w(),
      layout: { left: 0, bottom: 0, right: 0, height: 32 },
      childViews: "add del".w(),

      add: SC.ButtonView.design({
        layout: { left: 0, top: 0, bottom: 0, width:32 },
        target: "ThothApp.statechart",
        action: "addReview",
        icon: "icons plus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons plus-active button-icon" : "icons plus button-icon"));
        }.observes("isActive")
      }),

      del: SC.ButtonView.design({
        layout: { left: 32, top: 0, bottom: 0, width:32 },
        target: "ThothApp.statechart",
        action: "deleteReview",
        icon: "icons minus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons minus-active button-icon" : "icons minus button-icon"));
        }.observes("isActive")
      })
    }) // toolbar

  }), // reviewsView

  /* This stuff goes at the end because it is entirely to test animation. So there. */
  append: function() {
    this.disableAnimation();
    this.adjust("opacity", 1).updateLayout();
    this.enableAnimation();
    sc_super();
  },

  remove: function() {
    this._call_when_done = arguments.callee.base;
    this.adjust("opacity", 0);
  },

  index: 0
});

