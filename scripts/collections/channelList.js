define(["backbone", "models/channel"], function(Backbone, Channel){
  var ChannelList = Backbone.Collection.extend({
      model: Channel,
      //localStorage: new Backbone.LocalStorage('tunamidi-channels'),
  });
  return new ChannelList;
});
