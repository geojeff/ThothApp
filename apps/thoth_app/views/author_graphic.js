// ==========================================================================
// Project:   ThothApp.graphic
// ==========================================================================
/*globals ThothApp LinkIt Forms*/

sc_require('views/node');

ThothApp.AuthorGraphicView = SC.View.extend(SC.Animatable, {
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  childViews: 'contentView'.w(),
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({
    layout: { top: 0, bottom: 0, left: 0, right: 0 },
    childViews: 'canvas'.w(),

    canvas: LinkIt.CanvasView.design({
      layout: { top: 0, bottom: 0, left: 0, right: 0 },
      classNames: ['authors-canvas'],
      contentBinding: SC.Binding.from('ThothApp.allItemsController.arrangedObjects').oneWay(),
      selectionBinding: 'ThothApp.allItemsController.selection',
      nodeViewDelegate: ThothApp.allItemsController,
      exampleView: ThothApp.NodeView,
      delegate: ThothApp.allItemsController

    })
  })
});
