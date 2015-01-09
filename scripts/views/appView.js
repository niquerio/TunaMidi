define([
    "underscore",
    "backbone", 
    "collections/songList", 
    "views/songView", 
    "views/playerView",  
    "common", 
    "templates",
    "jasny",
    ],function( _, Backbone, Songs, SongView, PlayerView, Common, templates ){
  var AppView = Backbone.View.extend({
    el: 'body',
    template: _.template(templates.upload),
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
        var title = f.name.replace(/\.[^/.]+$/, "")
        var self = this;
        var reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = function() {
             Songs.create({'midi_src': reader.result, 'title':title});

             Songs.fetch({reset:true});
             self.addAllSongs();
        }
        reader.onerror = function(e) {
            alert("Error!: " + e);
        }
    }, 
    render: function(){
       
        $('#songList').before(this.render_upload());
       this.addAllSongs();
        return this;
            },
    render_upload: function(){
        var self = this;
        var upload = $("<form>").html(this.template);
        upload.find("#submit_upload").click(function(){
           self.readFile($('#upload_file').get(0).files[0]);
           $('.fileinput').fileinput('clear');
        });
        return upload;
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
