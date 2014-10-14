define(['jquery', 'underscore', 'backbone', 'templates', 'collections/channelList', 'common', 'lib/MIDI', 'helpers/loadSoundfont','bootstrap', 'select2'], function($,_,Backbone,templates, Channels, Common, MIDI, loadSoundfont ){
  var ChannelView = Backbone.View.extend({
      tagName: 'tr',
  
      template: _.template(templates.channelView),
  
      events: {
        'click .solo': 'solo',
        'click .mute': 'mute',
        'blur .edit': 'close',

      },
  
     updateOnEnter: function(e){
                     if (e.keyCode === Common.ENTER_KEY ){
                       this.close();
                     } 
     },
     close: function(){
     },
     initialize: function(){
     },
     
     
     render: function(){
       this.$el.html( this.template(this.model.attributes) );
       this.$input = this.$('.edit');
       this.$volume = this.$('.volumeSlider')

       this.$input.select2({
         data: Common.Instruments,
       });

       this.$input.select2("val",this.model.get('instrument'));
       var self = this;
       this.$input.on("select2-selecting", function(instrument){
         var wasPlaying = MIDI.Player.playing;
         if(MIDI.Player.playing){
           Channels.trigger('pause');
         }
         MIDI.programChange(self.model.get('channel')-1, instrument.val);
         self.model.set("instrument", instrument.val);

         var instrument_name = MIDI.GeneralMIDI.byId[instrument.val].id;
         if(!MIDI.Soundfont[instrument_name]){
           loadSoundfont({
             instruments: [instrument_name], 
             callback: function(){ 
               if(wasPlaying){ Channels.trigger('resume') } 
               MIDI.loader.stop(); 
             },
           });
         }else{
             if(wasPlaying){ Channels.trigger('resume') } 
         }

       });

       //volumeSlider
       this.$volume.slider({
         value: this.model.get('volume'),
         max: 127,
         tooltip: 'hide',
       }).on('slideStart', function(slideEvent){
         if($('#play-pause').hasClass('playing')){
           Channels.trigger('pause');
         }
         self.model.set("volume", slideEvent.value);
         MIDI.channels[self.model.get('channel')-1].volume = 
            slideEvent.value;
       }).on('slideStop', function(slideEvent){
         if($('#play-pause').hasClass('playing')){
           Channels.trigger('pause');
           Channels.trigger('resume');
         }
         self.model.set("volume", slideEvent.value);
         MIDI.channels[self.model.get('channel')-1].volume = 
            slideEvent.value;
       }).on('slide', function(slideEvent){
         self.model.set("volume", slideEvent.value);
         MIDI.channels[self.model.get('channel')-1].volume = 
            slideEvent.value;

       });

       return this;
    },
    solo: function(){
      if(this.model.get('solo') == false){ //turn solo on
        if(this.$el.find('.mute').hasClass('active')) this.$el.find('.mute').button('toggle');
        this.model.set('solo', true);
        this.model.set('mute', false);
        this.updateChannels();
      }else{ //turn solo off
        this.model.set('solo', false);
        this.updateChannels();
      }
      if(MIDI.Player.playing){
        Channels.trigger('pause');
        Channels.trigger('resume');
      }
    },
    mute: function(){
      if(this.model.get('mute') == false){ //turn mute on
        if(this.$el.find('.solo').hasClass('active')) this.$el.find('.solo').button('toggle');
        this.model.set('solo', false);
        this.model.set('mute', true);
        this.updateChannels();
      }else{ //turn mute off
        this.model.set('mute', false);
        this.updateChannels();
      }

      if(MIDI.Player.playing){
        Channels.trigger('pause');
        Channels.trigger('resume');
      }
    },
    updateChannels: function(){
        var otherSoloFlag = false;
        Channels.each( function(channel){
          if(channel.get('solo')) otherSoloFlag = true; 
        }, this);
        Channels.each(function(channel){
          if(channel.get('solo')){
            channel.set('mute', false);
            MIDI.channels[channel.get('channel') - 1].mute = false;
          }else if(channel.get('mute')){
            channel.set('solo', false);
            MIDI.channels[channel.get('channel') - 1].mute = true;
          }else{
            channel.set('mute', false);
            channel.set('solo', false);
            if(otherSoloFlag){
              MIDI.channels[channel.get('channel') - 1].mute = true;
            }else{
              MIDI.channels[channel.get('channel') - 1].mute = false;
            }
          }
        }, this);
    },

  }); 
 return ChannelView
});
