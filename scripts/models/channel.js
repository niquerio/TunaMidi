define(['underscore', 'backbone', 'lib/MIDI',], function(_, Backbone, MIDI ){
  var Channel = Backbone.Model.extend({
    defaults: {
                channel: null,
                instrument: 0,
                solo: false,
                mute: false,
                volume: 100,
    },
    initialize: function(){
    }
  });
  return Channel;
});
