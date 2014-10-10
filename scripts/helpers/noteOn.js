define(['lib/MIDI'], function(MIDI){
var sources = MIDI.WebAudio.sources;
var audioBuffers = MIDI.WebAudio.audioBuffers;

  var noteOn = function (channel, note, velocity, delay) {
    var ctx = MIDI.Player.ctx;
    /// check whether the note exists
    if (!MIDI.channels[channel]) return;
    var instrument = MIDI.channels[channel].instrument;
    if (!audioBuffers[instrument + "" + note]) return;
    /// convert relative delay to absolute delay
    if (delay < ctx.currentTime) delay += ctx.currentTime;
    /// crate audio buffer
    var source = ctx.createBufferSource();
    sources[channel + "" + note] = source;
    source.buffer = audioBuffers[instrument + "" + note];
    source.connect(ctx.destination);
    ///
    if (ctx.createGain) { // firefox
      source.gainNode = ctx.createGain();
    } else { // chrome
      source.gainNode = ctx.createGainNode();
    }
    var value = (velocity / 127) * (MIDI.WebAudio.masterVolume / 127) * (MIDI.channels[channel].volume / 127) * 2 - 1;
    source.gainNode.connect(ctx.destination);
    source.gainNode.gain.value = Math.max(-1, value);
    source.connect(source.gainNode);
    if (source.noteOn) { // old api
      source.noteOn(delay || 0);
    } else { // new api
      source.start(delay || 0);
    }
    return source;
  };
return noteOn;
});
