
define([
    "underscore",
    "backbone", 
    "collections/songList", 
    "views/appView",
    "helpers/readFile",
    "common", 
    "templates",
    "jasny",
    ],function( _, Backbone, Songs, appView, readFile, Common, templates ){
    var UploadView = Backbone.View.extend({
       tagName: 'form',

       template: _.template(templates.upload),
       events: {
          'click #submit_upload': 'submitUpload',
          'click #submit_url': 'submitURL',
       },
 
       render: function(){
           this.$el.html(this.template());
           return this;
       },

       submitUpload: function(){
              readFile($('#upload_file').get(0).files[0]);
              $('.fileinput').fileinput('clear');
       },

       submitURL: function(){
              Songs.create({'midi_src': $('#upload_url').val()});
              Songs.fetch({reset:true});
              Songs.trigger('submitSong');
       },

    });
    return UploadView
});
