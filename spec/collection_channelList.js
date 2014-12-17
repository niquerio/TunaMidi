define(["models/channel","collections/channelList"],function(Channel, Channels){
  describe("Channels Collection", function(){
    it('Can add Model instances as objects and arrays.', function() {

        expect(Channels.length).toBe(0);

        Channels.add( {channel: 0});

        // how many todos have been added so far?
        expect(Channels.length).toBe(1);

        Channels.add([
            { channel: 3, mute: true, volume: 50},
            { channel: 0},
        ]);

        // how many are there in total now?
        expect(Channels.length).toBe(3);
        Channels.reset();
    });
  });
});
