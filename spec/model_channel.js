define(["models/channel", "path"], function(Channel, path){
  describe("Channel Model", function(){
    var channel;
    beforeEach(function(){ channel = new Channel(); });

    it("Should have correct defaults", function(){
      expect(channel.get('channel')).toBe(null);
      expect(channel.get('instrument')).toBe(0);
      expect(channel.get('mute')).toBe(false);
      expect(channel.get('solo')).toBe(false);
      expect(channel.get('volume')).toBe(100);
    });

  });
});
