requirejs.config({
    "paths": {
      'path': '../spec/helpers/path',
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min",
      "backbone":"http://documentcloud.github.com/backbone/backbone",
      "underscore" :"https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js", 
      "text" : 'lib/text',
      "bootstrap" : "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min",
      "marionette" : 'lib/backbone.marionette',
      "select2" : "//cdnjs.cloudflare.com/ajax/libs/select2/3.5.2/select2.min",
      "localstorage": "lib/backbone.localStorage",
      "jasny": "//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/js/jasny-bootstrap.min",
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
      'jasny': { deps: ["jquery"],},
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
     'lib/iconpicker.js': {
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
        MIDI.loadPlugin({instruments:[ 'synth_drum' ],
            callback: function () {
//                Songs.create( 
//            {midi_src: 'http://cynnabar.thedancingmaster.net/singing/extra/tantara_cries_mars/tantara_cries_mars.mid'}
//        );
        //  Songs.add([
        //    {midi_src: 'http://cynnabar.thedancingmaster.net/singing/myeditions/alle_psallite/alle_psallite.mid'},
        //    {midi_src: 'http://cynnabar.thedancingmaster.net/singing/myeditions/pucelete/pucelete.mid'},
        //    {midi_src: 'http://cynnabar.thedancingmaster.net/singing/extra/tantara_cries_mars/tantara_cries_mars.mid'},
        //    {midi_src: 'http://cynnabar.thedancingmaster.net/singing/myeditions/aucun_se_sont/aucun_se_sont.midi'},
        //    ]);
          //Songs.fetch({reset:true});
          var appView = new AppView({collection: Songs});
          appView.render();
          MIDI.noteOn = noteOn;
          MIDI.noteOff = noteOff;
          //var playerView = new PlayerView({model: Songs.first()});
          //playerView.render();
          //app.songs.show(songsView);
          //app.player.show(playerView);
          MIDI.loader.stop();
          
        },});
  //
});
