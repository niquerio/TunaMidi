
define(['underscore', 'backbone', 'lib/MIDI', 'helpers/loadSoundfont','common', 'lib/Base64'], function(_, Backbone, MIDI, loadSoundfont, Common){
  var Song = Backbone.Model.extend({
      defaults: {
          title: 'Unknown',
          currentTime: 0,
          currentMeasure: 1,
          measureRange: [1, 1],
          active_channels: new Array(),
          measures: new Array(),
          endTime: 0,
          midi_src:  '',
          midi_data_url: '',
          load_midi_callback: function(){},
          timeWarp: 1,
          tempo: 0, //quarter-note = bpm
          masterVolume: 127,
          transpose: 0,
          denominator: 4,
          countBy: 'quarter-note', 
          repeat: false,
          intro_numberOfBeats: 4,
          intro_countBy: 'quarter-note', 
          intro: false,
          metronome: false,
          metronome_countBy: 'quarter-note',
  
      },
  
      initialize: function(){
          this.listenTo(this, 'change:midi_src', this.load_midi);
          this.listenTo(this, 'myError', console.log('myError'));
          var error = this.validate(this.attributes);
          if(error){
             console.log('Initialization Error: ' + error);
             this.trigger('myError', this, error);
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
       if(/\.midi?$/.test(this.get('midi_src')) && this.get('title') === 'Unknown'){
         var myArray = /([\w-]+)\.midi?$/.exec(this.get('midi_src'));
         title = myArray[1];
         this.set('title', title);
       }
       var self = this;
          MIDI.Player.loadFile(this.get('midi_data_url'),function(){
              if(self.get('tempo') === 0){
                 self.set({data: $.extend(true, [],MIDI.Player.data) });
                 self.set({endTime: MIDI.Player.endTime});
                 self.get_active_channels();
                 self.initialize_measures();
                 self.get_tempo();
              }
              self.load_soundFont();
              self.attributes.load_midi_callback();
          }); 
  
    },
    load_soundFont: function(){
          var instrumentsToLoad = {};
          this.attributes.active_channels.forEach(function(element, index){
            instrument_name = MIDI.GeneralMIDI.byId[element.instrument].id;
            if(!Common.InstrumentsToLoad.hasOwnProperty(instrument_name) && !instrumentsToLoad[element.instrument]){
              instrumentsToLoad[element.instrument] = instrument_name;
              Common.InstrumentsToLoad[instrument_name] = '';
            }
          });
          if(! $.isEmptyObject(instrumentsToLoad)){
            loadSoundfont({instruments: instrumentsToLoad, 
              callback: function(){ 
                console.log('finished'); 
                if(MIDI.loader){ MIDI.loader.stop(); }
              },
            });
          }
    },
    get_tempo: function(){
        var data = this.get('data');
        var length = data.length;
          for(var n = 0; n < length; n++){
              var event = data[n][0].event;
              if(event.subtype == "setTempo"){
                  this.set('tempo' , 60000000 / event.microsecondsPerBeat); //bpm 
                  break;
              }
          }
          for(var n = 0; n < length; n++){
              var event = data[n][0].event;
              if(event.subtype == "timeSignature"){
                this.set('denominator', event.denominator);
                  break;
              }
          }
          switch(this.get("denominator")){
            case 4:
              this.set("countBy", 'quarter-note');
              this.set("intro_countBy", 'quarter-note');
              this.set("metronome_countBy", 'quarter-note');
              break;
            case 8:
              this.set("countBy", 'dotted-quarter-note');
              this.set("intro_countBy", 'dotted-quarter-note');
              this.set("metronome_countBy", 'dotted-quarter-note');
              break;
            case 2:
              this.set("countBy", 'half-note');
              this.set("intro_countBy", 'half-note');
              this.set("metronome_countBy", 'half-note');
              break;
            default:
              this.set("countBy", 'quarter-note');
              this.set("intro_countBy", 'quarter-note');
              this.set("metronome_countBy", 'quarter-note');
              break;
          }
    },
    get_active_channels: function(){
          var data = this.get('data');
          var length = data.length;
             for(var n = 0; n < length; n++){
                 var event = data[n][0].event;
                 if (typeof(event.channel) === "number"){  
                   if( typeof(this.attributes.active_channels[event.channel]) === "undefined" && event.programNumber){
                         this.attributes.active_channels[event.channel] = 
                            { instrument: event.programNumber,
                              mute: false,
                              solo: false,
                              volume: 127,
                            };
                     }else if(typeof(this.attributes.active_channels[event.channel]) === "undefined"){
                         this.attributes.active_channels[event.channel] = 
                            { instrument: 0,
                              mute: false,
                              solo: false,
                              volume: 127,
                            };
                     }else if(this.attributes.active_channels[event.channel].instrument === 0 && event.programNumber){
                         this.attributes.active_channels[event.channel] = 
                            { instrument: event.programNumber,
                              mute: false,
                              solo: false,
                              volume: 127,
                            };
                     }
                 }
             }
          
    },
      initialize_measures: function(){
          var data = this.get('data');
          var length = data.length;
          var miliSecondsPerBeat = null;
          var beatsPerMeasure = null;
          var firstNoteHasPlayed = false; //flag to account for first note.
          var measureLength = 0;
          var eventTimeSoFar = 0; //total Time Up To Current Event;
          var measureTimeSoFar = 0; //total Time For Measures Up to now
  
          this.attributes.measures[1] = 0;
  
          for(var i = 0; i< length; i++){
              var event = data[i][0].event;
              if( event.type === "meta" && event.subtype === "setTempo"){
                  miliSecondsPerBeat = event.microsecondsPerBeat * this.attributes.timeWarp / 1000;
                  this.set("miliSecondsPerQuarter", miliSecondsPerBeat);
                  measureLength = miliSecondsPerBeat * beatsPerMeasure;
  
              }
              else if( event.type === "meta" && event.subtype === "timeSignature"){
                  beatsPerMeasure = event.numerator * (4 / event.denominator);  
                  measureLength = miliSecondsPerBeat * beatsPerMeasure;
              }
              if(measureLength && !firstNoteHasPlayed){
                  firstNoteHasPlayed = true;
                  measureTimeSoFar += measureLength;
                  this.attributes.measures.push(measureTimeSoFar);   
  
              }
              if (data[i][1]){
                  eventTimeSoFar += data[i][1];
                  if(eventTimeSoFar >= measureTimeSoFar){
                      measureTimeSoFar += measureLength;
                      this.attributes.measures.push(measureTimeSoFar);   
                  }
              }
  
          }
          this.attributes.lastMeasureToBePlayed = this.attributes.measures.length - 2;
          this.attributes.firstMeasureToBePlayed = 1;
          this.attributes.measureRange[1] = this.attributes.measures.length - 2;
  
      }
  
  });
  return Song;
});
