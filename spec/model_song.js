var song3;
describe("Song Model", function(){
    
    var protocol = window.location.protocol;
    var host = window.location.host;
    var pathArray = window.location.pathname.split( '/' );
    pathArray.pop();
    var path = protocol + '//' + host;
    for ( var i = 0; i < pathArray.length; i++ ) {
        path = path + pathArray[i] + '/';
    }

    var bionda_trecca = 'data:audio/midi;base64,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hgCRPAAAkT5ahgCRPgAAkUBakgCRQAAA/y8ATVRyawAAAa8A/wUCTGGGAP8FBGJpb26GAP8FAmRhhgD/BQN0cmWDAP8FASCDAP8FASCDAP8FBsOnw6dhLIYA/wUBIIMA/wUDZGVshgD/BQRmaW4njAD/BQJvcoYA/wUCY2+MAP8FAmxvpAD/BQJyZZIA/wUDTSdhkgD/BQJsZYYA/wUCZ2GDAP8FAnRvgwD/BQJsYYYA/wUDbWVujAD/BQR0J2FshgD/BQJtZYYA/wUBIIMA/wUFw6dvJ2yGAP8FASCDAP8FAmNvpAD/BQNyZS6SAP8FAlNpkgD/BQJtaYYA/wUGbCfDqCdsgwD/BQEggwD/BQEggwD/BQEggwD/BQJ2aYYA/wUEc28gYYYA/wUHY2h1ZWxsJ4YA/wUCb22GAP8FASCDAP8FA2JyYYYA/wUBIIMA/wUCZmGSAP8FA2NlLJIA/wUBT4YA/wUCdmWGAP8FAnJphgD/BQNkb26GAP8FASCGAP8FAmxlhgD/BQNwZXKMAP8FBGxlIGWGAP8FAnZhgwD/BQEggwD/BQEggwD/BQNnaGmDAP8FASCDAP8FASCDAP8FA2Zpb+wA/wUDcmkuAP8vAE1UcmsAAAGoAP8FAUWGAP8FAnNvhgD/BQVnbGllZoYA/wUDZmV0gwD/BQEggwD/BQEggwD/BQJ0aYYA/wUBIIMA/wUDZGVshgD/BQNtaWWMAP8FAm1hhgD/BQJtYYwA/wUEZ2dpb6QA/wUDcmkukgD/BQNDaGWSAP8FA2xsZYYA/wUCcGGDAP8FAnJvgwD/BQRsZSBlhgD/BQNiZWyMAP8FAmxvhgD/BQJ2ZYYA/wUBIIMA/wUEZGUgYYYA/wUBIIMA/wUCbW+kAP8FA3JlLpIA/wUDQ2hlkgD/BQJjb4YA/wUCbWWDAP8FASCDAP8FASCDAP8FASCDAP8FA3B1coYA/wUCbmWGAP8FBXZlIGFshgD/BQNzb2yGAP8FASCDAP8FAm1phgD/BQEggwD/BQNzZmGSAP8FAmNlkgD/BQFFhgD/BQNub26GAP8FAnNphgD/BQJjdYYA/wUBIIYA/wUDcmEshgD/BQNwZXKMAP8FBWNoJ2lvhgD/BQJtaYMA/wUBIIMA/wUBIIMA/wUDc2NvgwD/BQEggwD/BQEggwD/BQJsb+wA/wUDcmkuAP8vAE1UcmsAAAGRAP8FAkxhhgD/BQRiaW9uhgD/BQJkYYYA/wUDdHJliQD/BQbDp8OnYSyGAP8FASCDAP8FA2RlbIYA/wUEZmluJ4wA/wUCb3KGAP8FAmNvjAD/BQJsb6QA/wUCcmWSAP8FA00nYYYA/wUBIIYA/wUBIIYA/wUCbGWGAP8FAmdhgwD/BQJ0b4MA/wUCbGGGAP8FA21lbowA/wUEdCdhbIYA/wUCbWWJAP8FBcOnbydsiQD/BQJjb6QA/wUDcmUukgD/BQJTaZIA/wUCbWmGAP8FBmwnw6gnbIYA/wUBIIYA/wUCdmmGAP8FBHNvIGGGAP8FB2NodWVsbCeGAP8FAm9thgD/BQEggwD/BQNicmGGAP8FASCDAP8FAmZhhgD/BQEghgD/BQEghgD/BQNjZSySAP8FAU+GAP8FAnZlhgD/BQJyaYYA/wUDZG9uhgD/BQEghgD/BQJsZYYA/wUDcGVyjAD/BQRsZSBlhgD/BQJ2YYkA/wUDZ2hphgD/BQEggwD/BQNmaW/sAP8FA3JpLgD/LwBNVHJrAAABigD/BQFFhgD/BQJzb4YA/wUFZ2xpZWaGAP8FA2ZldIkA/wUCdGmGAP8FASCDAP8FA2RlbIYA/wUDbWlljAD/BQJtYYYA/wUCbWGMAP8FBGdnaW+kAP8FA3JpLpIA/wUDQ2hlhgD/BQEghgD/BQEghgD/BQNsbGWGAP8FAnBhgwD/BQJyb4MA/wUEbGUgZYYA/wUDYmVsjAD/BQJsb4YA/wUCdmWJAP8FBGRlIGGJAP8FAm1vpAD/BQNyZS6SAP8FA0NoZZIA/wUCY2+GAP8FAm1lhgD/BQEghgD/BQNwdXKGAP8FAm5lhgD/BQV2ZSBhbIYA/wUDc29shgD/BQEggwD/BQJtaYYA/wUBIIMA/wUDc2ZhhgD/BQEghgD/BQEghgD/BQJjZZIA/wUBRYYA/wUDbm9uhgD/BQJzaYYA/wUCY3WGAP8FASCGAP8FA3JhLIYA/wUDcGVyjAD/BQVjaCdpb4YA/wUCbWmJAP8FA3Njb4YA/wUBIIMA/wUCbG/sAP8FA3JpLgD/LwA=';


    it("Should have correct defaults", function(){
        var song = new app.Song({midi_src: path + 'spec/example.mid',}); 
        expect(song.get('title')).toBe('Unknown');
        expect(song.get('currentTime')).toBe(0);
    });
    describe("Set midi_src", function(){

      it("Should load set midi_src", function(){
          var song = new app.Song({midi_src: path + 'spec/example.mid',}); 
          var data_url = song.get('midi_data_url');
          song.set('midi_src', path + 'spec/aucun_se_sont.midi', {validate: true});
          expect(song.get('midi_data_url')).not.toBe('');
          expect(song.get('midi_data_url')).not.toBe(data_url);
      });


      it("Should handle set non-existent MIDI gracefully", function(){
          var song = new app.Song({midi_src: path + 'spec/example.mid'}); 
          var errorCallback = jasmine.createSpy('-invalid event callback-');

          song.on('invalid', errorCallback);
          song.set('midi_src','',{validate: true});

         var errorArgs = errorCallback.calls.mostRecent().args;

         expect(errorArgs).toBeDefined();
         expect(errorArgs[0]).toBe(song);
         expect(errorArgs[1]).toBe('Not http or https');
         expect(song.get('midi_data_url')).toBe('');
      });
      it("Should handle set fake MIDI gracefully", function(){

         var song = new app.Song({midi_src: path + 'spec/example.mid'}); 
         expect(song.get('midi_data_url')).not.toBe('');

         var errorCallback = jasmine.createSpy('-invalid event callback-');
         song.on('invalid', errorCallback);
         song.set('midi_src', path + 'spec/fakeNormalSizeMidi.mid', {validate: true});

         expect(song.get('midi_data_url')).toBe('');
         var errorArgs = errorCallback.calls.mostRecent().args;
         expect(errorArgs[1]).toBe('Bad .mid file - header not found');
      });
    });

    describe("Initialization of midi_src", function(){
      it("Should load good midi on initialize", function(){
        var song = new app.Song({midi_src:  path + 'spec/example.mid'});
        expect(song.get('midi_data_url')).not.toBe('');
      });

      it("Should handle non-existent MIDI gracefully", function(){
        var song = new app.Song({midi_src:  path + 'spec/non-existent-midi.mid'});
        expect(song.get('midi_data_url')).toBe('');
      });

      it("Should handle empty midi_src on initialize gracefully", function(){
        var song = new app.Song();
        expect(song.get('midi_data_url')).toBe('');
      });

      it("Should fail with relative path for midi_src", function(){
        var song = new app.Song({midi_src: 'spec/example.mid'});
        expect(song.get('midi_data_url')).toBe('');
      });
      it("Should handle very Large MIDI on initialize gracefully", function(){
        var song4 = new app.Song({midi_src:  path + 'spec/veryLargeFakeMid.mid'});
        expect(song4.get('midi_data_url')).toBe('');
      });

      it("Should handle non-existent MIDI on initialize gracefully", function(){
        var song5 = new app.Song({midi_src:  path + 'spec/fakeNormalSizeMidi.mid'});
        expect(song5.get('midi_data_url')).toBe('');
      }); 

      it("Should process data url", function(){
        var song = new app.Song({midi_src: bionda_trecca});
        expect(song.get('midi_data_url')).not.toBe('');
      });
      it("Should process external midi", function(){
        var song = new app.Song({midi_src: "http://cynnabar.thedancingmaster.net/singing/myeditions/la_bionda_trecca/la_bionda_trecca_trans_up_fifth.midi"});
        expect(song.get('midi_data_url')).not.toBe('');
      });
    });

    it("Should get a copy of data from MIDI", function(done){
        var song = new app.Song({midi_src: path + 'spec/example.mid'}); 
        var song2 = new app.Song({
           midi_src: path + 'spec/aucun_se_sont.midi', 
           load_midi_callback: function(){
              expect(song.get('data')).toBeDefined();
              expect(song.get('data')).not.toEqual(this.data);
              done();
           }

        });
    });
});
