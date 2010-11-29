// ==========================================================================
// Project:   ThothApp.graphicPane
// ==========================================================================
/*globals ThothApp Sai*/

sc_require('views/record_icon');

ThothApp.graphicPane = SC.PanelPane.design({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({
    layout: { centerX: 0, centerY: 0, width: 400, height: 660 },
    childViews: 'reviews dismissButton'.w(),

    reviews: SC.View.design({
      layout: { top: 0, left: 0, right: 0, bottom: 0 },
      createChildViews: function() {
        console.log('in here');
        var reviewIcons = [], x = 10, y = 10, stepX = 20, stepY = 20;

        for (var i=0; i<ThothApp.loadedReviewCount; i++) {
          console.log('in here here');
          reviewIcons.pushObject(ThothApp.RecordIconView.design({
            layerId: 'graphic-view',
            layout: { left: x, top: y, height: 20, width: 20},
            backgroundColor: 'green'
          }));
          y += stepY;
        }

        this.set('childViews', reviewIcons);
      }
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
