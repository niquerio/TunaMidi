define(['jquery','lib/MIDI'], function($, MIDI){

  var ctx = {};
  var filetype = ''
  var audioBuffers = MIDI.WebAudio.audioBuffers; 
  
  var loadSoundfont = function(params) {
     var instruments = []

    //if (MIDI.loader) MIDI.loader.message("Web Audio API...");
    // works awesome! safari, chrome and firefox support.
    ctx = MIDI.Player.ctx;
    filetype = MIDI.supports["audio/ogg"] ? "ogg" : "mp3";
    for (var key in params.instruments){
      instruments.push(params.instruments[key]);
     };
    var callback = params.callback;
    runSoundfontFile(0);
  
    function runSoundfontFile(index){
      var instrumentId = instruments[index];
      $.ajax({
          url: MIDI.soundfontUrl + instrumentId + "-" + filetype + ".js",
          async: true,
          success: function(data){
            addSoundfont(data);
            if(index+1 < instruments.length){
              runSoundfontFile(index+1);
            }else{
             connect2({callback: params.callback,
                       instruments: instruments })
            }
  
          },
  
      });
    };
  
  
  };
  
  var connect2 = function (conf) {
      //
      if(!MIDI.Player.ctx){
        MIDI.Player.ctx = ctx = new AudioContext();
      }
      ///
      var urlList = [];
      var keyToNote = MIDI.keyToNote;
      for (var key in keyToNote) urlList.push(key);
      var bufferList = [];
      var pending = {};
      var oncomplete = function(instrument) {
        delete pending[instrument];
        for (var key in pending) break;
        if (!key) conf.callback();
      };
      for(var j = 0; j < conf.instruments.length; j++)  {
        pending[conf.instruments[j]] = true;
        for (var i = 0; i < urlList.length; i++) {
          audioLoader(conf.instruments[j], urlList, i, bufferList, oncomplete);
        }
      }
    };
  
  var addSoundfont = function(text) {
    var script = document.createElement("script");
    script.language = "javascript";
    script.type = "text/javascript";
    script.text = text;
    document.body.appendChild(script);
  };
  
  
  
  var audioLoader = function (instrument, urlList, index, bufferList, callback) {
    var synth = MIDI.GeneralMIDI.byName[instrument];
    var instrumentId = synth.number;
    var url = urlList[index];
    if (!MIDI.Soundfont[instrument][url]) { // missing soundfont
      return callback(instrument);
    }
    var base64 = MIDI.Soundfont[instrument][url].split(",")[1];
    var buffer = Base64Binary.decodeArrayBuffer(base64);
    ctx.decodeAudioData(buffer, function (buffer) {
      var msg = url;
      while (msg.length < 3) msg += "&nbsp;";
      if (typeof (MIDI.loader) !== "undefined") {
        MIDI.loader.update(null, synth.instrument + "<br>Processing: " + (index / 87 * 100 >> 0) + "%<br>" + msg);
      }
      buffer.id = url;
      bufferList[index] = buffer;
      //
      if (bufferList.length === urlList.length) {
        while (bufferList.length) {
          buffer = bufferList.pop();
          if (!buffer) continue;
          var nodeId = MIDI.keyToNote[buffer.id];
          audioBuffers[instrumentId + "" + nodeId] = buffer;
        }
        callback(instrument);
      }
    });
  };
  return loadSoundfont;
});
