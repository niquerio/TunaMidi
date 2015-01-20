define([
    "underscore",
    "backbone", 
    "collections/songList", 
    "views/songView", 
    "views/playerView",  
    "views/uploadView",  
    "common", 
    "templates",
    "helpers/readFile",
    "jasny",
    ],function( _, Backbone, Songs, SongView, PlayerView, UploadView, Common, templates, readFile ){
  var AppView = Backbone.View.extend({
    el: 'body',
    template: _.template(templates.upload),
    initialize: function(){
          this.listenTo(Songs, 'load', this.loadSong);
          this.listenTo(Songs, 'submitSong', this.addAllSongs);
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
          readFile(f); 
      }
      this.$el.css("background-color","");
    },
    render: function(){
       
        self = this;
        var uploadLink = $("<a>").addClass('noUpload').attr('href','#').text('Upload').click(function(){

            if( $(this).hasClass('noUpload') ){
                $(this).removeClass('noUpload').text('Hide Upload');
                self.uploadView = new UploadView;
                $(this).after(self.uploadView.render().el)
            }
            else{
                $(this).addClass('noUpload').text('Upload');
                self.uploadView.remove(); 
               
            }
            
        });
        $('#sidebar').prepend(uploadLink);

        
        //var uploadView = new UploadView;
        //$('#sidebar').prepend(uploadView.render().el)
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
