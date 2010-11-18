// ==========================================================================
// ThothApp.loginController
//   Reference: https://github.com/suvajitgupta/ThothApp login.js
// ==========================================================================
/*globals ThothApp*/

ThothApp.loginController = SC.ObjectController.create(
/** @scope ThothApp.loginController.prototype */ {

    loginErrorMessage: '',
    loginName: '',
    password: '',

    _loginInformationHasChanged: function() {
      this.set('loginErrorMessage', '');
    }.observes('loginName', 'password')

});