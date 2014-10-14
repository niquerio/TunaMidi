requirejs.config({
    "paths": {
      'path': '../spec/helpers/path',
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min",
      "backbone":"http://documentcloud.github.com/backbone/backbone",
      "underscore" :"http://documentcloud.github.com/underscore/underscore", 
      "text" : 'lib/text',
      "bootstrap" : "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
      "marionette" : 'lib/backbone.marionette',
      "select2" : "http://ivaynberg.github.io/select2/select2-3.5.1/select2"
    },
    "shim": {
      'underscore': {
        exports: "_"
      },
      'backbone': {
         deps : [ "jquery", "underscore" ],
         exports: "Backbone"
      },
      'bootstrap': { deps : [ "jquery" ], },
      'marionette': {
         deps: ['backbone'],
         exports: 'Backbone.Marionette',
            },
      'lib/MIDI': {
         deps : [ "lib/Base64", "lib/base64binary", "lib/jasmid/stream", "lib/jasmid/replayer","lib/jasmid/midifile" ],
         exports: "MIDI"
      },
      'lib/jasmid/midifile': {
         exports: "MidiFile"
      },
      'lib/Loader': {
        exports: "Loader"
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
     'lib/bootstrap-slider.min': {
         deps: ["jquery", "bootstrap"],
     },
     'select2': {
       deps: ["jquery"]
     },
     'lib/bootstrap-touchspin': {
         deps: ["jquery", "bootstrap"],
     },
   }
});

require(['backbone', 'lib/MIDI', 'collections/songList','views/appView', 'path', 'lib/Loader', 'helpers/noteOn', 'helpers/noteOff'], function(Backbone, MIDI, Songs, AppView, path, Loader, noteOn, noteOff){
//require(['app'], function(app){
//  app.start();
        MIDI.loader = new widgets.Loader;
        for(var key in MIDI.channels){
          MIDI.channels[key].volume = 127;
        }
        MIDI.loadPlugin( function () {
          Songs.add([
            {midi_src: 'http://cynnabar.thedancingmaster.net/singing/myeditions/la_bionda_trecca/la_bionda_trecca_trans_up_fifth.midi', },
            {midi_src: 'http://cynnabar.thedancingmaster.net/singing/myeditions/alle_psallite/alle_psallite.mid'},
            {midi_src: 'http://cynnabar.thedancingmaster.net/singing/myeditions/pucelete/pucelete.mid'},
            ]);
          var appView = new AppView();
          appView.render();
          MIDI.noteOn = noteOn;
          MIDI.noteOff = noteOff;
          //var playerView = new PlayerView({model: Songs.first()});
          //playerView.render();
          //app.songs.show(songsView);
          //app.player.show(playerView);
          MIDI.loader.stop();
          
        });
  //
});
