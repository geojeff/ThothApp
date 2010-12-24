// ==========================================================================
// Project:   ThothApp - mainPage
//            UI modified from Alex Iskander's Contacts app:
//                http://github.com/ialexi/Contacts
// ==========================================================================
/*globals ThothApp Forms Animation */
require("views/author");
require("views/graphic");

// This page describes the main user interface for your application.  
ThothApp.mainPage = SC.Page.design({

  // The main panel is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPanel: SC.MainPane.design({
    childViews: 'toolbar splitter'.w(),
    defaultResponder: "ThothApp.statechart",

    toolbar: SC.ToolbarView.design({
      classNames: ["hback", "toolbar"],
      layout: { left: 0, top: 0, right: 0, height: 32 },

      childViews: "appLogo countsLabel authorCount bookCount versionCount reviewCount".w(),

      appLogo: SC.View.design({
        layout: {left: 0, top: 0, right: 0, height: 32},

        render: function(context, firstTime){
          context = context.begin('div').addClass('logo').text('thoth app').end();
        }
      }),

      countsLabel: SC.LabelView.design({
        layout: { right: 180, width: 280, height: 20, centerY: 0 },
        value: "Loaded Authors, Books, Versions, Reviews:"
      }),

      authorCount: SC.LabelView.design({
        layout: { right: 130, width: 30, height: 20, centerY: 0 },
        valueBinding: "ThothApp.authorsController.loadedCount"
      }),

      bookCount: SC.LabelView.design({
        layout: { right: 90, width: 30, height: 20, centerY: 0 },
        valueBinding: "ThothApp.booksController.loadedCount"
      }),

      versionCount: SC.LabelView.design({
        layout: { right: 50, width: 30, height: 20, centerY: 0 },
        valueBinding: "ThothApp.versionsController.loadedCount"
      }),

      reviewCount: SC.LabelView.design({
        layout: { right: 10, width: 30, height: 20, centerY: 0 },
        valueBinding: "ThothApp.reviewsController.loadedCount"
      })

    }), // toolbar

    // splitter, with authors list on the left, and author view or graphic on the right
    splitter: SC.SplitView.design({
      layout: { left: 0, top: 32, right: 0, bottom: 0 },
      defaultThickness: 200,
      dividerThickness: 0,

      topLeftView: SC.View.design({
        backgroundColor: "#555",
        layout: { left: 0, top: 15, right: 0, bottom: 0 },
        childViews: "authorList toolbar".w(),
        classNames: "authors".w(),

        authorList: SC.ScrollView.design({
          backgroundColor: "lightgrey",
          layout: { left: 15, right: 0, top: 15, bottom: 32},
          borderStyle: SC.BORDER_NONE,
          hasHorizontalScroller: NO,
          contentView: SC.ListView.design({
            contentBinding: "ThothApp.authorsController.arrangedObjects",
            selectionBinding: "ThothApp.authorsController.selection",
            contentValueKey: "fullName",
            canEditContent: YES,
            canDeleteContent: YES,
            rowHeight:24,
            exampleView: SC.View.design({
              childViews: "label".w(),

              label: SC.LabelView.design({
                layout: {left:10, right:10, height:18,centerY:0},
                contentBinding: ".parentView.content",
                contentValueKey: "fullName",
                isEditable: YES,
                fontWeight: SC.FONT_WEIGHT_BOLD,
                inlineEditorDidEndEditing: function(){
                  sc_super();
                  ThothApp.store.commitRecords();
                }
              }),

              beginEditing: function(){ this.label.beginEditing(); },

              isSelected: NO,

              isSelectedDidChange: function() {
                this.displayDidChange();
              }.observes("isSelected"),

              render: function(context) {
                sc_super();
                if (this.contentIndex % 2 === 0) {
                  context.addClass("even");
                } else {
                  context.addClass("odd");
                }
                if (this.get("isSelected")) {
                  context.addClass("hback").addClass("list-big-selection").addClass("selected");
                }
              }
            })
          })
        }), // authorList

        toolbar: SC.ToolbarView.design({
          classNames: "hback toolbar".w(),
          layout: { left: 15, bottom: 15, right: 0, height: 32 },
          childViews: "add del showGraphic".w(),

          add: SC.ButtonView.design({
            layout: { left: 0, top: 0, bottom: 0, width:32 },
            action: "addAuthor",
            icon: "icons plus button-icon",
            titleMinWidth: 16,
            isActiveDidChange: function() {
              this.set("icon", (this.get("isActive") ? "icons plus-active button-icon" : "icons plus button-icon"));
            }.observes("isActive")
          }),

          del: SC.ButtonView.design({
            layout: { left: 34, top: 0, bottom: 0, width:32 },
            action: "deleteAuthor",
            icon: "icons minus button-icon",
            titleMinWidth: 16,
            isActiveDidChange: function() {
              this.set("icon", (this.get("isActive") ? "icons minus-active button-icon" : "icons minus button-icon"));
            }.observes("isActive")
          }),

          showGraphic: SC.ButtonView.design({
            layout: { left: 68, right: 0, top: 0, bottom: 0 },
            titleMinWidth: 16,
            action: "showGraphicPane",
            title: "Show Graphic"
          })

        }) // toolbar
      }), // topLeftView

      // book view
      bottomRightView: SC.View.design({
        backgroundColor: "#555",
        childViews: 'noAuthorView authorView'.w(),

        noAuthorView: SC.LabelView.design({
          layout: { centerX: 0, centerY: 0, height: 18, width: 200 },
          value: "No author selected..."
        }),

        authorView: SC.ScrollView.design(SC.Animatable, {
          style: {
            opacity: 0,
            display: "none"
          },
          transitions: {
            opacity: 0.15,
            display: 0.5
          },

          classNames: ["book-panel"],
          layout: { left: 15, right: 15, bottom: 15, top: 15 },
          borderStyle: SC.BORDER_NONE,
            contentView: ThothApp.ContainerView.design({
            nowShowingBinding: "ThothApp.authorController.nowShowing"
          }),

          shouldDisplayBinding: "ThothApp.authorsController.hasContent",
          shouldDisplayDidChange: function(){
            if (this.get("shouldDisplay")) {
              this.adjust({"opacity": 1.0, display: "block"});
            } else {
              this.adjust({"opacity": 0, display: "none"});
            }
          }.observes("shouldDisplay")
        }) // bookView
      }) // bottomRightView (bookView)
    }) // splitter
  }) // mainPane
}); // mainPage
