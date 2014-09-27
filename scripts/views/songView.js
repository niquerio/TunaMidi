define(['jquery', 'underscore', 'backbone', 'text!templates/songView.html'], function($,_,Backbone,songViewTemplate){
  var SongView = Backbone.View.extend({
      tagName: 'li',
  
      songTpl: _.template(songViewTemplate),
  
      events: {
      },
  
     initialize: function(){
          //this.listenTo(this.model, 'change:playing', this.pause);
     },
     
     render: function(){
               this.$el.html( this.songTpl(this.model.attributes) );
               return this;
             },
  }); 
 return SongView
});
