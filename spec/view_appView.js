define(["jquery", "views/appView", "models/song", "collections/songList", 
    "path",
    "jasmine-jquery",
    ],function($, AppView, Song, Songs, path){
  describe("AppView View", function(){
     beforeEach(function(){
       this.appView = new AppView();
       setFixtures('<div id="tunamidi"><ul id="songList"></ul></div>');
     });
     afterEach(function(){
       this.appView.remove();
       $('#songList').remove();
       $('#tunamidi').remove();
       Songs.reset();
     });
    it("Should add song to songList ul", function(){
      var song = new Song({midi_src: path + 'spec/midi/example.mid'})
      this.appView.addOneSong(song);
      expect($('#songList')).toContainText('example');
    });

    it("Should add all songs in Songs to songList ul", function() {
      Songs.add([
        {midi_src: path + 'spec/midi/example.mid'},
        {midi_src: path + 'spec/midi/rachmaninov3.mid'},
        {midi_src: path + 'spec/midi/aucun_se_sont.midi'},
      ]);
      expect($('#songList')).not.toContainText('example');

      this.appView.addAllSongs();
      expect($('#songList')).toContainText('example');
      var first = $('#songList').children(':first');
      expect(first).toContainText('example');
      expect(first.next()).toContainText('rachmaninov3');
    });

  });
});
