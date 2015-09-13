'use strict';

var Backbone = require('Backbone');
var _ = require('underscore');

var WorldModel = Backbone.Model.extend({

    defaults: {
        height: 0,
        width: 0,
        frameRate: 100
    },

    initialize: function() {
        this.timer = setInterval(_.bind(this.tick, this), this.get('frameRate'));
    },

    tick: function() {
        this.trigger('tick');
    }
});

module.exports = WorldModel;
