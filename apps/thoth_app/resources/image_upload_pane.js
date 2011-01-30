// ==========================================================================
// ThothApp.authorsLoadedPane
// ==========================================================================
/*globals ThothApp*/

/**

   @author Jeff Pittman
*/

require("views/upload");

ThothApp.imageUploadPane = SC.PanelPane.create({
  layout: { centerX: 0, top: 80, width: 420, height: 150},
  classNames: ['image-upload'],
  defaultResponder: ThothApp.statechart,

  contentView: SC.View.design({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    childViews: 'title imageUpload cancelButton saveButton'.w(),

    title: SC.LabelView.design({
      layout: { left: 20, top: 10, right: 20, height: 24 },
      classNames: ['image-upload-title'],
      value: 'Upload an image)',
      controlSize: SC.LARGE_CONTROL_SIZE,
      fontWeight: SC.BOLD_WEIGHT
    }),

    imageUpload: ThothApp.UploadView.design({
      layout: { left: 17, right: 14, top: 50, height: 36 }
    }),

    cancelButton: SC.ButtonView.design({
      layout: { right: 120, bottom: 10, width: 100, height: 24 },
      title: 'Cancel',
      action: 'cancel'
    }),

    saveButton: SC.ButtonView.design({
      layout: { right: 10, bottom: 10, width: 100, height: 24 },
      title: 'Save',
      action: 'save',
      isDefault: YES
    })
  })
});
