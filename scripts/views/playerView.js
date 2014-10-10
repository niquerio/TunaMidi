define(['jquery','underscore','backbone','collections/channelList','views/channelView', 'templates', 'views/appView', 'lib/bootstrap-slider.min'],function($,_,Backbone,Channels,ChannelView,templates, AppView){
  var PlayerView = Backbone.View.extend({
    tagName: 'div',
    initialize: function(){
      this.listenTo(Channels, 'change', this.updateChannel); 

              var self = this;
              MIDI.Player.loadFile( this.model.get('midi_data_url'),function(){ 
                self.addAllChannels();
                self.initMIDIChannels();
              });
    },
    events: {
              'click #play-pause' : 'playPause',
              'click #stop' : 'stop',
            },
    render: function(){
      var title = $('<h2>').text(this.model.get('title'))
      this.$el.append(title);
        this.$el.append(this.renderPlayer())
               this.$el.append( this.renderAllChannels());
              
                return this;
    },

    initMIDIChannels: function(){
                        var soloFlag = false;
                        this.model.get('active_channels').forEach(function(element, index){
                            if (element.solo) soloFlag = true;
                        });
                       for(var index in MIDI.channels){
                           if(this.model.attributes.active_channels[index]){
                             MIDI.programChange(index, this.model.attributes.active_channels[index].instrument);
                             if(this.model.attributes.active_channels[index].mute){
                                MIDI.channels[index].mute = true;
                             }else if(this.model.attributes.active_channels[index].solo){
                                MIDI.channels[index].mute = false;
                             }else{
                               if(soloFlag){
                                MIDI.channels[index].mute = true;
                               }else{
                                MIDI.channels[index].mute = false;
                               }
                             }
                           }else{
                             MIDI.programChange(index, 0);
                             MIDI.channels[index].mute = false;
                           } 
                        };
    },
    template: _.template(templates.player),
    updateTime: function() {
     $("#currentTime").text(this.timeFormatting(MIDI.Player.currentTime));    
     this.progressBar.slider('setValue', this.getSeconds(MIDI.Player.currentTime));
    },
    getInstruments: function(){
                      this.model.active_channels.forEach(function(element, index){
                        MIDI.programChange(index, element.instrument);
                      });
                    
    },
    updateChannel: function(channel){
                     var current = this.model.attributes.active_channels[channel.get('channel')-1];
                     current.solo = channel.get('solo');
                     current.mute = channel.get('mute');
                     current.instrument = channel.get('instrument');
                     current.volume = channel.get('volume');
    },
    playPause: function(){
      if( $('#play-pause').hasClass('playing')){
        $('#play-pause').removeClass('playing');
        $('#play-pause span:first-child').removeClass('glyphicon-pause');
        $('#play-pause span:first-child').addClass('glyphicon-play');
        MIDI.Player.pause();
        this.model.attributes.currentTime = MIDI.Player.currentTime; 
      }
      else{
        $('#play-pause').addClass('playing');
        $('#play-pause span:first-child').removeClass('glyphicon-play');
        $('#play-pause span:first-child').addClass('glyphicon-pause');
        var self = this;
        MIDI.Player.loadFile(this.model.attributes.midi_data_url, function(){
          MIDI.Player.currentTime = self.model.attributes.currentTime;
          MIDI.Player.resume();
        });
      }
    },
    stop: function(){
        if($('#play-pause').hasClass('playing')){
          $('#play-pause').removeClass('playing');
          $('#play-pause span:first-child').removeClass('glyphicon-pause');
          $('#play-pause span:first-child').addClass('glyphicon-play');
        }
        MIDI.Player.stop();
        this.model.currentTime=0;
        $('#currentTime').text('0:00');
        this.progressBar.slider('setValue', 0);
    },
    
    addAllChannels: function(){
      Channels.reset();
      this.model.get('active_channels').forEach(this.addOneChannel);
    },
    addOneChannel: function(element, index){
       element.channel = index +1;
       Channels.add(element);
    },
    renderOneChannel: function(channel){
    },
    renderAllChannels: function(){
      channelList = $("<table>").addClass('table').attr("id", "channels");
      channelList.append("<thead><tr><th>#</th><th>S</th><th>M</th><th>Instrument</th><th>Volume</th></tr></thead>");
      Channels.each(function(channel){
        
      var view = new ChannelView({ model: channel, id: 'channel' + channel.get('channel') });
      channelList.append(view.render().el);
      }, this);
      return channelList
    },
    renderPlayer: function(){
          
        var self = this;
          var player = $("<div>").html(this.template({
            duration: this.timeFormatting(this.model.get('endTime')/1000), 
            currentTime: this.timeFormatting(this.model.get('currentTime')/1000),
          }));
         this.progressBar = player.find('.slider').slider({
             value: this.getSeconds(this.model.get('currentTime')),
             max: this.getSeconds(this.model.get('endTime')),
             tooltip: 'hide',
             
         }).on('slideStart', function(){
           MIDI.Player.pause();
           self.model.attributes.currentTime = MIDI.Player.currentTime; 
           if($('play-pause').hasClass('playing')){
              $('#play-pause').removeClass('playing');
              $('#play-pause span:first-child').removeClass('glyphicon-pause');
              $('#play-pause span:first-child').addClass('glyphicon-play');
           }
         }).on('slideStop', function(slideEvent){
           MIDI.Player.currentTime = slideEvent.value * 1000;
           self.model.attributes.currentTime = slideEvent.value * 1000;
           MIDI.Player.resume();
           if($('play-pause').hasClass('playing') == false){
              $('#play-pause').addClass('playing');
              $('#play-pause span:first-child').removeClass('glyphicon-play');
              $('#play-pause span:first-child').addClass('glyphicon-pause');
           }
         }).on('slide', function(slideEvent){
              $('#currentTime').text(self.timeFormatting(slideEvent.value));
         });      
        
        this.volumeSlider = player.find('.masterVolume').slider({
          value: this.model.get('masterVolume'),
          max: 127,
          tooltip: 'hide',
       }).on('slideStart', function(slideEvent){
         if($('#play-pause').hasClass('playing')){
           MIDI.Player.pause();
         }
         self.model.set("masterVolume", slideEvent.value);
         MIDI.WebAudio.masterVolume = 
            slideEvent.value;
       }).on('slideStop', function(slideEvent){
         if($('#play-pause').hasClass('playing')){
           MIDI.Player.pause();
           MIDI.Player.resume();
         }
         self.model.set("masterVolume", slideEvent.value);
         MIDI.WebAudio.masterVolume = 
            slideEvent.value;
       }).on('slide', function(slideEvent){
         self.model.set("masterVolume", slideEvent.value);
         MIDI.WebAudio.masterVolume = 
            slideEvent.value;

        }); 

        MIDI.Player.setAnimation(function(data, element){
          if(MIDI.Player.playing){
            $("#currentTime").text(self.timeFormatting(data.now));    
            self.progressBar.slider('setValue', data.now >> 0);
          }
        
        });

        return player;
    },

    getSeconds: function(n){
      n = n/1000;
      return n >> 0;
    },
   timeFormatting: function(n){
      var minutes = n / 60 >> 0; 
      var seconds = String(n - (minutes * 60) >> 0);
      if (seconds.length == 1) seconds = "0" + seconds;
      return minutes + ":" + seconds;
   }, 


  });
  return PlayerView;
});
