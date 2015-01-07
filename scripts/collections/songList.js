define(["backbone", "models/song","localstorage"], function(Backbone, Song){
  var SongList = Backbone.Collection.extend({
      model: Song,
      localStorage: new Backbone.LocalStorage('tunamidi'),
  });
  return new SongList;
});

