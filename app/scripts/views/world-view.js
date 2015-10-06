'use strict';

var Backbone = require('Backbone');
var $ = require('jquery');
var _ = require('underscore');

var WorldModel = require('../models/world-model');
var ParticleView = require('./particle-view');

var WorldView = Backbone.View.extend({

    events: {
        'click': 'onClick',
        'touchstart': 'onClick'
    },

    multiplier: 5,

    initialize: function() {
        this.model = new WorldModel();
        $(window).resize(_.bind(this.updateBounds, this));
        this.updateBounds();
    },

    updateBounds: function() {
        this.model.set('height', this.$el.height());
        this.model.set('width', this.$el.width());
    },

    onClick: function() {
        for (var i = 0; i < this.multiplier; i++) {
            this.spawnParticle();
        }
    },

    spawnParticle: function() {
        var particle = new ParticleView({
            worldModel: this.model
        });
        this.model.particles.push(particle);
        this.$el.append(particle.$el);
    }
});

module.exports = WorldView;
