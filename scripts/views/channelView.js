define(['jquery', 'underscore', 'backbone', 'templates', 'collections/channelList', 'bootstrap'], function($,_,Backbone,templates, Channels){
  var ChannelView = Backbone.View.extend({
      tagName: 'tr',
  
      template: _.template(templates.channelView),
  
      events: {
        'click .solo': 'solo',
        'click .mute': 'mute',
      },
  
     initialize: function(){
     },
     
     render: function(){
               this.$el.html( this.template(this.model.attributes) );
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
        MIDI.Player.pause();
        MIDI.Player.resume();
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
        MIDI.Player.pause();
        MIDI.Player.resume();
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
