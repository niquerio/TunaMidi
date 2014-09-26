var app = app || {};
app.AppView = Backbone.View.extend({
  el: "tunamidi",
  initialize: function(){
                this.addAllSongs();
              },
  render: function(){
          },
  addOneSong: function(song){
                var view = new app.SongView({ model: song });
                $('#song-list').append( view.render().el );
              },
  addAllSongs: function(){
    this.$('#song-list').html('');
    app.Songs.each(this.addOneSong, this);
               },

});
