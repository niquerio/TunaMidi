define(["path", "models/channel", "views/channelView", 'jquery', "text!templates/channelView.html", 'jasmine-jquery', ], function(path, Channel, ChannelView, $, channelViewTemplate){
   describe("ChannelView View", function(){


     beforeEach(function(){
       var channel = new Channel({channel:1});
       this.channelView = new ChannelView({model: channel});
       setFixtures('<table id="channelList"></table>');
     });
     afterEach(function(){
       this.channelView.remove();
       $('#channelList').remove();
     });

    it('Should be tied to a DOM element when created, based off the property provided.', function() {
        //what html element tag name represents this view?
        expect(this.channelView.el.tagName.toLowerCase()).toBe('tr');
    });
    it('Is backed by a model instance, which provides the data.', function() {
    
        expect(this.channelView.model).toBeDefined();
    
        // what's the value for Todo.get('done') here?
        expect(this.channelView.model.get('channel')).toBe(1);
        expect(this.channelView.model.get('mute')).toBe(false);
    });

    describe('Rendering', function(){
      it('returns the view object', function() {
         expect(this.channelView.render()).toEqual(this.channelView);
       });
   
       it('produces the correct HTML', function() {
         this.channelView.render();
   
         // let's use jasmine-jquery's toContain() to avoid
         // testing for the complete content of a todo's markup
         expect(this.channelView.el.innerHTML)
           .toContain('<td class="mute">');
       });

    }); //Rendering
   });
});
