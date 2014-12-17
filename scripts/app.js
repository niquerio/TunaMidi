define([
    'marionette',
    'collections/songList',
    'path',
    'lib/MIDI',
    'views/appView',
    'views/playerView',
    'common',

    ],function(Marionette, Songs, path, MIDI, AppView, PlayerView,Common ){
      var app = new Marionette.Application();
      //var songList = new SongList(); 

      app.addRegions({ 
          player: "#playerContainer", 
          songs: "#sideBar",  
      });
      //var songsView = new AppView({collection: Songs }) ;
      

      app.addInitializer(function(){

      //  MIDI.loadPlugin( function () {
      //    Songs.add([
      //      {midi_src: path + 'spec/midi/example.mid', },
      //      {midi_src: path + 'spec/midi/aucun_se_sont.midi'},
      //      ]);
      //    var playerView = new PlayerView({model: Songs.first()});
      //    app.songs.show(songsView);
      //    app.player.show(playerView);
      //  });
      });

    return app;
    });
    
