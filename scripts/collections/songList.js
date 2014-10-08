define(["backbone", "models/song"], function(Backbone, Song){
  var SongList = Backbone.Collection.extend({
      model: Song,
  });
  return new SongList;
});

