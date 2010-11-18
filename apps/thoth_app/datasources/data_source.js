// ==========================================================================                                                                                                                                                                                            
// ThothApp.DataSource
// ==========================================================================
/* globals ThothApp Thoth */

/** 

This controller manages the creation of data.

   @extends SC.ObjectController
   @author Jeff Pittman
*/

sc_require('thothsc/data_sources/WebsocketDataSource');

ThothApp.DataSource = ThothSC.WebsocketDataSource.extend({
  authSuccessCallback: function(){
    ThothApp.statechart.sendEvent('authSuccess');
  },

  authFailureCallback: function(){
    ThothApp.statechart.sendEvent('authFailure');
  }
});

