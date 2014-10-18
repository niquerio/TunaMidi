define(['jquery','underscore','backbone','collections/channelList','views/channelView', 'templates', 'views/appView', 
    'common',
    'bootstrap',
    'lib/bootstrap-slider.min',
    'lib/bootstrap-touchspin',
    'lib/iconpicker',
    ], function($,_,Backbone,Channels,ChannelView,templates, AppView, Common){
  var PlayerView = Backbone.View.extend({
    tagName: 'div',
    initialize: function(){
      this.listenTo(Channels, 'change', this.updateChannel); 
      this.listenTo(Channels, 'pause', this.pause); 
      this.listenTo(Channels, 'resume', this.resume); 

              var self = this;
              MIDI.Player.loadFile( this.model.get('midi_data_url'),function(){ 
                self.addAllChannels();
                self.initMIDIChannels();
                MIDI.Player.transpose = self.model.get('transpose');
              });
    },
    events: {
              'click #play-pause' : 'playPause',
              'click #stop' : 'stop',
              'blur #transpose' :  'setTranspose',
              'blur #tempo' :  'setTempo',
              'keypress #transpose' : 'updateTransposeOnEnter',
              'keypress #tempo' : 'updateTempoOnEnter',
              'click #repeat' : 'toggleRepeat',
            },
    render: function(){
      var title = $('<h2>').text(this.model.get('title'))
        this.$el.append(title);
        this.$el.append(this.renderPlayer())
        this.$el.append(this.renderMeasures())
        this.$el.append(this.renderOptions())
        this.$el.append( this.renderAllChannels());
        this.setAnimation();
              
                return this;
    },
    toggleRepeat: function(){
           this.model.set("repeat", !this.model.get("repeat"));
    },
    updateTransposeOnEnter: function(e){
      if (e.keyCode === Common.ENTER_KEY ){
        this.transpose.blur();
      } 
    },
    updateTempoOnEnter: function(e){
      if (e.keyCode === Common.ENTER_KEY ){
        this.$tempo.blur();
      } 
    },

    setTranspose: function(e){
        var transpose = parseInt(e.target.value);
           if(!isNaN(transpose)){
             if(this.model.get("transpose") != transpose){
                this.model.set("transpose", transpose);
                MIDI.Player.transpose = transpose;
                if($('#play-pause').hasClass('playing')){
                    this.pause();
                    this.resume();
                  }
             }
           }else{
             this.transpose.val(this.model.get("transpose"));
           }
      },
    setTempo: function(e){
        var tempo = parseInt(e.target.value) * Common.NoteValues[this.model.get("countBy")];
        var self = this;
           if(!isNaN(tempo) && tempo >= 0){
             var timeWarp = this.model.get("tempo") / tempo ;
             if(this.model.get("timeWarp") != timeWarp){
                this.model.set("timeWarp", timeWarp);
                MIDI.Player.timeWarp = timeWarp;
                if($('#play-pause').hasClass('playing')){ this.pause(); }
                var currentPercent = MIDI.Player.currentTime/MIDI.Player.endTime;
                MIDI.Player.loadFile(this.model.get("midi_data_url"), function(){
                  var newTime = MIDI.Player.endTime * currentPercent;
                  self.model.set("currentTime", newTime);
                  MIDI.Player.currentTime = newTime;
                  self.model.set("endTime",MIDI.Player.endTime);
                  self.progressBar.slider('setAttribute', 'max', self.getSeconds(MIDI.Player.endTime))
                  self.progressBar.slider('setValue', self.getSeconds(MIDI.Player.currentTime))
                  $("#duration").text(self.timeFormatting(MIDI.Player.endTime/1000));
                  if($('#play-pause').hasClass('playing')){ self.resume(); }
                });
             }
           }else{
             this.$tempo.val(this.model.get("tempo")/Common.NoteValues[this.model.get("countBy")]/this.model.get("timeWarp"));
           }
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
    optionsTemplate: _.template(templates.options),
    measuresTemplate: _.template(templates.measures),
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
        this.pause();
        this.model.set("currentTime", MIDI.Player.currentTime); 
      }
      else{
        $('#play-pause').addClass('playing');
        $('#play-pause span:first-child').removeClass('glyphicon-play');
        $('#play-pause span:first-child').addClass('glyphicon-pause');
        var self = this;
        MIDI.Player.loadFile(this.model.get("midi_data_url"), function(){
          MIDI.Player.currentTime = self.model.get("currentTime");
          self.resume();
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
        var measures = this.model.get("measures");
        var measureRange = this.model.get("measureRange");
        this.model.set("currentTime",measures[measureRange[0]]);
        this.model.set("currentMeasure",measureRange[0]);
        $('#currentTime').text(this.timeFormatting(this.model.get("currentTime")/1000));
        $('#currentMeasure').text(measureRange[0]);
        this.progressBar.slider('setValue', this.getSeconds(this.model.get("currentTime")));
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
    renderOptions: function(){
                     var self = this;
                     var options = $("<form>").addClass('form-inline').html(this.optionsTemplate({
                       countBy: this.model.get("countBy"), 
                     }));
                     this.transpose = options.find("#transpose").TouchSpin({
                       max: 50,
                       min: -50,
                       initval: this.model.get('transpose'),
                     }).on('touchspin.on.startspin', function(){
                       if($('#play-pause').hasClass('playing')){
                         self.pause();
                       }
                     }).on('touchspin.on.stopspin', function(e){
                       self.model.set("transpose", parseInt(e.target.value));
                       MIDI.Player.transpose = parseInt(e.target.value);
                       if($('#play-pause').hasClass('playing')){
                         self.resume();
                       }
                     });

                     this.$tempo = options.find("#tempo").TouchSpin({
                       max: 1000,
                       min: 0,
                       initval: this.model.get('tempo')/Common.NoteValues[this.model.get('countBy')]/this.model.get("timeWarp"),
                       postfix: "bpm",
                     }).on('touchspin.on.startspin', function(){
                       if($('#play-pause').hasClass('playing')){
                         self.pause();
                       }
                     }).on('touchspin.on.stopspin', function(e){
                       self.setTempo(e);
                    });

                     this.$countBy = options.find(".countBy").iconpicker({
                       icons: [
                       'icon-eighth-note',
                       'icon-quarter-note', 
                       'icon-dotted-quarter-note' , 
                       'icon-half-note',
                       'icon-dotted-half-note',
                       'icon-whole-note',
                       ],  
                     }).on("iconpickerSelected", function(e){
                        var countBy = e.iconpickerValue.replace(/icon-/, '');
                        self.model.set("countBy", countBy);
                        self.$tempo.val(self.model.get("tempo")/Common.NoteValues[countBy]/self.model.get("timeWarp"));
                        self.$countBy.dropdown('toggle');
                     });
                     return options;
    },
    renderMeasures: function(){
       var self = this;
       var measures = $("<div>").html(this.measuresTemplate({
         currentMeasure: this.model.get("currentMeasure"),
         start: this.model.get("measureRange")[0],
         finish: this.model.get("measureRange")[1],
         repeat: this.model.get("repeat"),
       }));
       this.$measuresSlider = measures.find(".set_of_measures").slider({
        max: this.model.get("lastMeasureToBePlayed"),
         min: 1,
         range: true,
         value: this.model.get("measureRange"),
       }).on("slideStart", function(){
           self.pause();
       }).on('slideStop', function(slideEvent){
         self.model.set("measureRange", slideEvent.value);
         var measures = self.model.get("measures");
         self.model.set("currentMeasure", slideEvent.value[0]);
         self.model.set("currentTime", measures[slideEvent.value[0]]);
         $('#currentMeasure').text(slideEvent.value[0]);
         $('#currentTime').text(self.timeFormatting(self.model.get('currentTime')/1000));
         $('#measureRange').text(slideEvent.value[0] + ' - ' + slideEvent.value[1]);
         self.progressBar.slider('setValue', self.model.get('currentTime')/1000 >> 0);
         if($('#play-pause').hasClass('playing')){
           self.resume();
         }
       }).on("slide", function(slideEvent){
         $('#measureRange').text(slideEvent.value[0] + ' - ' + slideEvent.value[1]);
       });
      return measures;
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
           self.pause();
           self.model.attributes.currentTime = MIDI.Player.currentTime; 
           if($('play-pause').hasClass('playing')){
              $('#play-pause').removeClass('playing');
              $('#play-pause span:first-child').removeClass('glyphicon-pause');
              $('#play-pause span:first-child').addClass('glyphicon-play');
           }
         }).on('slideStop', function(slideEvent){
           MIDI.Player.currentTime = slideEvent.value * 1000;
           self.model.set('currentTime', slideEvent.value * 1000);
           var measures = self.model.get('measures');
           for(n = 1; n <= measures.length; n++){
             if(measures[n]*self.model.get('timeWarp') > slideEvent.value * 1000){
               self.model.set('currentMeasure', n-1);
               $('#currentMeasure').text(n-1);
               break;
             }
           }
           var measureRange = self.model.get('measureRange')
           if(self.model.get('currentMeasure') < measureRange[0] || self.model.get('currentMeasure') > measureRange[1]){
             self.model.set("currentTime",measures[measureRange[0]]);
             self.model.set("currentMeasure",measureRange[0]);
             $('#currentTime').text(self.timeFormatting(self.model.get("currentTime")/1000));
             $('#currentMeasure').text(measureRange[0]);
             self.progressBar.slider('setValue', self.getSeconds(self.model.get("currentTime")));
             MIDI.Player.currentTime = self.model.get("currentTime");
           }
           self.resume();
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
           self.pause();
         }
         self.model.set("masterVolume", slideEvent.value);
         MIDI.WebAudio.masterVolume = 
            slideEvent.value;
       }).on('slideStop', function(slideEvent){
         self.model.set("masterVolume", slideEvent.value);
         MIDI.WebAudio.masterVolume = 
            slideEvent.value;
         if($('#play-pause').hasClass('playing')){
           self.pause();
           self.resume();
         }
       }).on('slide', function(slideEvent){
         self.model.set("masterVolume", slideEvent.value);
         MIDI.WebAudio.masterVolume = 
            slideEvent.value;

        }); 


        return player;
    },

    resume: function(){
              $("#currentMeasure").text(this.model.get("currentMeasure"));
              MIDI.Player.resume()
              this.setAnimation();
    },
    pause: function(){
             MIDI.Player.pause();
             MIDI.Player.clearAnimation();
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
   setAnimation: function(){
        var self = this;
        MIDI.Player.setAnimation(function(data, element){
        var measures = self.model.get('measures');
        var measureRange = self.model.get("measureRange");

          if(MIDI.Player.playing){
            $("#currentTime").text(self.timeFormatting(data.now));    
            self.progressBar.slider('setValue', data.now >> 0);

            var endRangeTime = measures[measureRange[1]+1]
            var nextMeasureTime = measures[self.model.get('currentMeasure')+1] * self.model.get('timeWarp');
            if(data.now*1000 > endRangeTime){
                self.pause();
                self.model.set("currentTime", measures[measureRange[0]]);
                MIDI.Player.currentTime = measures[measureRange[0]];
                self.model.set("currentMeasure", measureRange[0]);
              if(self.model.get("repeat")){
                $("#currentMeasure").text(measureRange[0]);
                self.resume();
              }else{
                $('#play-pause').removeClass('playing');
                $('#play-pause span:first-child').removeClass('glyphicon-pause');
                $('#play-pause span:first-child').addClass('glyphicon-play');
              }
            }else if( data.now*1000 > nextMeasureTime){
               var currentMeasure = self.model.get('currentMeasure') + 1;
                self.model.set("currentMeasure", currentMeasure);
                $("#currentMeasure").text(currentMeasure);
            }

          }
          if(data.now == data.end){
            self.pause();
            self.model.set("currentTime", measures[measureRange[0]]);
            MIDI.Player.currentTime = measures[measureRange[0]];
            self.model.set("currentMeasure", measureRange[0]);
            if(self.model.get("repeat")){
              $("#currentMeasure").text(measureRange[0]);
              self.resume();
            }else{

              $('#play-pause').removeClass('playing');
              $('#play-pause span:first-child').removeClass('glyphicon-pause');
              $('#play-pause span:first-child').addClass('glyphicon-play');
            }

          }
        
        });
   },


  });
  return PlayerView;
});
