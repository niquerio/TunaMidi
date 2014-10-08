define(['jquery','underscore','path','models/song','models/channel','views/playerView', 'collections/channelList', 'jasmine-jquery', 'lib/bootstrap-slider.min', 'bootstrap'],function($,_,path,Song,Channel,PlayerView,Channels){
  describe("Player View", function(){

    var song;
    
     beforeEach(function(){
       setFixtures('<div id="playerContainer"><div id="player"></div><table id="channelList"></table></div>');
       var self = this;
       var song = new Song({midi_src: path + 'spec/midi/aucun_se_sont.midi',
         load_midi_callback: function(){
           self.playerView = new PlayerView({model: this});
         }, 
       }); 
      
       this.active_channels = this.playerView.model.active_channels;
     });
     afterEach(function(){
       this.playerView.remove();
       $('#channelList').remove();
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
        var song = new Song({midi_src: path + 'spec/midi/rachmaninov3.mid',
        load_midi_callback: function(){
          expect(Channels.length).toBe(1);
          var player = new PlayerView({ model: this}); 
          expect(Channels.length).toBe(11);
        } 
      });
    });

    it("Should add Channel to channelList table", function(){
      var channel = new Channel({channel: 3});
      this.playerView.renderOneChannel(channel);
      expect($('#channelList')).toContainText('VOLUME');
    }); 
    it("Should add all channels in Channels to channelList table", function() {
      expect($('#channelList').find('thead')).not.toContainText('Instrument');
      this.playerView.renderAllChannels();
      expect($('#channelList').find('thead')).toContainText('Instrument');
      var first = $('#channelList').find('tbody').children('tr:first');
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
      expect(this.playerView.model.currentTime).toBe(0);
      $('#play-pause').click();
      expect(this.playerView.model.currentTime).toBe(0);
      expect(MIDI.Player.playing).toBe(true);
      expect($('#play-pause span:first-child')).toHaveClass("glyphicon-pause");
      self=this;
      window.setTimeout(function(){
        $('#play-pause').click();
        expect($('#play-pause span:first-child')).toHaveClass("glyphicon-play");
        expect(MIDI.Player.playing).toBe(false);
        expect(self.playerView.model.currentTime).not.toBe(0);
        done();
      },1000);
    });

    it("Should stop playing Midi", function(done){
      expect(this.playerView.model.currentTime).toBe(0);
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
         expect(self.playerView.model.currentTime).toBe(0);
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
  });
});

