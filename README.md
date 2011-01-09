This app tests Thoth and the Thoth-SC datasource:

ThothApp requires the Thoth-SC framework:

    https://github.com/mauritslamers/Thoth-SC

and a version of SproutCore with the addFiniteObserver function added:

    https://github.com/mauritslamers/sproutcore

If you use your own version of Sproutcore, add the following method to your sproutcore/runtime/mixins/observable.js

   addFiniteObserver: function(key, target, method, context){
 
     // normalize.  if a function is passed to target, make it the method.
     if (method === undefined) {
       method = target; target = this ;
     }
     if (!target) target = this ;
 
     if (typeof method === "string") method = target[method] ;
     if (!method) throw "You must pass a method to addObserver()" ;
 
     var me = this; // replace by context?
     var f = function() {
       var val = me.get(key);
       var ret = method.call(target,val);
       //console.log("addFiniteObserver function called: val = " + val + " and ret = " + ret);
       if(ret){
         me.removeObserver(key, me, f);
       }
     };
 
   this.addObserver(key, this, f);
   },

Running
=======

ThothApp can be run with sc-server in one terminal window, if using the standard Ruby-based build tools, or with garcon.

In another terminal, go to the your Thoth installation directory and run one of the initialization scripts shown below.

In another terminal, you may need to start and top your backend. For example, when running with Riak, you might want to
sometimes delete the data directory and restart.

ThothApp has been tested alternately against Thoth running its MemStore.js, RiakStore.js, and CouchDB.js versions.
Use of MemStore.js is handy for testing. Here is an initialization script for running Thoth with MemStore:

MemStore
--------

Save as myMemServer.js in your Thoth dir.

    var sys = require('sys');
    var Thoth = require('./lib/Thoth').Thoth;

    var myServer = Thoth.Server.create({
       port: 8080,
       store: Thoth.MemStore.create(),
       tempStore: Thoth.DiskStore.create({ filename: 'test.js'}),
       authModule: Thoth.FileAuth.create({ fileName: './myUsers'}),
       sessionModule: Thoth.Session.create({ sessionName: 'ThothServer' })
       //policyModule: Thoth.Policies.create({ policyFile: './myPolicies'})
    });

    myServer.start();

and run with:

    sudo node myMemServer.js

RiakStore
---------

For running Thoth with RiakStore.js, here is an initialization script:

Save as myRiakServer.js in your Thoth dir.

    var sys = require('sys');
    var Thoth = require('./lib/Thoth').Thoth;

    // require the store you need here:
    var RiakStore = require('./lib/RiakStore').RiakStore;

    var myServer = Thoth.Server.create({
       port: 8080,
       URLprefix: '/thoth',
       store: RiakStore.create(),
       authModule: Thoth.FileAuth.create({ fileName: './myUsers'}),
       sessionModule: Thoth.Session.create({ sessionName: 'ThothServer' })
       //policyModule: Thoth.Policies.create({ policyFile: './myPolicies'})
    });

    myServer.start();

and run with:

    sudo node myRiakServer.js

CouchDBStore
------------

For running Thoth with CouchDBStore.js, here is an initialization script:

Save as myCouchDBServer.js in your Thoth dir.

    var sys = require('sys');
    var Thoth = require('./lib/Thoth').Thoth;

    // require the store you need here:
    var CouchDBStore = require('./lib/CouchDBStore').CouchDBStore;

    var myServer = Thoth.Server.create({
       port: 8080,
       URLprefix: '/thoth',
       store: CouchDBStore.create({host:'localhost'}),
       authModule: Thoth.FileAuth.create({ fileName: './myUsers'}),
       sessionModule: Thoth.Session.create({ sessionName: 'ThothServer' })
       //policyModule: Thoth.Policies.create({ policyFile: './myPolicies'})
    });

    myServer.start();

and run with:

    sudo node myCouchDBServer.js

MysqlStore
----------

Need to test this one...
