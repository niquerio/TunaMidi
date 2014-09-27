define(["models/song", "views/songView", 'jquery', "text!templates/songView.html", 'jasmine-jquery', ], function(Song, SongView, $, songViewTemplate){
   describe("SongView View", function(){

    var protocol = window.location.protocol;
    var host = window.location.host;
    var pathArray = window.location.pathname.split( '/' );
    pathArray.pop();
    var path = protocol + '//' + host;
    for ( var i = 0; i < pathArray.length; i++ ) {
        path = path + pathArray[i] + '/';
    }
    
     beforeEach(function(){
       var song = new Song({midi_src: path + 'example.mid'});
       //$('body').append('<ul id="songList"></ul>');
       this.songView = new SongView({model: song});
       setFixtures('<ul id="songList"></ul>');
     });
     afterEach(function(){
       this.songView.remove();
       $('#songList').remove();
     });

    it('Should be tied to a DOM element when created, based off the property provided.', function() {
        //what html element tag name represents this view?
        expect(this.songView.el.tagName.toLowerCase()).toBe('li');
    });
    it('Is backed by a model instance, which provides the data.', function() {
    
        expect(this.songView.model).toBeDefined();
    
        // what's the value for Todo.get('done') here?
        expect(this.songView.model.get('title')).toBe('example');
    });
    describe('Rendering', function(){
      it('returns the view object', function() {
         expect(this.songView.render()).toEqual(this.songView);
       });
   
       it('produces the correct HTML', function() {
         this.songView.render();
   
         // let's use jasmine-jquery's toContain() to avoid
         // testing for the complete content of a todo's markup
         expect(this.songView.el.innerHTML)
           .toContain('<a class="songTitle" href="#">example</a> <a href="#">Reset</a>');
       });

    }); //Rendering

    describe('Template', function(){
       beforeEach(function(){
         $('#songList').append(this.songView.render().el);
       });
       it('has the correct text content', function(){
         expect($('#songList').find('.songTitle'))
        .toHaveText('example');
       });
    });
  }); //SongView
});
