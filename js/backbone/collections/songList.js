var app = app || {};

app.SongList = Backbone.Collection.extend({
    model: app.Song,

});

app.Songs = new SongList();
