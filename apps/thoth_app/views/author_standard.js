// ==========================================================================
// Project:   ThothApp.AuthorStandardView
// ==========================================================================
/*globals ThothApp Forms */

/** @class

        (Document Your View Here)

 @extends SC.View
 */

//SC.Animatable.defaultTimingFunction = SC.Animatable.TRANSITION_EASE_IN_OUT;

ThothApp.AuthorStandardView = SC.View.extend(SC.Animatable,
  /** @scope ThothApp.AuthorStandardView.prototype */ {
  layout: {left:0, right:0},
  classNames: ["author-view"],
  childViews: "booksView versionsView versionView reviewsView".w(),
  backgroundColor: "white",
  contentBindingDefault: SC.Binding.single(),
  defaultResponder: "ThothApp.statechart",

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
      classNames: "hback toolbar".w(),
      layout: { left: 0, bottom: 0, right: 0, height: 32 },
      childViews: "add del".w(),

      add: SC.ButtonView.design({
        layout: { left: 0, top: 0, bottom: 0, width:32 },
        action: "addBook",
        icon: "icons plus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons plus-active button-icon" : "icons plus button-icon"));
        }.observes("isActive")
      }),

      del: SC.ButtonView.design({
        layout: { left: 34, top: 0, bottom: 0, width:32 },
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
      classNames: "hback toolbar".w(),
      layout: { left: 0, bottom: 0, right: 0, height: 32 },
      childViews: "add del".w(),

      add: SC.ButtonView.design({
        layout: { left: 0, top: 0, bottom: 0, width:32 },
        action: "addVersion",
        icon: "icons plus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons plus-active button-icon" : "icons plus button-icon"));
        }.observes("isActive")
      }),

      del: SC.ButtonView.design({
        layout: { left: 34, top: 0, bottom: 0, width:32 },
        action: "deleteVersion",
        icon: "icons minus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons minus-active button-icon" : "icons minus button-icon"));
        }.observes("isActive")
      })
    }) // toolbar

  }), // versionsView

  versionView: SC.View.design({
    layout: { left: 0, top: 280, width: 500, height: 500 },
    contentBinding: "ThothApp.versionController.content",
    childViews: "publisher publicationDate format image pages language rank height width depth isbn10 isbn13".w(),

    publisher: SC.View.design({
      layout: { left: 17, right: 14, top: 0, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Publisher:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },
        hint: 'Bantam, etc.',

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.publisher'
      })
    }),

    publicationDate: SC.View.design({
      layout: { left: 17, right: 14, top: 30, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Publication Date:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.DateFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },
        formatDate: '%Y %m %d',
        hint: "yyyy m d",

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.publicationDate'
      })
    }),

    format: SC.View.design({
      layout: { left: 17, right: 14, top: 60, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Format:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },
        hint: "Paperback, DVD, etc.",

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.format'
      })
    }),

    image: SC.View.design({
      layout: { left: 17, right: 14, top: 90, height: 150 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Image:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.LabelView.design(SCUI.SimpleButton, {
        layout: { width: 200, height: 150, right: 3, centerY: 0 },
        //icon: static_url('images/default_book.png'),
        hasHover: YES,
        action: 'showImageUploadPane',

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        iconBinding: 'ThothApp.versionController.imgURL'
      })
    }),

    pages: SC.View.design({
      layout: { left: 17, right: 14, top: 245, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Number of Pages:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.pages'
      })
    }),

    language: SC.View.design({
      layout: { left: 17, right: 14, top: 275, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Language:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.language'
      })
    }),

    rank: SC.View.design({
      layout: { left: 17, right: 14, top: 305, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Rank:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },
        hint: 'Amazon Rank Index',

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.rank'
      })
    }),

    height: SC.View.design({
      layout: { left: 17, right: 14, top: 335, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Height:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },
        hint: 'in inches',

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.height'
      })
    }),

    width: SC.View.design({
      layout: { left: 17, right: 14, top: 365, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Width:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },
        hint: 'in inches',

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.width'
      })
    }),

    depth: SC.View.design({
      layout: { left: 17, right: 14, top: 395, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: 'Depth:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },
        hint: 'in inches',

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.depth'
      })
    }),

    isbn10: SC.View.design({
      layout: { left: 17, right: 14, top: 425, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: '10 Character ISBN:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.isbn10'
      })
    }),

    isbn13: SC.View.design({
      layout: { left: 17, right: 14, top: 455, height: 26 },
      childViews: 'label field'.w(),

      label: SC.LabelView.design({
        layout: { left: 0, width: 107, height: 18, centerY: 0 },

        value: '13 Character ISBN:',
        textAlign: SC.ALIGN_RIGHT
      }),

      field: SC.TextFieldView.design({
        layout: { width: 200, height: 22, right: 3, centerY: 0 },

        isEnabledBinding: SC.Binding.from("ThothApp.versionController.isEditing")
                .bool()
                .transform(function(value, isForward) {
          return value;
        }),
        valueBinding: 'ThothApp.versionController.isbn13'
      })
    })

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
      classNames: "hback toolbar".w(),
      layout: { left: 0, bottom: 0, right: 0, height: 32 },
      childViews: "add del".w(),

      add: SC.ButtonView.design({
        layout: { left: 0, top: 0, bottom: 0, width:32 },
        action: "addReview",
        icon: "icons plus button-icon",
        titleMinWidth: 16,
        isActiveDidChange: function() {
          this.set("icon", (this.get("isActive") ? "icons plus-active button-icon" : "icons plus button-icon"));
        }.observes("isActive")
      }),

      del: SC.ButtonView.design({
        layout: { left: 34, top: 0, bottom: 0, width:32 },
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

