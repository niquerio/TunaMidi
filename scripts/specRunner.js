(function() {
  'use strict';

  // Configure RequireJS to shim Jasmine
  require.config({
    //baseUrl: '..',
    paths: {
      'jasmine': '../lib/jasmine-2.0.2/jasmine',
      'jasmine-html': '../lib/jasmine-2.0.2/jasmine-html',
      'boot': '../lib/jasmine-2.0.2/boot',
      'jasmine-jquery': '../lib/jasmine-jquery',
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min",
      "backbone":"http://documentcloud.github.com/backbone/backbone",
      "underscore" :"http://documentcloud.github.com/underscore/underscore", 
      "text" : 'lib/text',
    },
    //urlArgs: "bust=" + (new Date()).getTime(),
    shim: {
      'jasmine': {
        exports: 'window.jasmineRequire'
      },
      'jasmine-html': {
        deps: ['jasmine'],
        exports: 'window.jasmineRequire'
      },
      'jasmine-jquery': {
        deps: ['jasmine', 'jquery'],
        exports: 'window.jasmine'
      },
      'boot': {
        deps: ['jasmine', 'jasmine-html'],
        exports: 'window.jasmineRequire'
      },
      'underscore': {
        exports: "_"
      },
      'backbone': {
         deps : [ "jquery", "underscore" ],
         exports: "Backbone"
      },
      'lib/MIDI': {
         deps : [ "lib/Base64", "lib/base64binary", "lib/jasmid/stream", "lib/jasmid/replayer","lib/jasmid/midifile" ],
         exports: "MIDI"
      },
      'lib/jasmid/midifile': {
         exports: "MidiFile"
      },
      'lib/jasmid/replayer': {
         exports: "Replayer"
      },
      'lib/jasmid/stream': {
         exports: "Stream"
      },
      'lib/Base64': {
         exports: "window.atob"
      },
     'lib/base64binary': {
         exports: "Base64Binary"
     },
    }
  });

  // Define all of your specs here. These are RequireJS modules.
  var specs = [
    //'tests/spec/routerSpec'
    '../spec/model_song',
    '../spec/view_songView'
  ];

  // Load Jasmine - This will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use the
  // AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
  // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
  // initialize the HTML Reporter and execute the environment.
  require(['boot'], function () {

    // Load the specs
    require(specs, function () {

      // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
      window.onload();
    });
  });
})();
