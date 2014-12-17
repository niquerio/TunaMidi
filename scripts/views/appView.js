define([
    "underscore",
    "backbone", 
    "collections/songList", 
    "views/songView", 
    "views/playerView",  
    "common", 
    ],function( _, Backbone, Songs, SongView, PlayerView, Common ){
  var AppView = Backbone.View.extend({
    template: _.template('<ul id="songList"></ul>'),
    //childView: SongView,
    //childViewContainer: '#songList',
    initialize: function(){
          this.listenTo(Songs, 'load', this.loadSong);
          this.currentPlayerView = {};
    },
    events: {
            },

    render: function(){
       this.addAllSongs();
            },
    
    addOneSong: function(song){
                  var view = new SongView({ model: song });
                  $('#songList').append( view.render().el );
                },
    addAllSongs: function(){
      this.$('#songList').html('');
      Songs.each(this.addOneSong, this);
                 },
  
    loadSong: function(){
                var view = new PlayerView({model: Common.CurrentSong});
                if (view != this.currentPlayerView){
                  if(!($.isEmptyObject(this.currentPlayerView))){ 
                    this.currentPlayerView.remove();
                  }
                  this.currentPlayerView = view;
                  $('#playerContainer').append(this.currentPlayerView.render().el)
                }

              },
  });
  
  return AppView;
});
