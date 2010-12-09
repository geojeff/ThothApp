// ==========================================================================
// ThothApp.versionsLoadedPane
// ==========================================================================
/*globals ThothApp*/

/**

   @author Jeff Pittman
*/

ThothApp.versionsLoadedPane = SC.PanelPane.create({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({

    layout: { centerX: 0, centerY: 0, width: 400, height: 660 },

    childViews: 'explanation1 explanation2 showGraphicButton loadBooksButton'.w(),

    explanation1: SC.LabelView.design({
      layout: { left: 60, top: 60, right: 60, height: 300 },
      value: "Version records have been loaded, and relations set to the reviews associated with each version. For the " +
             "version records, you see in the console createRecordResult reports, then a series of lines from Thoth about " +
             "updateRecord being called, and expected results. updateRecord calls were triggered by the data controller " +
             "when review records are added to the associated version records (Book versions contain reviews, specified " +
             "in a toMany relation). After the console lines about updateRecord calls, you see updateRecordResult reports, " +
             "for the version records, in which you will see Riak keys of the associated review records in array notation."
    }),

    explanation2: SC.LabelView.design({
      layout: { left: 60, top: 370, right: 60, height: 80 },
      value: "Now we load books. It will be a case of repeat procedure, wherein book records will be added, followed by " +
             "the setting of relations between books and their versions."
    }),

    showGraphicButton: SC.ButtonView.design({
      layout: { right: 60, bottom: 120, width: 120, height: 32 },
      titleMinWidth: 0,
      isDefault: NO,
      title: 'Show Graphic',
      action: 'showGraphicForVersionsLoaded'
    }),

    loadBooksButton: SC.ButtonView.design({
      layout: { right: 60, bottom: 60, width: 120, height: 32 },
      titleMinWidth: 0,
      isDefault: YES,
      title: 'Load Books',
      action: 'loadBooks'
    })
  })
});
