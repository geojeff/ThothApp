// ==========================================================================                                                                                                                                                                                            
// ThothApp.DataSource
// ==========================================================================
/* globals ThothApp Thoth */

/** 

This controller manages the creation of data.

   @extends SC.ObjectController
   @author Jeff Pittman
*/

sc_require('WebSocketDataSource');

ThothApp.DataSource = ThothSC.WebSocketDataSource.extend({
  authSuccessCallback: function(){
    ThothApp.statechart.sendEvent('authSuccess');
  },

  authFailureCallback: function(){
    ThothApp.statechart.sendEvent('authFailure');
  },

  ThothHost: 'localhost',
  ThothPort: '8080',
  ThothURLPrefix: '/thoth'
});

//sc_require('XHRPollingDataSource');
//
//ThothApp.DataSource = ThothSC.XHRPollingDataSource.extend({
//  authSuccessCallback: function(){
//    ThothApp.statechart.sendEvent('authSuccess');
//  },
//
//  authFailureCallback: function(){
//    ThothApp.statechart.sendEvent('authFailure');
//  }
//});

