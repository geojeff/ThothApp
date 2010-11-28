// ==========================================================================
// ThothApp.reviewsLoadedPane
// ==========================================================================
/*globals ThothApp*/

/**

   @author Jeff Pittman
*/

ThothApp.reviewsLoadedPane = SC.PanelPane.create({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({
    layout: { centerX: 0, centerY: 0, width: 400, height: 542 },
    childViews: 'instructions explanation1 explanation2 loadReviewsButton'.w(),

    instructions: SC.LabelView.design({
      layout: { left: 60, top: 60, right: 60, height: 80 },
      value: "If you do not yet have the javascript console open in your browser, please open it now. You will be inspecting console.log reports."
    }),

    explanation1: SC.LabelView.design({
      layout: { left: 60, top: 150, right: 60, height: 130 },
      value: "Sample data will be loaded from FIXTURES files, with a twist, wherein an integer key in the FIXTURES data is used to associate " +
             "records for setting relations. As records are created in the store, the Riak backend will set its own long string key for each record."
    }),

    explanation2: SC.LabelView.design({
      layout: { left: 60, top: 300, right: 60, height: 100 },
      value: "Review record data will be loaded first, because these records have no child records (They have no toMany relations), so can be " +
             "created without complication -- without the need to set relations to other records."
    }),

    loadReviewsButton: SC.ButtonView.design({
      layout: { right: 60, bottom: 60, width: 120, height: 32 },
      titleMinWidth: 0,
      isDefault: YES,
      title: 'Load Reviews',
      action: 'loadReviews'
    })
  })
});
