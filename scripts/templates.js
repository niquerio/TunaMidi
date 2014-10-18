define(function (require) {
  'use strict';

  return {
    appView: require('text!templates/appView.tmpl'),
    songView: require('text!templates/songView.tmpl'),
    channelView: require('text!templates/channelView.tmpl'),
    player: require('text!templates/player.tmpl'),
    options: require('text!templates/options.tmpl'),
    measures: require('text!templates/measures.tmpl'),
  };
});
