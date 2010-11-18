// ==========================================================================
// Project: ThothApp.loginPage
//            Reference: https://github.com/suvajitgupta/Tasks login_page.js
// ==========================================================================
/*globals ThothApp */

ThothApp.loginPanel = SC.PanelPane.create({
  layout: { top: 0, bottom: 0, left: 0, right: 0 },
  defaultResponder: 'ThothApp.statechart',

  contentView: SC.View.design({

    layout: { centerX: 0, centerY: 0, width: 400, height: 300 },
    childViews: 'instructions loginNameField passwordField loginErrorMessageLabel loginButton'.w(),

    instructions: SC.LabelView.design({
      layout: { left: 60, top: 60, right: 60, height: 50 },
      value: "Use username: test, password: test."
    }),

    loginNameField: SC.TextFieldView.design({
      layout: { top: 120, left: 60, right: 60, height: 32 },
      hint: 'login name',
      valueBinding: 'ThothApp.loginController.loginName'
    }),

    passwordField: SC.TextFieldView.design({
      layout: { top: 160, left: 60, right: 60, height: 32 },
      isPassword: YES,
      hint: 'password',
      valueBinding: 'ThothApp.loginController.password'
    }),

    loginErrorMessageLabel: SC.LabelView.design({
      layout: { top: 204, left: 60, right: 60, height: 20 },
      valueBinding: SC.Binding.oneWay('ThothApp.loginController.loginErrorMessage')
    }),

    loginButton: SC.ButtonView.design({
      layout: { bottom: 60, right: 60, width: 80, height: 24 },
      titleMinWidth: 0,
      isEnabledBinding: SC.Binding.oneWay('ThothApp.loginController.loginName').bool(),
      isDefault: YES,
      title: 'Log In',
      action: 'authenticate'
    })

  }),

  focus: function() {
    this.contentView.loginNameField.becomeFirstResponder();
  }

});