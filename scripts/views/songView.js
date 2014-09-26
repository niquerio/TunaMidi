var app = app || {};
app.SongView = Backbone.View.extend({
    tagName: 'li',

    songTpl: _.template($('#song-template').html()),

    events: {
    },

   initialize: function(){
        this.listenTo(this.model, 'change:playing', this.pause);
   },
}); 
