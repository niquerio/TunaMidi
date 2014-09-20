var app = app || {};

app.Song = Backbone.Model.extend({
    defaults: {
        title: 'Unknown',
        currentTime: 0,
        midi_src:  '',
        midi_data_url: '',
        load_midi_callback: function(){},
    },

    initialize: function(){
        this.listenTo(this, 'change:midi_src', this.load_midi);
        var error = this.validate(this.attributes);
        if(error){
           console.log('Initialization Error: ' + error);
           return ;
        }else{
          this.load_midi(); 
      }

      
    },
    
    validate: function(attrs){
        var self = this;
        if (attrs.hasOwnProperty('midi_src')){
           var return_val =  null;
           if(this.get('midi_src').indexOf("base64,") !== -1){
               this.set('midi_data_url', this.get('midi_src'));
           }else{
           $.ajax({
                  type: "POST",
                  url: "php/get_remote_midi.php",
                  data: {midi_src: attrs.midi_src},
                  async: false,
                  }).success( function(data){ 
                      self.set('midi_data_url', data);
                  }).error(function(xhr, status, error) {
                     self.set('midi_data_url', '');
                     return_val = xhr.responseText;

              });
          }
           if(!return_val){
               try{
                   var data = window.atob(self.get('midi_data_url').split(",")[1]);
                   MidiFile(data)
               }
               catch(err){
                 console.log('Failed to load because: ' + err);
                 self.set('midi_data_url', '');
                 return_val = err;
               }
           }
           return return_val;
        }
    },


  load_midi: function(){
     var self = this;
        MIDI.Player.loadFile(this.get('midi_data_url'),function(){
            self.set({data: $.extend(true, [],MIDI.Player.data) });
            self.attributes.load_midi_callback();
            }); 

  },

});
