define(['collections/songList'],function(Songs){
    var readFile = function(f){
        var title = f.name.replace(/\.[^/.]+$/, "")
        var self = this;
        var reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = function() {
             Songs.create({'midi_src': reader.result, 'title':title});

             Songs.fetch({reset:true});
             Songs.trigger('submitSong'); 
        }
        reader.onerror = function(e) {
            alert("Error!: " + e);
        }
    }
    return readFile;
});
