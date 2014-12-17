define([
    'jquery',
    'underscore',
    'path',
    'models/song',
    'models/channel',
    'views/playerView', 
    'collections/channelList', 
    'jasmine-jquery', 
    'lib/bootstrap-slider.min', 
    'bootstrap'],function($,_,path,Song,Channel,PlayerView,Channels){
  describe("Player View", function(){
   var song;
    
     beforeEach(function(done){
       setFixtures('<div id="playerContainer"></div>');
       song = new Song({midi_src: path + 'spec/midi/aucun_se_sont.midi',
         load_midi_callback: function(){
         }, 
       }); 
      this.playerView = new PlayerView({model: song});
      
      this.active_channels = this.playerView.model.get('active_channels');
      $('#playerContainer').append(this.playerView.render().el);
      done();
     });

     afterEach(function(){
       MIDI.Player.stop();
       this.playerView.remove();
       $('#playerContainer').remove();
       //song.destroy();
       Channels.reset();
       MIDI.channels[0].mute = false;
       MIDI.channels[1].mute = false;
       MIDI.channels[2].mute = false;
     });
    it("Should add active_channels to Channels", function(){
          expect(Channels.length).toBe(3);
    });

    it("Should clear Channels on initialize", function(){
        Channels.reset();
        Channels.add({channel: 3});
        expect(Channels.length).toBe(1);
        var song = new Song({midi_src: path + 'spec/midi/aucun_se_sont.midi',
        load_midi_callback: function(){
        } 
      });
        expect(Channels.length).toBe(1);
          var player = new PlayerView({ model: song}); 
          expect(Channels.length).toBe(3);
          player.remove();
    });

    it("Should add all channels in Channels to channelList table", function() {
      expect($('#playerContainer').find('thead')).toContainText('Instrument');
      var first = $('#playerContainer').find('tbody').children('tr:first');
      expect(first).toContainText('Harpsichord');
      
    });
    it("Should play loaded midi when play button is clicked", function(){

      expect($('#play-pause')).not.toHaveClass('playing');
      expect($('#play-pause span:first-child')).toHaveClass("glyphicon-play");
      expect(MIDI.Player.playing).toBe(false);
      $('#play-pause').click();
      expect($('#play-pause')).toHaveClass('playing')
      expect(MIDI.Player.playing).toBe(true);
      expect($('#play-pause span:first-child')).toHaveClass("glyphicon-pause");
      $('#play-pause').click();

    });

    it("Should pause loaded midi after having played", function(done){
      expect(this.playerView.model.get('currentTime')).toBe(0);
      $('#play-pause').click();
      expect(this.playerView.model.get('currentTime')).toBe(0);
      expect(MIDI.Player.playing).toBe(true);
      expect($('#play-pause span:first-child')).toHaveClass("glyphicon-pause");
      self=this;
      window.setTimeout(function(){
        $('#play-pause').click();
        expect($('#play-pause span:first-child')).toHaveClass("glyphicon-play");
        expect(MIDI.Player.playing).toBe(false);
        expect(self.playerView.model.get('currentTime')).not.toBe(0);
        done();
      },1000);
    });

    it("Should stop playing Midi", function(done){
      expect(this.playerView.model.get('currentTime')).toBe(0);
      $('#play-pause').click();
      expect($('#play-pause')).toHaveClass('playing')
      expect($('#play-pause span:first-child')).toHaveClass("glyphicon-pause");
      expect(MIDI.Player.playing).toBe(true);
      self=this;
      window.setTimeout(function(){

         $('#stop').click();
         expect($('#play-pause')).not.toHaveClass('playing')
         expect($('#play-pause span:first-child')).toHaveClass("glyphicon-play");
         expect(MIDI.Player.playing).toBe(false);
         expect(self.playerView.model.get('currentTime')).toBe(0);
         done();
      },1000);

    });

    it("Should display duration of midi", function(){
      expect($('#duration')).toHaveText('1:33');
    });
    it("Should update #currentTime at intervals", function(done){

      expect($('#currentTime')).toHaveText('0:00');
      $('#play-pause').click();
      self=this;
      var time = '';
      window.setTimeout(function(){
         expect($('#currentTime')).not.toHaveText('0:00');
         time = $('#currentTime').text();        
         window.setTimeout(function(){
            expect($('#currentTime')).not.toHaveText(time);
            $('#stop').click();
            done(); 
         },1000);
      },3000);
     
    });

    describe("Solo Mute", function(){
      it("ch1-N ch2-N ch3-N to ch1-S ", function(){
        expect(this.active_channels[0].solo).toBe(false);
        expect(this.active_channels[0].mute).toBe(false);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(false)

        $('#channel1').find('button.solo').click();
        expect(this.active_channels[0].solo).toBe(true);
        expect(this.active_channels[0].mute).toBe(false);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(true)
      });   
      it("ch1-N ch2-N ch3-N to ch1-M ", function(){
        expect(this.active_channels[0].solo).toBe(false);
        expect(this.active_channels[0].mute).toBe(false);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(false)

        $('#channel1').find('button.mute').click();
        expect(this.active_channels[0].solo).toBe(false);
        expect(this.active_channels[0].mute).toBe(true);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(false)
      });   

      it("ch1-S ch2-N ch3-N to ch1-N ", function(){
        $('#channel1').find('button.solo').click();


        expect(this.active_channels[0].solo).toBe(true);
        expect(this.active_channels[0].mute).toBe(false);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.mute').click();
        expect(this.active_channels[0].solo).toBe(false);
        expect(this.active_channels[0].mute).toBe(true);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(false)
      });   
      it("ch1-S ch2-N ch3-N to ch1-M ", function(){
        $('#channel1').find('button.solo').click();


        expect(this.active_channels[0].solo).toBe(true);
        expect(this.active_channels[0].mute).toBe(false);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.mute').click();
        expect(this.active_channels[0].solo).toBe(false);
        expect(this.active_channels[0].mute).toBe(true);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(false)
      });   

      it("ch1-M ch2-N ch3-N to ch1-N ", function(){
        $('#channel1').find('button.mute').click();


        expect(this.active_channels[0].solo).toBe(false);
        expect(this.active_channels[0].mute).toBe(true);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(false)

        $('#channel1').find('button.mute').click();
        expect(this.active_channels[0].solo).toBe(false);
        expect(this.active_channels[0].mute).toBe(false);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(false)
      });   
      it("ch1-M ch2-N ch3-N to ch1-S ", function(){
        $('#channel1').find('button.mute').click();


        expect(this.active_channels[0].solo).toBe(false);
        expect(this.active_channels[0].mute).toBe(true);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(false)

        $('#channel1').find('button.solo').click();
        expect(this.active_channels[0].solo).toBe(true);
        expect(this.active_channels[0].mute).toBe(false);
        expect(this.active_channels[1].solo).toBe(false);
        expect(this.active_channels[1].mute).toBe(false);
        expect(this.active_channels[2].solo).toBe(false);
        expect(this.active_channels[2].mute).toBe(false);

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(true)
      });   

      it("ch1-N ch2-S ch3-N to ch1-S ", function(){
        $('#channel2').find('button.solo').click();
        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.solo').click();
        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)

      });   
      it("ch1-N ch2-S ch3-N to ch1-M ", function(){
        $('#channel2').find('button.solo').click();
        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.mute').click();
        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)
      });   

      it("ch1-S ch2-S ch3-N to ch1-N ", function(){
        $('#channel1').find('button.solo').click();
        $('#channel2').find('button.solo').click();
        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.solo').click();
        expect($('#channel1').find('.solo')).not.toHaveClass('active');
        expect($('#channel1').find('.mute')).not.toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)
      });   
      it("ch1-S ch2-S ch3-N to ch1-M ", function(){
        $('#channel1').find('button.solo').click();
        $('#channel2').find('button.solo').click();
        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.mute').click();
        expect($('#channel1').find('button.solo')).not.toHaveClass('active');
        expect($('#channel1').find('button.mute')).toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)
      });   

      it("ch1-M ch2-S ch3-N to ch1-N ", function(){
        $('#channel1').find('button.mute').click();
        $('#channel2').find('button.solo').click();
        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.mute').click();
        expect($('#channel1').find('button.solo')).not.toHaveClass('active');
        expect($('#channel1').find('button.mute')).not.toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)
      });   
      it("ch1-M ch2-S ch3-N to ch1-S ", function(){
        $('#channel1').find('button.mute').click();
        $('#channel2').find('button.solo').click();
        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.solo').click();
        expect($('#channel1').find('button.solo')).toHaveClass('active');
        expect($('#channel1').find('button.mute')).not.toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(false)
        expect(MIDI.channels[2].mute).toBe(true)
      });   

      it("ch1-N ch2-M ch3-N to ch1-S ", function(){
        $('#channel2').find('button.mute').click();
        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(false)

        $('#channel1').find('button.solo').click();
        expect($('#channel1').find('button.solo')).toHaveClass('active');
        expect($('#channel1').find('button.mute')).not.toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(true)
      });   
      it("ch1-N ch2-M ch3-N to ch1-M ", function(){
        $('#channel2').find('button.mute').click();
        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(false)

        $('#channel1').find('button.mute').click();
        expect($('#channel1').find('button.solo')).not.toHaveClass('active');
        expect($('#channel1').find('button.mute')).toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(false)
      });   

      it("ch1-S ch2-M ch3-N to ch1-N ", function(){
        $('#channel1').find('button.solo').click();
        $('#channel2').find('button.mute').click();
        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.solo').click();
        expect($('#channel1').find('button.solo')).not.toHaveClass('active');
        expect($('#channel1').find('button.mute')).not.toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(false)
      });   
      it("ch1-S ch2-M ch3-N to ch1-M ", function(){
        $('#channel1').find('button.solo').click();
        $('#channel2').find('button.mute').click();
        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(true)

        $('#channel1').find('button.mute').click();
        expect($('#channel1').find('button.solo')).not.toHaveClass('active');
        expect($('#channel1').find('button.mute')).toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(false)
      });   

      it("ch1-M ch2-M ch3-N to ch1-N ", function(){
        $('#channel1').find('button.mute').click();
        $('#channel2').find('button.mute').click();
        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(false)

        $('#channel1').find('button.mute').click();
        expect($('#channel1').find('button.solo')).not.toHaveClass('active');
        expect($('#channel1').find('button.mute')).not.toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(false)
      });   
      it("ch1-M ch2-M ch3-N to ch1-S ", function(){
        $('#channel1').find('button.mute').click();
        $('#channel2').find('button.mute').click();
        expect(MIDI.channels[0].mute).toBe(true)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(false)

        $('#channel1').find('button.solo').click();
        expect($('#channel1').find('button.solo')).toHaveClass('active');
        expect($('#channel1').find('button.mute')).not.toHaveClass('active');

        expect(MIDI.channels[0].mute).toBe(false)
        expect(MIDI.channels[1].mute).toBe(true)
        expect(MIDI.channels[2].mute).toBe(true)
      });   
    });   
    describe("Measure Range", function(){
      it("Should start at the start of the measure range", function(){
      });
      it("The last measure played should be the one before the last measure of measureRange", function(){
      });
      it("Should work properly when there's an intro", function(){
});
    });
    describe("Intro Clicks", function(){
        it("Should default to clicks turned off", function(){
          expect(this.playerView.model.get("intro")).toBe(false);
        });

        it("Should default to 4 clicks of default countBy Value", function(){
          expect(this.playerView.model.get("intro_numberOfBeats")).toBe(4);
          expect(this.playerView.model.get("intro_countBy")).toBe('half-note');
          expect(this.playerView.model.get("intro_countBy")).toBe(this.playerView.model.get("countBy"));
        });

        it("Should put clicks at start of song", function(done){
          var count = 0;
          var clicks = [];
          var first_real_note_channel = 16; //should not be this;
          MIDI.Player.addListener(function(data){
            if(count == 4){
              first_real_note_channel = data.channel;
              expect(first_real_note_channel).not.toBe(16);
              expect(clicks.toString()).toBe([16,16,16,16].toString());
              done();
            }
            if(count < 4){
              count++
              clicks.push(data.channel);
            }
          });


          $('#play-pause').click();
        });

        it("Should put clicks at first measure of measureRange", function(done){
          var count = 0;
          var clicks = [];
          var first_real_note_channel = 16; //should not be this;
          MIDI.Player.addListener(function(data){
            if(count == 4){
              first_real_note_channel = data.channel;
              expect(first_real_note_channel).not.toBe(16);
              expect(clicks.toString()).toBe([16,16,16,16].toString());
              count++
              done();
            }
            if(count < 4){
              count++
              clicks.push(data.channel);
            }
          });

          this.playerView.$measuresSlider.slider('setValue', [5,10]);
            var e = $.Event("slideStop", {value: [5,10]});
            this.playerView.$measuresSlider.trigger(e);
          $('#intro').click();
          $('#play-pause').click();
          
        });
        it("Should handle measureRange with weird timeWarp Properties", function(done){
          var count = 0;
          var clicks = [];
          var first_real_note_channel = 16; //should not be this;
          MIDI.Player.addListener(function(data){
            if(count == 4){
              first_real_note_channel = data.channel;
              expect(first_real_note_channel).not.toBe(16);
              expect(clicks.toString()).toBe([16,16,16,16].toString());
              count++
              done();
            }
            if(count < 4){
              count++
              clicks.push(data.channel);
            }
          });

          $("#tempo").val('111').blur();
          this.playerView.$measuresSlider.slider('setValue', [6,13]);
            var e = $.Event("slideStop", {value: [6,13]});
            this.playerView.$measuresSlider.trigger(e);
          $('#intro').click();
          $('#play-pause').click();
        });

        it("Should not put in clicks when resuming from seeking", function(){
        });

        it("Should be able to change number of starting clicks", function(){
        });

        it("Should be able to change countBy note of clicks", function(){
        });

        it("Should adjust values appropriately based on timeWarp", function(){
        });

        it("After turning intro off while playing, seeking to the beginning should not have clicks", function(){
        });

        it("Should handle songs where there is no note event at a measure", function(){
        });
    });
    describe("Metronome", function(){
    });
  });
});

