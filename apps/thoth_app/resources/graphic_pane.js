// ==========================================================================
// Project:   ThothApp.graphicPane
// ==========================================================================
/*globals ThothApp Sai Forms*/

sc_require('views/reviewsGraphic');
sc_require('views/versionsGraphic');
sc_require('views/booksGraphic');
sc_require('views/authorsGraphic');

ThothApp.graphicPane = SC.PanelPane.create({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({
    layout: { centerX: 0, centerY: 0, width: 400, height: 660 },
    childViews: 'graphicPanel dismissButton'.w(),

    graphicPanel: SC.View.design({
      layout: { left: 0, top: 0, width: 400, height: 500 },
      childViews: 'reviewsGraphic versionsGraphic booksGraphic authorsGraphic'.w(),

      reviewsGraphic: ThothApp.ReviewsGraphicView.design({
        layout: { left: 10, top: 10, width: 30, height: 500 },
        layerId: 'graphic-view',
        backgroundColor: 'green'
      }),

      versionsGraphic: ThothApp.VersionsGraphicView.design({
        layout: { left: 50, top: 10, width: 30, height: 500 },
        layerId: 'graphic-view',
        backgroundColor: 'green'
      }),

      booksGraphic: ThothApp.BooksGraphicView.design({
        layout: { left: 90, top: 10, width: 30, height: 500 },
        layerId: 'graphic-view',
        backgroundColor: 'green'
      }),

      authorsGraphic: ThothApp.AuthorsGraphicView.design({
        layout: { left: 130, top: 10, width: 30, height: 500 },
        layerId: 'graphic-view',
        backgroundColor: 'green'
      })
    }),

    dismissButton: SC.ButtonView.design({
      layout: { right: 60, bottom: 60, width: 120, height: 32 },
      titleMinWidth: 0,
      isDefault: YES,
      title: 'Dismiss',
      action: 'dismissGraphicPane'
    })
  })
});
