// ==========================================================================
// ThothApp.loadAuthorsPane
// ==========================================================================
/*globals ThothApp*/

/**

   @author Jeff Pittman
*/

ThothApp.loadAuthorsPane = SC.PanelPane.create({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({

    layout: { centerX: 0, centerY: 0, width: 400, height: 432 },

    childViews: 'explanation1 explanation2 loadAuthorsButton'.w(),

    explanation1: SC.LabelView.design({
      layout: { left: 60, top: 60, right: 60, height: 140 },
      value: "Book records have been loaded, and relations set to the versions associated with each book. Examine the " +
             "console reports to see the same pattern of createRecordResults, followed by updateRecord notifications, " +
             "followed by updateRecordResults."
    }),

    explanation2: SC.LabelView.design({
      layout: { left: 60, top: 210, right: 60, height: 80 },
      value: "Finally we load authors, wherein author records will be added, followed by the setting of relations " +
             "between authors and their books. You will see the app come up afterward."
    }),

    loadAuthorsButton: SC.ButtonView.design({
      layout: { right: 60, bottom: 60, width: 120, height: 32 },
      titleMinWidth: 0,
      isDefault: YES,
      title: 'Load Authors',
      action: 'loadAuthors'
    })
  })
});
