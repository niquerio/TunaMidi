define([
    "underscore",
    "backbone", 
    "collections/songList", 
    "views/songView", 
    "views/playerView",  
    "common", 
    ],function( _, Backbone, Songs, SongView, PlayerView, Common ){
  var AppView = Backbone.View.extend({
    el: 'body',
    template: _.template('<ul id="songList"></ul>'),
    initialize: function(){
          this.listenTo(Songs, 'load', this.loadSong);
          this.currentPlayerView = {};
          
          this.collection.fetch();
    },
    events: {
        "dragover" : "handleDragOver",
        "dragleave" : "handleDragLeave",
        "drop" : "handleFileSelect",
   },
   badFile: function(){
        alert('badTimes!');
   },

    handleDragOver: function(evt){
        evt.stopPropagation();
        evt.preventDefault();
        this.$el.css("background-color","#E8E8E8");
    },
    handleDragLeave: function(evt){
        evt.stopPropagation();
        evt.preventDefault();
        this.$el.css("background-color","");
    },
    handleFileSelect: function(evt){
        evt.stopPropagation();
        evt.preventDefault();
      var files = evt.originalEvent.dataTransfer.files; // FileList object.
      var output = [];
      for (var i = 0, f; f = files[i]; i++) {
          this.readFile(f); 
      }
      this.$el.css("background-color","");
    },
    readFile: function(f){
        var self = this;
        var reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = function() {
             Songs.create({'midi_src': reader.result});
             Songs.fetch({reset:true});
             self.render();
        }
        reader.onerror = function(e) {
            alert("Error!: " + e);
        }
    }, 
    render: function(){
       this.addAllSongs();
        return this;
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
