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
    childViews: 'graphic dismissButton'.w(),

    graphic: ThothApp.GraphicView.design({
      layerId: 'graphic-view',
      layout: { left: 10, top: 10, width: 100, height: 500},
      backgroundColor: 'green'
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
