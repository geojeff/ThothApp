This app tests Thoth and the Thoth-SC datasource. It has been written by Jeff Pittman and Maurits Lamers during
development of Thoth / Thoth-SC, starting first as ONRTest in Summer 2010, when Thoth was then known as OrionNodeRiak.
It had a brief life as ONRTestApp before being renamed to ThothApp when the name OrionNodeRiak was changed to Thoth. For
Thoth, see:

    [https://github.com/mauritslamers/Thoth](https://github.com/mauritslamers/Thoth)

ThothApp requires the Thoth-SC framework:

    [https://github.com/mauritslamers/Thoth-SC](https://github.com/mauritslamers/Thoth-SC)

and a version of SproutCore with the addFiniteObserver function added:

    [https://github.com/mauritslamers/sproutcore](https://github.com/mauritslamers/sproutcore)

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

In another terminal, you may need to start and stop your backend. For example, when running with Riak, you might want to
sometimes delete the data directory and restart.

You have a choice of running with websockets or XHR polling, or with the Thoth-SC DataStore.js directly if running with
the Thoth MemStore.js backend. When switching between websockets and XHR polling, the following line at the bottom of
the Buildfile will need to be toggled:

    # Uncomment this line when running with Thoth/XHRPollingDataSource (not needed for WebsocketsDataSource)
    #proxy '/thoth', :to => 'localhost:8080'

And, you will need to change how you create the store in core.js and the datasource in datasources/data_source.js.

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
