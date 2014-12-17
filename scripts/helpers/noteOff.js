define(['lib/MIDI'], function(MIDI){
  
var sources = MIDI.WebAudio.sources;

	var noteOff = function (channel, note, delay) {
    note = note + MIDI.Player.transpose;
    var ctx = MIDI.Player.ctx;
		delay = delay || 0;
		if (delay < ctx.currentTime) delay += ctx.currentTime;
		var source = sources[channel + "" + note];
		if (!source) return;
		if (source.gainNode) {
			// @Miranet: "the values of 0.2 and 0.3 could ofcourse be used as 
			// a 'release' parameter for ADSR like time settings."
			// add { "metadata": { release: 0.3 } } to soundfont files
			var gain = source.gainNode.gain;
			gain.linearRampToValueAtTime(gain.value, delay);
			gain.linearRampToValueAtTime(-1, delay + 0.2);
		}
		if (source.noteOff) { // old api
			source.noteOff(delay + 0.3);
		} else {
			source.stop(delay + 0.3);
		}
		///
		delete sources[channel + "" + note];
	};
return noteOff;
});
