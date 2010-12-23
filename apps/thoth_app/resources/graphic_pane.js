// ==========================================================================
// Project:   ThothApp.graphicPane
// ==========================================================================
/*globals ThothApp Sai Forms*/

sc_require('views/node');

ThothApp.graphicPane = SC.PanelPane.create({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({
    layout: { centerX: 0, centerY: 0, width: 840, height: 660 },
    childViews: 'graphicPanel dismissButton'.w(),

    graphicPanel: SC.View.design({
      layout: { left: 0, top: 0, width: 840, height: 500 },
      childViews: 'canvas'.w(),

      canvas: LinkIt.CanvasView.design({
        layout: { left: 10, top: 10, right: 10, height: 500 },
        classNames: ['authors-canvas'],
        contentBinding: SC.Binding.from('ThothApp.allItemsController').oneWay(),
        selectionBinding: 'ThothApp.authorsController.selection',
        nodeViewDelegate: ThothApp.allItemsController,
        exampleView: ThothApp.NodeView,
        delegate: ThothApp.allItemsController
      })

    }),

    dismissButton: SC.ButtonView.design({
      layout: { right: 60, bottom: 60, width: 120, height: 24 },
      classNames: ['thoth-button'],
      fontWeight: SC.BOLD_WEIGHT,
      color: '#999',
      isDefault: YES,
      title: 'Dismiss',
      action: 'dismiss'
    })
  })
});
