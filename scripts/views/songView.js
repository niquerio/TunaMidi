define(['underscore', 'backbone', 'templates', 'views/playerView', 'common',
    'collections/songList'], function(_, Backbone,templates, PlayerView, Common, Songs){
  var SongView = Backbone.View.extend({
      tagName: 'li',
  
      template: _.template(templates.songView),
  
      events: {
        'click .load': 'loadSong',
      },
  
     initialize: function(){
                   
     },
     
     render: function(){
               this.$el.html( this.template(this.model.attributes) );
               return this;
             },
      loadSong: function(){
              Common.CurrentSong = this.model; 
              Songs.trigger('load');
      },
  }); 
 return SongView
});
