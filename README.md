Introduction
============

This app tests Thoth and the Thoth-SC datasource. It has been written by Jeff Pittman and Maurits Lamers during
development of Thoth / Thoth-SC, starting first as ONRTest in Summer 2010, when Thoth was then known as OrionNodeRiak.
It had a brief life as ONRTestApp before being renamed to ThothApp when the name OrionNodeRiak was changed to Thoth. For
Thoth, see:

[https://github.com/mauritslamers/Thoth](https://github.com/mauritslamers/Thoth)

ThothApp requires the Thoth-SC framework:

[https://github.com/mauritslamers/Thoth-SC](https://github.com/mauritslamers/Thoth-SC)

and a version of SproutCore with the addFiniteObserver function added:

[https://github.com/mauritslamers/sproutcore](https://github.com/mauritslamers/sproutcore)

> NOTE: There is a Status / TODO / Plans section at the bottom of this README.

Cloning and Setup
-----------------

If you clone this repo, with git clone git@github.com:geojeff/ThothApp.git, you should be able to then run, from inside 
the main ThothApp directory:

    git submodule update --init

This will install Thoth-SC, the fork of SproutCore mentioned above, and scui into your frameworks directory.

A Special Tweak
---------------

(Skip, if you installed as above).

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

There is a file with just this function in the main ThothApp directory.

Running
=======

ThothApp can be run with sc-server in one terminal window, if using the standard Ruby-based build tools, or with garcon.

In another terminal, go to the your Thoth installation directory and run one of the initialization scripts shown below. You 
will also need read the Thoth docs about creating your own users and policies files. For example, in the default setup for
ThothApp, it is assumed that username / password, "test" / "test" will be used. So, do this to get the scripts below to work:

    cp myUsers.sample.js myUsers.js

In the scripts below, myPolicies.js is commented out, but you may wish to learn about that.

In another terminal, you may need to start and stop your backend. For example, when running with Riak, you might want to
sometimes delete the data directory and restart.

You have a choice of running with websockets or XHR polling. When switching between websockets and XHR polling, the
following line at the bottom of the Buildfile will need to be toggled:

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

FileStore
---------

Need to test this one...

Status / TODO / Plans
=====================

Add adding and deleting, editing, and test the loaded app for normal functionality (it is unfinished as of 2011/1/11).
Add buttons as needed.

Add a better positioning system for the LinkIt objects, for handling a larger dataset.

Add a relations-setting graphic display using LinkIt, for setting/breaking relations using icons and links, and for
adding new authors, books, etc., in the fashion of the family_tree demo for LinkIt.

Add a larger test dataset.

Consider adding an option for authenticating automatically and for loading the data in one-fell-swoop, to avoid having
to click through loading steps. This would be useful when focusing on development of app features.

Evaluate the layout of the book form. Labels are needed for the lists, for the form. If the design with version list
left, form on right, reviews list on bottom, is kept, handle case of small window size and overlap of reviews list and
main  properties panel.

Consider adding animation.

Style long reviews... For text wrapping, with css?  by putting \ns in the text?

Style lists.

Add feedback for principal actions, such as add, delete, etc. Somewhere add feedback on relation-setting, perhaps when
a new record is added. Make reusable in standard and graphics views.

Review theming, which is now some combination of that from the Contacts app and a few things from test_controls app.

