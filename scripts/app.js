requirejs.config({
    "paths": {
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js",
      "backbone":"http://documentcloud.github.com/backbone/backbone.js",
      "underscore" :"http://documentcloud.github.com/underscore/underscore.js", 
      "text" : 'lib/text',
    },
    "shim": {
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
