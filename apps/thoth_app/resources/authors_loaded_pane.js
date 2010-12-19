// ==========================================================================
// ThothApp.authorsLoadedPane
// ==========================================================================
/*globals ThothApp*/

/**

   @author Jeff Pittman
*/

ThothApp.authorsLoadedPane = SC.PanelPane.create({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({

    layout: { centerX: 0, centerY: 0, width: 400, height: 482 },

    childViews: 'explanation1 explanation2 loadAppButton'.w(),

    explanation1: SC.LabelView.design({
      layout: { left: 60, top: 60, right: 60, height: 140 },
      value: "Author records have been loaded, and relations set to the books associated with each author. Examine the " +
             "console reports to see the same pattern of createRecordResults, followed by updateRecord notifications, " +
             "followed by updateRecordResults."
    }),

    explanation2: SC.LabelView.design({
      layout: { left: 60, top: 210, right: 60, height: 80 },
      value: "Finally we load the app. We do this by setting the records, now loaded in the store (for reviews, versions," +
             "books, and authors), into the controllers, which are bound to user interface elements. The user interface" +
             "elements, upon instantiation, adjust to present the records as their bound controllers receive the data."
    }),

    loadAppButton: SC.ButtonView.design({
      layout: { right: 60, bottom: 60, width: 120, height: 24 },
      classNames: ['thoth-button'],
      fontWeight: SC.BOLD_WEIGHT,
      color: '#999',
      isDefault: YES,
      title: 'Load App',
      action: 'loadApp'
    })
  })
});
