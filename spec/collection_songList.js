define(["models/song","collections/songList", "path"],function(Song, Songs, path){
  describe("Songs Collection", function(){
    it('Can add Model instances as objects and arrays.', function() {

        expect(Songs.length).toBe(0);

        Songs.add({ midi_src: path + 'spec/midi/example.mid' });

        // how many todos have been added so far?
        expect(Songs.length).toBe(1);

        Songs.add([
            { midi_src: path + 'spec/midi/aucun_se_sont.midi' },
            { midi_src: path + 'spec/midi/example.mid', title: 'Example'}
        ]);

        // how many are there in total now?
        expect(Songs.length).toBe(3);
        Songs.reset();
    });
  });
});
