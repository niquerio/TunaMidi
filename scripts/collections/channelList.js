define(["backbone", "models/channel"], function(Backbone, Channel){
  var ChannelList = Backbone.Collection.extend({
      model: Channel,
  });
  return new ChannelList;
});
