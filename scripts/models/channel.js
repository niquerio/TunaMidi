define(['underscore', 'backbone', 'lib/MIDI',], function(_, Backbone, MIDI ){
  var Channel = Backbone.Model.extend({
    defaults: {
                channel: null,
                instrument: 0,
                solo: false,
                mute: false,
                volume: 127,
    },
    initialize: function(){
    }
  });
  return Channel;
});
