define(['underscore', 'backbone', 'templates', 'views/playerView', 'common',
    'collections/songList'], function(_, Backbone,templates, PlayerView, Common, Songs){
  var SongView = Backbone.View.extend({
      tagName: 'li',
  
      template: _.template(templates.songView),
  
      events: {
        'click .load': 'loadSong',
        'dblclick span': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close',
      },
  
     initialize: function(){
        this.model.on('error', function(error){
            alert(error);
        });
                   
     },
     edit: function(){
             this.$el.addClass('editing');
             this.$input.focus();
     },
     updateOnEnter: function(e){
                     if (e.keyCode === Common.ENTER_KEY ){
                       this.close();
                     } 
     },
     close: function(){
       var value = this.$input.val().trim();
       if (value){
         this.model.save({title: value});
         this.$title.text(value);
       }
       this.$el.removeClass('editing');
     },
     
     render: function(){
               this.$el.html( this.template(this.model.attributes) );
               this.$input = this.$('.edit');
               this.$title = this.$('.view').find('.title');
               return this;
             },
      loadSong: function(){
              Common.CurrentSong = this.model; 
              Songs.trigger('load');
      },
  }); 
 return SongView
});
